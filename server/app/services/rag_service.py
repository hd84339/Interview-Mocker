import os
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

# Try importing ChromaDB and sentence-transformers with graceful fallback
try:
    import chromadb
    from chromadb.config import Settings as ChromaSettings
    CHROMADB_AVAILABLE = True
except ImportError:
    CHROMADB_AVAILABLE = False
    logger.warning("ChromaDB package not found. RAG service operating in fallback mode.")


class RAGService:
    """
    RAG (Retrieval-Augmented Generation) Service using ChromaDB & Embeddings.
    Indexes candidate resumes into semantic vector embeddings and retrieves targeted context
    for Gemini interview question generation and response scoring.
    """

    def __init__(self, persist_directory: str = "./.chroma_db"):
        self.persist_directory = persist_directory
        self.client = None
        self.collection = None

        if CHROMADB_AVAILABLE:
            try:
                os.makedirs(self.persist_directory, exist_ok=True)
                self.client = chromadb.PersistentClient(path=self.persist_directory)
                self.collection = self.client.get_or_create_collection(
                    name="candidate_resumes",
                    metadata={"hnsw:space": "cosine"}
                )
                logger.info("ChromaDB vector collection 'candidate_resumes' initialized successfully.")
            except Exception as e:
                logger.error(f"Failed to initialize ChromaDB client: {e}")
                self.client = None

    def _chunk_text(self, text: str, chunk_size: int = 400, overlap: int = 50) -> List[str]:
        """
        Split raw text into overlapping semantic chunks.
        """
        words = text.split()
        if not words:
            return []

        chunks = []
        for i in range(0, len(words), chunk_size - overlap):
            chunk = " ".join(words[i:i + chunk_size])
            if chunk.strip():
                chunks.append(chunk.strip())
        return chunks

    async def index_resume(self, user_id: int, resume_id: int, text: str) -> Dict[str, Any]:
        """
        Chunks candidate resume text, generates embeddings, and indexes into ChromaDB.
        """
        chunks = self._chunk_text(text)
        if not chunks:
            return {"status": "empty", "chunks_indexed": 0}

        if self.collection:
            try:
                documents = chunks
                metadatas = [{"user_id": user_id, "resume_id": resume_id, "chunk_index": idx} for idx in range(len(chunks))]
                ids = [f"resume_{resume_id}_chunk_{idx}" for idx in range(len(chunks))]

                self.collection.upsert(
                    documents=documents,
                    metadatas=metadatas,
                    ids=ids
                )
                logger.info(f"Indexed {len(chunks)} vector chunks for resume_id={resume_id} into ChromaDB.")
                return {"status": "indexed", "chunks_indexed": len(chunks), "resume_id": resume_id}
            except Exception as e:
                logger.error(f"Error indexing resume into ChromaDB: {e}")

        # Fallback return if ChromaDB is unavailable
        return {"status": "fallback_indexed", "chunks_indexed": len(chunks), "resume_id": resume_id}

    async def query_resume_context(self, resume_id: int, query_text: str, top_k: int = 3) -> str:
        """
        Retrieves top_k relevant semantic chunks from ChromaDB for a given job description / interview query.
        """
        if self.collection:
            try:
                results = self.collection.query(
                    query_texts=[query_text],
                    n_results=top_k,
                    where={"resume_id": resume_id}
                )
                if results and "documents" in results and results["documents"]:
                    matched_chunks = results["documents"][0]
                    if matched_chunks:
                        return "\n\n".join(matched_chunks)
            except Exception as e:
                logger.error(f"ChromaDB query failed: {e}")

        # Default fallback string if vector query yields no result or ChromaDB is uninitialized
        return f"Resume context for resume_id {resume_id} unavailable or not indexed."


rag_service = RAGService()

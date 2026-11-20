import os
import re
import zlib
import zipfile
import xml.etree.ElementTree as ET
from sqlalchemy.orm import Session
from app.models.resume import Resume
from app.services.ai_service import ai_service
from app.services.rag_service import rag_service


class ResumeService:
    def extract_text_from_file(self, file_path: str) -> str:
        """
        Extracts raw plain text from PDF, DOCX, and TXT files without external binary dependencies.
        """
        if not os.path.exists(file_path):
            return ""

        ext = os.path.splitext(file_path)[1].lower()

        # 1. Plain text files
        if ext in [".txt", ".md", ".json"]:
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    return f.read()
            except Exception:
                return ""

        # 2. Microsoft Word .docx files (standard zip archive with XML)
        if ext == ".docx":
            try:
                with zipfile.ZipFile(file_path) as docx_zip:
                    xml_content = docx_zip.read("word/document.xml")
                    tree = ET.fromstring(xml_content)
                    paragraphs = []
                    for elem in tree.iter():
                        if elem.tag.endswith("t") and elem.text:
                            paragraphs.append(elem.text)
                    return " ".join(paragraphs)
            except Exception:
                pass

        # 3. PDF files
        if ext == ".pdf":
            try:
                with open(file_path, "rb") as f:
                    content = f.read()

                text_tokens = []
                # Search and decompress all FlateDecode streams
                for stream_match in re.finditer(b"stream[\r\n]+(.*?)[\r\n]+endstream", content, re.DOTALL):
                    stream_bytes = stream_match.group(1)
                    try:
                        decompressed = zlib.decompress(stream_bytes)
                        # Extract literal strings inside (text) Tj or TJ
                        matches = re.findall(rb"\((.*?)\)\s*T[jJ]", decompressed)
                        if matches:
                            text_tokens.extend([m.decode("utf-8", errors="ignore") for m in matches])
                    except Exception:
                        continue

                extracted = " ".join(text_tokens).strip()
                if len(extracted) > 50:
                    return extracted

                # Fallback heuristic: Extract human-readable ASCII character clusters
                words = re.findall(rb"[A-Za-z0-9#+.\-_/]{2,}", content)
                return " ".join([w.decode("utf-8", errors="ignore") for w in words[:1000]])
            except Exception:
                pass

        return ""

    async def process_resume_file(
        self, db: Session, user_id: int, file_name: str, file_path: str
    ) -> Resume:
        # Delete old resumes for this user
        old_resumes = db.query(Resume).filter(Resume.user_id == user_id).all()
        for r in old_resumes:
            if os.path.exists(r.file_path):
                try:
                    os.remove(r.file_path)
                except Exception:
                    pass
            db.delete(r)
        db.commit()

        # Extract text and parse candidate technical skills
        extracted_text = self.extract_text_from_file(file_path)
        if not extracted_text:
            extracted_text = f"Resume document: {file_name}"

        parsed_data = await ai_service.parse_resume_text(extracted_text)
        db_resume = Resume(
            user_id=user_id,
            file_name=file_name,
            file_path=file_path,
            parsed_skills=parsed_data.get("skills", []),
            parsed_summary=parsed_data.get("summary", "")
        )
        db.add(db_resume)
        db.commit()
        db.refresh(db_resume)

        # Index raw resume text into RAG Vector Store (ChromaDB)
        resume_text_content = f"Skills: {', '.join(db_resume.parsed_skills)}. Summary: {db_resume.parsed_summary}\n\n{extracted_text[:2000]}"
        await rag_service.index_resume(user_id=user_id, resume_id=db_resume.id, text=resume_text_content)

        return db_resume

    def get_latest_resume(self, db: Session, user_id: int) -> Resume | None:
        return db.query(Resume).filter(Resume.user_id == user_id).order_by(Resume.created_at.desc()).first()

resume_service = ResumeService()


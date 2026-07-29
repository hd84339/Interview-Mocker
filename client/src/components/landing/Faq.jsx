import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "How does Mockora analyze my resume?",
    answer: "When you upload your PDF or TXT resume, our AI parses key skill sets, projects, and target role requirements. It then dynamically synthesizes technical and behavioral questions aligned with your actual experience level."
  },
  {
    question: "Can I practice both voice and text responses?",
    answer: "Yes! You can choose interactive voice mode with real-time speech-to-text transcription, or text mode for quick keyboard-based practice sessions."
  },
  {
    question: "Is there a free trial or free practice tier?",
    answer: "Absolutely! You can start practicing right away with zero credit card required. Our free tier includes 3 full interview sessions with instant diagnostic scoring."
  },
  {
    question: "How accurate is the AI scoring compared to real interviewers?",
    answer: "Our evaluation models are benchmarked against scoring rubrics used at top tech companies. You receive targeted feedback on technical accuracy, structure (STAR method), and areas for improvement."
  },
  {
    question: "Is my resume and audio data private?",
    answer: "Yes, privacy is paramount. Your uploaded documents and voice transcripts are encrypted and used strictly during your active practice sessions. We never share or sell candidate data."
  }
];

function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 mt-4 text-base sm:text-lg">
            Everything you need to know about preparing with Mockora.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  type="button"
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-slate-900 hover:text-blue-600 focus:outline-none transition-colors"
                >
                  <span>{item.question}</span>
                  <div
                    className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-blue-50 text-blue-600" : "text-slate-500"
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100/80 animate-in fade-in-50 duration-200">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default Faq;

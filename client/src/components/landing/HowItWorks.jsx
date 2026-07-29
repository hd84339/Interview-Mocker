import { Upload, Sliders, MessageSquareCode, Award } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Resume",
    description: "Provide your latest resume or target job description to set the baseline context."
  },
  {
    step: "02",
    icon: Sliders,
    title: "Configure Interview",
    description: "Select job role, experience level, interview duration, and specific focus areas."
  },
  {
    step: "03",
    icon: MessageSquareCode,
    title: "Practice with AI",
    description: "Complete an interactive, voice or text-driven mock session with realistic prompts."
  },
  {
    step: "04",
    icon: Award,
    title: "Receive Feedback",
    description: "Review comprehensive reports detailing your strengths, weaknesses, and model answers."
  }
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-3">
            Step-by-Step Guide
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Mockora Works
          </p>
          <p className="text-slate-600 mt-4 text-base sm:text-lg">
            Four simple steps from upload to detailed feedback report.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((stepItem, index) => {
            const Icon = stepItem.icon;
            return (
              <div 
                key={index} 
                className="relative flex flex-col items-start bg-slate-50/80 p-6 sm:p-7 rounded-2xl border border-slate-200/80 hover:bg-white hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center justify-between w-full mb-6">
                  <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-semibold shadow-md shadow-blue-600/20 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-black text-slate-300 font-mono tracking-tighter">
                    {stepItem.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {stepItem.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {stepItem.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;

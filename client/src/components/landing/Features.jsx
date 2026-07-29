import { Bot, FileText, Camera, Mic, Building2, LineChart } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Adaptive AI Interviewer",
    description: "Engage in dynamic, context-aware conversations that adapt to your answers in real time."
  },
  {
    icon: FileText,
    title: "Deep Resume Analysis",
    description: "Upload your resume to receive tailored behavioral and technical questions specific to your stack."
  },
  {
    icon: Camera,
    title: "Camera & Vision Analysis",
    description: "Monitor eye contact, body language, and non-verbal cues to build confident delivery."
  },
  {
    icon: Mic,
    title: "Voice-Based Interaction",
    description: "Practice spoken responses with real-time speech-to-text accuracy and tone feedback."
  },
  {
    icon: Building2,
    title: "Company-Specific Benchmarks",
    description: "Simulate interview styles and culture checks tailored to top tech companies."
  },
  {
    icon: LineChart,
    title: "Actionable Performance Reports",
    description: "Get detailed scoring breakdowns on technical accuracy, clarity, and areas for improvement."
  }
];

function Features() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-3">
            Powerful Features
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything You Need to Command the Room
          </p>
          <p className="text-slate-600 mt-4 text-base sm:text-lg">
            Simulate realistic, high-stakes technical and behavioral interviews powered by advanced AI.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default Features;

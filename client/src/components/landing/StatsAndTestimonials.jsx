import { Star, Award, TrendingUp, Users, CheckCircle } from "lucide-react";

const STATS = [
  { value: "10,000+", label: "Mock Interviews Completed", icon: Users },
  { value: "94%", label: "Offer Rate Increase", icon: TrendingUp },
  { value: "4.9/5", label: "Average Candidate Score", icon: Star },
  { value: "50+", label: "Tech & Management Roles", icon: Award }
];

const TESTIMONIALS = [
  {
    name: "Alex Rivera",
    role: "Senior Software Engineer @ Meta",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    content: "Mockora changed how I prep. The real-time AI voice feedback caught filler words and structural gaps I never noticed during solo practice."
  },
  {
    name: "Sarah Chen",
    role: "Staff Backend Developer @ Stripe",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    content: "The resume matching feature generates questions tailored right to my tech stack. It felt like a real L6 technical loop with a lead architect."
  },
  {
    name: "Michael Johnson",
    role: "Product Manager @ Google",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    content: "Behavioral interview prep used to feel awkward. Practicing with Mockora gave me the exact confidence needed to land my dream offer."
  }
];

function StatsAndTestimonials() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white via-slate-50/50 to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
          {STATS.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Testimonials Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-3">
            Candidate Success Stories
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Top Engineers & Leaders
          </p>
          <p className="text-slate-600 mt-4 text-base sm:text-lg">
            See how candidates turned interview anxiety into FAANG & Tier-1 tech job offers.
          </p>
        </div>

        {/* Testimonials Card Grid */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed italic">
                  "{testimonial.content}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-slate-100 mt-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-blue-500/20"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    {testimonial.name}
                    <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default StatsAndTestimonials;

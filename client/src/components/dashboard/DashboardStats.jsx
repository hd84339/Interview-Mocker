import { Trophy, TrendingUp, Clock, Target, CheckCircle2 } from "lucide-react";

export default function DashboardStats() {
  const stats = [
    {
      label: "Interviews Completed",
      value: "12",
      change: "+3 this week",
      icon: Trophy,
      color: "from-amber-500/20 to-orange-500/20 text-amber-400",
    },
    {
      label: "Average Performance Score",
      value: "86%",
      change: "+5% overall",
      icon: TrendingUp,
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400",
    },
    {
      label: "Practice Time",
      value: "14.5 hrs",
      change: "4 sessions",
      icon: Clock,
      color: "from-indigo-500/20 to-purple-500/20 text-indigo-400",
    },
    {
      label: "Target Role Readiness",
      value: "Senior Level",
      change: "Top 10%",
      icon: Target,
      color: "from-pink-500/20 to-rose-500/20 text-pink-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, idx) => (
        <div
          key={idx}
          className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl shadow-lg hover:border-slate-700 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">
              {item.label}
            </span>
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${item.color}`}>
              <item.icon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mb-1">
            {item.value}
          </div>
          <div className="text-xs font-medium text-indigo-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{item.change}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

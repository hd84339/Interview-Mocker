import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { interviewService } from "../services/interviewService";
import DashboardHero from "../components/dashboard/DashboardHero";
import DashboardStats from "../components/dashboard/DashboardStats";
import RecentInterviews from "../components/dashboard/RecentInterviews";
import SkillBreakdown from "../components/dashboard/SkillBreakdown";

function DashboardPage() {
  const { user } = useAuthContext();
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await interviewService.getRecentInterviews();
        setRecentInterviews(data);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <DashboardHero user={user} />
      <DashboardStats interviews={recentInterviews} />
      
      {/* Main Content Split: Recent Interviews + Skill Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RecentInterviews loading={loading} recentInterviews={recentInterviews} />
        <SkillBreakdown />
      </div>
    </div>
  );
}

export default DashboardPage;

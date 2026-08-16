import { useState, useEffect } from "react";
import { Users, Mail, Clock, CheckCircle2, ShieldAlert } from "lucide-react";
import { adminService } from "../services/adminService";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && !user.is_admin && user.email !== import.meta.env.VITE_ADMIN_EMAIL && user.email !== "hd84339@gmail.com") {
      navigate("/dashboard");
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-slate-400">Manage users and platform activity.</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20">
          <ShieldAlert className="w-5 h-5 text-indigo-400" />
          <span className="text-indigo-300 font-medium text-sm">Superadmin Access</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Registered Users</h2>
          </div>
          <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full font-medium">
            Total: {users.length}
          </span>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-400">
            <p>{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-700/50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={u.avatar_url || `https://ui-avatars.com/api/?name=${u.full_name || u.email}&background=random`} 
                          alt="avatar" 
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-white flex items-center gap-2">
                            {u.full_name || "Unknown User"}
                            {u.is_admin && (
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Admin</span>
                            )}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                            <Mail className="w-3 h-3" />
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {u.is_active ? (
                        <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full text-xs font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Active
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-400 px-2.5 py-1 rounded-full text-xs font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          Inactive
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {new Date(u.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

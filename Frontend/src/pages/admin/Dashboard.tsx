import { useState, useEffect } from 'react';
import { getProjects, getMessages, getTechLogos, getProfile } from '@/src/services/api';
import { IProject, IMessage, ITechLogo, IProfile } from '@/src/types';
import { LayoutGrid, MessageSquare, Plus, ExternalLink, Settings, LogOut, User, Database } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';

export default function Dashboard() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [techLogos, setTechLogos] = useState<ITechLogo[]>([]);
  const [profile, setProfile] = useState<IProfile | null>(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    getProjects().then(setProjects).catch(() => setProjects([]));
    getMessages().then(setMessages).catch(() => setMessages([]));
    getTechLogos().then(setTechLogos).catch(() => setTechLogos([]));
    getProfile().then(setProfile).catch(() => setProfile(null));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="space-y-8" id="admin-dashboard">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-8" id="dashboard-header">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100">Control Center</h1>
          <p className="text-xs text-neutral-500">Welcome back, {user?.name || 'Administrator'}.</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/profile"
            className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-all flex items-center gap-2 cursor-pointer text-sm font-medium"
          >
            <User className="w-3.5 h-3.5" /> Profile Settings
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-red-500 hover:bg-neutral-100 dark:hover:bg-red-900/10 rounded-md transition-all flex items-center gap-2 cursor-pointer text-sm font-medium"
          >
            Logout <LogOut className="w-3.5 h-3.5" />
          </button>
          <Link
            to="/admin/manage-projects"
            className="px-6 py-2.5 bg-primary text-white rounded-md flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer text-sm font-medium"
          >
            New Project <Plus className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="dashboard-stats">
        {[
          { label: 'Live Projects', value: Array.isArray(projects) ? projects.length : 0, icon: LayoutGrid, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
          { label: 'Unread Messages', value: Array.isArray(messages) ? messages.length : 0, icon: MessageSquare, color: 'text-primary', bg: 'bg-primary/5 dark:bg-primary/10' },
          { label: 'Tech Stack', value: Array.isArray(techLogos) ? techLogos.length : 0, icon: Database, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-md flex items-center gap-4">
             <div className={`p-3 rounded-md ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{stat.label}</span>
                <span className="text-2xl font-black">{stat.value}</span>
             </div>
          </div>
        ))}
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="dashboard-sections">
        {/* Profile Quick Access */}
        <div className="lg:col-span-1 space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-tight">Portfolio Profile</h3>
              <Link to="/admin/profile" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors cursor-pointer">Edit All</Link>
           </div>
           <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-md p-6 space-y-6">
              {profile ? (
                <>
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-md overflow-hidden bg-neutral-100 dark:bg-black border border-neutral-100 dark:border-neutral-800">
                        <img src={profile.profilePic} alt="Profile" className="w-full h-full object-cover" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{profile.fullName}</span>
                        <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">{profile.profession}</span>
                     </div>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-neutral-50 dark:border-neutral-900">
                     <div className="flex items-center justify-between text-[10px]">
                        <span className="text-neutral-400 font-bold uppercase tracking-widest">Experience</span>
                        <span className="font-mono text-primary">{profile.yearsOfExperience}</span>
                     </div>
                     <div className="flex items-center justify-between text-[10px]">
                        <span className="text-neutral-400 font-bold uppercase tracking-widest">Location</span>
                        <span className="font-mono">{profile.address}</span>
                     </div>
                  </div>
                </>
              ) : (
                <div className="text-xs text-neutral-500">Failed to load profile. Ensure the backend is running.</div>
              )}
              <Link
                to="/admin/profile"
                className="w-full py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-md flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all cursor-pointer text-sm font-medium"
              >
                <Settings className="w-3 h-3" /> Update Portfolio Profile
              </Link>
           </div>
        </div>

        {/* Recent Projects Table */}
        <div className="lg:col-span-2 space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-tight">Recent Projects</h3>
              <Link to="/admin/manage-projects" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors cursor-pointer">Manage All</Link>
           </div>
           <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-md overflow-hidden">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-neutral-50 dark:bg-black/20 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                       <th className="p-4 border-b border-neutral-100 dark:border-neutral-800">Title</th>
                       <th className="p-4 border-b border-neutral-100 dark:border-neutral-800 text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody>
                    {Array.isArray(projects) && projects.slice(0, 5).map(p => (
                      <tr key={p.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                        <td className="p-4 text-xs font-semibold">{p.title}</td>
                        <td className="p-4 text-right">
                           <Link to={`/projects/${p.id}`} className="p-1.5 text-neutral-400 hover:text-primary inline-block cursor-pointer">
                              <ExternalLink className="w-3.5 h-3.5" />
                           </Link>
                        </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Incoming Messages Table */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-tight">Recent Messages</h3>
              <Link to="/admin/messages" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors cursor-pointer">Inbox</Link>
           </div>
           <div className="bg-white dark:bg-[#171717] border border-neutral-100 dark:border-neutral-800 rounded-md overflow-hidden">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-neutral-50 dark:bg-black/20 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                       <th className="p-4 border-b border-neutral-100 dark:border-neutral-800">Sender</th>
                       <th className="p-4 border-b border-neutral-100 dark:border-neutral-800 text-right">Date</th>
                    </tr>
                 </thead>
                 <tbody>
                    {Array.isArray(messages) && messages.slice(0, 5).map(m => (
                      <tr key={m.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                        <td className="p-4">
                           <div className="flex flex-col">
                              <span className="text-xs font-bold">{m.name}</span>
                              <span className="text-[10px] text-neutral-400">{m.email}</span>
                           </div>
                        </td>
                        <td className="p-4 text-right text-[10px] text-neutral-400 font-mono">
                           {new Date(m.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
}

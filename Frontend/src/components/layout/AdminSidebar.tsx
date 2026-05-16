import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Database, 
  UserCircle, 
  Mail, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/src/lib/utils';

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/admin/manage-projects', icon: FolderKanban },
    { name: 'Tech Stack', path: '/admin/tech-stack', icon: Database },
    { name: 'Profile', path: '/admin/profile', icon: UserCircle },
    { name: 'Messages', path: '/admin/messages', icon: Mail },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed bottom-6 right-6 z-[60] p-4 bg-primary text-white rounded-full shadow-lg shadow-primary/30"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside 
        className={cn(
          "bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300 flex flex-col shrink-0",
          "fixed inset-y-0 left-0 z-50 md:sticky md:top-0 h-screen md:h-full",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          {!isCollapsed && (
            <Link to="/" className="flex items-center gap-2 group cursor-pointer">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
                P
              </div>
              <span className="text-sm font-bold uppercase tracking-tight dark:text-white">Admin</span>
            </Link>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
          
          <button 
             onClick={() => setIsMobileOpen(false)}
             className="md:hidden p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
          >
             <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-4 px-4 py-3 rounded-md transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", isCollapsed && "mx-auto")} />
              {!isCollapsed && <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex flex-col items-center gap-1">
             {!isCollapsed && <p className="text-[8px] font-bold uppercase tracking-tighter text-neutral-400">v1.2.0 Stable Build</p>}
          </div>
        </div>
      </aside>
    </>
  );
}

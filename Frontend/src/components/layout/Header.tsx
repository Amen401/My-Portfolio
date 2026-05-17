import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, Home, Mail, User, Shield, Menu, X } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/src/contexts/AuthContext";
import { getProfile } from "@/src/services/api";
import { IProfile } from "@/src/types";

export function Header() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<IProfile | null>(null);

  useEffect(() => {
    getProfile().then(setProfile).catch(console.error);
  }, []);

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Projects", path: "/projects", icon: LayoutGrid },
    { name: "Contact", path: "/contact", icon: Mail },
  ];

  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <header
      className="sticky top-0 z-50 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800"
      id="main-header"
    >
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 group cursor-pointer"
          id="logo-link"
        >
          <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform uppercase">
            {/* Automatically uses the first letter of the fetched name, defaults to P */}
            {profile?.fullName ? profile.fullName.charAt(0) : "P"}
          </div>
          <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100 uppercase hidden sm:block">
            {/* Displays the full name from the backend, defaults to Portfolio */}
            {profile?.fullName
              ? `${profile.fullName.split(" ")[0]}'s Portfolio`
              : "Portfolio"}
          </span>
        </Link>

        {isAdminPath ? (
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
            Control Center
          </div>
        ) : (
          <nav className="hidden md:flex items-center gap-2" id="desktop-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 cursor-pointer",
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800",
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3" id="header-actions">
          <ThemeToggle />
          <Link
            to={isAuthenticated ? "/admin/dashboard" : "/admin/login"}
            className={cn(
              "p-2.5 rounded-full transition-colors cursor-pointer",
              isAuthenticated
                ? "bg-primary text-white"
                : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800",
            )}
            title="Admin Dashboard"
          >
            <Shield className="w-5 h-5" />
          </Link>
          {!isAdminPath && (
            <button
              className="md:hidden p-2.5 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {!isAdminPath && isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors cursor-pointer",
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800",
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

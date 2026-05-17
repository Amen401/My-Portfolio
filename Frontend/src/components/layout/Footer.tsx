import { useState, useEffect } from "react";
import { Github, Linkedin, Send } from "lucide-react";
import { getProfile } from "@/src/services/api";
import { IProfile } from "@/src/types";

export function Footer() {
  const [profile, setProfile] = useState<IProfile | null>(null);

  useEffect(() => {
    // Fetch profile data to populate social links dynamically
    getProfile().then(setProfile).catch(console.error);
  }, []);

  return (
    <footer
      className="w-full py-8 mt-auto border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#171717]"
      id="main-footer"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              © {new Date().getFullYear()} Portfolio. Built with React &
              Tailwind.
            </p>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono tracking-tighter uppercase">
              Decoupled MERN Architecture
            </p>
          </div>

          <div
            className="flex items-center gap-4 text-neutral-400 dark:text-neutral-500"
            id="footer-socials"
          >
            {profile?.github && (
              <a
                href={
                  profile.github.startsWith("http")
                    ? profile.github
                    : `https://${profile.github}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors cursor-pointer"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}

            {profile?.linkedin && (
              <a
                href={
                  profile.linkedin.startsWith("http")
                    ? profile.linkedin
                    : `https://${profile.linkedin}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors cursor-pointer"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}

            {profile?.telegram && (
              <a
                href={
                  profile.telegram.startsWith("http")
                    ? profile.telegram
                    : `https://${profile.telegram}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors cursor-pointer"
                title="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

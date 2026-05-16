import { Github, Linkedin, Send } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full py-8 mt-auto border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#171717]" id="main-footer">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">© 2024 Portfolio. Built with React & Tailwind.</p>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono tracking-tighter uppercase">Decoupled MERN Architecture</p>
          </div>

          <div className="flex items-center gap-4 text-neutral-400 dark:text-neutral-500" id="footer-socials">
            <a href="#" className="hover:text-primary transition-colors cursor-pointer"><Github className="w-4 h-4" /></a>
            <a href="#" className="hover:text-primary transition-colors cursor-pointer"><Linkedin className="w-4 h-4" /></a>
            <a href="#" className="hover:text-primary transition-colors cursor-pointer"><Send className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

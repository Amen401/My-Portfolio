import { useState, useEffect } from 'react';
import { getProfile, getTechLogos } from '@/src/services/api';
import { IProfile, ITechLogo } from '@/src/types';
import { Download, Github, Linkedin, Send, ArrowRight, Smile, Zap, Award, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function Home() {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [techLogos, setTechLogos] = useState<ITechLogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProfile().then(setProfile).catch(() => setProfile(null)),
      getTechLogos().then(setTechLogos).catch(() => setTechLogos([]))
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20 text-neutral-500">Loading...</div>;
  }

  if (!profile) {
    return <div className="flex justify-center py-20 text-red-500">Failed to load profile. Ensure the backend is running.</div>;
  }

  return (
    <div className="flex flex-col gap-24 py-12" id="home-page">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 text-center space-y-16" id="hero-section">
        
        {/* Name Section */}
        <div id="name-section" className="space-y-4">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="text-[10px] font-black uppercase tracking-[0.5em] text-primary"
           >
             Welcome to my portfolio
           </motion.div>
           <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-neutral-950 dark:text-white tracking-tighter" id="profile-name">
              {profile.fullName}
           </h1>
        </div>

        {/* Profession Section */}
        <div id="profession-section" className="flex items-center justify-center gap-6">
           <div className="h-px w-8 md:w-16 bg-neutral-200 dark:bg-neutral-800" />
           <span className="text-xl md:text-4xl font-light text-primary tracking-[0.2em] uppercase italic">
             {profile.profession}
           </span>
           <div className="h-px w-8 md:w-16 bg-neutral-200 dark:bg-neutral-800" />
        </div>

        <div className="relative group" id="hero-image-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-white dark:border-neutral-900 relative z-10"
          >
            <img
              src={profile.profilePic}
              alt={profile.fullName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute -inset-6 bg-primary/20 rounded-full blur-3xl -z-0 group-hover:bg-primary/30 transition-colors" />
        </div>

        {/* Description Section */}
        <div id="description-section" className="max-w-4xl space-y-8 bg-white dark:bg-neutral-900/60 p-8 md:p-16 rounded-md border border-neutral-100 dark:border-neutral-800">
           <div className="flex flex-col items-center gap-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Professional Summary</h3>
              <div className="w-8 h-0.5 bg-primary rounded-full" />
           </div>
           <p className="text-2xl md:text-4xl text-neutral-950 dark:text-neutral-100 leading-tight font-black" id="profile-description">
              {profile.description}
           </p>
           <p className="text-base md:text-lg text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed" id="profile-bio">
             {profile.bio}
           </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-4" id="hero-actions">
           <Link
             to="/projects"
             className="px-10 py-5 bg-primary text-white rounded-md hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer text-sm font-medium"
           >
             Explore Projects <ArrowRight className="w-5 h-5" />
           </Link>
           <a
             href={profile.cvUrl}
             className="px-10 py-5 border-2 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all flex items-center gap-3 cursor-pointer text-sm font-medium"
           >
             Download Resume <Download className="w-5 h-5" />
           </a>
        </div>
      </section>

      {/* Tech Logos Section */}
      <section className="space-y-12 overflow-hidden" id="tech-logos-section">
         <div className="flex flex-col items-center gap-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Trusted Tech Stack</h3>
            <div className="w-8 h-0.5 bg-primary rounded-full" />
         </div>
         
         {techLogos.length > 8 ? (
           <div className="relative group">
             <div className="flex animate-marquee group-hover:pause gap-16 whitespace-nowrap">
               {[...techLogos, ...techLogos].map((tech, i) => (
                 <div key={`${tech.id}-${i}`} className="flex flex-col items-center gap-3 shrink-0">
                   <img src={tech.logoUrl} alt={tech.name} className="w-10 h-10 md:w-12 md:h-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default" />
                   <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{tech.name}</span>
                 </div>
               ))}
             </div>
             {/* Gradient Overlays */}
             <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-neutral-50 dark:from-black to-transparent pointer-events-none" />
             <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-neutral-50 dark:from-black to-transparent pointer-events-none" />
           </div>
         ) : (
           <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 hover:opacity-100 transition-opacity">
            {techLogos.map((tech) => (
               <motion.div
                 key={tech.id}
                 whileHover={{ y: -5, scale: 1.1 }}
                 className="flex flex-col items-center gap-3 group"
               >
                  <img src={tech.logoUrl} alt={tech.name} className="w-10 h-10 md:w-12 md:h-12 grayscale group-hover:grayscale-0 transition-all" />
                  <span className="text-[10px] font-bold text-neutral-400 group-hover:text-primary transition-colors uppercase tracking-widest">{tech.name}</span>
               </motion.div>
            ))}
           </div>
         )}
      </section>

      {/* Metrics Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6" id="metrics-section">
        {[
          { label: 'Experience', value: profile.yearsOfExperience, icon: Award, color: 'text-amber-500' },
          { label: 'Built Projects', value: '25+', icon: Zap, color: 'text-blue-500' },
          { label: 'Service Uptime', value: '100%', icon: Globe, color: 'text-primary' },
        ].map((metric, i) => (
          <div key={i} className="p-8 bg-white dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 rounded-md flex flex-col items-center justify-center space-y-4 group hover:border-primary/50 transition-all">
            <div className={cn("p-3 rounded-md bg-neutral-50 dark:bg-black/40 group-hover:scale-110 transition-transform", metric.color)}>
               <metric.icon className="w-6 h-6" />
            </div>
            <div className="text-center">
               <div className="text-2xl md:text-3xl font-black text-neutral-950 dark:text-white">{metric.value}</div>
               <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{metric.label}</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

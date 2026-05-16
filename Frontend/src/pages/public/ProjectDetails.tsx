import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjects } from '@/src/services/api';
import { IProject } from '@/src/types';
import { ArrowLeft, Github, Globe, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects().then(projects => {
      const p = Array.isArray(projects) ? projects.find(proj => proj.id === id) : null;
      setProject(p || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="h-10 w-32 bg-neutral-100 dark:bg-neutral-900 rounded" />
    <div className="h-64 w-full bg-neutral-100 dark:bg-neutral-900 rounded-md" />
  </div>;

  if (!project) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <AlertCircle className="w-12 h-12 text-red-500" />
      <h2 className="text-xl font-bold">Project Not Found</h2>
      <Link to="/projects" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors cursor-pointer">
        Back to Projects
      </Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12" id="project-details-page">
      <Link to="/projects" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </Link>

      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">{project.title}</h1>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech, idx) => (
              <span key={`${tech}-${idx}`} className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-900 px-3 py-1 rounded-full text-neutral-600 dark:text-neutral-400">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed italic border-l-2 border-primary pl-4">
          {project.description}
        </p>

        <div className="flex items-center gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-md bg-black text-white hover:bg-neutral-800 transition-all cursor-pointer text-sm font-medium">
              <Github className="w-4 h-4" /> Source Code
            </a>
          )}
          {project.liveLink && (
            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all cursor-pointer text-sm font-medium text-neutral-900 dark:text-neutral-100">
              <Globe className="w-4 h-4" /> Live Demo
            </a>
          )}
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-12" id="project-logic">
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-primary">The Problem</h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed bg-white dark:bg-neutral-900 p-4 rounded-md border border-neutral-100 dark:border-neutral-800">
            {project.problem}
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500">The Solution</h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed bg-white dark:bg-neutral-900 p-4 rounded-md border border-neutral-100 dark:border-neutral-800">
            {project.solution}
          </p>
        </div>
      </section>

      <section className="space-y-6" id="project-features">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Key Features & Engineering Logic</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.features.map((feature, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-md bg-white dark:bg-neutral-900/40 border border-neutral-50 dark:border-neutral-800/50">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              <span className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

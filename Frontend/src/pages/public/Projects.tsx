import { useState, useEffect } from 'react';
import { getProjects } from '@/src/services/api';
import { IProject } from '@/src/types';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { SearchBar } from '../../components/projects/SearchBar';
import { Grid2X2, List, Filter } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function Projects() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    setLoading(true);
    getProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = Array.isArray(projects) ? projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase()) ||
    p.techStack.some(t => t.toLowerCase().includes(search.toLowerCase()))
  ) : [];

  return (
    <div className="space-y-8" id="projects-page">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6" id="projects-header">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100">Engineering Portfolio</h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">A detailed collection of technical challenges and architectural solutions.</p>
        </div>

        <div className="flex items-center gap-3">
          <SearchBar value={search} onChange={setSearch} />
          <button className="p-2 border border-neutral-200 dark:border-neutral-800 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors cursor-pointer text-sm font-medium">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between py-4 border-y border-neutral-100 dark:border-neutral-800" id="projects-toolbar">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          Showing {filteredProjects.length} Projects
        </span>

        <div className="flex items-center gap-2">
           <button
             onClick={() => setViewMode('grid')}
             className={cn(
               "p-1.5 rounded-md transition-colors",
               viewMode === 'grid' ? "bg-primary/10 text-primary" : "text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
             )}
           >
             <Grid2X2 className="w-4 h-4" />
           </button>
           <button
             onClick={() => setViewMode('list')}
             className={cn(
               "p-1.5 rounded-md transition-colors",
               viewMode === 'list' ? "bg-primary/10 text-primary" : "text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
             )}
           >
             <List className="w-4 h-4" />
           </button>
        </div>
      </div>

      {loading ? (
        <div className={cn(
          "gap-6 animate-pulse",
          viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "flex flex-col"
        )}>
           {[1,2,3].map(i => (
             <div key={i} className={cn(
               "bg-neutral-100 dark:bg-neutral-900 rounded-md",
               viewMode === 'grid' ? "h-80" : "h-32"
             )} />
           ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className={cn(
          "gap-8 p-1 md:p-4",
          viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "flex flex-col"
        )} id={viewMode === 'grid' ? "projects-grid" : "projects-list"}>
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} view={viewMode} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                <Filter className="w-6 h-6 text-neutral-400" />
            </div>
            <div className="space-y-1">
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">No projects found</p>
                <p className="text-xs text-neutral-500">Try adjusting your search terms or filters.</p>
            </div>
            <button
               onClick={() => setSearch('')}
               className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
                Clear all filters
            </button>
        </div>
      )}
    </div>
  );
}

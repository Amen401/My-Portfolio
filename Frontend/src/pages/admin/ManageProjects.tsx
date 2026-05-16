import { useState, useEffect } from 'react';
import { getProjects, deleteProject, createProject, updateProject } from '@/src/services/api';
import { IProject } from '@/src/types';
import { Plus, Trash2, Edit3, Save, X, Search, ExternalLink, Globe, LayoutGrid, Link, Info } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import Modal from '@/src/components/ui/Modal';

import { useToast } from '@/src/components/ui/Toast';
import { useConfirm } from '@/src/components/ui/ConfirmDialog';

export default function ManageProjects() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<IProject> | null>(null);
  const [featuresStr, setFeaturesStr] = useState('');
  const [techStackStr, setTechStackStr] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { confirm } = useConfirm();

  useEffect(() => {
    fetchProjects();
  }, [search]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects(search);
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProject({
      title: '',
      description: '',
      techStack: [],
      status: 'In Progress',
      githubLink: '',
      liveLink: '',
      problem: '',
      solution: '',
      features: []
    });
    setFeaturesStr('');
    setTechStackStr('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: IProject) => {
    setEditingProject({ ...project });
    setFeaturesStr(project.features?.join('\n') || '');
    setTechStackStr(project.techStack?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (await confirm({ title: 'Delete Project', message: 'Are you sure you want to delete this project permanently?', confirmTitle: 'Destroy Project' })) {
      try {
        await deleteProject(id);
        setProjects(projects.filter(p => p.id !== id));
        toast('Project destroyed from database', 'error');
      } catch (error) {
        toast('Failed to delete project', 'error');
      }
    }
  };

  const handleSave = async () => {
    if (!editingProject?.title) {
      toast('Title is required', 'error');
      return;
    }

    const payload = {
      ...editingProject,
      features: featuresStr.split('\n').filter(Boolean),
      techStack: techStackStr.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      if (editingProject.id) {
        // Update existing
        await updateProject(editingProject.id, payload);
        setProjects(projects.map(p => p.id === editingProject.id ? payload as IProject : p));
        toast('Project metadata synchronized');
      } else {
        // Create new
        const savedProject = await createProject(payload);
        setProjects([savedProject, ...projects]);
        toast('Project initialized successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast('Failed to save project', 'error');
    }
  };

  const filteredProjects = Array.isArray(projects) ? projects : [];

  return (
    <div className="space-y-8" id="manage-projects">
      {/* Header section with consistent styling */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" id="manage-header">
        <div className="space-y-1">
          <h1 className="text-xl font-black uppercase text-neutral-900 dark:text-neutral-100 tracking-tight">Project Lifecycle</h1>
          <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Database operations for engineering portfolio content.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="px-6 py-2.5 bg-primary text-white rounded-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Initialize New Project
        </button>
      </div>

      {/* Search section with consistent styling */}
      <div className="relative max-w-md group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Query database for projects..."
          className="w-full pl-12 pr-4 py-3 text-xs font-bold bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden"
        />
      </div>

      {/* Grid section instead of Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(p => (
          <div key={p.id} className="bg-white dark:bg-[#171717] border border-neutral-100 dark:border-neutral-800 rounded-md p-6 space-y-4 hover:border-primary/30 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-neutral-400">#PRJ-{p.id.padStart(4, '0')}</span>
                <div className="flex items-center gap-2">
                   <div className={cn(
                     "w-1.5 h-1.5 rounded-full",
                     p.status === 'Completed' ? "bg-emerald-500" : "bg-blue-500"
                   )} />
                   <span className={cn(
                     "text-[9px] font-black uppercase tracking-tighter",
                     p.status === 'Completed' ? "text-emerald-500" : "text-blue-500"
                   )}>
                     {p.status}
                   </span>
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xs font-black text-neutral-900 dark:text-neutral-100 uppercase tracking-tight line-clamp-1">{p.title}</h3>
                <p className="text-[10px] text-neutral-500 leading-relaxed line-clamp-2">{p.description}</p>
              </div>

              <div className="flex flex-wrap gap-1 pt-2">
                {p.techStack.map((t, idx) => (
                  <span key={`${t}-${idx}`} className="text-[8px] font-black bg-neutral-100 dark:bg-neutral-800 text-neutral-500 px-2 py-0.5 rounded-md uppercase tracking-tighter">{t}</span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-neutral-50 dark:border-neutral-800/50 mt-auto">
              <div className="flex items-center gap-1">
                 <button onClick={() => handleOpenEditModal(p)} className="p-2 text-neutral-400 hover:text-primary hover:bg-primary/10 rounded-md transition-all cursor-pointer">
                    <Edit3 className="w-4 h-4" />
                 </button>
                 <button onClick={() => handleDelete(p.id)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                 </button>
              </div>
              <a href={p.githubLink} target="_blank" rel="noopener noreferrer" className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer text-sm font-medium">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingProject?.id ? "Project Metadata Refinement" : "New Project Initialization"}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-neutral-400 flex items-center gap-1.5"><LayoutGrid className="w-3 h-3" /> Project Architecture Title</label>
              <input
                type="text"
                value={editingProject?.title || ''}
                onChange={(e) => setEditingProject({ ...editingProject!, title: e.target.value })}
                className="w-full px-4 py-2.5 text-xs font-bold bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden"
                placeholder="Ex: Distributed Database Engine"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-neutral-400 flex items-center gap-1.5"><Info className="w-3 h-3" /> System Status</label>
              <select
                value={editingProject?.status || 'In Progress'}
                onChange={(e) => setEditingProject({ ...editingProject!, status: e.target.value as any })}
                className="w-full px-4 py-2.5 text-xs font-bold bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden"
              >
                <option value="In Progress">Engineering In Progress</option>
                <option value="Completed">System Operational</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-neutral-400 flex items-center gap-1.5"><Info className="w-3 h-3" /> Project Narrative</label>
              <textarea
                rows={3}
                value={editingProject?.description || ''}
                onChange={(e) => setEditingProject({ ...editingProject!, description: e.target.value })}
                className="w-full px-4 py-2.5 text-xs font-bold bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden resize-none"
                placeholder="High-level technical overview..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-neutral-400 flex items-center gap-1.5">Problem Statement</label>
                 <textarea
                   rows={2}
                   value={editingProject?.problem || ''}
                   onChange={(e) => setEditingProject({ ...editingProject!, problem: e.target.value })}
                   className="w-full px-4 py-2.5 text-xs font-bold bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden resize-none"
                   placeholder="Describe what issue this project solves..."
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-neutral-400 flex items-center gap-1.5">Technical Solution</label>
                 <textarea
                   rows={2}
                   value={editingProject?.solution || ''}
                   onChange={(e) => setEditingProject({ ...editingProject!, solution: e.target.value })}
                   className="w-full px-4 py-2.5 text-xs font-bold bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden resize-none"
                   placeholder="Describe how it was solved..."
                 />
               </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-neutral-400 flex items-center gap-1.5">Key Features (Line separated)</label>
              <textarea
                rows={3}
                value={featuresStr}
                onChange={(e) => setFeaturesStr(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-bold bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden resize-none"
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-neutral-400 flex items-center gap-1.5"><Link className="w-3 h-3 cursor-pointer" /> Tech Stack (Comma Separated)</label>
            <input
              type="text"
              value={techStackStr}
              onChange={(e) => setTechStackStr(e.target.value)}
              className="w-full px-4 py-2.5 text-xs font-bold bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden"
              placeholder="React, Node.js, TypeScript..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-neutral-400 flex items-center gap-1.5"><Globe className="w-3 h-3" /> Live Demo Link</label>
              <input
                type="text"
                value={editingProject?.liveLink || ''}
                onChange={(e) => setEditingProject({ ...editingProject!, liveLink: e.target.value })}
                className="w-full px-4 py-2.5 text-xs font-bold bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-neutral-400 flex items-center gap-1.5"><Link className="w-3 h-3 cursor-pointer" /> Source Code Repository</label>
              <input
                type="text"
                value={editingProject?.githubLink || ''}
                onChange={(e) => setEditingProject({ ...editingProject!, githubLink: e.target.value })}
                className="w-full px-4 py-2.5 text-xs font-bold bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden"
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-8 py-2.5 bg-primary text-white rounded-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer text-sm font-medium"
            >
              <Save className="w-4 h-4" /> Commit Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


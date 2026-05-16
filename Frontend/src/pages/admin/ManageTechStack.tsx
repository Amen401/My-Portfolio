import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, X, ImageIcon, Globe, Search } from 'lucide-react';
import { getTechLogos, MOCK_TECH_LOGOS } from '@/src/services/api';
import { ITechLogo } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

import { useToast } from '@/src/components/ui/Toast';
import { useConfirm } from '@/src/components/ui/ConfirmDialog';

export default function ManageTechStack() {
  const [logos, setLogos] = useState<ITechLogo[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempLogo, setTempLogo] = useState<Partial<ITechLogo>>({});
  const [search, setSearch] = useState('');
  const { toast } = useToast();
  const { confirm } = useConfirm();

  useEffect(() => {
    getTechLogos(search).then(setLogos);
  }, [search]);

  const handleCreate = () => {
    const newLogo: ITechLogo = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Tech',
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'
    };
    setLogos([...logos, newLogo]);
    setEditingId(newLogo.id);
    setTempLogo(newLogo);
  };

  const handleEdit = (logo: ITechLogo) => {
    setEditingId(logo.id);
    setTempLogo(logo);
  };

  const handleSave = () => {
    if (!tempLogo.name || !tempLogo.logoUrl) {
      toast('Please fill all fields', 'error');
      return;
    }
    setLogos(logos.map(l => l.id === editingId ? { ...l, ...tempLogo } as ITechLogo : l));
    setEditingId(null);
    toast('Technology updated successfully');
  };

  const handleDelete = async (id: string) => {
    if (await confirm({ title: 'Remove Tech Stack', message: 'Are you sure you want to remove this technology permanently?', confirmTitle: 'Remove' })) {
      setLogos(logos.filter(l => l.id !== id));
      toast('Technology removed', 'info');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8" id="manage-tech-stack">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
              <h1 className="text-xl font-black uppercase text-neutral-900 dark:text-neutral-100 tracking-tight">Tech Stack Repository</h1>
          <p className="text-xs text-neutral-500">Curate the technologies showcased on your homepage.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <input 
              type="text"
              placeholder="Search database..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-md text-xs focus:ring-1 focus:ring-primary outline-hidden"
            />
          </div>
          <button 
            onClick={handleCreate}
            className="px-6 py-2.5 bg-primary text-white rounded-md flex items-center gap-2 transition-all active:scale-95 shrink-0 cursor-pointer text-sm font-medium"
          >
            <Plus className="w-3.5 h-3.5" /> Initialize New
          </button>
        </div>
      </div>

      <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
          <AnimatePresence>
            {logos.map((logo) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={logo.id}
              className="group bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-md p-6 relative overflow-hidden"
            >
              {editingId === logo.id ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-md bg-neutral-100 dark:bg-black border border-neutral-100 dark:border-neutral-800 flex items-center justify-center p-2">
                       <img src={tempLogo.logoUrl} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Logo Preview</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold uppercase text-neutral-400">Tech Name</label>
                       <input 
                         type="text"
                         value={tempLogo.name}
                         onChange={(e) => setTempLogo({ ...tempLogo, name: e.target.value })}
                         className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-black border border-neutral-100 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden"
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold uppercase text-neutral-400">Logo URL (SVG preferred)</label>
                       <input 
                         type="text"
                         value={tempLogo.logoUrl}
                         onChange={(e) => setTempLogo({ ...tempLogo, logoUrl: e.target.value })}
                         className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-black border border-neutral-100 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden"
                       />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={handleSave}
                      className="flex-1 py-2 bg-primary text-white rounded-md flex items-center justify-center gap-1.5 cursor-pointer text-sm font-medium"
                    >
                      <Save className="w-3 h-3" /> Save
                    </button>
                    <button 
                      onClick={() => setEditingId(null)}
                      className="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 text-[10px] font-black uppercase tracking-widest rounded-md cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-md bg-neutral-50 dark:bg-black border border-neutral-100 dark:border-neutral-800 p-3 group-hover:scale-110 transition-transform">
                      <img src={logo.logoUrl} alt={logo.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-tight">{logo.name}</h4>
                      <p className="text-[10px] text-neutral-400 font-mono truncate max-w-[120px]">{logo.logoUrl}</p>
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(logo)}
                      className="p-1.5 text-neutral-400 hover:text-primary transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(logo.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>

      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 p-4 rounded-md flex items-start gap-3">
        <Globe className="w-4 h-4 text-emerald-500 mt-0.5" />
        <div className="space-y-1">
           <h5 className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">Pro Tip</h5>
           <p className="text-xs text-emerald-600/80 dark:text-emerald-500/80">Use high-quality SVG links from <a href="https://devicon.dev" target="_blank" className="underline cursor-pointer">Devicon</a> for best results across all themes.</p>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, FormEvent } from 'react';
import { getProfile } from '@/src/services/api';
import { IProfile } from '@/src/types';
import { Save, User, MapPin, Linkedin, Github, Phone, Briefcase, Globe, Send, MessageSquare, Lock, AlertCircle } from 'lucide-react';

import { useToast } from '@/src/components/ui/Toast';

export default function EditProfile() {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    getProfile().then(p => {
      setProfile({
        ...p,
        username: p.username || 'admin',
        password: p.password || '********'
      });
      setLoading(false);
    });
  }, []);

  const handleSaveSection = (section: string) => {
    if (section === 'Credentials') {
      if (!currentPassword) {
        toast('Confirm your identity with current password', 'error');
        return;
      }
      // Mock validation matching Login.tsx credentials
      if (currentPassword !== 'admin123') {
        toast('Authentication failed: Invalid current secret key', 'error');
        return;
      }
      setCurrentPassword('');
    }
    toast(`${section} updated successfully`);
  };

  if (loading || !profile) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12" id="edit-profile">
      <div className="space-y-1">
        <h1 className="text-xl font-black uppercase text-neutral-900 dark:text-neutral-100 tracking-tight">Identity Configuration</h1>
        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Update global metadata and public credentials independently.</p>
      </div>

      <div className="space-y-12">
        {/* Core Identity */}
        <section className="bg-white dark:bg-neutral-900 p-8 rounded-md border border-neutral-100 dark:border-neutral-800 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Core Identity</h3>
            <button 
              onClick={() => handleSaveSection('Core Identity')}
              className="px-6 py-2.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-md flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Sync Identity
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-24 h-24 shrink-0 rounded-md overflow-hidden bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-neutral-800">
              <img src={profile.profilePic} alt="Current" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-2 flex-1">
              <label className="text-[10px] font-bold uppercase text-neutral-400">Profile Image URL</label>
              <input
                type="text"
                value={profile.profilePic}
                onChange={(e) => setProfile({ ...profile, profilePic: e.target.value })}
                className="w-full px-4 py-2 text-xs font-bold bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-neutral-400 flex items-center gap-1.5"><User className="w-3 h-3"/> Full Name</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full px-4 py-2 text-xs font-bold bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-neutral-400 flex items-center gap-1.5"><Briefcase className="w-3 h-3"/> Profession</label>
              <input
                type="text"
                value={profile.profession}
                onChange={(e) => setProfile({ ...profile, profession: e.target.value })}
                className="w-full px-4 py-2 text-xs font-bold bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-neutral-400 flex items-center gap-1.5"><Briefcase className="w-3 h-3"/> Years of Experience</label>
              <input
                type="text"
                value={profile.yearsOfExperience}
                onChange={(e) => setProfile({ ...profile, yearsOfExperience: e.target.value })}
                className="w-full px-4 py-2 text-xs font-bold bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-neutral-400 flex items-center gap-1.5"><MapPin className="w-3 h-3"/> Location</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full px-4 py-2 text-xs font-bold bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden"
              />
            </div>
          </div>
        </section>

        {/* Narratives */}
        <section className="bg-white dark:bg-neutral-900 p-8 rounded-md border border-neutral-100 dark:border-neutral-800 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Narratives</h3>
            <button 
              onClick={() => handleSaveSection('Narratives')}
              className="px-6 py-2.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-md flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save Bios
            </button>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-neutral-400">Short Bio</label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-4 py-2 text-xs font-bold bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-neutral-400">Detailed Description</label>
              <textarea
                rows={5}
                value={profile.description}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                className="w-full px-4 py-2 text-xs font-bold bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden resize-none"
              />
            </div>
          </div>
        </section>

        {/* Connections */}
        <section className="bg-white dark:bg-neutral-900 p-8 rounded-md border border-neutral-100 dark:border-neutral-800 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Connections</h3>
            <button 
              onClick={() => handleSaveSection('Social Connections')}
              className="px-6 py-2.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-md flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Sync Socials
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-neutral-400 flex items-center gap-1.5"><Phone className="w-3 h-3"/> Phone Number</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-2 text-xs font-bold bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-neutral-400 flex items-center gap-1.5"><Globe className="w-3 h-3"/> Website URL</label>
              <input
                type="url"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                className="w-full px-4 py-2 text-xs font-bold bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-neutral-400 flex items-center gap-1.5"><Linkedin className="w-3 h-3"/> LinkedIn URL</label>
              <input
                type="url"
                value={profile.linkedin}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                className="w-full px-4 py-2 text-xs font-bold bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-neutral-400 flex items-center gap-1.5"><Github className="w-3 h-3"/> GitHub URL</label>
              <input
                type="url"
                value={profile.github}
                onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                className="w-full px-4 py-2 text-xs font-bold bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden"
              />
            </div>
          </div>
        </section>

        {/* Credentials */}
        <section className="bg-white dark:bg-neutral-900 p-8 rounded-md border border-red-100 dark:border-red-900/30 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
             <Lock className="w-16 h-16" />
          </div>
          
          <div className="flex items-center justify-between relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Security Credentials</h3>
            <button 
              onClick={() => handleSaveSection('Credentials')}
              className="px-6 py-2.5 bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-md flex items-center gap-2 hover:bg-red-600 transition-all active:scale-95 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" /> Force Update
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-neutral-400 flex items-center gap-1.5"><User className="w-3 h-3"/> Target Username</label>
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-neutral-400 flex items-center gap-1.5"><Lock className="w-3 h-3"/> New Passcode</label>
                <input
                  type="password"
                  value={profile.password}
                  onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden"
                />
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-md border border-red-100 dark:border-red-900/40 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-3 h-3" /> Integrity Check
                </label>
                <p className="text-[9px] text-red-500/70 font-bold uppercase tracking-tight">System requires current secret to commit changes.</p>
              </div>
              <input
                type="password"
                placeholder="Current Secret Key"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 text-xs font-bold bg-white dark:bg-black border border-red-200 dark:border-red-800 rounded-md focus:ring-1 focus:ring-red-500 outline-hidden tracking-widest"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

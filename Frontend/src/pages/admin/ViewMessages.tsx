import { useState, useEffect, useMemo } from 'react';
import { getMessages } from '@/src/services/api';
import { IMessage } from '@/src/types';
import { 
  Trash2, 
  Reply, 
  Mail, 
  User, 
  Clock, 
  Search, 
  Filter, 
  ChevronDown, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  CornerDownRight,
  Send,
  X,
  Calendar
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

import { useToast } from '@/src/components/ui/Toast';

export default function ViewMessages() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [search, setSearch] = useState('');
  const [filterReplied, setFilterReplied] = useState<'all' | 'replied' | 'unreplied'>('all');
  const [filterRead, setFilterRead] = useState<'all' | 'read' | 'unread'>('unread');
  const [filterIgnored, setFilterIgnored] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    getMessages(search).then(msgs => {
      // Add missing fields for mock data if necessary
      const enhancedMsgs = msgs.map(m => ({
        ...m,
        isRead: m.isRead ?? false,
        isIgnored: m.isIgnored ?? false
      }));
      setMessages(enhancedMsgs);
    });
  }, [search]);

  const filteredMessages = useMemo(() => {
    return messages
      .filter(m => {
        const matchesReplied = 
          filterReplied === 'all' ? true : 
          filterReplied === 'replied' ? !!m.repliedAt : !m.repliedAt;

        const matchesRead = 
          filterRead === 'all' ? true : 
          filterRead === 'read' ? m.isRead : !m.isRead;

        const matchesIgnored = filterIgnored ? m.isIgnored : !m.isIgnored;

        // Date matching logic - using ISO date strings for comparison to avoid TZ issues
        const messageDateStr = m.createdAt.split('T')[0];
        const matchesDate = 
          (!dateRange.start || messageDateStr >= dateRange.start) &&
          (!dateRange.end || messageDateStr <= dateRange.end);

        return matchesReplied && matchesRead && matchesIgnored && matchesDate;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [messages, filterReplied, filterRead, filterIgnored, dateRange]);

  const handleDelete = (id: string) => {
    setMessages(messages.filter(m => m.id !== id));
    toast('Message removed from local view', 'info');
  };

  const markAsRead = (id: string) => {
    setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m));
    toast('Message marked as read');
  };

  const toggleIgnore = (id: string) => {
    const message = messages.find(m => m.id === id);
    setMessages(messages.map(m => m.id === id ? { ...m, isIgnored: !m.isIgnored } : m));
    toast(message?.isIgnored ? 'Message restored' : 'Message ignored', 'info');
  };

  const handleReply = (id: string) => {
    setMessages(messages.map(m => m.id === id ? { 
      ...m, 
      repliedAt: new Date().toISOString(), 
      replyText: replyText,
      isRead: true 
    } : m));
    setReplyingTo(null);
    setReplyText('');
    toast('Reply sent successfully');
  };

  return (
    <div className="h-full flex flex-col gap-6" id="view-messages-container">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-black uppercase text-neutral-900 dark:text-neutral-100">Communications Hub</h1>
          <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Manage, filter and respond to inquiries.</p>
        </div>
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-md flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                {messages.filter(m => !m.isRead).length} Incoming Inquiries
              </span>
           </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-md">
        <div className="lg:col-span-1 space-y-1">
          <label className="text-[9px] font-black uppercase tracking-tighter text-neutral-400">Search Workspace</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <input 
              type="text"
              placeholder="Query..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-[11px] font-bold bg-neutral-50 dark:bg-black border border-neutral-100 dark:border-neutral-800 rounded-md focus:ring-1 focus:ring-primary outline-hidden"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase tracking-tighter text-neutral-400">Status Matrix</label>
          <div className="flex gap-2">
            <select 
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value as any)}
              className="flex-1 px-3 py-2.5 text-[11px] font-bold bg-neutral-50 dark:bg-black border border-neutral-100 dark:border-neutral-800 rounded-md outline-hidden"
            >
              <option value="unread">Unread Only</option>
              <option value="read">Archived (Read)</option>
              <option value="all">Full History</option>
            </select>
            <select 
              value={filterReplied}
              onChange={(e) => setFilterReplied(e.target.value as any)}
              className="flex-1 px-3 py-2.5 text-[11px] font-bold bg-neutral-50 dark:bg-black border border-neutral-100 dark:border-neutral-800 rounded-md outline-hidden"
            >
              <option value="all">Any Status</option>
              <option value="replied">Processed</option>
              <option value="unreplied">Pending Action</option>
            </select>
          </div>
        </div>

        <div className="space-y-1 text-center">
           <label className="text-[9px] font-black uppercase tracking-tighter text-neutral-400">Chronological Control</label>
           <div className="flex items-center gap-2">
              <input 
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full px-2 py-2 text-[10px] font-bold bg-neutral-50 dark:bg-black border border-neutral-100 dark:border-neutral-800 rounded-md outline-hidden"
              />
              <span className="text-neutral-300">/</span>
              <input 
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full px-2 py-2 text-[10px] font-bold bg-neutral-50 dark:bg-black border border-neutral-100 dark:border-neutral-800 rounded-md outline-hidden"
              />
           </div>
        </div>

        <div className="flex items-end gap-2">
          <button 
            onClick={() => setFilterIgnored(!filterIgnored)}
            className={cn(
              "flex-1 py-2.5 rounded-md text-[9px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2",
              filterIgnored 
                ? "bg-amber-50 border-amber-200 text-amber-600" 
                : "bg-neutral-50 dark:bg-black border-neutral-100 dark:border-neutral-800 text-neutral-400"
            )}
          >
            {filterIgnored ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            {filterIgnored ? "Viewing Ignored" : "Ignored Inbox"}
          </button>
          <button 
            onClick={() => {
              setSearch('');
              setFilterRead('unread');
              setFilterReplied('all');
              setFilterIgnored(false);
              setDateRange({ start: '', end: '' });
              toast('Filters Resetted', 'info');
            }}
            className="p-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-500 hover:text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages List Area */}
      <div 
        className="flex-1 overflow-y-auto pr-4 space-y-4 custom-scrollbar" 
        style={{ scrollbarGutter: 'stable' }}
        id="messages-scroll-area"
      >
        <AnimatePresence mode="popLayout">
          {filteredMessages.length > 0 ? filteredMessages.map((m) => (
            <motion.div
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={m.id}
              className={cn(
                "group relative bg-white dark:bg-neutral-900 p-6 rounded-md border transition-all duration-300",
                !m.isRead ? "border-primary/30 ring-1 ring-primary/5" : "border-neutral-100 dark:border-neutral-800",
                m.isIgnored && "opacity-60 grayscale bg-neutral-50 dark:bg-neutral-950"
              )}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex gap-4">
                   <div className={cn(
                     "w-12 h-12 rounded-md flex items-center justify-center transition-colors",
                     !m.isRead ? "bg-primary/10 text-primary border border-primary/20" : "bg-neutral-50 dark:bg-black text-neutral-400 border border-neutral-100 dark:border-neutral-800"
                   )}>
                      <User className="w-6 h-6" />
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">{m.name}</h3>
                        {!m.isRead && <span className="w-2 h-2 rounded-full bg-primary" />}
                        {m.repliedAt && <CheckCircle2 className="w-4 h-4 text-emerald-500" title="Replied" />}
                      </div>
                      <p className="text-[10px] text-primary font-black uppercase tracking-widest flex items-center gap-1.5 cursor-pointer hover:underline">
                        <Mail className="w-3 h-3" /> {m.email}
                      </p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-neutral-400 tracking-tighter bg-neutral-50 dark:bg-black px-2 py-1 rounded-md border border-neutral-100 dark:border-neutral-800">
                    <Clock className="w-3 h-3" /> {new Date(m.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="mt-5 p-5 rounded-md bg-neutral-50 dark:bg-black/40 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed relative border border-neutral-100 dark:border-neutral-800/20">
                <span className="absolute -top-3 left-3 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest text-neutral-400">Message Payload</span>
                {m.message}
              </div>

              {m.replyText && (
                <div className="mt-4 pl-6 border-l-2 border-emerald-500/30 space-y-2">
                   <div className="flex items-center gap-2 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                      <CornerDownRight className="w-3 h-3" /> Outreach Sent ( {new Date(m.repliedAt!).toLocaleDateString()} )
                   </div>
                   <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                      {m.replyText}
                   </p>
                </div>
              )}

              {replyingTo === m.id && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 space-y-3"
                >
                  <textarea 
                    autoFocus
                    placeholder="Draft your professional response..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-4 text-[11px] font-medium bg-neutral-50 dark:bg-black border border-primary/20 rounded-md focus:ring-1 focus:ring-primary outline-hidden min-h-[120px] shadow-inner"
                  />
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setReplyingTo(null)}
                      className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-600 cursor-pointer"
                    >
                      Discard
                    </button>
                    <button 
                      onClick={() => handleReply(m.id)}
                      disabled={!replyText.trim()}
                      className="px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-md disabled:opacity-50 transition-all cursor-pointer"
                    >
                      Dispatch Replay
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/50 flex items-center justify-between">
                <div className="flex gap-4">
                   {!m.isRead && (
                     <button 
                       onClick={() => markAsRead(m.id)}
                       className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-emerald-500 flex items-center gap-2"
                     >
                       <Eye className="w-3.5 h-3.5" /> Archive
                     </button>
                   )}
                   <button 
                     onClick={() => toggleIgnore(m.id)}
                     className={cn(
                       "text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors",
                       m.isIgnored ? "text-amber-500" : "text-neutral-400 hover:text-amber-500"
                     )}
                   >
                     {m.isIgnored ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                     {m.isIgnored ? "Unignore" : "Ignore"}
                   </button>
                </div>

                <div className="flex items-center gap-3">
                   {!m.repliedAt && !replyingTo && (
                     <button 
                       onClick={() => setReplyingTo(m.id)}
                       className="px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] font-black uppercase tracking-widest rounded-md hover:scale-105 transition-all flex items-center gap-2 shadow-sm"
                     >
                        <Reply className="w-3.5 h-3.5" /> Compose Reply
                     </button>
                   )}
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="py-32 flex flex-col items-center justify-center text-center space-y-4 bg-white dark:bg-neutral-900 rounded-md border border-dashed border-neutral-200 dark:border-neutral-800">
               <div className="w-20 h-20 rounded-full bg-neutral-50 dark:bg-black/50 flex items-center justify-center text-neutral-300">
                 <Mail className="w-10 h-10" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-tight">Zero Inquiries</h3>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest max-w-[240px]">The current filtered view is empty.</p>
               </div>
               <button 
                 onClick={() => {
                   setSearch('');
                   setFilterRead('unread');
                   setFilterReplied('all');
                   setFilterIgnored(false);
                 }}
                 className="text-[9px] font-black text-primary uppercase tracking-[0.2em] border border-primary/20 px-4 py-2 rounded-full hover:bg-primary/5 transition-colors cursor-pointer"
               >
                 Flush Filters
               </button>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

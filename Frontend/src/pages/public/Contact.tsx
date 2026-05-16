import { useState, FormEvent } from 'react';
import { Send, CheckCircle, Mail, MapPin, Linkedin } from 'lucide-react';
import { motion } from 'motion/react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 py-8" id="contact-page">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-black text-neutral-900 dark:text-neutral-100">Get in Touch</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Have a technical project or inquiry? I'm always open to discussing architectural solutions.</p>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4 p-4 rounded-md bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
             <div className="p-2 rounded-md bg-primary/10 text-primary"><Mail className="w-5 h-5" /></div>
             <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Email</p>
                <p className="text-xs font-semibold">pawlos@example.com</p>
             </div>
          </div>
          <div className="flex gap-4 p-4 rounded-md bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
             <div className="p-2 rounded-md bg-primary/10 text-primary"><MapPin className="w-5 h-5" /></div>
             <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Location</p>
                <p className="text-xs font-semibold">Addis Ababa, Ethiopia</p>
             </div>
          </div>
          <div className="flex gap-4 p-4 rounded-md bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
             <div className="p-2 rounded-md bg-primary/10 text-primary"><Linkedin className="w-5 h-5" /></div>
             <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">LinkedIn</p>
                <p className="text-xs font-semibold">linkedin.com/in/pawlosgelgelo</p>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 p-8 rounded-md border border-neutral-100 dark:border-neutral-800 relative overflow-hidden">
        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full flex flex-col items-center justify-center text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold">Message Sent!</h2>
              <p className="text-xs text-neutral-500">Thank you for reaching out. I will get back to you shortly.</p>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Full Name</label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary transition-all"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Email Address</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary transition-all"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Your Message</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary transition-all"
                placeholder="Tell me about your project..."
              />
            </div>
            <button
              disabled={status === 'submitting'}
              type="submit"
              className="w-full py-3 bg-primary text-white rounded-md disabled:opacity-50 transition-all flex items-center justify-center gap-2 group cursor-pointer text-sm font-medium"
            >
              {status === 'submitting' ? 'Transmitting...' : (
                <>Send Message <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

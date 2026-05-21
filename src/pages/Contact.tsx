import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const inputCls = `w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200
  bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400
  focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:bg-white
  dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500
  dark:focus:border-amber-500 dark:focus:ring-amber-500/20`;

const labelCls = 'block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Header */}
      <div className="py-14 bg-white dark:bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none hidden dark:block">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full opacity-8"
            style={{ background: 'radial-gradient(ellipse, #f59e0b, transparent 70%)', filter: 'blur(60px)' }} />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-sm font-medium
            bg-amber-50 text-amber-700 border border-amber-200
            dark:bg-amber-500/10 dark:text-amber-300/80 dark:border-amber-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            Get in Touch
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Contact Us</h1>
          <p className="text-gray-500 dark:text-gray-400">We'd love to hear from you</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid lg:grid-cols-2 gap-10">

          {/* Form */}
          <div className="p-8 rounded-2xl border shadow-card
            bg-white border-gray-100
            dark:bg-gray-800/50 dark:border-white/[0.06]">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={labelCls}>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Subject</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} required placeholder="How can we help?" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows={5}
                  placeholder="Tell us more..." className={inputCls} />
              </div>
              <button type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5
                  bg-gradient-to-r from-amber-400 to-amber-600 text-gray-900 shadow-md hover:shadow-amber-500/20 hover:shadow-lg">
                <Send className="h-4 w-4" />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-5">
            <div className="p-8 rounded-2xl border shadow-card
              bg-white border-gray-100
              dark:bg-gray-800/50 dark:border-white/[0.06]">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Get in Touch</h2>
              <div className="space-y-6">
                {[
                  { icon: Mail,   label: 'Email',   value: 'support@spoonify.com' },
                  { icon: Phone,  label: 'Phone',   value: '+1 (555) 123-4567' },
                  { icon: MapPin, label: 'Address', value: '123 Recipe Street\nCulinary City, CC 12345' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                      bg-amber-50 dark:bg-amber-500/10">
                      <Icon className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{label}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm whitespace-pre-line mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Response time card */}
            <div className="p-6 rounded-2xl border
              bg-amber-50 border-amber-100
              dark:bg-amber-500/8 dark:border-amber-500/15">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">We're Online</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Typical response time is within <span className="text-amber-600 dark:text-amber-400 font-medium">24 hours</span>. We read every message!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

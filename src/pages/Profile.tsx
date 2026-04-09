import React from 'react';
import { motion } from 'motion/react';
import { 
  Box, 
  Heart, 
  Download, 
  Share2, 
  Edit2, 
  MapPin, 
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { cn } from '../lib/utils';

const MY_CREATIONS = [
  {
    id: 1,
    title: "Neo-Tokyo Skyscraper",
    image: "https://picsum.photos/seed/lego1/800/600",
    likes: 124,
    downloads: 45,
    parts: 1240,
    date: "2 days ago"
  },
  {
    id: 2,
    title: "Mars Rover Prototype",
    image: "https://picsum.photos/seed/lego2/800/600",
    likes: 89,
    downloads: 12,
    parts: 450,
    date: "1 week ago"
  },
  {
    id: 3,
    title: "Modular Library",
    image: "https://picsum.photos/seed/lego3/800/600",
    likes: 256,
    downloads: 112,
    parts: 3200,
    date: "2 weeks ago"
  }
];

export default function Profile() {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-background">
      {/* Profile Header */}
      <div className="relative h-64 bg-gradient-to-r from-primary/20 via-secondary/10 to-background border-b border-outline-variant/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-from)_0%,_transparent_50%)] opacity-20"></div>
        <div className="max-w-6xl mx-auto px-8 h-full flex items-end pb-8">
          <div className="flex flex-col md:flex-row items-end gap-8 w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative -mb-16"
            >
              <div className="w-40 h-40 rounded-3xl overflow-hidden border-8 border-background shadow-2xl">
                <img 
                  alt="User avatar" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6kaOpglxZzTFxWW2s27gb6ilv9xs0VAaQUgv2rtQjWGQVzWTRbpp_gdN9DMjD47DjjoBUcat05OK1_AIS9gYQRMxXCbtYxcUAuLO8-k3orfbay1Om1aTtRk8YO0UuBjlR-7rW116ClNuTOn7oAxIQW6CIlpyR2hhLch2GwNfTm9BQgMRYryoQUh1w8_Ccu5vcTIjVH8bYIaH502DecSgXrmmo9OFs9EgVxgx1ERwbmwlt9nDWgf-OOkpG6SklBl3JIGMjT7fpzz0"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-2 right-2 bg-tertiary text-on-tertiary p-2 rounded-xl shadow-lg hover:scale-110 transition-transform">
                <Edit2 className="w-4 h-4" />
              </button>
            </motion.div>
            
            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-black text-white font-headline tracking-tighter">The Tactile Architect</h1>
                  <div className="flex items-center gap-4 mt-2 text-slate-400 text-sm font-medium">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Copenhagen, DK</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined March 2024</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-2.5 rounded-xl bg-surface-container-high text-white font-bold text-sm hover:bg-surface-container-highest transition-colors border border-outline-variant/10">
                    Share Profile
                  </button>
                  <button className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/20">
                    Edit Profile
                  </button>
                </div>
              </div>
              
              <div className="flex gap-8 pt-2">
                <div className="text-center md:text-left">
                  <p className="text-2xl font-black text-white">42</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Creations</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-2xl font-black text-white">1.2k</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Followers</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-2xl font-black text-white">856</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Following</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-8 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar Info */}
          <div className="space-y-10">
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 px-1">About</h3>
              <p className="text-slate-300 text-sm leading-relaxed bg-surface-container-low/50 p-6 rounded-2xl border border-outline-variant/5">
                Digital master-builder focused on high-fidelity procedural brick generation and architectural modular systems. Exploring the intersection of AI and tactile creativity.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 px-1">Achievements</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/5 flex flex-col items-center text-center gap-2">
                  <Award className="w-8 h-8 text-secondary" />
                  <span className="text-[10px] font-bold text-slate-400">Master Builder</span>
                </div>
                <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/5 flex flex-col items-center text-center gap-2">
                  <Layers className="w-8 h-8 text-tertiary" />
                  <span className="text-[10px] font-bold text-slate-400">1k+ Bricks</span>
                </div>
              </div>
            </section>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4">
              <div className="flex gap-8">
                <button className="text-sm font-bold text-white border-b-2 border-primary pb-4 -mb-4">Creations</button>
                <button className="text-sm font-bold text-slate-500 hover:text-slate-300 pb-4 -mb-4 transition-colors">Liked</button>
                <button className="text-sm font-bold text-slate-500 hover:text-slate-300 pb-4 -mb-4 transition-colors">Collections</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MY_CREATIONS.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/5 hover:border-outline-variant/20 transition-all hover:shadow-2xl"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div className="flex gap-2 w-full">
                        <button className="flex-1 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2">
                          <Download className="w-3 h-3" /> Export
                        </button>
                        <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-2 rounded-lg transition-colors">
                          <Share2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-white group-hover:text-primary transition-colors">{item.title}</h4>
                      <span className="text-[10px] text-slate-500 font-medium">{item.date}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-primary fill-primary" /> {item.likes}</span>
                      <span className="flex items-center gap-1"><Download className="w-3 h-3" /> {item.downloads}</span>
                      <span className="flex items-center gap-1"><Box className="w-3 h-3" /> {item.parts} bricks</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

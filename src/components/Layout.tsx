import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Settings as SettingsIcon, 
  User,
  Library,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Plus,
  LogOut,
  HelpCircle,
  LayoutDashboard,
  Box,
  Check,
  MessageSquare,
  Heart
} from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const isSettings = location.pathname === '/settings';
  const isCommunity = location.pathname === '/community';
  const isProfile = location.pathname === '/profile';
  const isGenerator = location.pathname === '/';
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: 'New Like', message: 'Kenta_Builds liked your Space Shuttle', time: '2m ago', icon: <Heart className="w-4 h-4 text-primary" /> },
    { id: 2, title: 'System Update', message: 'New Technic bricks added to foundry', time: '1h ago', icon: <Box className="w-4 h-4 text-secondary" /> },
    { id: 3, title: 'Build Success', message: 'Your "Mars Habitat" render is ready', time: '3h ago', icon: <Check className="w-4 h-4 text-tertiary" /> },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-on-surface">
      {/* Top Navigation Bar */}
      <header className="flex justify-between items-center px-6 py-3 w-full border-none bg-[#1a2333] shadow-[0_20px_40px_rgba(0,0,0,0.4)] top-0 z-50">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tighter text-primary italic font-headline">
            The Tactile Architect
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link 
              to="/" 
              className={cn(
                "font-headline text-sm font-medium tracking-tight transition-colors duration-200",
                isGenerator ? "text-secondary border-b-2 border-secondary pb-1" : "text-slate-400 hover:text-tertiary"
              )}
            >
              Workbench
            </Link>
            <Link 
              to="/community" 
              className={cn(
                "font-headline text-sm font-medium tracking-tight transition-colors duration-200",
                isCommunity ? "text-secondary border-b-2 border-secondary pb-1" : "text-slate-400 hover:text-tertiary"
              )}
            >
              Community
            </Link>
            <Link 
              to="/profile" 
              className={cn(
                "font-headline text-sm font-medium tracking-tight transition-colors duration-200",
                isProfile ? "text-secondary border-b-2 border-secondary pb-1" : "text-slate-400 hover:text-tertiary"
              )}
            >
              My Studio
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4 relative">
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className={cn(
                "text-slate-400 hover:text-tertiary transition-colors relative p-2 rounded-full hover:bg-surface-container-highest/20",
                showNotifications && "text-tertiary bg-surface-container-highest/20"
              )}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-[#1a2333]"></span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-surface-container-high border border-outline-variant/20 rounded-2xl shadow-2xl overflow-hidden z-[60]"
                >
                  <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center">
                    <h3 className="font-headline font-bold text-sm">Notifications</h3>
                    <button className="text-[10px] uppercase tracking-widest font-bold text-tertiary hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {notifications.map(n => (
                      <div key={n.id} className="p-4 border-b border-outline-variant/5 hover:bg-surface-container-highest/30 transition-colors cursor-pointer group">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                            {n.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-xs font-bold text-on-surface">{n.title}</p>
                              <span className="text-[10px] text-slate-500">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">{n.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-outline-variant/10">
                    <button className="text-xs font-bold text-slate-400 hover:text-white transition-colors">View all activity</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/settings" className="text-slate-400 hover:text-tertiary transition-colors p-2 rounded-full hover:bg-surface-container-highest/20">
            <SettingsIcon className="w-5 h-5" />
          </Link>

          <button className="hidden sm:block px-4 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-sm scale-95 active:scale-90 transition-all hover:brightness-110">
            Upgrade
          </button>

          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className={cn(
                "w-9 h-9 rounded-full overflow-hidden bg-surface-variant border-2 transition-all",
                showProfile ? "border-tertiary" : "border-outline-variant"
              )}
            >
              <img 
                alt="User avatar" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6kaOpglxZzTFxWW2s27gb6ilv9xs0VAaQUgv2rtQjWGQVzWTRbpp_gdN9DMjD47DjjoBUcat05OK1_AIS9gYQRMxXCbtYxcUAuLO8-k3orfbay1Om1aTtRk8YO0UuBjlR-7rW116ClNuTOn7oAxIQW6CIlpyR2hhLch2GwNfTm9BQgMRYryoQUh1w8_Ccu5vcTIjVH8bYIaH502DecSgXrmmo9OFs9EgVxgx1ERwbmwlt9nDWgf-OOkpG6SklBl3JIGMjT7fpzz0"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 bg-surface-container-high border border-outline-variant/20 rounded-2xl shadow-2xl overflow-hidden z-[60]"
                >
                  <div className="p-4 bg-surface-container-highest/30 border-b border-outline-variant/10">
                    <p className="text-sm font-bold text-white">The Tactile Architect</p>
                    <p className="text-[10px] text-slate-400 font-medium">Master Builder • Level 42</p>
                  </div>
                  <div className="p-2">
                    <Link 
                      to="/settings" 
                      onClick={() => setShowProfile(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container-highest/50 transition-colors group"
                    >
                      <User className="w-4 h-4 text-slate-400 group-hover:text-tertiary" />
                      <span className="text-xs font-bold text-slate-300 group-hover:text-white">Profile Settings</span>
                    </Link>
                    <Link 
                      to="/profile" 
                      onClick={() => setShowProfile(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container-highest/50 transition-colors group"
                    >
                      <LayoutGrid className="w-4 h-4 text-slate-400 group-hover:text-tertiary" />
                      <span className="text-xs font-bold text-slate-300 group-hover:text-white">My Studio</span>
                    </Link>
                    <div className="h-px bg-outline-variant/10 my-2 mx-2"></div>
                    <button 
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/10 transition-colors group text-left"
                    >
                      <LogOut className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                      <span className="text-xs font-bold text-slate-300 group-hover:text-primary">Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for Community, Settings, and Profile */}
        {(isCommunity || isSettings || isProfile) && (
          <aside className="hidden md:flex h-full w-64 bg-background flex-col border-r border-outline-variant/10 z-40">
            <div className="px-6 py-8">
              {isCommunity || isProfile ? (
                <>
                  <div className="flex items-center gap-3 mb-10">
                    <div className="h-12 w-12 rounded-xl bg-surface-container-high flex items-center justify-center border border-outline-variant/30 overflow-hidden">
                      <img 
                        alt="Architect Avatar" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdaz-7dg6row6YZW9PGCegDJjzyfjCDz_ilJ-sesF0PdnLP30ThUORlqJ1CbrgpTBEpixiKaXjBeuOVGBirCtQbIZDLuL7SO7PBjo5qA8YY5hS_D6w_vvymPYTcCuXNM5EbytqJGEqinPI8MfD0vgmBTeeN23jUV9w7WpWYmJXUrePvXTDnGU-Ukm3YAHTFBvIhmJ6hs36iz01wj8KBV1AcgrTpqUF7gYosbxBxY5LzY5vkrVeiMKFy8nt6GEmR4YS5TCiz72U-Cs"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h3 className="font-black text-secondary text-sm uppercase tracking-wider">Master Builder</h3>
                      <p className="text-[10px] text-tertiary uppercase font-bold tracking-widest">Level 42 Creator</p>
                    </div>
                  </div>
                  <nav className="space-y-4">
                    <button className="w-full bg-secondary text-on-secondary px-4 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:shadow-[0_0_20px_rgba(255,243,215,0.1)] hover:brightness-105 active:scale-[0.98] transition-all text-sm font-headline">
                      <Plus className="w-5 h-5" />
                      Upload Design
                    </button>
                    <Link 
                      to="/profile"
                      className={cn(
                        "w-full px-4 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] text-sm font-headline",
                        isProfile ? "bg-surface-container-highest text-white border border-tertiary/30" : "bg-surface-container-highest/50 text-on-surface border border-outline-variant/20 hover:bg-surface-container-highest"
                      )}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      My Studio
                    </Link>
                  </nav>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-secondary-container rounded-lg flex items-center justify-center shadow-lg">
                      <Box className="w-6 h-6 text-on-secondary-container" />
                    </div>
                    <div>
                      <h2 className="font-headline font-bold text-white tracking-tight leading-tight">Creator Hub</h2>
                      <p className="text-xs text-slate-400 font-label tracking-wide">Settings</p>
                    </div>
                  </div>
                  <nav className="space-y-1 -mx-6">
                    <a className="bg-surface-container-highest/50 text-tertiary font-bold border-l-4 border-tertiary flex items-center px-6 py-4 gap-4" href="#profile">
                      <User className="w-5 h-5" />
                      <span className="text-sm tracking-wide">Profile</span>
                    </a>
                    <a className="text-slate-400 flex items-center px-6 py-4 gap-4 hover:bg-surface-container-highest/30 hover:text-white transition-all" href="#3d-preferences">
                      <Box className="w-5 h-5" />
                      <span className="text-sm tracking-wide">3D Preferences</span>
                    </a>
                    <a className="text-slate-400 flex items-center px-6 py-4 gap-4 hover:bg-surface-container-highest/30 hover:text-white transition-all" href="#notifications">
                      <Bell className="w-5 h-5" />
                      <span className="text-sm tracking-wide">Notifications</span>
                    </a>
                  </nav>
                </>
              )}
            </div>
            <div className="mt-auto px-6 py-8 border-t border-outline-variant/10">
              <nav className="space-y-1">
                <a className="text-slate-400 flex items-center px-4 py-3 hover:bg-surface-container-high rounded-lg transition-colors text-sm" href="#">
                  <HelpCircle className="w-5 h-5 mr-3" />
                  Support
                </a>
                <a className="text-slate-400 flex items-center px-4 py-3 hover:bg-surface-container-high rounded-lg transition-colors text-sm" href="#">
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </a>
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {children}
        </main>

        {/* Bottom Navigation (Mobile Only) */}
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-high px-6 py-4 flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <Link to="/community" className="text-tertiary flex flex-col items-center gap-1">
            <Library className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Explore</span>
          </Link>
          <Link to="/" className="text-on-surface-variant flex flex-col items-center gap-1">
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Workbench</span>
          </Link>
          <button className="bg-secondary-container text-on-secondary-container h-12 w-12 rounded-2xl flex items-center justify-center -mt-8 shadow-lg active:scale-95 transition-transform">
            <Plus className="w-6 h-6" />
          </button>
          <Link to="/community" className="text-on-surface-variant flex flex-col items-center gap-1">
            <LayoutGrid className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Gallery</span>
          </Link>
          <Link to="/settings" className="text-on-surface-variant flex flex-col items-center gap-1">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Edit2, 
  Bell, 
  Heart, 
  Mail, 
  RefreshCw,
  Trash2,
  Check,
  Save
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Settings() {
  const [profile, setProfile] = useState({
    name: "The Tactile Architect",
    location: "Copenhagen, Denmark",
    bio: "Digital master-builder focused on high-fidelity procedural brick generation and architectural modular systems."
  });

  const [notifications, setNotifications] = useState({
    likes: true,
    digest: true,
    updates: true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto px-8 py-12 space-y-16">
        {/* Account Profile Section */}
        <section className="space-y-8" id="profile">
          <div className="flex items-baseline justify-between gap-4">
            <div className="flex items-baseline gap-4 flex-1">
              <h2 className="font-headline text-2xl font-bold text-white">Account Profile</h2>
              <div className="h-1 flex-1 bg-surface-container-low rounded-full opacity-30"></div>
            </div>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="stud-button px-6 py-2 bg-tertiary text-on-tertiary rounded-lg font-bold text-sm flex items-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <AnimatePresence>
            {showSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-secondary-container text-on-secondary-container p-4 rounded-xl flex items-center gap-3 font-bold text-sm shadow-lg"
              >
                <Check className="w-5 h-5" />
                Profile updated successfully!
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-surface-container-low rounded-xl p-8 space-y-8 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-surface-container-highest shadow-xl">
                  <img 
                    alt="User Profile" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBq5TYEHUKFIMcQdkznJMYYEtIFLvWR5bRN2qZ4df1URRRTuSRH-Qvx_JKQN4NSFHYSmhKiPJl50mzrX5Sxp3AzOkyumNeKEqtB09aGf61ilu742CqG8h3J4HsiHffKynCESUaFR3QxfPwz5birpfV81WEztpO4jY5YnBZkL4Z7Kww-oPa6H2zVMyjY0LMXVp3UAZOkx3t4vIMJPoqiByilef9KOrMJaXMP3fI71DYZWFVy5Ix_oCRKpS66CLzTVbTdB1jUkSSu2IE"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <button className="absolute -bottom-2 -right-2 bg-tertiary text-on-tertiary p-2 rounded-lg shadow-lg hover:scale-110 transition-transform">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">Display Name</label>
                  <input 
                    className="w-full bg-surface-container-lowest border-none rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-tertiary transition-all" 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">Location</label>
                  <input 
                    className="w-full bg-surface-container-lowest border-none rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-tertiary transition-all" 
                    placeholder="Copenhagen, Denmark" 
                    type="text" 
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">Bio</label>
                  <textarea 
                    className="w-full bg-surface-container-lowest border-none rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-tertiary transition-all resize-none" 
                    rows={3} 
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3D Preferences Section */}
        <section className="space-y-8" id="3d-preferences">
          <div className="flex items-baseline gap-4">
            <h2 className="font-headline text-2xl font-bold text-white">3D Preferences</h2>
            <div className="h-1 flex-1 bg-surface-container-low rounded-full opacity-30"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface-container-low rounded-xl p-6 flex items-center justify-between shadow-lg">
              <div className="space-y-1">
                <h4 className="font-headline font-semibold text-on-surface">Default to Wireframe Mode</h4>
                <p className="text-xs text-on-surface-variant">Optimize viewport for complex builds</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input className="sr-only peer" type="checkbox" />
                <div className="w-14 h-7 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-tertiary after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all"></div>
              </label>
            </div>
            <div className="bg-surface-container-low rounded-xl p-6 flex flex-col justify-between shadow-lg">
              <div className="space-y-1 mb-4">
                <h4 className="font-headline font-semibold text-on-surface">Default Export Format</h4>
                <p className="text-xs text-on-surface-variant">Standardized CAD output format</p>
              </div>
              <select className="w-full bg-surface-container-lowest border-none rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-tertiary">
                <option>OBJ (3D Model)</option>
                <option defaultValue="ldr">LDR (LDraw Standard)</option>
                <option>PDF (Building Instructions)</option>
              </select>
            </div>
            <div className="bg-surface-container-low rounded-xl p-8 md:col-span-2 shadow-xl border-l-4 border-secondary-container">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h4 className="font-headline font-semibold text-on-surface">Preferred Render Quality</h4>
                  <p className="text-xs text-on-surface-variant">Balancing real-time performance and visual fidelity</p>
                </div>
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-md text-xs font-bold uppercase tracking-tighter">Ultra Quality</span>
              </div>
              <div className="relative pt-2">
                <input className="w-full h-2 rounded-lg appearance-none cursor-pointer" max="4" min="1" type="range" defaultValue="4" />
                <div className="flex justify-between mt-4 text-[10px] font-bold uppercase text-on-surface-variant tracking-widest px-1">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                  <span>Ultra</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="space-y-8" id="notifications">
          <div className="flex items-baseline gap-4">
            <h2 className="font-headline text-2xl font-bold text-white">Notifications</h2>
            <div className="h-1 flex-1 bg-surface-container-low rounded-full opacity-30"></div>
          </div>
          <div className="space-y-4">
            <div 
              onClick={() => setNotifications({...notifications, likes: !notifications.likes})}
              className="bg-surface-container-low rounded-xl p-5 flex items-center gap-6 hover:bg-surface-container shadow-sm transition-colors group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-tertiary">
                <Heart className={cn("w-6 h-6", notifications.likes && "fill-current")} />
              </div>
              <div className="flex-1">
                <h4 className="font-headline font-semibold text-on-surface">New Likes on Blueprints</h4>
                <p className="text-xs text-on-surface-variant">Get notified when creators applaud your work</p>
              </div>
              <div className={cn(
                "w-12 h-6 rounded-full transition-all relative",
                notifications.likes ? "bg-tertiary" : "bg-surface-container-highest"
              )}>
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                  notifications.likes ? "right-1" : "left-1"
                )} />
              </div>
            </div>
            <div 
              onClick={() => setNotifications({...notifications, digest: !notifications.digest})}
              className="bg-surface-container-low rounded-xl p-5 flex items-center gap-6 hover:bg-surface-container shadow-sm transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-secondary">
                <Mail className={cn("w-6 h-6", notifications.digest && "fill-current")} />
              </div>
              <div className="flex-1">
                <h4 className="font-headline font-semibold text-on-surface">Weekly Build Digest</h4>
                <p className="text-xs text-on-surface-variant">A curated summary of top community creations</p>
              </div>
              <div className={cn(
                "w-12 h-6 rounded-full transition-all relative",
                notifications.digest ? "bg-tertiary" : "bg-surface-container-highest"
              )}>
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                  notifications.digest ? "right-1" : "left-1"
                )} />
              </div>
            </div>
            <div 
              onClick={() => setNotifications({...notifications, updates: !notifications.updates})}
              className="bg-surface-container-low rounded-xl p-5 flex items-center gap-6 hover:bg-surface-container shadow-sm transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
                <RefreshCw className={cn("w-6 h-6", notifications.updates && "fill-current")} />
              </div>
              <div className="flex-1">
                <h4 className="font-headline font-semibold text-on-surface">System Updates</h4>
                <p className="text-xs text-on-surface-variant">Important alerts regarding platform tools and brick releases</p>
              </div>
              <div className={cn(
                "w-12 h-6 rounded-full transition-all relative",
                notifications.updates ? "bg-tertiary" : "bg-surface-container-highest"
              )}>
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                  notifications.updates ? "right-1" : "left-1"
                )} />
              </div>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="space-y-8 pb-12" id="danger-zone">
          <div className="flex items-baseline gap-4">
            <h2 className="font-headline text-2xl font-bold text-primary">Danger Zone</h2>
            <div className="h-1 flex-1 bg-primary-container rounded-full opacity-10"></div>
          </div>
          <div className="bg-surface-container-lowest border border-primary-container/20 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h4 className="font-headline font-semibold text-white">Delete Account</h4>
              <p className="text-xs text-on-surface-variant max-w-md">Permanently remove your profile and all associated 3D models from the foundry database. This action is irreversible.</p>
            </div>
            <button className="whitespace-nowrap px-8 py-3 rounded-lg border-2 border-primary text-primary font-headline font-bold hover:bg-primary hover:text-on-primary transition-all active:scale-95">
              <Trash2 className="w-5 h-5 inline mr-2" />
              Delete My Account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

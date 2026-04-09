import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-on-surface">
      <header className="flex items-center justify-between px-6 py-4 bg-[#1a2333] shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-50">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-tertiary">Lego Studio</div>
          <h1 className="text-2xl font-black tracking-tight text-secondary font-headline">Workbench</h1>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">3D Build System</div>
          <div className="text-sm text-on-surface">Voxel Lego Creator</div>
        </div>
      </header>

      <main className="flex-1 min-w-0 overflow-hidden">{children}</main>
    </div>
  );
}

"use client";
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Radar, Activity, ShieldCheck, Zap } from 'lucide-react';

// Force Client Only
const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { ssr: false });

export default function App() {
  return (
    <main className="fixed inset-0 bg-[#020202] text-slate-300 flex flex-col lg:flex-row overflow-hidden font-sans uppercase">
      
      {/* HUD PANEL: Top on Mobile, Left on Desktop */}
      <aside className="w-full lg:w-96 bg-black/80 border-b lg:border-r border-cyan-500/20 z-30 p-6 lg:p-8 flex flex-col backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-4 mb-8">
          <Radar className="text-cyan-500 animate-spin-slow w-8 h-8" />
          <div>
            <h1 className="text-2xl font-black text-white italic tracking-tighter">OMNIS_V20</h1>
            <p className="text-[9px] text-cyan-600 font-mono tracking-[0.3em] font-bold">GLOBAL_OSINT_NETWORK</p>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="p-5 rounded-2xl bg-red-600/5 border border-red-500/20 flex items-center gap-4">
            <Activity className="text-red-500 w-6 h-6 animate-pulse" />
            <div>
              <p className="text-xs font-black text-white">LIFETIME_SEISMIC</p>
              <p className="text-[9px] text-slate-500 font-mono">STREAMING: USGS_GLOBAL</p>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-cyan-600/5 border border-cyan-500/20 flex items-center gap-4">
            <ShieldCheck className="text-cyan-500 w-6 h-6" />
            <div>
              <p className="text-xs font-black text-white">SATELLITE_LINK</p>
              <p className="text-[9px] text-slate-500 font-mono">ENCRYPTED_SIGNAL</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-xl font-mono text-[10px] space-y-2">
           <div className="flex justify-between items-center opacity-70 border-b border-cyan-500/20 pb-2">
              <span className="text-cyan-400 font-black italic">CORE_STATUS</span>
              <Zap size={12} className="text-cyan-400" />
           </div>
           <p className="flex justify-between"><span>LINK:</span> <span className="text-green-500">SECURE</span></p>
           <p className="flex justify-between"><span>NODE:</span> <span>JAKARTA_01</span></p>
        </div>
      </aside>

      {/* 3D VIEWPORT */}
      <section className="flex-1 relative bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]">
        <div className="w-full h-full cursor-crosshair">
          <Canvas dpr={[1, 2]}>
            <Suspense fallback={null}>
              <GlobeEngine />
            </Suspense>
          </Canvas>
        </div>

        {/* MARQUEE FOOTER */}
        <div className="absolute bottom-0 w-full h-12 bg-black/90 border-t border-cyan-500/30 flex items-center overflow-hidden font-mono text-[10px] italic z-40">
          <div className="bg-cyan-800 h-full px-8 flex items-center font-black text-white shrink-0 z-50 skew-x-[-15deg] -translate-x-4 shadow-[15px_0_30px_rgba(0,0,0,1)]">
            LIVE_FEED
          </div>
          <div className="flex-1 whitespace-nowrap animate-marquee flex gap-16 items-center text-cyan-200/50 uppercase tracking-[0.2em]">
             <span>● [INTEL] DATA GEMPA DUNIA UPDATE TIAP 5 DETIK ● [SYSTEM] OMNIS_V20 OPERATIONAL ● [DATA] MENDETEKSI PERGERAKAN TEKTONIK ● [STATUS] SATELIT AKTIF</span>
          </div>
        </div>
      </section>
    </main>
  );
}

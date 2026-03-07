"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Radar, Activity, Cpu, ShieldAlert, Target } from 'lucide-react';

const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { 
  ssr: false, 
  loading: () => <div className="h-full flex items-center justify-center bg-black text-cyan-500 font-mono animate-pulse uppercase tracking-[1em]">Establishing_Uplink...</div>
});

export default function Page() {
  return (
    <main className="fixed inset-0 bg-black text-slate-400 flex flex-col lg:flex-row overflow-hidden uppercase font-sans tracking-tighter">
      {/* SIDEBAR / HEADER */}
      <aside className="w-full lg:w-96 bg-[#050505] border-b lg:border-r border-white/10 z-30 p-6 lg:p-10 flex flex-col shadow-2xl">
        <div className="flex items-center gap-4 mb-10">
          <Radar className="text-cyan-500 animate-spin-slow w-8 h-8" />
          <div>
            <h1 className="text-2xl font-black text-white italic leading-none">OMNIS_V20</h1>
            <p className="text-[9px] text-cyan-600 font-mono tracking-[0.3em] font-bold mt-1">TACTICAL_OSINT</p>
          </div>
        </div>

        <div className="space-y-4 flex-1 overflow-y-auto">
          <div className="p-6 rounded-[2rem] bg-red-600/5 border border-red-500/20 flex items-center gap-6">
            <Activity className="text-red-500 w-8 h-8 animate-pulse" />
            <div><p className="text-[12px] font-black text-white">SEISMIC_LIVE</p><p className="text-[9px] text-slate-600 font-mono">STREAMING: USGS_GLOBAL</p></div>
          </div>
          <div className="p-6 rounded-[2rem] bg-cyan-600/5 border border-cyan-500/20 flex items-center gap-6">
            <Target className="text-cyan-500 w-8 h-8" />
            <div><p className="text-[12px] font-black text-white">COORD_LOCK</p><p className="text-[9px] text-slate-600 font-mono">ENCRYPTED_SIGNAL</p></div>
          </div>
        </div>

        <div className="mt-6 p-5 bg-cyan-950/20 border border-cyan-500/30 rounded-2xl font-mono text-[9px] space-y-2">
           <p className="flex justify-between"><span>CPU_LOAD:</span> <span className="text-green-500">14%</span></p>
           <p className="flex justify-between"><span>LINK:</span> <span className="text-cyan-500">AES_256_ACTIVE</span></p>
           <p className="text-slate-600 animate-pulse mt-4 italic">Recieveing_Satellite_Data...</p>
        </div>
      </aside>

      {/* VIEWPORT */}
      <section className="flex-1 relative bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]">
        <div className="absolute top-6 left-6 z-20 hidden lg:flex items-center gap-4 bg-black/50 p-4 rounded-2xl border border-white/10 backdrop-blur-xl">
           <ShieldAlert className="text-cyan-500" />
           <div className="text-[10px] font-black italic"><p className="text-white">NODE_JAKARTA_SERVER_01</p><p className="text-slate-500 font-mono">6.2088°S, 106.8456°E</p></div>
        </div>
        <div className="w-full h-full cursor-crosshair"><Canvas dpr={[1, 2]}><GlobeEngine /></Canvas></div>
        <div className="absolute bottom-0 w-full h-12 bg-black/95 border-t border-white/10 flex items-center overflow-hidden font-mono text-[10px] italic z-40">
          <div className="bg-cyan-700 h-full px-10 flex items-center font-black text-white shrink-0 tracking-widest z-50 skew-x-[-15deg] -translate-x-4 shadow-2xl">INTEL_FEED</div>
          <div className="animate-marquee whitespace-nowrap flex gap-20 items-center text-cyan-200/50 font-bold uppercase">
             <span>● [DATA] REALTIME SEISMIC TRACKING ACTIVE ● [INTEL] DATA GEMPA BUMI DUNIA UPDATE TIAP 5 DETIK ● [SYSTEM] OMNIS_V20 OPERATIONAL</span>
          </div>
        </div>
      </section>
    </main>
  );
}

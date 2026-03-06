"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Radar, Activity, Cpu, ShieldAlert, Target, Zap } from 'lucide-react';

const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { 
  ssr: false, 
  loading: () => <div className="h-full flex items-center justify-center bg-black text-cyan-500 font-mono tracking-[1em] animate-pulse">UPLOADING_OSINT_KERNEL...</div>
});

export default function App() {
  return (
    <main className="fixed inset-0 bg-[#000] text-slate-400 font-sans flex flex-col lg:flex-row overflow-hidden tracking-tighter uppercase">
      
      {/* SIDE CONTROL - DESKTOP */}
      <aside className="w-full lg:w-[400px] bg-black/40 border-b lg:border-r border-cyan-500/20 z-30 p-8 backdrop-blur-3xl flex flex-col shadow-[inset_-20px_0_50px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-5 mb-16 border-b border-cyan-500/10 pb-8">
          <div className="relative">
             <div className="absolute inset-0 bg-cyan-500 blur-md opacity-30 animate-pulse" />
             <Radar className="text-cyan-400 w-10 h-10 animate-spin-slow relative" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white italic tracking-[-0.1em] leading-none">BGENG_OMNIS</h1>
            <p className="text-[10px] text-cyan-500 font-mono tracking-[0.4em] font-bold mt-1">GLOBAL_INTEL_SYSTEM</p>
          </div>
        </div>

        <div className="space-y-6 flex-1">
          <div className="p-6 rounded-[2.5rem] bg-gradient-to-r from-red-600/10 to-transparent border-l-4 border-red-500 flex items-center gap-6">
            <Activity className="text-red-500 w-10 h-10" />
            <div>
              <p className="text-[14px] font-black text-white tracking-widest">LIVE_SEISMIC</p>
              <p className="text-[9px] text-slate-500 font-mono italic">STREAMING: USGS_GLOBAL_SAT</p>
            </div>
          </div>

          <div className="p-6 rounded-[2.5rem] bg-cyan-600/5 border-l-4 border-cyan-500 flex items-center gap-6 opacity-80">
            <Target className="text-cyan-500 w-10 h-10" />
            <div>
              <p className="text-[14px] font-black text-white tracking-widest">COORD_TRACKER</p>
              <p className="text-[9px] text-slate-500 font-mono">LOCKING_ON_GEOLOGY_LEVEL</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-3xl font-mono text-[10px] space-y-3 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-2 opacity-20"><Zap size={40} /></div>
           <p className="text-cyan-400 font-black italic underline underline-offset-4 decoration-cyan-800">SYSTEM_DIAGNOSTICS</p>
           <p className="flex justify-between"><span>CPU_USE:</span> <span className="text-green-500">LOW</span></p>
           <p className="flex justify-between"><span>SAT_LINK:</span> <span className="text-cyan-500">ENCRYPTED</span></p>
           <div className="h-[2px] bg-cyan-500/20 w-full animate-pulse" />
           <p className="text-slate-600 italic">Receiving_Coordinates_Sector_7...</p>
        </div>
      </aside>

      {/* RENDER VIEWPORT */}
      <section className="flex-1 relative">
        {/* HUD OVERLAY LAYER */}
        <div className="absolute inset-0 pointer-events-none border-[20px] border-black/20 z-20">
           <div className="absolute top-10 right-10 flex flex-col items-end gap-2">
              <div className="px-6 py-2 bg-black/80 border border-white/10 rounded-full text-[10px] text-white flex items-center gap-3">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                 SERVER_CENTRAL_ONLINE
              </div>
           </div>
        </div>

        <div className="w-full h-full">
          <Canvas dpr={[1, 2]} shadows>
            <GlobeEngine />
          </Canvas>
        </div>

        {/* MILITARY MARQUEE FOOTER */}
        <div className="absolute bottom-0 w-full h-14 bg-black/95 border-t-2 border-cyan-500/30 flex items-center overflow-hidden font-mono text-[11px] italic z-40">
          <div className="bg-red-700 h-full px-12 flex items-center font-black text-white shrink-0 tracking-[0.2em] shadow-[20px_0_40px_rgba(0,0,0,1)] z-50 skew-x-[-15deg] -translate-x-4">DANGER_ZONE</div>
          <div className="flex-1 whitespace-nowrap animate-marquee flex gap-32 items-center text-cyan-200/80 font-bold uppercase tracking-[0.3em]">
             <span>● [DATA] DETECTING SEISMIC ANOMALIES IN SECTOR_04 ● [ALERT] MAGNITUDE 5.2 RECORDED IN PACIFIC BASIN ● [SYSTEM] ALL NODES OPERATIONAL ● [PROTOCOL] AES_256_ACTIVE</span>
          </div>
        </div>
      </section>
    </main>
  );
}

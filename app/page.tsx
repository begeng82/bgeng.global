"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Radar, Activity, Target, ShieldCheck, Zap } from 'lucide-react';

// Force Client-side Only
const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { 
  ssr: false, 
  loading: () => (
    <div className="h-full flex items-center justify-center bg-black">
      <div className="text-cyan-500 font-mono animate-pulse tracking-[0.5em] text-sm uppercase">
        Initializing_Strategic_Uplink...
      </div>
    </div>
  )
});

export default function OSINTPage() {
  return (
    <main className="fixed inset-0 bg-[#020202] text-slate-300 flex flex-col lg:flex-row overflow-hidden uppercase font-sans selection:bg-cyan-500/30">
      
      {/* HUD: SIDEBAR (Desktop) / TOPBAR (Mobile) */}
      <aside className="w-full lg:w-96 bg-black border-b lg:border-r border-white/10 z-30 p-6 lg:p-10 flex flex-col shadow-[20px_0_100px_rgba(0,0,0,0.9)] backdrop-blur-md">
        <div className="flex items-center gap-5 mb-12 border-b border-white/5 pb-8">
          <div className="relative">
             <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20 animate-pulse" />
             <Radar className="text-cyan-400 w-10 h-10 animate-spin-slow relative" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white italic tracking-tighter leading-none">OMNIS_V20</h1>
            <p className="text-[10px] text-cyan-600 font-mono tracking-[0.4em] font-bold mt-1">GLOBAL_INTEL_OPS</p>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar">
          <div className="p-6 rounded-[2.5rem] bg-red-600/5 border border-red-500/20 group hover:bg-red-600/10 transition-all cursor-pointer">
            <div className="flex items-center gap-5">
              <Activity className="text-red-500 w-8 h-8 animate-pulse" />
              <div>
                <p className="text-[14px] font-black text-white tracking-widest">SEISMIC_FEED</p>
                <p className="text-[9px] text-slate-500 font-mono">LIFETIME_USGS_SYNC</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-[2.5rem] bg-cyan-600/5 border border-cyan-500/20 group hover:bg-cyan-600/10 transition-all cursor-pointer">
            <div className="flex items-center gap-5">
              <ShieldCheck className="text-cyan-500 w-8 h-8" />
              <div>
                <p className="text-[14px] font-black text-white tracking-widest">SATELLITE_LINK</p>
                <p className="text-[9px] text-slate-500 font-mono italic tracking-widest">ENCRYPTED_SIGNAL</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-cyan-950/20 border border-cyan-500/30 rounded-3xl font-mono text-[10px] space-y-3 relative overflow-hidden">
           <div className="flex justify-between items-center opacity-70 border-b border-cyan-500/20 pb-2">
              <span className="text-cyan-400 font-black italic">CORE_DIAGNOSTICS</span>
              <Zap size={12} className="text-cyan-400" />
           </div>
           <p className="flex justify-between"><span>CPU_USE:</span> <span className="text-green-500">12%</span></p>
           <p className="flex justify-between"><span>NET_LINK:</span> <span className="text-cyan-500">SECURE</span></p>
           <div className="h-[2px] bg-cyan-500/20 w-full mt-2" />
           <p className="text-slate-600 italic uppercase">Receiving_Coordinates_Stream...</p>
        </div>
      </aside>

      {/* VIEWPORT AREA */}
      <section className="flex-1 relative bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]">
        {/* OVERLAY HUD */}
        <div className="absolute top-8 left-8 right-8 z-20 flex justify-between pointer-events-none">
           <div className="bg-black/60 border border-white/10 px-6 py-3 rounded-full backdrop-blur-xl flex items-center gap-4 pointer-events-auto shadow-2xl">
              <Target size={16} className="text-cyan-500 animate-ping" />
              <div className="text-[10px] font-black tracking-widest">
                 <span className="text-white">NODE_JAKARTA_01</span>
                 <span className="text-slate-500 ml-4 font-mono font-normal">S: 6.2088° | E: 106.8456°</span>
              </div>
           </div>
        </div>

        {/* 3D CANVAS */}
        <div className="w-full h-full cursor-crosshair">
          <Canvas dpr={[1, 2]} shadows>
            <GlobeEngine />
          </Canvas>
        </div>

        {/* MARQUEE FOOTER */}
        <div className="absolute bottom-0 w-full h-14 bg-black/95 border-t border-white/10 flex items-center overflow-hidden font-mono text-[11px] italic z-40 backdrop-blur-md">
          <div className="bg-cyan-800 h-full px-12 flex items-center font-black text-white shrink-0 tracking-[0.3em] z-50 skew-x-[-15deg] -translate-x-4 shadow-[15px_0_30px_rgba(0,0,0,1)]">
            LIVE_INTEL
          </div>
          <div className="flex-1 whitespace-nowrap animate-marquee flex gap-20 items-center text-cyan-200/40 font-bold uppercase tracking-[0.2em]">
             <span>● [DATA] DETECTING SEISMIC ANOMALIES IN SECTOR_04 ● [ALERT] MAGNITUDE 5.2 RECORDED IN PACIFIC BASIN ● [SYSTEM] ALL NODES OPERATIONAL PADA PROTOKOL AES_256 ● [INTEL] DATA GEMPA BUMI DUNIA TERUPDATE DALAM 5 DETIK TERAKHIR</span>
          </div>
        </div>
      </section>
    </main>
  );
}

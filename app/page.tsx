"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Activity, Radar, Cpu, ShieldCheck } from 'lucide-react';

const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { 
  ssr: false, 
  loading: () => <div className="h-full flex items-center justify-center bg-black text-cyan-500 font-mono animate-pulse">BOOTING_CORE_V18...</div>
});

export default function Page() {
  return (
    <main className="fixed inset-0 bg-black text-white flex flex-col lg:flex-row overflow-hidden uppercase font-sans">
      {/* SIDEBAR DESKTOP / HEADER MOBILE */}
      <aside className="w-full lg:w-80 bg-[#050505] border-b lg:border-r border-white/10 p-6 lg:p-8 z-30 flex flex-row lg:flex-col justify-between lg:justify-start">
        <div className="flex items-center gap-3">
          <Radar className="text-cyan-500 animate-spin-slow w-6 h-6 lg:w-8 lg:h-8" />
          <h1 className="text-lg lg:text-2xl font-black italic tracking-tighter">BGENG_OMNIS</h1>
        </div>

        <div className="hidden lg:block mt-12 space-y-4">
          <div className="p-5 rounded-2xl bg-cyan-600/10 border border-cyan-500/50">
            <Activity className="text-red-500 mb-2 w-5 h-5" />
            <p className="text-[11px] font-bold">LIFETIME_SEISMIC</p>
            <p className="text-[9px] text-slate-500 font-mono italic">STREAMING: USGS_GLOBAL</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 opacity-50">
            <ShieldCheck className="text-green-500 mb-2 w-5 h-5" />
            <p className="text-[11px] font-bold">THREAT_SCAN</p>
            <p className="text-[9px] text-slate-500 font-mono">SECTOR: STABLE</p>
          </div>
        </div>

        <div className="mt-auto hidden lg:flex flex-col gap-2 p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-xl font-mono text-[9px]">
           <p className="flex justify-between"><span>LINK:</span> <span className="text-green-500">ENCRYPTED</span></p>
           <p className="flex justify-between"><span>NODE:</span> <span className="text-cyan-400">JAKARTA_01</span></p>
        </div>
      </aside>

      {/* VIEWPORT */}
      <section className="flex-1 relative bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]">
        <div className="w-full h-full cursor-crosshair">
          <Canvas dpr={[1, 2]}>
            <GlobeEngine />
          </Canvas>
        </div>
        
        {/* FOOTER MARQUEE */}
        <div className="absolute bottom-0 w-full h-10 bg-black/90 border-t border-white/10 flex items-center px-4 lg:px-8 overflow-hidden font-mono text-[9px] text-cyan-500 italic z-40">
          <div className="bg-cyan-700 text-white px-4 py-1 mr-4 lg:mr-8 not-italic font-black text-[10px] hidden sm:block">LIVE_FEED</div>
          <div className="animate-marquee whitespace-nowrap flex gap-10 lg:gap-20">
            <span>● [INTEL] DATA GEMPA BUMI DUNIA UPDATE TIAP 5 DETIK</span>
            <span>● [SYSTEM] OMNIS_V18 OPERATIONAL PADA SEMUA SEKTOR</span>
            <span>● [STATUS] GLOBAL SENSOR NETWORK ONLINE</span>
          </div>
        </div>
      </section>
    </main>
  );
}

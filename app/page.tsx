"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Radar, Activity, Zap, Terminal, ShieldAlert, Cpu } from 'lucide-react';

const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { 
  ssr: false, 
  loading: () => <div className="h-full flex items-center justify-center bg-black text-cyan-500 font-mono tracking-widest animate-pulse">INIT_OMNIS_V18...</div>
});

export default function App() {
  const [activeTab, setActiveTab] = useState('global');

  return (
    <main className="fixed inset-0 bg-[#000] text-slate-300 font-sans flex flex-col lg:flex-row overflow-hidden uppercase">
      
      {/* SIDEBAR (Desktop) / TOPBAR (Mobile) */}
      <aside className="w-full lg:w-96 bg-[#050505] border-b lg:border-b-0 lg:border-r border-white/10 z-30 flex flex-col p-6 lg:p-8 backdrop-blur-3xl">
        <div className="flex items-center gap-4 mb-8 lg:mb-12">
          <div className="p-3 bg-cyan-600 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <Radar className="text-white w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-black text-white italic tracking-tighter leading-none">OMNIS_V18</h1>
            <span className="text-[9px] text-cyan-500 font-mono tracking-[0.3em] font-bold italic">STRATEGIC_COMMAND</span>
          </div>
        </div>

        {/* TABS MENU */}
        <nav className="space-y-3 flex-1 overflow-y-auto">
          <button className="w-full p-6 rounded-3xl bg-blue-600/10 border border-blue-500/50 flex items-center gap-5 text-left group transition-all hover:scale-[1.02]">
            <Activity className="text-red-500 animate-pulse" />
            <div>
              <p className="text-[12px] font-black text-white">SEISMIC_LIVE</p>
              <p className="text-[9px] text-slate-500 font-mono italic uppercase">Lifetime USGS Stream</p>
            </div>
          </button>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 opacity-40 flex items-center gap-5 cursor-not-allowed">
            <ShieldAlert className="text-amber-500" />
            <div>
              <p className="text-[12px] font-black text-slate-400 italic">THREAT_LEVEL</p>
              <p className="text-[9px] text-slate-600 font-mono uppercase">Analyzing Sector...</p>
            </div>
          </div>
        </nav>

        {/* SYSTEM STATS */}
        <div className="mt-8 lg:mt-auto p-5 bg-cyan-950/20 border border-cyan-500/30 rounded-2xl font-mono text-[9px] space-y-2">
           <p className="text-cyan-400 font-black italic border-b border-white/5 pb-2 flex items-center gap-2 underline underline-offset-4">
               <Cpu size={14}/> SYSTEM_DIAGNOSTICS
           </p>
           <p className="flex justify-between"><span>LINK_STABILITY:</span> <span className="text-green-500">98.4%</span></p>
           <p className="flex justify-between"><span>ENCRYPTION:</span> <span className="text-cyan-500">AES_256</span></p>
           <p className="text-slate-600 animate-pulse mt-4 uppercase italic">Recieveing_Packet_Data...</p>
        </div>
      </aside>

      {/* VIEWPORT AREA */}
      <section className="flex-1 relative bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#000_100%)]">
        {/* HUD LAYERS */}
        <div className="absolute top-6 left-6 right-6 z-20 flex justify-between pointer-events-none">
           <div className="bg-black/60 border border-white/10 p-3 lg:p-4 rounded-xl backdrop-blur-xl flex items-center gap-4 pointer-events-auto">
              <Zap size={16} className="text-cyan-500" />
              <div className="text-[10px] font-black">
                 <p className="text-white">SAT_LINK_01</p>
                 <p className="text-slate-500 font-mono text-[8px]">POS: 21.4°N, 39.1°E</p>
              </div>
           </div>
        </div>

        {/* CANVAS */}
        <div className="w-full h-full cursor-crosshair">
          <Canvas dpr={[1, 2]}>
            <GlobeEngine />
          </Canvas>
        </div>

        {/* BOTTOM GLOBAL MARQUEE */}
        <div className="absolute bottom-0 w-full h-12 bg-black/95 border-t border-white/10 flex items-center overflow-hidden font-mono text-[10px] italic backdrop-blur-2xl z-40">
          <div className="bg-cyan-700 h-full px-6 lg:px-12 flex items-center font-black text-white shrink-0 tracking-widest z-50 skew-x-[-20deg] -translate-x-3 shadow-[15px_0_30px_rgba(0,0,0,1)]">INTEL_FEED</div>
          <div className="flex-1 whitespace-nowrap animate-marquee flex gap-20 lg:gap-40 items-center text-cyan-100 font-bold tracking-widest uppercase">
             <span>● [NEWS] DATA GEMPA BUMI DUNIA TERUPDATE DALAM 5 DETIK TERAKHIR</span>
             <span>● [SYSTEM] NODE JAKARTA AKTIF PADA PROTOKOL GLOBAL MONITORING</span>
             <span>● [DATA] TERDETEKSI PERGERAKAN LEMPENG TEKTONIK DI SEKTOR PASIFIK BARAT</span>
             <span>● [ALERT] UPAYA PERETASAN TERDETEKSI - PROTOKOL ENKRIPSI DIPERKUAT</span>
          </div>
        </div>
      </section>
    </main>
  );
}

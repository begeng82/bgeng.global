"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Activity, Shield, Zap, Globe, Search, Menu, X, Cpu, Radio } from 'lucide-react';

const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { 
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center bg-black text-cyan-500 font-mono text-xs tracking-[1em] animate-pulse">INIT_SATELLITE_LINK...</div>
});

export default function NeuralTerminal() {
  const [layers, setLayers] = useState<string[]>(['geologi']);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) setSidebarOpen(false);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  return (
    <main className="fixed inset-0 bg-[#000] text-slate-300 overflow-hidden flex font-sans select-none uppercase">
      
      {/* MOBILE HEADER */}
      {isMobile && (
        <div className="absolute top-0 w-full h-16 bg-black/80 border-b border-white/10 z-[60] backdrop-blur-md flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Cpu className="text-cyan-500 w-5 h-5" />
            <h1 className="font-black italic text-white tracking-tighter">BGENG_V11</h1>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-white/5 rounded-lg border border-white/10">
            {sidebarOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      )}

      {/* SIDEBAR (Responsive) */}
      <aside className={`
        ${isMobile ? 'fixed inset-y-0 left-0 w-full z-50 bg-black/98' : 'relative w-80 bg-[#050505] border-r border-white/10 z-20'}
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-500 flex flex-col backdrop-blur-3xl
      `}>
        <div className="p-10 border-b border-white/5">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-cyan-600 rounded shadow-[0_0_20px_rgba(6,182,212,0.5)]">
               <Globe className="text-white w-5 h-5 animate-spin-slow" />
             </div>
             <h1 className="text-xl font-black text-white italic tracking-tighter">NEURAL_EYE</h1>
          </div>
          <p className="text-[9px] font-mono text-cyan-500 tracking-[0.3em]">Global_Omniscience_V11</p>
        </div>

        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          <LayerBtn active={layers.includes('geologi')} onClick={() => setLayers(['geologi'])} icon={<Activity size={18}/>} label="SEISMIC_LIVE" sub="USGS_STREAM" color="text-orange-500" />
          <LayerBtn active={layers.includes('infra')} onClick={() => setLayers(['infra'])} icon={<Zap size={18}/>} label="GRID_NETWORK" sub="ENERGY_FLOW" color="text-cyan-400" />
          <LayerBtn active={layers.includes('konflik')} onClick={() => setLayers(['konflik'])} icon={<Shield size={18}/>} label="DEFENSE_INTEL" sub="OSINT_ALERT" color="text-red-500" />

          <div className="mt-10 p-6 bg-cyan-900/10 border border-cyan-500/20 rounded-2xl font-mono text-[9px] space-y-3 shadow-inner">
             <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-cyan-400 font-bold">● SYSTEM_UPTIME</span>
                <span className="text-white">99.9%</span>
             </div>
             <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-cyan-400 font-bold">● DATA_LOAD</span>
                <span className="text-green-500">OPTIMAL</span>
             </div>
             <p className="text-[8px] text-slate-500 animate-pulse tracking-widest">RECEIVING_SATELLITE_DATA_STREAM...</p>
          </div>
        </div>
      </aside>

      {/* VIEWPORT */}
      <section className="flex-1 relative">
        {!isMobile && (
          <div className="absolute top-10 left-10 z-10 flex gap-4 pointer-events-none">
            <div className="bg-black/60 border border-white/10 p-4 rounded-2xl backdrop-blur-xl flex items-center gap-4 pointer-events-auto">
              <Search size={18} className="text-slate-500" />
              <input className="bg-transparent border-none outline-none text-xs w-64 text-white font-mono placeholder-slate-700" placeholder="SCAN_GLOBAL_COORDS..." />
            </div>
          </div>
        )}

        <div className="w-full h-full cursor-crosshair">
          <Canvas dpr={[1, 2]} shadows>
            <GlobeEngine activeLayers={layers} />
          </Canvas>
        </div>

        {/* BOTTOM HUD */}
        <div className={`absolute bottom-0 w-full ${isMobile ? 'h-20' : 'h-14'} bg-black/95 border-t border-white/10 flex items-center overflow-hidden z-30`}>
          <div className="bg-cyan-700 h-full px-10 flex items-center font-black italic text-white shrink-0 skew-x-[-20deg] -translate-x-5 shadow-[10px_0_30px_rgba(0,0,0,0.8)] z-40">
            {isMobile ? 'LIVE' : 'REALTIME_INTEL'}
          </div>
          <div className="flex-1 whitespace-nowrap animate-marquee flex gap-20 items-center text-[11px] font-mono font-bold tracking-[0.2em] text-cyan-100/60">
             <span>● [SIGNAL] SATELIT LEO-42 DETEKSI ANOMALI DI SEKTOR PASIFIK TIMUR</span>
             <span>● [GEO] GEMPA BUMI M4.8 TERDETEKSI DI WILAYAH RING OF FIRE</span>
             <span>● [NET] ENKRIPSI DATA SELESAI PADA NODE JAKARTA_SERVER_08</span>
             <span>● [WEATHER] BADAI TEKANAN TINGGI TERBENTUK DI SEKTOR SAMUDRA HINDIA</span>
          </div>
        </div>
      </section>
    </main>
  );
}

function LayerBtn({ active, onClick, icon, label, sub, color }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-6 rounded-3xl transition-all duration-300 border-2
        ${active ? `bg-white/5 border-white/10 shadow-2xl scale-[1.02]` : 'border-transparent opacity-30 hover:opacity-100 hover:bg-white/5'}
      `}>
      <div className="flex items-center gap-5">
        <span className={active ? color : 'text-slate-600'}>{icon}</span>
        <div className="text-left">
          <p className={`text-[12px] font-black tracking-tighter ${active ? 'text-white' : 'text-slate-500'}`}>{label}</p>
          <p className="text-[9px] text-slate-600 font-mono italic tracking-tight">{sub}</p>
        </div>
      </div>
      {active && <Radio className="text-cyan-500 animate-pulse" size={14} />}
    </button>
  );
}

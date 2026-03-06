"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Activity, ShieldAlert, Zap, Globe, Search, Radar, Terminal, Cpu } from 'lucide-react';

const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { 
  ssr: false, 
  loading: () => <div className="h-full flex items-center justify-center bg-black text-cyan-500 font-mono text-sm tracking-[0.5em] animate-pulse">ESTABLISHING_ENCRYPTED_UPLINK...</div>
});

export default function GlobalDashboard() {
  const [layers, setLayers] = useState(['geologi']);

  return (
    <main className="fixed inset-0 bg-[#000] text-slate-300 font-sans overflow-hidden flex flex-col lg:flex-row uppercase">
      
      {/* SIDEBAR OPERASI */}
      <aside className="w-full lg:w-96 bg-[#050505]/95 border-b lg:border-b-0 lg:border-r border-white/10 z-20 flex flex-col backdrop-blur-3xl">
        <div className="p-8 border-b border-white/5 bg-gradient-to-br from-blue-900/20 to-transparent">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-cyan-600 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <Radar className="text-white w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white italic tracking-tighter leading-none">OMNIS_CORE</h1>
              <span className="text-[9px] text-cyan-500 font-mono tracking-[0.3em] font-bold">V16_STABLE_LINK</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <LayerButton active={layers.includes('geologi')} onClick={() => setLayers(['geologi'])} icon={<Activity size={20}/>} label="DETEKSI SEISMIK" sub="LIVE USGS STREAM" />
          <LayerButton active={layers.includes('conflict')} onClick={() => setLayers(['conflict'])} icon={<ShieldAlert size={20}/>} label="ANCAMAN GLOBAL" sub="OSINT THREAT MAP" />
          
          <div className="mt-10 p-6 bg-cyan-950/20 border border-cyan-500/30 rounded-3xl font-mono text-[10px] space-y-3">
            <p className="text-cyan-400 font-black italic border-b border-white/10 pb-2 flex items-center gap-2 underline underline-offset-4">
               <Cpu size={14}/> SYSTEM_DIAGNOSTICS
            </p>
            <p className="text-slate-500">● NODE: Jakarta_01_Active</p>
            <p className="text-slate-500">● SYNC: <span className="text-green-500 font-bold">STABLE</span></p>
            <p className="text-slate-400 animate-pulse uppercase">● Streaming_Live_Coordinates...</p>
          </div>
        </div>
      </aside>

      {/* VIEWPORT UTAMA */}
      <section className="flex-1 relative bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#000_100%)]">
        <div className="absolute top-8 left-8 right-8 z-10 flex flex-col md:flex-row justify-between pointer-events-none gap-6">
          <div className="bg-black/60 border border-white/10 p-4 rounded-2xl flex items-center gap-4 pointer-events-auto backdrop-blur-2xl">
            <Search size={18} className="text-slate-500" />
            <input className="bg-transparent border-none outline-none text-xs w-full md:w-80 text-white font-mono placeholder-slate-800 uppercase" placeholder="SCAN_SATELLITE_COORDINATES..." />
          </div>
          <div className="bg-red-600/10 border-2 border-red-600/50 px-8 py-4 rounded-2xl text-[11px] font-black text-white hidden md:flex items-center gap-4 backdrop-blur-2xl pointer-events-auto shadow-[0_0_30px_rgba(220,38,38,0.2)]">
             <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
             CRITICAL_ANOMALY_DETECTED: SECTOR_7G
          </div>
        </div>

        <div className="w-full h-full cursor-crosshair">
          <Canvas dpr={[1, 2]}>
            <GlobeEngine activeLayers={layers} />
          </Canvas>
        </div>

        {/* BOTTOM GLOBAL TICKER */}
        <div className="absolute bottom-0 w-full h-14 bg-black/95 border-t border-white/10 flex items-center overflow-hidden font-mono text-[11px] italic backdrop-blur-2xl z-30">
          <div className="bg-cyan-700 h-full px-12 flex items-center font-black text-white shrink-0 tracking-widest z-40 skew-x-[-20deg] -translate-x-5 shadow-[20px_0_40px_rgba(0,0,0,1)]">INTEL_FEED</div>
          <div className="flex-1 whitespace-nowrap animate-marquee flex gap-40 items-center text-cyan-100 font-bold tracking-widest uppercase">
             <span>● [NEWS] DATA GEMPA BUMI DUNIA TERUPDATE DALAM 10 DETIK TERAKHIR</span>
             <span>● [INTEL] ANOMALI TEKANAN UDARA TERDETEKSI DI SEKTOR PASIFIK UTARA</span>
             <span>● [SYSTEM] SEMUA SATELIT BEROPERASI PADA KAPASITAS MAKSIMAL</span>
             <span>● [ALERT] UPAYA PERETASAN TERDETEKSI PADA NODE_CENTER_BGENG - PROTOKOL ENKRIPSI DIPERKUAT</span>
          </div>
        </div>
      </section>
    </main>
  );
}

function LayerButton({ active, onClick, icon, label, sub }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-5 p-6 rounded-3xl transition-all duration-500 border-2 text-left
        ${active ? `bg-cyan-600/10 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.1)] scale-[1.02]` : 'border-transparent opacity-30 hover:opacity-100 hover:bg-white/5'}
      `}>
      <span className={active ? 'text-cyan-400' : 'text-slate-600'}>{icon}</span>
      <div>
        <p className={`text-[13px] font-black tracking-tighter ${active ? 'text-white' : 'text-slate-500'}`}>{label}</p>
        <p className="text-[10px] text-slate-600 font-mono italic tracking-tight uppercase">{sub}</p>
      </div>
    </button>
  );
}

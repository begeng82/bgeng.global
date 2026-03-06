"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Activity, Radar, Shield, Search } from 'lucide-react';

const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { 
  ssr: false, 
  loading: () => <div className="h-full flex items-center justify-center bg-black text-cyan-500 font-mono animate-pulse">SYNCING_GLOBAL_SENSORS...</div>
});

export default function OSINTPage() {
  const [layers, setLayers] = useState(['geologi']);

  return (
    <main className="fixed inset-0 bg-black text-slate-300 font-sans overflow-hidden flex flex-col md:flex-row uppercase">
      {/* SIDEBAR TACTICAL */}
      <aside className="w-full md:w-80 bg-[#050505] border-r border-white/10 z-20 flex flex-col p-8">
        <div className="flex items-center gap-3 mb-10">
          <Radar className="text-cyan-500 animate-pulse" />
          <h1 className="text-xl font-black italic text-white tracking-tighter">BGENG_OMNIS</h1>
        </div>

        <button 
          onClick={() => setLayers(['geologi'])}
          className={`w-full p-6 rounded-3xl transition-all border-2 text-left mb-6 ${layers.includes('geologi') ? 'bg-cyan-600/10 border-cyan-500/50' : 'border-transparent opacity-30 hover:opacity-100 hover:bg-white/5'}`}
        >
          <Activity className="text-red-500 mb-2" />
          <p className="text-[12px] font-black text-white">SEISMIC_LIVE</p>
          <p className="text-[9px] text-slate-500 font-mono italic">REALTIME_USGS_FEED</p>
        </button>

        <div className="mt-auto p-5 bg-cyan-950/20 border border-cyan-500/30 rounded-2xl font-mono text-[9px] space-y-2 tracking-tighter">
           <p className="text-cyan-400 font-black italic pb-2 border-b border-white/5">SYSTEM_DIAGNOSTICS</p>
           <p className="flex justify-between"><span>NODE:</span> <span className="text-green-500">ONLINE</span></p>
           <p className="flex justify-between"><span>LINK:</span> <span className="text-cyan-500">SECURE</span></p>
           <p className="text-slate-600 animate-pulse mt-4 uppercase">Streaming_Live_Coordinates...</p>
        </div>
      </aside>

      {/* VIEWPORT UTAMA */}
      <section className="flex-1 relative bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]">
        <div className="absolute top-10 left-10 z-10 flex gap-4">
          <div className="bg-black/60 border border-white/10 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-2xl">
            <Search size={16} className="text-slate-500" />
            <input className="bg-transparent border-none outline-none text-[10px] w-64 text-white font-mono placeholder-slate-800" placeholder="SCAN_GLOBAL_COORDINATES..." />
          </div>
        </div>

        <div className="w-full h-full cursor-crosshair">
          <Canvas dpr={[1, 2]}>
            <GlobeEngine activeLayers={layers} />
          </Canvas>
        </div>

        {/* FOOTER MARQUEE */}
        <div className="absolute bottom-0 w-full h-10 bg-black/95 border-t border-white/10 flex items-center overflow-hidden font-mono text-[9px] italic text-cyan-500">
          <div className="bg-cyan-700 h-full px-10 flex items-center font-black text-white shrink-0 z-10 tracking-[0.2em]">LIVE_INTEL</div>
          <div className="flex-1 whitespace-nowrap animate-marquee flex gap-32">
             <span>● [DATA] REALTIME SEISMIC TRACKING ACTIVE</span>
             <span>● [SYSTEM] SATELLITE NODE JAKARTA_SERVER_01 STABLE</span>
             <span>● [INTEL] DATA GEMPA BUMI DUNIA TERUPDATE DALAM 10 DETIK TERAKHIR</span>
          </div>
        </div>
      </section>
    </main>
  );
}

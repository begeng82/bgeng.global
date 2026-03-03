"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Activity, ShieldAlert, Zap, Globe, Search, Radar, Info } from 'lucide-react';

const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { 
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center bg-black text-blue-500 font-mono animate-pulse uppercase tracking-[0.5em]">Establishing_Satellite_Link...</div>
});

export default function OSINTTerminal() {
  const [layers, setLayers] = useState<string[]>(['geologi', 'konflik']);

  return (
    <main className="fixed inset-0 bg-[#020202] text-slate-300 font-sans overflow-hidden flex uppercase">
      {/* SIDEBAR INTELIJEN */}
      <aside className="w-80 bg-[#050505] border-r border-white/10 z-20 flex flex-col backdrop-blur-3xl">
        <div className="p-8 border-b border-white/5 bg-gradient-to-b from-blue-900/20 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <Radar className="text-blue-500 animate-pulse" />
            <h1 className="text-xl font-black text-white italic tracking-tighter">BGENG_OMNIS</h1>
          </div>
          <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">Global_Intelligence_V10</p>
        </div>

        <div className="flex-1 p-4 space-y-3 custom-scrollbar">
          <p className="text-[10px] font-bold text-slate-600 mb-6 px-2 tracking-[0.3em] border-l-2 border-blue-600 ml-2">DATA_CATEGORIES</p>
          
          <button onClick={() => setLayers(['geologi'])} className={`w-full p-5 rounded-2xl transition-all border-2 text-left ${layers.includes('geologi') ? 'bg-blue-600/10 border-blue-600/50' : 'border-transparent opacity-40 hover:opacity-100'}`}>
            <div className="flex items-center gap-4">
              <Activity className="text-orange-500" />
              <div>
                <p className="text-[11px] font-black text-white">BENCANA_ALAM</p>
                <p className="text-[9px] text-slate-500 font-mono italic">USGS_REALTIME_FEED</p>
              </div>
            </div>
          </button>

          <button onClick={() => setLayers(['konflik'])} className={`w-full p-5 rounded-2xl transition-all border-2 text-left ${layers.includes('konflik') ? 'bg-red-600/10 border-red-600/50' : 'border-transparent opacity-40 hover:opacity-100'}`}>
            <div className="flex items-center gap-4">
              <ShieldAlert className="text-red-500" />
              <div>
                <p className="text-[11px] font-black text-white">ZONA_KONFLIK</p>
                <p className="text-[9px] text-slate-500 font-mono italic">OSINT_WORLD_ALERT</p>
              </div>
            </div>
          </button>

          <div className="mt-10 p-5 bg-white/5 rounded-2xl border border-white/5 font-mono text-[9px] space-y-2 leading-relaxed shadow-inner">
             <p className="text-blue-400 font-black border-b border-white/10 pb-2 mb-2 italic">SYSTEM_DIAGNOSTIC</p>
             <p className="text-slate-500">● NODE_SYNC: <span className="text-green-500">ACTIVE</span></p>
             <p className="text-slate-500">● SECURITY: <span className="text-white">ENCRYPTED</span></p>
             <p className="text-slate-500 animate-pulse">● STREAMING_DATA_GLOBAL...</p>
          </div>
        </div>
      </aside>

      {/* VIEWPORT GLOBE */}
      <section className="flex-1 relative bg-[radial-gradient(circle_at_center,_#0b0b0b_0%,_#000_100%)]">
        <div className="absolute top-8 left-8 z-10 bg-black/60 border border-white/10 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-xl pointer-events-auto">
          <Search size={16} className="text-slate-500" />
          <input className="bg-transparent border-none outline-none text-[10px] w-64 text-white font-mono placeholder-slate-700 uppercase" placeholder="SCAN_COORDINATES..." />
        </div>

        <div className="w-full h-full cursor-crosshair">
          <Canvas dpr={[1, 2]}>
            <GlobeEngine activeLayers={layers} />
          </Canvas>
        </div>

        {/* FOOTER TICKER NEWS */}
        <div className="absolute bottom-0 w-full h-12 bg-black/95 border-t border-white/10 flex items-center font-mono text-[10px] overflow-hidden italic backdrop-blur-md">
          <div className="bg-blue-700 h-full px-8 flex items-center font-black text-white shrink-0 tracking-widest skew-x-[-15deg] -translate-x-2">LIVE_FEED</div>
          <div className="flex-1 whitespace-nowrap animate-marquee flex gap-32 items-center text-slate-400 font-bold tracking-tighter px-10">
             <span>● [INTEL] DATA GEMPA BUMI TERBARU DITERIMA DARI SATELIT USGS</span>
             <span>● [ECON] FLUKTUASI PASAR GLOBAL TERDETEKSI DI SEKTOR ENERGI</span>
             <span>● [WEATHER] ANOMALI TEKANAN UDARA RENDAH DI SEKTOR PASIFIK</span>
          </div>
        </div>
      </section>
    </main>
  );
}
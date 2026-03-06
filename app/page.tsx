"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Activity, Radar, Search, Cpu } from 'lucide-react';

const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { 
  ssr: false, 
  loading: () => <div className="h-full flex items-center justify-center bg-black text-cyan-500 font-mono animate-pulse uppercase">Connecting_Satellite...</div>
});

export default function Page() {
  const [layers] = useState(['geologi']);

  return (
    <main className="fixed inset-0 bg-black text-white flex flex-col md:flex-row uppercase font-sans overflow-hidden">
      <aside className="w-full md:w-80 bg-[#050505] border-r border-white/10 z-20 p-8 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <Radar className="text-cyan-500 animate-spin-slow" />
          <h1 className="text-xl font-black italic tracking-tighter">BGENG_OMNIS</h1>
        </div>

        <div className="p-6 rounded-3xl bg-cyan-600/10 border border-cyan-500/50 mb-6">
          <Activity className="text-red-500 mb-2" />
          <p className="text-[12px] font-bold">SEISMIC_LIVE</p>
          <p className="text-[9px] text-slate-500 font-mono">USGS_SATELLITE_FEED</p>
        </div>

        <div className="mt-auto p-4 bg-white/5 rounded-xl border border-white/10 font-mono text-[9px] space-y-2">
           <p className="flex justify-between text-cyan-400"><span>SYSTEM:</span> <span>ONLINE</span></p>
           <p className="flex justify-between text-slate-500"><span>NODE:</span> <span>JAKARTA_01</span></p>
        </div>
      </aside>

      <section className="flex-1 relative">
        <div className="w-full h-full">
          <Canvas dpr={[1, 2]}>
            <GlobeEngine activeLayers={layers} />
          </Canvas>
        </div>
        
        <div className="absolute bottom-0 w-full h-10 bg-black/90 border-t border-white/10 flex items-center px-6 overflow-hidden text-[10px] font-mono text-cyan-500/80 italic">
          <span className="bg-cyan-700 text-white px-4 py-1 mr-6 not-italic font-black">INTEL</span>
          <div className="animate-pulse whitespace-nowrap">
            ● [DATA] SCANNING COORDINATES... ● [ALERT] NEW SEISMIC ACTIVITY DETECTED ● [SAT] LINK STABLE
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Activity, Radar } from 'lucide-react';

// Kita panggil GlobeEngine tanpa SSR biar nggak error di browser
const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { 
  ssr: false, 
  loading: () => (
    <div className="h-full flex items-center justify-center bg-black text-cyan-500 font-mono animate-pulse">
      ESTABLISHING_UPLINK...
    </div>
  )
});

export default function Page() {
  // Logic state ditaruh di sini, bukan dikirim sebagai props ke fungsi Page
  const [layers, setLayers] = useState(['geologi']);

  return (
    <main className="fixed inset-0 bg-black text-slate-300 font-sans overflow-hidden flex flex-col md:flex-row uppercase">
      {/* SIDEBAR */}
      <aside className="w-full md:w-80 bg-[#050505] border-r border-white/10 z-20 flex flex-col p-8">
        <div className="flex items-center gap-3 mb-10">
          <Radar className="text-cyan-500 animate-pulse" />
          <h1 className="text-xl font-black italic text-white tracking-tighter">BGENG_OMNIS</h1>
        </div>

        <button 
          onClick={() => setLayers(['geologi'])}
          className="w-full p-6 rounded-3xl bg-cyan-600/10 border border-cyan-500/50 flex items-center gap-4 text-left"
        >
          <Activity className="text-red-500" />
          <div>
            <p className="text-[12px] font-black text-white">SEISMIC_LIVE</p>
            <p className="text-[9px] text-slate-500 font-mono">REALTIME_USGS_FEED</p>
          </div>
        </button>

        <div className="mt-auto p-4 bg-white/5 rounded-xl border border-white/10 font-mono text-[9px] space-y-2">
           <p className="flex justify-between"><span>NODE:</span> <span className="text-green-500">ONLINE</span></p>
           <p className="flex justify-between"><span>SYNC:</span> <span className="text-cyan-500">ACTIVE</span></p>
        </div>
      </aside>

      {/* CANVAS AREA */}
      <section className="flex-1 relative bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]">
        <div className="w-full h-full cursor-crosshair">
          <Canvas dpr={[1, 2]}>
            {/* Sekarang kita kirim props ke komponen GlobeEngine, bukan ke Page */}
            <GlobeEngine activeLayers={layers} />
          </Canvas>
        </div>

        <div className="absolute bottom-0 w-full h-10 bg-black/90 border-t border-white/10 flex items-center overflow-hidden font-mono text-[9px] italic text-cyan-500/80">
          <div className="bg-cyan-700 h-full px-8 flex items-center font-black text-white shrink-0 z-10">LIVE_FEED</div>
          <div className="flex-1 whitespace-nowrap animate-marquee flex gap-20">
             <span>● [INTEL] GLOBAL SEISMIC MONITORING ACTIVE</span>
             <span>● [DATA] RECEIVING LIVE STREAM FROM USGS GLOBAL STATIONS</span>
          </div>
        </div>
      </section>
    </main>
  );
}

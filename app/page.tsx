"use client";
import React, { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Radar, Crosshair, AlertTriangle, ShieldAlert, Terminal, Activity } from 'lucide-react';

const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { ssr: false });

export default function App() {
  const [logStr, setLogStr] = useState("ESTABLISHING SECURE UPLINK...");

  // Efek ngetik di terminal
  useEffect(() => {
    const logs = [
      "DECRYPTING SATELLITE FEED...",
      "BYPASSING FIREWALL PROXY...",
      "SYNCING USGS SEISMIC DATA...",
      "DETECTING CYBER THREATS...",
      "OMNIS_V20 FULLY OPERATIONAL."
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLogStr(logs[i]);
      i = (i + 1) % logs.length;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="fixed inset-0 bg-omnis-bg text-omnis-cyan flex flex-col lg:flex-row overflow-hidden font-mono uppercase text-xs selection:bg-omnis-red selection:text-white">
      
      {/* 🟢 LEFT PANEL: SYSTEM DIAGNOSTICS */}
      <aside className="w-full lg:w-[350px] bg-black/40 border-b lg:border-r border-omnis-cyan/30 z-30 flex flex-col backdrop-blur-md relative shrink-0">
        <div className="p-6 border-b border-omnis-cyan/20 bg-omnis-cyan/5">
          <div className="flex items-center gap-4 mb-2">
            <Radar className="text-omnis-red animate-spin-slow w-10 h-10" />
            <div>
              <h1 className="text-3xl font-black text-white tracking-widest drop-shadow-[0_0_10px_rgba(0,242,255,0.8)]">OMNIS</h1>
              <p className="text-[10px] tracking-[0.4em] text-omnis-red font-bold">V_20 // GOD_TIER</p>
            </div>
          </div>
        </div>

        <div className="p-6 flex-1 space-y-6 overflow-y-auto">
          {/* Status Box */}
          <div className="border border-omnis-cyan/30 p-4 bg-omnis-cyan/5 relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-omnis-cyan"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-omnis-cyan"></div>
            <h2 className="text-white font-bold mb-3 flex items-center gap-2"><Activity size={14}/> SYSTEM_CORE</h2>
            <div className="space-y-2 text-[10px]">
              <div className="flex justify-between"><span>DEFCON_LEVEL:</span> <span className="text-omnis-amber animate-pulse">3 ELEVATED</span></div>
              <div className="flex justify-between"><span>SAT_LINK:</span> <span className="text-green-500">CONNECTED (AES-256)</span></div>
              <div className="flex justify-between"><span>GLOBAL_NODES:</span> <span className="text-white">8,492 ACTIVE</span></div>
            </div>
          </div>

          {/* Layer Controls (Simulated UI) */}
          <div className="space-y-2">
             <h2 className="text-white font-bold mb-3 flex items-center gap-2 border-b border-omnis-cyan/20 pb-2"><ShieldAlert size={14}/> TACTICAL_LAYERS</h2>
             {['SEISMIC_DATA', 'MILITARY_BASES', 'CYBER_ATTACKS', 'NAVAL_ROUTES'].map((layer, i) => (
               <div key={i} className="flex items-center gap-3 p-2 hover:bg-omnis-cyan/10 cursor-pointer border border-transparent hover:border-omnis-cyan/30 transition-all">
                 <div className={`w-3 h-3 border ${i % 2 === 0 ? 'bg-omnis-cyan border-omnis-cyan' : 'border-omnis-cyan'}`}></div>
                 <span>{layer}</span>
               </div>
             ))}
          </div>
        </div>
      </aside>

      {/* 🔴 CENTER VIEWPORT (3D GLOBE) */}
      <section className="flex-1 relative bg-[radial-gradient(circle_at_center,_#0a192f_0%,_#000_100%)] flex flex-col">
        
        {/* Top Bar Terminal Log */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-black/80 border border-omnis-cyan/30 px-6 py-2 flex items-center gap-3 shadow-[0_0_20px_rgba(0,242,255,0.2)]">
           <Terminal size={14} className="text-omnis-amber" />
           <span className="text-omnis-amber tracking-widest">{logStr}</span>
        </div>

        {/* Center Crosshair Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center opacity-30">
           <Crosshair size={300} strokeWidth={0.5} className="text-omnis-cyan animate-pulse-fast" />
           <div className="absolute w-[400px] h-[400px] border border-omnis-cyan/20 rounded-full"></div>
        </div>

        {/* The 3D Engine */}
        <div className="flex-1 w-full h-full cursor-crosshair">
          <Canvas dpr={[1, 2]}>
            <Suspense fallback={null}>
              <GlobeEngine />
            </Suspense>
          </Canvas>
        </div>

        {/* Bottom Marquee */}
        <div className="h-10 bg-omnis-red/20 border-t border-omnis-red/50 flex items-center overflow-hidden z-40 backdrop-blur-md">
          <div className="bg-omnis-red h-full px-6 flex items-center text-white font-black tracking-widest shrink-0 z-50 flex gap-2">
            <AlertTriangle size={16} className="animate-pulse"/> ALERT_FEED
          </div>
          <div className="flex-1 whitespace-nowrap animate-marquee flex gap-12 items-center text-omnis-red font-bold tracking-[0.2em] shadow-inner">
             <span>⚠️ [WARNING] MULTIPLE CYBER INCURSIONS DETECTED IN SECTOR 7 ⚠️ [USGS] MAGNITUDE 6.1 RECORDED ⚠️ [INTEL] TROOP MOVEMENTS CONFIRMED ⚠️ [SYSTEM] MAINTAINING ORBITAL LOCK</span>
          </div>
        </div>
      </section>

      {/* 🟢 RIGHT PANEL (Desktop Only) */}
      <aside className="hidden lg:flex w-[300px] bg-black/40 border-l border-omnis-cyan/30 z-30 flex-col backdrop-blur-md p-6">
        <h2 className="text-white font-bold mb-4 border-b border-omnis-cyan/20 pb-2 text-right">LIVE_TELEMETRY</h2>
        <div className="space-y-4">
           {[1,2,3,4,5].map((i) => (
             <div key={i} className="text-[9px] border-l-2 border-omnis-cyan pl-2 py-1">
               <p className="text-white">ID: {Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
               <p className="text-omnis-cyan/60">LAT: {(Math.random() * 90).toFixed(4)} | LON: {(Math.random() * 180).toFixed(4)}</p>
               <p className="text-omnis-amber">STATUS: TRACKING</p>
             </div>
           ))}
        </div>
      </aside>

    </main>
  );
}

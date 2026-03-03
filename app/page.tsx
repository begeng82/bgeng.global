"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { ShieldAlert, Crosshair, Radar, CloudLightning, Database, AlertTriangle } from 'lucide-react';

const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { ssr: false });

export default function OSINTDashboard() {
  // State untuk nyimpen layer apa aja yang lagi aktif
  const [layers, setLayers] = useState<string[]>(['conflict', 'base']);

  const toggleLayer = (type: string) => {
    setLayers(prev => 
      prev.includes(type) ? prev.filter(l => l !== type) : [...prev, type]
    );
  };

  return (
    <main className="fixed inset-0 bg-[#00050a] text-cyan-500 font-mono overflow-hidden uppercase flex">
      {/* SIDEBAR - LAYER CONTROLS */}
      <div className="w-16 md:w-64 bg-black/80 border-r border-cyan-500/30 flex flex-col z-20 backdrop-blur-md">
        <div className="p-4 border-b border-cyan-500/30">
          <h1 className="hidden md:block text-xl font-black italic text-white drop-shadow-[0_0_8px_#00f2ff]">BGENG.OSINT</h1>
          <Radar className="w-6 h-6 md:hidden text-cyan-400 mx-auto" />
        </div>
        
        <div className="p-2 md:p-4 flex-1 overflow-y-auto flex flex-col gap-2">
          <p className="hidden md:block text-[10px] text-cyan-700 font-bold tracking-widest mb-2">ACTIVE_LAYERS</p>
          
          <LayerButton id="conflict" icon={<ShieldAlert className="w-4 h-4" />} label="Armed Conflicts" color="border-red-500 text-red-500" active={layers.includes('conflict')} onClick={() => toggleLayer('conflict')} />
          <LayerButton id="base" icon={<Database className="w-4 h-4" />} label="Military Bases" color="border-cyan-500 text-cyan-400" active={layers.includes('base')} onClick={() => toggleLayer('base')} />
          <LayerButton id="hotspot" icon={<AlertTriangle className="w-4 h-4" />} label="Geo-Hotspots" color="border-yellow-500 text-yellow-500" active={layers.includes('hotspot')} onClick={() => toggleLayer('hotspot')} />
          <LayerButton id="weather" icon={<CloudLightning className="w-4 h-4" />} label="Severe Weather" color="border-white/50 text-gray-400" active={layers.includes('weather')} onClick={() => toggleLayer('weather')} />
        </div>
      </div>

      {/* 3D GLOBE AREA */}
      <div className="flex-1 relative cursor-crosshair">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5.5] }}>
            {/* Kirim data layer yang aktif ke Engine 3D */}
            <GlobeEngine activeLayers={layers} />
          </Canvas>
        </div>

        {/* OVERLAY UI KANAN - INFO PANEL */}
        <div className="absolute top-4 right-4 w-64 bg-black/70 border border-cyan-500/30 backdrop-blur-md p-4 z-10 hidden md:block">
          <div className="flex items-center gap-2 mb-4 border-b border-cyan-500/30 pb-2">
            <Crosshair className="w-4 h-4 animate-spin-slow" />
            <span className="text-xs font-bold text-white tracking-widest">SATELLITE_LINK</span>
          </div>
          <div className="space-y-3 text-[10px]">
            <div className="flex justify-between"><span>STATUS:</span><span className="text-green-400">NOMINAL</span></div>
            <div className="flex justify-between"><span>ORBIT:</span><span>LEO-892</span></div>
            <div className="flex justify-between"><span>LAYERS:</span><span>{layers.length} ACTIVE</span></div>
            <div className="mt-4 pt-4 border-t border-cyan-500/20 text-cyan-700 italic">
              "Drag to rotate. Scroll to zoom. Click markers for intel."
            </div>
          </div>
        </div>

        {/* TIMELINE BOTTOM (Visual saja) */}
        <div className="absolute bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[600px] bg-black/80 border border-cyan-500/40 p-3 z-10 flex items-center gap-4">
           <span className="text-[10px] font-bold">TIMELINE</span>
           <div className="flex-1 h-1 bg-cyan-950 relative rounded-full">
             <div className="absolute left-0 top-0 h-full w-full bg-cyan-500/20 rounded-full" />
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_#00f2ff]" />
           </div>
           <span className="text-[10px] text-white">LIVE_FEED</span>
        </div>
      </div>
    </main>
  );
}

// Komponen Tombol Layer
function LayerButton({ icon, label, color, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 p-3 border-l-2 transition-all w-full text-left
        ${active ? `bg-white/5 ${color}` : 'border-transparent text-gray-600 hover:bg-white/5 hover:text-gray-300'}
      `}
    >
      {icon}
      <span className="text-[10px] font-bold tracking-wider hidden md:block">{label}</span>
    </button>
  );
}

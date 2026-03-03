"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Shield, TrendingUp, Radio, Map, Menu, Search, Activity } from 'lucide-react';

const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { ssr: false });

export default function OSINTApp() {
  const [layers, setLayers] = useState<string[]>(['conflict', 'economic', 'base']);

  const toggleLayer = (id: string) => {
    setLayers(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  };

  return (
    <main className="fixed inset-0 bg-[#020617] text-slate-300 font-mono flex">
      {/* Sidebar Kiri */}
      <div className="w-64 bg-slate-950/80 border-r border-slate-800 p-6 z-20 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-10">
          <Activity className="text-blue-500 animate-pulse" />
          <h1 className="text-white font-black tracking-tighter text-xl">MONITOR.SYS</h1>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] text-slate-500 font-bold mb-4 tracking-[0.2em]">INTELLIGENCE_LAYERS</p>
          <NavBtn active={layers.includes('conflict')} onClick={() => toggleLayer('conflict')} icon={<Shield size={16}/>} label="War Zones" color="text-red-500" />
          <NavBtn active={layers.includes('economic')} onClick={() => toggleLayer('economic')} icon={<TrendingUp size={16}/>} label="Finance" color="text-green-500" />
          <NavBtn active={layers.includes('base')} onClick={() => toggleLayer('base')} icon={<Radio size={16}/>} label="Nodes" color="text-cyan-500" />
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 relative">
        <div className="absolute top-6 left-6 right-6 z-10 flex justify-between pointer-events-none">
          <div className="bg-slate-900/80 border border-slate-700 p-2 rounded-lg flex items-center gap-3 pointer-events-auto">
            <Search size={18} className="text-slate-500" />
            <input className="bg-transparent border-none outline-none text-sm w-48" placeholder="Search coordinates..." />
          </div>
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold pointer-events-auto cursor-pointer hover:bg-blue-500 transition-all">
            LIVE FEED: 100%
          </div>
        </div>

        <Canvas camera={{ position: [0, 0, 5] }}>
          <GlobeEngine activeLayers={layers} />
        </Canvas>

        {/* Info Panel Bawah */}
        <div className="absolute bottom-6 left-6 right-6 flex gap-4 pointer-events-none">
          <div className="bg-black/60 border border-slate-800 p-4 rounded-xl backdrop-blur-md pointer-events-auto flex-1">
            <p className="text-[9px] text-blue-500 mb-1">DATA_STREAM_082</p>
            <p className="text-xs text-slate-400">Targeting real-time global events via OSINT neural link.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

function NavBtn({ active, onClick, icon, label, color }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all border ${active ? 'bg-slate-900 border-slate-700 shadow-lg' : 'border-transparent opacity-50'}`}>
      <span className={active ? color : 'text-slate-600'}>{icon}</span>
      <span className={`text-xs font-bold ${active ? 'text-white' : 'text-slate-500'}`}>{label}</span>
    </button>
  );
}

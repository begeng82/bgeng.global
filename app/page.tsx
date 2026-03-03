"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { 
  Globe2, ShieldAlert, Crosshair, CloudLightning, 
  TrendingDown, Anchor, Radio, Shield, AlertTriangle, 
  Search, Menu, Info, Activity
} from 'lucide-react';

const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { ssr: false });

export default function GlobalIntelligenceApp() {
  const [layers, setLayers] = useState<string[]>(['conflict', 'economic', 'weather', 'natural']);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleLayer = (type: string) => {
    setLayers(prev => prev.includes(type) ? prev.filter(l => l !== type) : [...prev, type]);
  };

  return (
    <main className="fixed inset-0 bg-[#0a0e17] text-slate-300 flex overflow-hidden font-sans">
      
      {/* SIDEBAR - LAYER CONTROLS */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 bg-[#0f172a]/95 backdrop-blur-xl border-r border-slate-800 flex flex-col z-20 shrink-0 overflow-hidden`}>
        
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Globe2 className="w-6 h-6 text-blue-500 mr-3" />
          <h1 className="text-lg font-bold text-white tracking-wide">WorldMonitor <span className="text-blue-500">3D</span></h1>
        </div>
        
        {/* Layer Toggles */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          <p className="text-xs font-semibold text-slate-500 mb-4 px-2 uppercase tracking-widest">Global Data Layers</p>
          
          <LayerToggle id="conflict" icon={<ShieldAlert size={16}/>} label="Conflicts & Wars" color="#ef4444" active={layers.includes('conflict')} onClick={() => toggleLayer('conflict')} />
          <LayerToggle id="military" icon={<Crosshair size={16}/>} label="Military Movements" color="#f97316" active={layers.includes('military')} onClick={() => toggleLayer('military')} />
          <LayerToggle id="hotspot" icon={<AlertTriangle size={16}/>} label="Geopolitical Hotspots" color="#eab308" active={layers.includes('hotspot')} onClick={() => toggleLayer('hotspot')} />
          <LayerToggle id="sanctions" icon={<Shield size={16}/>} label="Sanctions & Embargos" color="#64748b" active={layers.includes('sanctions')} onClick={() => toggleLayer('sanctions')} />
          
          <div className="my-4 border-t border-slate-800" />
          
          <LayerToggle id="economic" icon={<TrendingDown size={16}/>} label="Economic Crisis" color="#10b981" active={layers.includes('economic')} onClick={() => toggleLayer('economic')} />
          <LayerToggle id="outage" icon={<Radio size={16}/>} label="Comm. Outages" color="#f43f5e" active={layers.includes('outage')} onClick={() => toggleLayer('outage')} />
          <LayerToggle id="natural" icon={<Activity size={16}/>} label="Natural Disasters" color="#8b5cf6" active={layers.includes('natural')} onClick={() => toggleLayer('natural')} />
          <LayerToggle id="weather" icon={<CloudLightning size={16}/>} label="Severe Weather" color="#0ea5e9" active={layers.includes('weather')} onClick={() => toggleLayer('weather')} />
        </div>
      </div>

      {/* MAIN GLOBE AREA */}
      <div className="flex-1 relative flex flex-col">
        
        {/* Top Navbar */}
        <div className="h-16 absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 pointer-events-none">
          <div className="flex items-center gap-4 pointer-events-auto">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-[#0f172a]/80 border border-slate-700 rounded-lg hover:bg-slate-800 text-white transition-colors">
              <Menu size={20} />
            </button>
            <div className="bg-[#0f172a]/80 backdrop-blur-md border border-slate-700 rounded-lg flex items-center px-3 py-2 w-64">
               <Search size={16} className="text-slate-400 mr-2" />
               <input type="text" placeholder="Search locations, events..." className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-slate-500" />
            </div>
          </div>

          <div className="flex items-center gap-4 pointer-events-auto">
             <div className="bg-[#0f172a]/80 backdrop-blur-md border border-slate-700 rounded-lg px-4 py-2 text-xs font-mono text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                LIVE FEED ACTIVE
             </div>
          </div>
        </div>

        {/* 3D CANVAS */}
        <div className="flex-1 bg-gradient-to-b from-[#0a0e17] to-[#04060a] cursor-move">
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <GlobeEngine activeLayers={layers} />
          </Canvas>
        </div>

        {/* RIGHT INFO PANEL (News Feed) */}
        <div className="absolute right-4 top-20 w-80 max-h-[calc(100vh-160px)] overflow-y-auto z-10 hidden lg:flex flex-col gap-3 pointer-events-none">
          <div className="pointer-events-auto bg-[#0f172a]/90 backdrop-blur-xl border border-slate-700 rounded-xl p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Latest Intelligence</h3>
              <Info size={14} className="text-slate-400" />
            </div>
            
            <NewsCard category="Conflict" color="text-red-500" time="10m ago" title="Eastern Europe artillery strikes intensify." />
            <NewsCard category="Economic" color="text-emerald-500" time="1h ago" title="Asian markets close lower amid tech selloff." />
            <NewsCard category="Weather" color="text-sky-500" time="3h ago" title="Category 3 Hurricane tracking towards Florida." />
            
            <button className="w-full mt-2 py-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">View All Reports →</button>
          </div>
        </div>

      </div>
    </main>
  );
}

function LayerToggle({ icon, label, color, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all border
        ${active ? 'bg-slate-800/50 border-slate-700' : 'bg-transparent border-transparent hover:bg-slate-800/30'}
      `}
    >
      <div className="flex items-center gap-3">
        <div style={{ color: active ? color : '#64748b' }}>{icon}</div>
        <span className={`text-sm ${active ? 'text-white font-medium' : 'text-slate-400'}`}>{label}</span>
      </div>
      {/* Switch Toggle Visual */}
      <div className={`w-8 h-4 rounded-full transition-colors relative ${active ? 'bg-blue-500' : 'bg-slate-700'}`}>
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${active ? 'left-4.5 right-0.5' : 'left-0.5'}`} />
      </div>
    </button>
  );
}

function NewsCard({ category, color, time, title }: any) {
  return (
    <div className="mb-3 border-l-2 border-slate-700 pl-3">
      <div className="flex justify-between items-center mb-1">
        <span className={`text-[10px] font-bold uppercase ${color}`}>{category}</span>
        <span className="text-[10px] text-slate-500">{time}</span>
      </div>
      <p className="text-xs text-slate-300 leading-snug">{title}</p>
    </div>
  );
}

"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Shield, TrendingUp, Zap, Radio, Globe, Search, AlertTriangle, Database, Cloud } from 'lucide-react';

const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { ssr: false });

export default function WorldMonitorFull() {
  const [layers, setLayers] = useState<string[]>(['konflik', 'militer', 'ekonomi', 'infrastruktur', 'politik']);

  const toggleLayer = (id: string) => {
    setLayers(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  };

  return (
    <main className="fixed inset-0 bg-[#020408] text-slate-300 font-sans flex overflow-hidden">
      
      {/* SIDEBAR NAVIGASI - KATEGORI DUNIA */}
      <aside className="w-80 bg-[#0a0c12]/95 border-r border-white/10 z-20 flex flex-col backdrop-blur-2xl shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-gradient-to-r from-blue-900/10 to-transparent">
          <div className="flex items-center gap-3 mb-1">
            <Globe className="text-blue-500 w-6 h-6 animate-spin-slow" />
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">MONITOR_DUNIA</h1>
          </div>
          <p className="text-[10px] text-slate-500 font-mono tracking-widest">SISTEM INTELIJEN GLOBAL V10.0</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-[9px] font-bold text-slate-600 mb-4 px-2 tracking-[0.3em] uppercase">Lapisan Informasi</p>
          
          <LayerItem active={layers.includes('konflik')} onClick={() => toggleLayer('konflik')} icon={<Shield size={16}/>} label="Konflik Bersenjata" color="text-red-500" />
          <LayerItem active={layers.includes('militer')} onClick={() => toggleLayer('militer')} icon={<Database size={16}/>} label="Pangkalan Militer" color="text-orange-500" />
          <LayerItem active={layers.includes('ekonomi')} onClick={() => toggleLayer('ekonomi')} icon={<TrendingUp size={16}/>} label="Krisis Ekonomi" color="text-emerald-500" />
          <LayerItem active={layers.includes('infrastruktur')} onClick={() => toggleLayer('infrastruktur')} icon={<Zap size={16}/>} label="Gangguan Jaringan" color="text-cyan-400" />
          <LayerItem active={layers.includes('politik')} onClick={() => toggleLayer('politik')} icon={<AlertTriangle size={16}/>} label="Isu Geopolitik" color="text-yellow-500" />
          <LayerItem active={layers.includes('cuaca')} onClick={() => toggleLayer('cuaca')} icon={<Cloud size={16}/>} label="Bencana Alam" color="text-white" />
          
          <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/5">
            <p className="text-[10px] font-bold text-blue-400 mb-2">STATUS LINK SATELIT</p>
            <div className="space-y-2 text-[9px] font-mono">
              <div className="flex justify-between"><span>SINKRONISASI:</span><span className="text-green-500">AKTIF</span></div>
              <div className="flex justify-between"><span>TIPE DATA:</span><span>REAL-TIME</span></div>
              <div className="flex justify-between"><span>ENKRIPSI:</span><span>AES-256</span></div>
            </div>
          </div>
        </div>
      </aside>

      {/* AREA UTAMA - BUMI 3D */}
      <section className="flex-1 relative">
        {/* Header Overlay */}
        <div className="absolute top-6 left-6 right-6 z-10 flex justify-between pointer-events-none">
          <div className="bg-black/60 border border-white/10 p-2 rounded-xl flex items-center gap-3 pointer-events-auto backdrop-blur-md shadow-2xl">
            <Search size={16} className="text-slate-500 ml-2" />
            <input className="bg-transparent border-none outline-none text-xs w-64 text-white font-mono uppercase" placeholder="CARI KOORDINAT / LOKASI..." />
          </div>
          
          <div className="flex gap-4 pointer-events-auto items-center">
             <div className="bg-red-600/20 border border-red-500/50 px-4 py-2 rounded-xl text-[10px] font-black text-red-500 flex items-center gap-2 backdrop-blur-md">
               <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
               PERINGATAN KONFLIK AKTIF
             </div>
          </div>
        </div>

        {/* Visual Bumi */}
        <div className="w-full h-full cursor-move bg-[radial-gradient(circle_at_center,_#111827_0%,_#000_100%)]">
          <Canvas>
            <GlobeEngine activeLayers={layers} />
          </Canvas>
        </div>

        {/* Panel Berita Bawah (Ticker) */}
        <div className="absolute bottom-0 w-full h-12 bg-black/90 border-t border-white/10 z-10 flex items-center font-mono text-[10px] overflow-hidden">
          <div className="bg-blue-600 h-full px-6 flex items-center font-black italic text-white shrink-0">DATA_LIVE</div>
          <div className="flex-1 px-10 whitespace-nowrap animate-marquee flex gap-20 items-center text-slate-400">
             <span>● [MILITER] ARMADA KE-7 AS SIAGA DI LAUT CHINA SELATAN</span>
             <span>● [EKONOMI] HARGA MINYAK MENCAPAI REKOR TERTINGGI TAHUN INI</span>
             <span>● [KONFLIK] GENCATAN SENJATA DI SEKTOR UTARA GAGAL</span>
             <span>● [INFRA] GANGGUAN SERAT OPTIK DI SAMUDRA ATLANTIK TERDETEKSI</span>
          </div>
        </div>
      </section>
    </main>
  );
}

function LayerItem({ active, onClick, icon, label, color }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all border-2
        ${active ? 'bg-white/5 border-white/10 text-white shadow-xl' : 'border-transparent text-slate-600 hover:bg-white/5 hover:text-slate-400'}
      `}
    >
      <div className="flex items-center gap-4">
        <span className={active ? color : 'text-slate-700'}>{icon}</span>
        <span className="text-[11px] font-bold tracking-tight">{label}</span>
      </div>
      <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' : 'bg-slate-800'}`} />
    </button>
  );
}

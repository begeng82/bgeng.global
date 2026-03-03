"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Shield, Zap, Activity, Globe, Search, Radio, ChevronRight, AlertCircle } from 'lucide-react';

const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { ssr: false });

export default function OSINTSystem() {
  const [layers, setLayers] = useState<string[]>(['geologi', 'intel', 'cyber']);

  const toggle = (id: string) => {
    setLayers(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  };

  return (
    <main className="fixed inset-0 bg-[#020308] text-slate-300 font-sans flex overflow-hidden">
      
      {/* SIDEBAR NAVIGASI */}
      <aside className="w-72 bg-[#05070a]/95 border-r border-white/10 z-20 flex flex-col backdrop-blur-3xl shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-gradient-to-r from-blue-900/20 to-transparent">
          <div className="flex items-center gap-3">
            <Radio className="text-red-600 animate-pulse w-5 h-5" />
            <h1 className="text-lg font-black tracking-tighter text-white italic">WORLD_SCAN_V12</h1>
          </div>
          <p className="text-[9px] text-slate-500 font-mono tracking-widest mt-1 uppercase">Terminal Intelijen Global</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-[10px] font-bold text-slate-600 mb-4 px-2 tracking-[0.2em] uppercase">Sektor Pemantauan</p>
          <LayerItem active={layers.includes('geologi')} onClick={() => toggle('geologi')} icon={<Activity size={16}/>} label="Bencana Alam (Live)" color="text-orange-500" />
          <LayerItem active={layers.includes('intel')} onClick={() => toggle('intel')} icon={<Shield size={16}/>} label="Konflik Geopolitik" color="text-red-500" />
          <LayerItem active={layers.includes('cyber')} onClick={() => toggle('cyber')} icon={<Zap size={16}/>} label="Status Siber Global" color="text-cyan-400" />
          
          <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10 shadow-inner">
            <p className="text-[10px] font-bold text-blue-400 mb-3 tracking-widest">LOG_SISTEM</p>
            <div className="space-y-2 text-[9px] font-mono leading-tight">
              <p className="text-slate-400">● Satelit LEO-9 tersambung.</p>
              <p className="text-slate-400">● Node Asia Tenggara stabil.</p>
              <p className="text-emerald-500">● 100% Data terenkripsi.</p>
            </div>
          </div>
        </div>
      </aside>

      {/* AREA UTAMA */}
      <section className="flex-1 relative flex flex-col">
        {/* Top Header */}
        <div className="absolute top-6 left-6 right-6 z-10 flex justify-between pointer-events-none">
          <div className="bg-black/60 border border-white/10 p-2 px-4 rounded-xl flex items-center gap-3 pointer-events-auto backdrop-blur-md">
            <Search size={14} className="text-slate-500" />
            <input className="bg-transparent border-none outline-none text-[11px] w-48 text-white font-mono uppercase" placeholder="SCAN_KOORDINAT..." />
          </div>
          <div className="bg-[#05070a]/90 border border-white/10 px-5 py-2 rounded-xl text-[10px] font-black text-white flex items-center gap-3 backdrop-blur-md pointer-events-auto shadow-2xl">
             <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
             LOKASI TERDETEKSI: 32 SEKTOR KRITIS
          </div>
        </div>

        {/* BUMI 3D */}
        <div className="w-full h-full cursor-grab active:cursor-grabbing">
          <Canvas>
            <GlobeEngine activeLayers={layers} />
          </Canvas>
        </div>

        {/* NEWS TICKER (BAHASA INDONESIA) */}
        <div className="h-12 bg-black border-t border-white/10 z-10 flex items-center overflow-hidden font-mono text-[10px] backdrop-blur-md">
          <div className="bg-blue-600 h-full px-6 flex items-center font-black italic text-white shrink-0 skew-x-[-15deg] -translate-x-2">UPDATE_DUNIA</div>
          <div className="flex-1 px-10 whitespace-nowrap animate-marquee flex gap-20 items-center text-slate-400 italic">
             <span>● [INFRA] GANGGUAN SERAT OPTIK BAWAH LAUT TERDETEKSI DI SELAT MALAKA</span>
             <span>● [KONFLIK] TINGKAT WASPADA MENINGKAT DI PERBATASAN EROPA TIMUR</span>
             <span>● [EKONOMI] PASAR SAHAM GLOBAL MENGALAMI PENURUNAN TAJAM DI SEKTOR TEKNOLOGI</span>
             <span>● [ALAM] GEMPA SUSULAN TERDETEKSI DI WILAYAH PASIFIK SELATAN</span>
          </div>
        </div>
      </section>
    </main>
  );
}

function LayerItem({ active, onClick, icon, label, color }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-4 rounded-xl transition-all border
        ${active ? 'bg-white/5 border-white/10 text-white shadow-xl' : 'border-transparent text-slate-600 opacity-50 hover:opacity-100'}
      `}>
      <div className="flex items-center gap-4">
        <span className={active ? color : 'text-slate-700'}>{icon}</span>
        <span className="text-[11px] font-bold tracking-tight uppercase">{label}</span>
      </div>
      <ChevronRight size={14} className={active ? 'opacity-100' : 'opacity-0'} />
    </button>
  );
}

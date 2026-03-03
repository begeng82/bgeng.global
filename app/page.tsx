"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { ShieldAlert, Activity, Zap, Globe, Search, Radio, Database, Info, AlertTriangle } from 'lucide-react';

const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { ssr: false });

export default function OSINTTerminal() {
  const [layers, setLayers] = useState<string[]>(['geologi', 'konflik', 'infrastruktur']);

  const toggle = (id: string) => {
    setLayers(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  };

  return (
    <main className="fixed inset-0 bg-[#02040a] text-slate-400 font-sans overflow-hidden flex select-none">
      
      {/* SIDEBAR INTELIJEN */}
      <aside className="w-80 bg-[#05070c]/95 border-r border-white/10 z-20 flex flex-col backdrop-blur-2xl">
        <div className="p-8 border-b border-white/5 bg-gradient-to-b from-blue-900/10 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <Radio className="text-blue-500 w-6 h-6 animate-pulse" />
            <h1 className="text-xl font-black tracking-tighter text-white italic uppercase">BGENG_OSINT</h1>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-mono tracking-widest text-slate-500 uppercase">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            UPLINK_SATELIT_AKTIF
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
          <p className="text-[10px] font-bold text-slate-600 mb-6 px-2 tracking-[0.3em] uppercase underline underline-offset-8 decoration-blue-500/30">Kategori Data Real-Time</p>
          
          <LayerBtn active={layers.includes('geologi')} onClick={() => toggle('geologi')} icon={<Activity size={18}/>} label="Aktivitas Geologi (Live)" sub="Sinkronisasi USGS Nyata" color="text-orange-500 border-orange-600/50" />
          <LayerBtn active={layers.includes('konflik')} onClick={() => toggle('konflik')} icon={<ShieldAlert size={18}/>} label="Zona Konflik Global" sub="Intelijen Open Source" color="text-red-500 border-red-600/50" />
          <LayerBtn active={layers.includes('infrastruktur')} onClick={() => toggle('infrastruktur')} icon={<Zap size={18}/>} label="Energi & Jaringan" sub="Status Infrastruktur Kritis" color="text-cyan-400 border-cyan-500/50" />
          <LayerBtn active={layers.includes('pangkalan')} onClick={() => toggle('pangkalan')} icon={<Database size={18}/>} label="Instalasi Militer" sub="Koordinat Pangkalan Aktif" color="text-white border-white/30" />

          <div className="mt-10 p-5 bg-blue-950/20 border border-blue-500/20 rounded-2xl space-y-3 shadow-inner">
            <h3 className="text-[10px] font-black text-blue-400 tracking-widest uppercase">Status Terminal</h3>
            <div className="text-[9px] font-mono leading-relaxed space-y-1">
              <div className="flex justify-between"><span>LOKASI:</span><span className="text-white">JAKARTA, ID</span></div>
              <div className="flex justify-between"><span>SYNC:</span><span className="text-green-500 font-bold tracking-tighter">SUCCESS_100%</span></div>
              <div className="flex justify-between"><span>NODES:</span><span>4,102 DETECTED</span></div>
            </div>
          </div>
        </div>
      </aside>

      {/* VIEWPORT UTAMA */}
      <section className="flex-1 relative bg-[radial-gradient(circle_at_center,_#111b2d_0%,_#000_100%)]">
        {/* Top Header */}
        <div className="absolute top-8 left-8 right-8 z-10 flex justify-between pointer-events-none">
          <div className="bg-black/60 border border-white/10 p-3 px-5 rounded-2xl flex items-center gap-4 pointer-events-auto backdrop-blur-xl shadow-2xl">
            <Search size={18} className="text-slate-500" />
            <input className="bg-transparent border-none outline-none text-xs w-72 text-white font-mono uppercase tracking-widest" placeholder="PINDAI KOORDINAT GLOBAL..." />
          </div>
          
          <div className="flex gap-4 pointer-events-auto">
             <div className="bg-[#05070a]/90 border border-white/10 px-6 py-3 rounded-2xl text-[10px] font-black text-white flex items-center gap-4 backdrop-blur-xl shadow-2xl border-l-4 border-l-red-600">
               <AlertTriangle size={16} className="text-red-600 animate-bounce" />
               ANOMALI TERDETEKSI: 12 SEKTOR
             </div>
          </div>
        </div>

        {/* 3D CANVAS */}
        <div className="w-full h-full cursor-crosshair">
          <Canvas shadows>
            <GlobeEngine activeLayers={layers} />
          </Canvas>
        </div>

        {/* BOTTOM REAL-TIME TICKER NEWS */}
        <div className="absolute bottom-0 w-full h-14 bg-black/95 border-t border-white/10 z-10 flex items-center overflow-hidden backdrop-blur-md">
          <div className="bg-blue-700 h-full px-10 flex items-center font-black italic text-white shrink-0 skew-x-[-12deg] -translate-x-2">LIVE_FEED</div>
          <div className="flex-1 px-10 whitespace-nowrap animate-marquee flex gap-32 items-center text-[11px] font-bold text-slate-300 font-mono italic tracking-wide">
             <span>● [INTEL] PERGERAKAN ARMADA PASIFIK TERPANTAU DI KOORDINAT 21.3°N 157.8°W</span>
             <span>● [EKONOMI] INDEKS PASAR GLOBAL MENGALAMI FLUKTUASI EKSTRIM DI SEKTOR ENERGI</span>
             <span>● [CUACA] ANOMALI TEKANAN UDARA RENDAH TERDETEKSI DI SAMUDRA HINDIA</span>
             <span>● [NODE] GANGGUAN KOMUNIKASI SATELIT TERDETEKSI PADA SEKTOR 04-B</span>
          </div>
        </div>
      </section>
    </main>
  );
}

function LayerBtn({ active, onClick, icon, label, sub, color }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all duration-300 border-2 text-left
        ${active ? `bg-white/5 border-white/10 shadow-2xl scale-[1.02]` : 'border-transparent opacity-30 hover:opacity-100 hover:bg-white/5'}
      `}>
      <div className="flex items-center gap-5">
        <span className={active ? color : 'text-slate-600'}>{icon}</span>
        <div>
          <p className={`text-[11px] font-black tracking-tighter ${active ? 'text-white' : 'text-slate-500'}`}>{label}</p>
          <p className="text-[9px] text-slate-600 font-mono italic">{sub}</p>
        </div>
      </div>
      <div className={`w-2 h-2 rounded-full ${active ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-slate-800'}`} />
    </button>
  );
}

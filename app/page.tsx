"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Activity, ShieldAlert, Zap, Globe, Search, Radar, Info, Menu } from 'lucide-react';

const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { ssr: false });

export default function RealTimeWorldMonitor() {
  const [layers, setLayers] = useState<string[]>(['alam', 'konflik', 'ekonomi']);

  return (
    <main className="fixed inset-0 bg-[#010204] text-slate-300 font-sans flex overflow-hidden">
      
      {/* PANEL KONTROL KIRI */}
      <aside className="w-80 bg-[#05070a]/95 border-r border-white/10 z-20 flex flex-col backdrop-blur-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-gradient-to-b from-blue-950/20 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <Radar className="text-blue-500 w-6 h-6 animate-pulse" />
            <h1 className="text-xl font-black tracking-tighter text-white italic">GEO-INTEL_OSINT</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">Koneksi Satelit Aktif</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          <p className="text-[10px] font-bold text-slate-600 mb-4 px-2 tracking-[0.2em] uppercase underline decoration-blue-500/50 underline-offset-4">Kategori Informasi Nyata</p>
          
          <MenuButton active={layers.includes('alam')} onClick={() => toggleLayer(layers, setLayers, 'alam')} icon={<Activity size={18}/>} label="Bencana Alam (Live)" sub="Data USGS Real-time" color="border-orange-600 text-orange-500" />
          <MenuButton active={layers.includes('konflik')} onClick={() => toggleLayer(layers, setLayers, 'konflik')} icon={<ShieldAlert size={18}/>} label="Zona Konflik Dunia" sub="Pemantauan Geopolitik" color="border-red-600 text-red-500" />
          <MenuButton active={layers.includes('ekonomi')} onClick={() => toggleLayer(layers, setLayers, 'ekonomi')} icon={<Zap size={18}/>} label="Infrastruktur & Energi" sub="Status Jaringan Global" color="border-cyan-500 text-cyan-400" />
          
          <div className="mt-10 p-5 bg-blue-900/10 border border-blue-500/20 rounded-2xl">
            <h3 className="text-[10px] font-black text-blue-400 mb-3 tracking-widest">LOG SISTEM TERKINI</h3>
            <div className="space-y-3 text-[9px] font-mono leading-relaxed">
              <p className="text-slate-400 border-b border-white/5 pb-1">[12:44] Data seismik diterima dari USGS API.</p>
              <p className="text-slate-400 border-b border-white/5 pb-1">[12:40] Sinkronisasi satelit cuaca LEO-9.</p>
              <p className="text-blue-500">[12:35] Pemindaian anomali zona konflik selesai.</p>
            </div>
          </div>
        </div>
      </aside>

      {/* AREA GLOBE 3D */}
      <section className="flex-1 relative">
        <div className="absolute top-6 left-6 right-6 z-10 flex justify-between pointer-events-none">
          <div className="bg-black/60 border border-white/10 p-3 rounded-2xl flex items-center gap-4 pointer-events-auto backdrop-blur-xl shadow-2xl">
            <Search size={18} className="text-slate-500" />
            <input className="bg-transparent border-none outline-none text-xs w-64 text-white font-mono uppercase placeholder-slate-600" placeholder="MASUKKAN KOORDINAT / IDENTIFIKASI LOKASI..." />
          </div>
          
          <div className="bg-[#05070a]/90 border border-white/10 px-6 py-3 rounded-2xl text-[11px] font-black text-white flex items-center gap-3 backdrop-blur-xl pointer-events-auto shadow-2xl border-l-4 border-l-blue-500">
             <Globe className="w-4 h-4 text-blue-500" />
             TOTAL KEJADIAN TERDETEKSI: {Math.floor(Math.random() * 500) + 1200}
          </div>
        </div>

        <div className="w-full h-full cursor-crosshair bg-[radial-gradient(circle_at_center,_#0b1120_0%,_#000_100%)]">
          <Canvas shadowMap>
            <GlobeEngine activeLayers={layers} />
          </Canvas>
        </div>

        {/* FOOTER TICKER NEWS */}
        <div className="absolute bottom-0 w-full h-14 bg-black/95 border-t border-white/10 z-10 flex items-center font-mono text-[11px] overflow-hidden backdrop-blur-md">
          <div className="bg-blue-600 h-full px-8 flex items-center font-black italic text-white shrink-0 tracking-tighter">NYATA_SEKARANG</div>
          <div className="flex-1 px-10 whitespace-nowrap animate-marquee flex gap-24 items-center text-blue-100 font-bold tracking-wide">
             <span>● [NEWS] KESEPAKATAN DAGANG AS-ASIA PASIFIK MASUK TAHAP FINAL</span>
             <span>● [LIVE] GEMPA BUMI 4.5 SR TERDETEKSI DI WILAYAH PASIFIK SELATAN</span>
             <span>● [MILITER] LATIHAN GABUNGAN NATO DI EROPA TIMUR DIMULAI HARI INI</span>
             <span>● [TECH] GANGGUAN SERVER CLOUD GLOBAL BERDAMPAK PADA 12 NEGARA</span>
          </div>
        </div>
      </aside>
    </main>
  );
}

// Fungsi Toggle Layer
const toggleLayer = (layers: string[], setLayers: any, id: string) => {
  setLayers(layers.includes(id) ? layers.filter(l => l !== id) : [...layers, id]);
};

// Komponen Tombol Menu
function MenuButton({ active, onClick, icon, label, sub, color }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all duration-300 border-2 text-left
        ${active ? `bg-white/5 border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.5)]` : 'border-transparent opacity-40 hover:opacity-100 hover:bg-white/5'}
      `}
    >
      <div className="flex items-center gap-5">
        <span className={active ? color : 'text-slate-600'}>{icon}</span>
        <div>
          <p className={`text-[11px] font-black tracking-tight ${active ? 'text-white' : 'text-slate-500'}`}>{label}</p>
          <p className="text-[9px] text-slate-500 font-mono italic">{sub}</p>
        </div>
      </div>
      <div className={`w-2 h-2 rounded-full ${active ? 'bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]' : 'bg-slate-800'}`} />
    </button>
  );
}

"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Thermometer, Zap, Shield, RefreshCw, Lock, Radio, Crosshair, Target } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { ssr: false });
const dummyGraph = Array.from({length: 20}, (_, i) => ({v: Math.floor(Math.random() * 100)}));

export default function UltimateDashboard() {
  const [stats, setStats] = useState({ temp: "00.0", btc: "00000", status: "STANDBY" });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [w, c] = await Promise.all([
        fetch("https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.8&current=temperature_2m"),
        fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
      ]);
      const wD = await w.json();
      const cD = await c.json();
      setStats({ 
        temp: wD.current.temperature_2m, 
        btc: cD.bitcoin.usd.toLocaleString(), 
        status: "ACTIVE_ENCRYPT" 
      });
    } catch (e) { setStats(p => ({...p, status: "OFFLINE"})); }
    setTimeout(() => setLoading(false), 800);
  };

  useEffect(() => { fetchData(); const i = setInterval(fetchData, 60000); return () => clearInterval(i); }, []);

  return (
    <main className="fixed inset-0 bg-[#00050a] text-cyan-500 font-mono flex flex-col overflow-hidden uppercase animate-flicker">
      <div className="monitor-overlay absolute inset-0 pointer-events-none" />
      <div className="scanline z-50" />

      {/* 3D GLOBE - Dibuat lebih gelap dan dramatis */}
      <div className="absolute inset-0 z-0 opacity-30 grayscale-[0.5]">
        <Canvas camera={{ position: [0, 0, 7] }}><GlobeEngine /></Canvas>
      </div>

      {/* CORNER UI ELEMENTS */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-cyan-500/50 m-4 opacity-50" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-cyan-500/50 m-4 opacity-50" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-cyan-500/50 m-4 opacity-50" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-cyan-500/50 m-4 opacity-50" />

      {/* TOP HEADER */}
      <div className="relative z-10 flex justify-between items-center px-10 pt-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <h1 className="text-5xl font-black italic tracking-tighter text-white drop-shadow-[0_0_15px_rgba(0,242,255,0.8)]">BGENG.GLOBAL</h1>
            <div className="px-3 py-1 bg-cyan-500 text-black font-bold text-xs skew-x-[-20deg]">V9.7.1_PROTOC</div>
          </div>
          <p className="text-[10px] tracking-[1em] opacity-40 mt-2">Classified Terminal // Authorization Req.</p>
        </div>
        
        <div className="flex gap-8 items-center bg-black/60 p-4 border border-cyan-500/20 backdrop-blur-xl">
          <div className="text-right">
            <p className="text-[8px] opacity-50">Local_Time</p>
            <p className="text-xl font-bold text-white">{new Date().toLocaleTimeString()}</p>
          </div>
          <div className="h-10 w-[2px] bg-cyan-900" />
          <div className="text-right">
            <p className="text-[8px] opacity-50">Sat_Relay</p>
            <p className="text-xl font-bold text-white tracking-widest">JKT-082</p>
          </div>
        </div>
      </div>

      {/* CENTER HUD - CROSSHAIR */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="relative w-[500px] h-[500px] border border-cyan-500/30 rounded-full animate-[spin_20s_linear_infinite]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-cyan-500" />
        </div>
        <Crosshair className="absolute w-12 h-12" />
      </div>

      {/* DATA STREAM RIGHT */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-2 text-[8px] opacity-30 text-right font-thin">
        {[...Array(10)].map((_, i) => <p key={i}>HEX_DATA_STREAM_{Math.random().toString(16).slice(2, 10)}</p>)}
      </div>

      {/* BOTTOM CONTROL PANEL */}
      <div className="mt-auto relative z-10 grid grid-cols-1 md:grid-cols-4 gap-2 p-6 bg-cyan-950/10 backdrop-blur-md border-t border-cyan-500/20">
        <StatPanel label="ENV_THERMAL" value={`${stats.temp}°C`} sub="Core_Stable" icon={<Thermometer />} />
        <StatPanel label="XCHANGE_BTC" value={`${stats.btc}`} sub="USD_Index" icon={<Zap />} />
        <StatPanel label="DEFENSE_NET" value={stats.status} sub="Layer_7_Active" icon={<Shield />} />
        
        <div className="bg-black/80 border border-cyan-500/30 p-4 relative group overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] font-bold">SIGNAL_WAVEFORM</span>
            <Activity className="w-3 h-3 animate-pulse" />
          </div>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummyGraph}>
                <Area type="monotone" dataKey="v" stroke="#00f2ff" fill="#00f2ff22" strokeWidth={1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* COMMAND LINE FOOTER */}
      <div className="bg-cyan-500 text-black px-10 py-1 text-[10px] font-bold flex justify-between overflow-hidden">
        <div className="flex gap-10 whitespace-nowrap animate-marquee">
          <span>{">"} INITIALIZING BGENG OMNISCIENCE OVERRIDE...</span>
          <span>{">"} UPLINK ESTABLISHED...</span>
          <span>{">"} BYPASSING FIREWALL...</span>
          <span>{">"} SYSTEM SECURE. WELCOME, COMMANDER.</span>
        </div>
      </div>

      {/* REFRESH FLOATING BUTTON */}
      <button 
        onClick={fetchData} 
        className="absolute right-10 bottom-40 z-30 p-5 bg-black border-2 border-cyan-500 rounded-none hover:bg-cyan-500 hover:text-black transition-all shadow-[0_0_20px_rgba(0,242,255,0.4)] active:scale-95"
      >
        <RefreshCw className={loading ? 'animate-spin' : ''} />
      </button>
    </main>
  );
}

function StatPanel({ label, value, sub, icon }: any) {
  return (
    <div className="bg-black/60 border border-cyan-500/20 p-5 relative group transition-all hover:bg-cyan-900/20">
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400" />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold text-cyan-700 tracking-tighter mb-1">{label}</p>
          <p className="text-3xl font-black text-white italic tracking-tighter">{value}</p>
          <p className="text-[8px] text-cyan-500/50 mt-1 tracking-[0.2em]">{sub}</p>
        </div>
        <div className="p-2 bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
    </div>
  );
}

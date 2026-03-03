"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Thermometer, Zap, Shield, RefreshCw, Lock, Activity } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { ssr: false });
const dummyGraph = [{v:40}, {v:30}, {v:65}, {v:45}, {v:90}, {v:55}, {v:80}];

export default function Dashboard() {
  const [stats, setStats] = useState({ temp: "--", btc: "--", status: "ENCRYPTED" });
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
        temp: `${wD.current.temperature_2m}°C`, 
        btc: `$${cD.bitcoin.usd.toLocaleString()}`, 
        status: "SECURE_082" 
      });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <main className="fixed inset-0 bg-[#000814] text-white font-mono flex flex-col overflow-hidden uppercase">
      {/* 3D GLOBE BACKGROUND */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 6] }}><GlobeEngine /></Canvas>
      </div>

      {/* OVERLAY SCANLINE */}
      <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* TOP HUD */}
      <div className="relative z-10 flex justify-between items-start p-6 md:p-10">
        <div className="border-l-4 border-cyan-400 pl-4 bg-black/40 backdrop-blur-md p-2">
          <h1 className="text-3xl font-black italic tracking-tighter text-cyan-400 drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]">BGENG.GLOBAL_V9</h1>
          <p className="text-[9px] tracking-[0.4em] text-cyan-600 mt-1">Omniscience Override Active</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-[10px] text-cyan-800 font-bold tracking-widest">Uplink: Active</p>
          <p className="text-xs text-cyan-400 italic">Jakarta_Mainframe_Node</p>
        </div>
      </div>

      {/* SIDEBAR REFRESH */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20">
        <button onClick={fetchData} className="p-4 rounded-full border border-cyan-500/30 bg-black/60 hover:bg-cyan-500 hover:text-black transition-all shadow-[0_0_20px_rgba(0,242,255,0.2)]">
          <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* BOTTOM HUD - GRID SYSTEM */}
      <div className="mt-auto relative z-10 p-6 grid grid-cols-1 md:grid-cols-4 gap-4 bg-gradient-to-t from-black/80 to-transparent">
        <StatBox label="Ambient_Temp" value={stats.temp} icon={<Thermometer className="w-4 h-4 text-cyan-400" />} />
        <StatBox label="Market_BTC" value={stats.btc} icon={<Zap className="w-4 h-4 text-cyan-400" />} />
        <StatBox label="Encryption" value={stats.status} icon={<Lock className="w-4 h-4 text-cyan-400" />} />
        
        {/* REAL-TIME GRAPH */}
        <div className="bg-black/60 border border-cyan-500/20 p-4 backdrop-blur-md h-28 relative">
          <span className="absolute top-1 left-2 text-[8px] text-cyan-700 font-bold italic">SIGNAL_ANALYZER</span>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dummyGraph}>
              <Area type="step" dataKey="v" stroke="#00f2ff" fill="#00f2ff22" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FOOTER NEWS TICKER */}
      <div className="relative z-10 bg-cyan-950/20 border-t border-cyan-500/10 py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-[10px] text-cyan-600/80">
          <span className="mx-8">{">"} SYSTEM SECURE</span>
          <span className="mx-8">{">"} GLOBAL NODE 082 ONLINE</span>
          <span className="mx-8">{">"} ENCRYPTING TRAFFIC... DONE</span>
          <span className="mx-8">{">"} BGENG GLOBAL INTELLIGENCE OPERATIONAL</span>
        </div>
      </div>
    </main>
  );
}

function StatBox({ label, value, icon }: any) {
  return (
    <div className="bg-black/60 border border-cyan-500/20 p-4 backdrop-blur-md group hover:border-cyan-400 transition-all cursor-default">
      <div className="flex items-center gap-2 mb-1">
        {icon} <span className="text-[9px] text-cyan-700 font-bold tracking-widest">{label}</span>
      </div>
      <p className="text-2xl font-black text-white italic group-hover:text-cyan-400 transition-colors">{value}</p>
      <div className="mt-2 h-1 bg-cyan-900/30 overflow-hidden">
        <div className="h-full bg-cyan-500/50 w-2/3 animate-pulse" />
      </div>
    </div>
  );
}

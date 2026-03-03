"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Thermometer, Zap, Activity, RefreshCw, Shield, Globe } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { ssr: false });

const dummyData = [{v:40}, {v:30}, {v:60}, {v:80}, {v:50}, {v:90}, {v:100}];

export default function Dashboard() {
  const [stats, setStats] = useState({ temp: 0, btc: 0, status: "SECURE" });
  const [loading, setLoading] = useState(false);

  const sync = async () => {
    setLoading(true);
    try {
      const [w, c] = await Promise.all([
        fetch("https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.8&current=temperature_2m"),
        fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
      ]);
      const wD = await w.json();
      const cD = await c.json();
      setStats({ temp: wD.current.temperature_2m, btc: cD.bitcoin.usd, status: "ENCRYPTED" });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { sync(); }, []);

  return (
    <main className="relative h-screen w-full flex flex-col p-4 md:p-8 font-mono overflow-hidden uppercase">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 6] }}><GlobeEngine /></Canvas>
      </div>

      {/* Top Overlay */}
      <div className="relative z-10 flex justify-between items-start">
        <div className="bg-black/60 border-l-4 border-cyan-500 p-4 backdrop-blur-md">
          <h1 className="text-3xl font-black italic tracking-tighter text-cyan-400">BGENG.GLOBAL_v9</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-cyan-500 animate-pulse rounded-full" />
            <p className="text-[10px] tracking-[0.3em] text-cyan-500/80">Omniscience Override Active</p>
          </div>
        </div>
        
        <div className="hidden md:flex gap-4">
          <header className="bg-black/40 border border-cyan-500/20 p-2 text-right backdrop-blur-sm">
            <p className="text-[9px] text-cyan-700">System_Node</p>
            <p className="text-xs font-bold text-cyan-400">ID-JKT-082</p>
          </header>
        </div>
      </div>

      {/* Sidebar Controls */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-10">
        <button onClick={sync} className="p-4 bg-cyan-950/20 border border-cyan-500/40 rounded-full hover:bg-cyan-500 hover:text-black transition-all group">
          <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Bottom Interface */}
      <div className="mt-auto grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
        <StatPanel label="Ambient_Temp" value={`${stats.temp}°C`} icon={<Thermometer className="w-4 h-4" />} />
        <StatPanel label="Market_BTC" value={`$${stats.btc.toLocaleString()}`} icon={<Zap className="w-4 h-4" />} />
        <StatPanel label="Firewall" value={stats.status} icon={<Shield className="w-4 h-4" />} />
        
        {/* Real-time Graph */}
        <div className="bg-black/60 border border-cyan-500/30 p-4 rounded-xl backdrop-blur-xl h-28 relative overflow-hidden group">
          <div className="absolute top-2 right-4 text-[8px] text-cyan-500 font-bold">LIVE_TRAFFIC</div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dummyData}>
              <Area type="stepAfter" dataKey="v" stroke="#00f2ff" fill="#00f2ff22" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}

function StatPanel({ label, value, icon }: any) {
  return (
    <div className="bg-black/60 border border-cyan-500/20 p-4 rounded-xl backdrop-blur-md group hover:border-cyan-500/60 transition-colors">
      <div className="flex items-center gap-2 mb-2 text-cyan-500/60 group-hover:text-cyan-400">
        {icon} <span className="text-[9px] font-bold tracking-widest">{label}</span>
      </div>
      <p className="text-2xl font-black text-white group-hover:scale-105 transition-transform origin-left">{value}</p>
    </div>
  );
}

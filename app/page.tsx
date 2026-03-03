"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { Globe, Activity, Zap, Thermometer, RefreshCw, Newspaper } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { ssr: false });

const dummyChart = [{v: 10}, {v: 25}, {v: 15}, {v: 45}, {v: 30}, {v: 60}, {v: 40}];

export default function Dashboard() {
  const [stats, setStats] = useState<any>({ temp: 0, btc: 0, quake: "SCANNING" });
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
      setStats({ temp: wD.current.temperature_2m, btc: cD.bitcoin.usd, quake: "PACIFIC_STABLE" });
    } catch (e) { console.error("Sync Error"); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <main className="relative h-screen w-full flex flex-col p-6">
      <div className="absolute inset-0 z-0"><Canvas><GlobeEngine /></Canvas></div>

      <div className="relative z-10 flex justify-between">
        <div className="bg-black/40 p-4 border-l-4 border-cyan-500 backdrop-blur-md">
          <h1 className="text-3xl font-black italic tracking-tighter">BGENG.GLOBAL_v9</h1>
          <p className="text-[9px] text-cyan-500 font-bold tracking-[0.3em]">OMNISCIENCE_OVERRIDE</p>
        </div>
        <button onClick={fetchData} className="p-4 bg-cyan-950/50 border border-cyan-500 rounded-full h-fit">
          <RefreshCw className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="mt-auto grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
        <Panel label="JKT_TEMP" value={`${stats.temp}°C`} icon={<Thermometer />} />
        <Panel label="BITCOIN_USD" value={`$${stats.btc.toLocaleString()}`} icon={<Zap />} />
        <Panel label="SEISMIC" value={stats.quake} icon={<Activity />} />
        <div className="bg-black/60 border border-cyan-500/20 p-4 rounded-xl h-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dummyChart}><Area type="step" dataKey="v" stroke="#00f2ff" fill="#00f2ff33" /></AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}

function Panel({ label, value, icon }: any) {
  return (
    <div className="bg-black/60 backdrop-blur-md border border-cyan-500/20 p-4 rounded-xl">
      <div className="flex justify-between items-center mb-2 text-cyan-500">
        {icon} <span className="text-[8px] font-bold tracking-widest">{label}</span>
      </div>
      <p className="text-xl font-black">{value}</p>
    </div>
  );
}

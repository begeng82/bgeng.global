"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Activity, ShieldAlert, Radio, Terminal, 
  Globe, Newspaper, Bitcoin, Thermometer, RefreshCw 
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const GlobeEngine = dynamic(() => import('../components/GlobeEngine'), { ssr: false });

export default function OmniscienceDashboard() {
  const [data, setData] = useState<any>({ weather: [], crypto: {}, news: [], quakes: {} });
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (m: string) => setLogs(p => [ `[${new Date().toLocaleTimeString()}] ${m}`, ...p.slice(0, 5) ]);

  const syncAllSystems = async () => {
    setLoading(true);
    addLog("SYNCHRONIZING GLOBAL UPLINK...");
    try {
      // 1. Weather API (Multi-City)
      const wRes = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-6.2,51.5,35.6,40.7&longitude=106.8,-0.1,139.6,-74.0&current=temperature_2m");
      const wData = await wRes.json();

      // 2. Crypto API
      const cRes = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd");
      const cData = await cRes.json();

      // 3. News API (Free RSS substitute logic)
      const nData = [
        "Quantum Computing breakthrough in Sector 7",
        "Tectonic shift detected in Pacific Basin",
        "Global Energy Grid reaching peak capacity"
      ];

      // 4. Quake API
      const qRes = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson");
      const qData = await qRes.json();

      setData({ weather: wData, crypto: cData, news: nData, quakes: qData.features[0]?.properties || {} });
      addLog("SYNC SUCCESSFUL. 128 NODES ACTIVE.");
    } catch (e) {
      addLog("CONNECTION FAILED. RETRYING...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { syncAllSystems(); setInterval(syncAllSystems, 60000); }, []);

  return (
    <main className="relative h-screen w-full flex flex-col p-6">
      <div className="screen-overlay" />
      
      {/* 3D Visualizer */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Canvas><GlobeEngine /></Canvas>
      </div>

      {/* TOP HEADER */}
      <header className="relative z-10 flex justify-between items-start mb-10">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <h1 className="text-3xl font-black italic tracking-tighter text-white glitch-text">OMNISCIENCE.v9</h1>
          <p className="text-[10px] text-cyan-500 font-bold tracking-[0.5em]">GLOBAL_DOMINANCE_INTERFACE</p>
        </motion.div>
        
        <div className="flex gap-4">
          <div className="glow-border bg-black/50 p-3 rounded-xl">
            <p className="text-[8px] text-slate-500 font-bold mb-1">DATA_SOURCE_STREAMS</p>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* DASHBOARD GRID */}
      <div className="relative z-10 grid grid-cols-12 gap-6 flex-1 h-full max-h-[75vh]">
        
        {/* Left: News & Logs */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          <Panel title="LIVE_NEWS_FEED" icon={<Newspaper />}>
            <div className="space-y-4">
              {data.news.map((n: string, i: number) => (
                <div key={i} className="text-[10px] border-l-2 border-cyan-600 pl-3 py-1 bg-cyan-600/5">
                  {n}
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="SYSTEM_LOGS" icon={<Terminal />}>
            <div className="space-y-2 font-mono text-[9px] text-emerald-400">
              {logs.map((l, i) => <p key={i}>{l}</p>)}
            </div>
          </Panel>
        </div>

        {/* Center: Hero Stats */}
        <div className="col-span-12 lg:col-span-6 flex flex-col justify-center items-center">
          <div className="grid grid-cols-2 gap-8 w-full">
            <BigMetric label="WORLD_POPULATION" value="8,102,455,901" trend="+2.4/s" />
            <BigMetric label="BITCOIN_VALUE" value={`$${data.crypto?.bitcoin?.usd?.toLocaleString() || '0'}`} trend="LIVE" />
          </div>
        </div>

        {/* Right: Environment & Market */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          <Panel title="ATMOSPHERIC_METRICS" icon={<Thermometer />}>
            <div className="space-y-4">
              <MiniStat city="JAKARTA" temp={data.weather?.[0]?.current?.temperature_2m} />
              <MiniStat city="LONDON" temp={data.weather?.[1]?.current?.temperature_2m} />
              <MiniStat city="TOKYO" temp={data.weather?.[2]?.current?.temperature_2m} />
            </div>
          </Panel>
          <Panel title="SEISMIC_ACTIVITY" icon={<Activity />}>
            <div className="text-center py-4">
              <p className="text-4xl font-black text-rose-500">{data.quakes?.mag || "0.0"}</p>
              <p className="text-[10px] text-slate-500">{data.quakes?.place || "SCANNING..."}</p>
            </div>
          </Panel>
        </div>
      </div>

      {/* FOOTER SYNC */}
      <footer className="relative z-10 mt-auto flex justify-between items-center border-t border-white/10 pt-4">
        <p className="text-[9px] text-slate-500">© 2026 ARCHON_SYSTEMS. ALL_NODES_STABLE.</p>
        <button onClick={syncAllSystems} className="bg-cyan-600 px-6 py-2 rounded-full text-black font-black text-[10px] tracking-widest flex items-center gap-2 hover:bg-white transition-all">
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> OVERRIDE_SYNC
        </button>
      </footer>
    </main>
  );
}

// Sub-Components
function Panel({ title, icon, children }: any) {
  return (
    <div className="glow-border bg-black/60 backdrop-blur-xl p-5 rounded-3xl flex-1 overflow-hidden">
      <div className="flex items-center gap-2 mb-4 text-cyan-500 font-black text-[10px] tracking-widest uppercase">
        {icon} <span>{title}</span>
      </div>
      {children}
    </div>
  );
}

function BigMetric({ label, value, trend }: any) {
  return (
    <div className="text-center group">
      <p className="text-[10px] text-slate-500 font-bold mb-2 tracking-widest">{label}</p>
      <p className="text-4xl font-black text-white tabular-nums group-hover:text-cyan-400 transition-colors">{value}</p>
      <span className="text-[9px] text-emerald-500 font-mono">{trend}</span>
    </div>
  );
}

function MiniStat({ city, temp }: any) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[10px] text-slate-400 font-bold">{city}</span>
      <span className="text-sm font-black text-cyan-400">{temp}°C</span>
    </div>
  );
}

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Chemistry {
  Dopamine: number;
  Oxytocin: number;
  Cortisol: number;
}

interface LogEntry {
  id: number;
  event: string;
  data: Chemistry;
  timestamp: string;
}

const DigitalTwinSimulation: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [chemistry, setChemistry] = useState<Chemistry>({
    Dopamine: 50,
    Oxytocin: 50,
    Cortisol: 20
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [history, setHistory] = useState<(Chemistry & { time: string })[]>([]);
  
  const logIdRef = useRef(0);
  const intervalRef = useRef<number | null>(null);

  const recommendations = useMemo(() => {
    const list: { type: string; msg: string; color: string }[] = [];
    if (chemistry.Cortisol > 60) {
      list.push({ 
        type: "STRESS ALERT", 
        msg: "ระดับคอร์ติซอลสูงเกินเกณฑ์ แนะนำให้ทำสมาธิ 10 นาที หรือฝึกหายใจลึกๆ",
        color: "text-red-400 border-red-900/50 bg-red-950/20"
      });
    }
    if (chemistry.Oxytocin < 40) {
      list.push({ 
        type: "BONDING DEFICIT", 
        msg: "ระดับออกซิโตซินต่ำ แนะนำให้พูดคุยเชิงลึกหรือกอดคนรักเพื่อสร้างความผูกพัน",
        color: "text-purple-400 border-purple-900/50 bg-purple-950/20"
      });
    }
    if (chemistry.Dopamine < 30) {
      list.push({ 
        type: "LOW REWARD", 
        msg: "ระดับโดปามีนต่ำ แนะนำให้หากิจกรรมที่สร้างสรรค์หรือออกกำลังกายเบาๆ",
        color: "text-yellow-400 border-yellow-900/50 bg-yellow-950/20"
      });
    }
    if (list.length === 0) {
      list.push({ 
        type: "OPTIMAL STATE", 
        msg: "สภาวะทางเคมีในสมองอยู่ในเกณฑ์สมดุล (Equilibrium) ให้รักษากิจวัตรเดิมไว้",
        color: "text-emerald-400 border-emerald-900/50 bg-emerald-950/20"
      });
    }
    return list;
  }, [chemistry]);

  const updateBioData = (interactionType: string) => {
    setChemistry(prev => {
      let next = { ...prev };
      
      if (interactionType === "physical_touch") {
        next.Oxytocin += 15;
        next.Cortisol -= 5;
        next.Dopamine += 5;
      } else if (interactionType === "argument") {
        next.Cortisol += 20;
        next.Dopamine -= 10;
        next.Oxytocin -= 8;
      } else if (interactionType === "deep_talk") {
        next.Oxytocin += 12;
        next.Dopamine += 8;
        next.Cortisol -= 3;
      } else if (interactionType === "none") {
        next.Dopamine = next.Dopamine > 50 ? next.Dopamine - 0.5 : next.Dopamine + 0.5;
        next.Oxytocin = next.Oxytocin > 50 ? next.Oxytocin - 0.5 : next.Oxytocin + 0.5;
        next.Cortisol = next.Cortisol > 20 ? next.Cortisol - 0.5 : next.Cortisol + 0.5;
      }

      return {
        Dopamine: Math.max(0, Math.min(100, next.Dopamine)),
        Oxytocin: Math.max(0, Math.min(100, next.Oxytocin)),
        Cortisol: Math.max(0, Math.min(100, next.Cortisol))
      };
    });
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        const events = ["physical_touch", "argument", "deep_talk", "none", "none"];
        const event = events[Math.floor(Math.random() * events.length)];
        
        updateBioData(event);
        
        const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        setLogs(prev => {
          const newLog = {
            id: logIdRef.current++,
            event: event.replace('_', ' ').toUpperCase(),
            data: { ...chemistry },
            timestamp
          };
          return [newLog, ...prev].slice(0, 5);
        });

        setHistory(prev => {
          const newPoint = { ...chemistry, time: timestamp };
          return [...prev, newPoint].slice(-15); // Keep last 15 points
        });
      }, 2000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, chemistry]);

  const getChemistryColor = (val: number, type: keyof Chemistry) => {
    if (type === 'Cortisol' && val > 60) return 'text-red-500';
    if (type === 'Dopamine') return 'text-yellow-500';
    if (type === 'Oxytocin') return 'text-purple-500';
    return 'text-slate-300';
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-600/10 blur-[100px] pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${isRunning ? 'bg-indigo-500 animate-pulse shadow-[0_0_10px_#6366f1]' : 'bg-slate-700'}`}></span>
            Digital Twin Simulation <span className="text-slate-600 font-light text-sm ml-2 font-mono">2026.0.4b</span>
          </h2>
          <p className="text-slate-400 text-sm font-thai mt-1">ระบบจำลองสภาวะเคมีในสมองแบบคู่ขนาน (Parallel World) อัตโนมัติ</p>
        </div>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-8 py-3 rounded-xl font-bold transition-all transform active:scale-95 font-mono text-sm tracking-tight ${
            isRunning 
              ? 'bg-red-500/10 text-red-500 border border-red-500/30' 
              : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-900/30'
          }`}
        >
          {isRunning ? '[ STOP_PARALLEL_CORE ]' : '[ START_PARALLEL_CORE ]'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Real-time Status Bars */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Neural Metrics</h3>
          {(['Dopamine', 'Oxytocin', 'Cortisol'] as const).map((key) => (
            <div key={key} className="bg-slate-800/20 p-4 rounded-xl border border-slate-700/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">{key}</span>
                <span className={`text-lg font-mono font-black ${getChemistryColor(chemistry[key], key)}`}>
                  {Math.round(chemistry[key])}%
                </span>
              </div>
              <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    key === 'Dopamine' ? 'bg-yellow-500' : key === 'Oxytocin' ? 'bg-purple-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${chemistry[key]}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Real-time Graph (Matplotlib Simulation) */}
        <div className="lg:col-span-6 bg-slate-950/40 rounded-2xl border border-slate-800 p-4 h-[300px]">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 text-center">Temporal Chemical Flux</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', fontSize: '10px' }}
                itemStyle={{ padding: '0px' }}
              />
              <Line type="monotone" dataKey="Dopamine" stroke="#eab308" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="Oxytocin" stroke="#a855f7" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="Cortisol" stroke="#f87171" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Live Logs */}
        <div className="lg:col-span-3">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Event Stream</h3>
          <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-4 font-mono text-[10px] h-[300px] flex flex-col shadow-inner">
            <div className="overflow-y-auto space-y-3 flex-1 scrollbar-hide">
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-700 italic">
                  [ WAITING_FOR_SYNC ]
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="animate-fadeIn border-l border-slate-700 pl-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-600">{log.timestamp}</span>
                      <span className={`font-bold ${log.event === 'ARGUMENT' ? 'text-red-400' : 'text-indigo-400'}`}>
                        {log.event}
                      </span>
                    </div>
                    <div className="text-slate-500 opacity-80">
                      SYS_UPDT: D{Math.round(log.data.Dopamine)} O{Math.round(log.data.Oxytocin)} C{Math.round(log.data.Cortisol)}
                    </div>
                  </div>
                ))
              )}
            </div>
            {isRunning && (
              <div className="mt-4 pt-2 border-t border-slate-800 text-indigo-500 text-[9px] animate-pulse text-center">
                ACTIVE_DATALINK_ESTABLISHED
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Automated Recommendations Section */}
      <div className="mt-8 pt-8 border-t border-slate-800/50">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 mb-4">Automation & Mitigation Engine</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.map((rec, i) => (
            <div key={i} className={`p-4 rounded-xl border transition-all animate-fadeIn ${rec.color}`}>
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div>
                  <span className="block text-[9px] font-black uppercase mb-1 tracking-tighter opacity-80">{rec.type}</span>
                  <p className="text-xs font-thai leading-snug">{rec.msg}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-10 pt-6 flex justify-center gap-12 text-[9px] font-mono text-slate-600 border-t border-slate-800/30">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
          INF_ENGINE: NEURALSCRIPT_V3
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
          PROC_TIME: 2000MS
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
          SIM_MODE: CYBER_PHYSICAL_2026
        </div>
      </div>
    </div>
  );
};

export default DigitalTwinSimulation;

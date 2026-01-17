
import React, { useState, useMemo } from 'react';
import { STAGES, CHEMICALS, GENDER_DIFFS } from './constants';
import ChemicalCard from './components/ChemicalCard';
import BrainVisualizer from './components/BrainVisualizer';
import AiExplorer from './components/AiExplorer';
import DigitalTwinSimulation from './components/DigitalTwinSimulation';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const App: React.FC = () => {
  const [activeStageId, setActiveStageId] = useState(STAGES[1].id); // Start at Lust

  const activeStage = useMemo(() => 
    STAGES.find(s => s.id === activeStageId) || STAGES[1], 
    [activeStageId]
  );

  // Analysis function logic translated from the research model
  const analyzeLoveState = (dopamine: number, oxytocin: number, serotonin: number) => {
    if (serotonin < 40 && dopamine > 80) {
      return {
        status: "Attraction (หลงใหลอย่างรุนแรง)",
        desc: "มีอาการย้ำคิดย้ำทำถึงคู่ครอง (Obsessive-Compulsive behaviors regarding the partner)"
      };
    } else if (oxytocin > 80) {
      return {
        status: "Attachment (ผูกพันลึกซึ้ง)",
        desc: "เน้นความมั่นคงและความเชื่อใจ (Focuses on stability, safety, and deep trust)"
      };
    } else if (activeStageId === 'baseline') {
      return {
        status: "Baseline (สภาวะปกติ)",
        desc: "ระดับฮอร์โมนอยู่ในเกณฑ์สมดุล (Hormone levels are in balanced equilibrium)"
      };
    } else {
      return {
        status: "Early Stage / Instinct (ระยะเริ่มต้น)",
        desc: "ร่างกายเริ่มตอบสนองต่อแรงดึงดูด (Body begins responding to initial attraction)"
      };
    }
  };

  const analysis = useMemo(() => 
    analyzeLoveState(activeStage.levels.dopamine, activeStage.levels.oxytocin, activeStage.levels.serotonin),
    [activeStage]
  );

  // Data for the Transition Line Chart
  const transitionData = STAGES.map(s => ({
    name: s.title,
    Dopamine: s.levels.dopamine,
    Oxytocin: s.levels.oxytocin,
    Serotonin: s.levels.serotonin,
    Testosterone: s.levels.testosterone,
    Cortisol: s.levels.cortisol
  }));

  // Radar data for the current stage
  const radarData = useMemo(() => [
    { subject: 'Passion', A: activeStage.levels.testosterone },
    { subject: 'Obsession', A: 100 - activeStage.levels.serotonin },
    { subject: 'Bonding', A: activeStage.levels.oxytocin },
    { subject: 'Euphoria', A: activeStage.levels.dopamine },
    { subject: 'Stress', A: activeStage.levels.cortisol },
  ], [activeStage]);

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="py-12 text-center">
        <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent uppercase tracking-tighter">
          Neuro-Chemistry of Love
        </h1>
        <p className="text-slate-400 text-lg md:text-xl font-thai font-light max-w-2xl mx-auto">
          พฤติกรรมการเลือกคู่และความสัมพันธ์ของมนุษย์ผ่านมุมมองทางชีววิทยาและสารเคมีในสมอง
        </p>
      </header>

      {/* Main Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation & Stage Details */}
        <section className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap gap-2 p-1 bg-slate-900/80 rounded-2xl border border-slate-800">
            {STAGES.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl font-bold transition-all text-sm ${
                  activeStageId === stage.id 
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {stage.title}
              </button>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
            {/* Status Analysis Badge */}
            <div className="mb-6 p-4 bg-slate-800/50 rounded-2xl border border-pink-500/20 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500 shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <div>
                <p className="text-xs font-mono uppercase text-slate-500 tracking-tighter">Biological Analysis Engine</p>
                <h4 className="text-pink-400 font-bold font-thai">{analysis.status}</h4>
                <p className="text-slate-400 text-sm font-thai">{analysis.desc}</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              {activeStage.title}
              <span className="text-slate-600 font-light">|</span>
              <span className="text-pink-500 font-thai text-xl">{activeStage.titleThai}</span>
            </h2>
            <p className="text-slate-300 text-lg mb-8 italic">
              {activeStage.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {activeStage.chemicals.map(chemKey => (
                <ChemicalCard key={chemKey} chemical={CHEMICALS[chemKey]} />
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest border-b border-slate-800 pb-2">Key Biological Facts</h3>
              <ul className="space-y-3 font-thai">
                {activeStage.keyFacts.map((fact, idx) => (
                  <li key={idx} className="flex gap-3 items-start text-slate-200">
                    <span className="text-pink-500 mt-1">✦</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Visualizers */}
        <aside className="lg:col-span-5 space-y-6">
          {/* Brain Map */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">Neural Activity Map</h3>
            <BrainVisualizer activeRegions={activeStage.brainRegions} />
          </div>

          {/* Psychology Profile Radar */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl h-[350px]">
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">Current Intensity Radar</h3>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Radar
                    name="Intensity"
                    dataKey="A"
                    stroke="#ec4899"
                    fill="#ec4899"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </aside>

        {/* Transition Analysis */}
        <section className="lg:col-span-12">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Neuro-Chemical Transitions</h3>
              <p className="text-slate-400 text-sm font-thai">วิวัฒนาการของการเปลี่ยนแปลงสารสื่อประสาทในแต่ละช่วงเวลาของความสัมพันธ์</p>
            </div>
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transitionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Line type="monotone" dataKey="Dopamine" stroke="#eab308" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="Oxytocin" stroke="#a855f7" strokeWidth={3} dot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Serotonin" stroke="#22c55e" strokeWidth={3} dot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Testosterone" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Cortisol" stroke="#f87171" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-slate-500 mt-6 italic font-thai tracking-tight">
              * กราฟแสดงแนวโน้มความเข้มข้นของสารเคมี (%) อ้างอิงตามแบบจำลองชีววิทยาพฤติกรรม (2026 Neuro-Model)
            </p>
          </div>
        </section>

        {/* Digital Twin Simulation Section */}
        <section className="lg:col-span-12">
          <DigitalTwinSimulation />
        </section>

        {/* Gender Differences Section */}
        <section className="lg:col-span-12 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {GENDER_DIFFS.map((diff) => (
              <div key={diff.gender} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl hover:border-slate-700 transition-all group">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 rounded-2xl ${diff.gender === 'male' ? 'bg-blue-500/10 text-blue-500' : 'bg-pink-500/10 text-pink-500'}`}>
                    {diff.gender === 'male' ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM16.5 7.5 21 3m0 0h-4m4 0v4"/></svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 0v7m-3-3h6"/></svg>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold">{diff.title}</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-xs uppercase text-slate-500 font-bold block mb-1">Primary Focus</span>
                    <p className="text-slate-200 font-thai text-lg">{diff.focus}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-slate-500 font-bold block mb-1">Brain Activity</span>
                    <p className="text-slate-400 text-sm leading-relaxed">{diff.brainActivity}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-slate-500 font-bold block mb-1">Evolutionary Driver</span>
                    <p className="text-slate-400 text-sm leading-relaxed italic">"{diff.evolutionaryReasoning}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Section */}
        <section className="lg:col-span-12">
          <AiExplorer />
        </section>
      </main>

      <footer className="mt-20 text-center text-slate-500 text-sm font-thai border-t border-slate-800 pt-8">
        <p>© 2025 The Neural Lab - Exploration of the Human Heart through the Brain's Chemistry</p>
        <p className="mt-2 opacity-50">Reference: Biological Factors in Human Mate Selection Studies (Incorporating 2026 Predictive Models)</p>
      </footer>
    </div>
  );
};

export default App;

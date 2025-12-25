import React, { useState, useEffect, useCallback } from 'react';
import { runCognitionCycle } from './services/gemini';
import { sealThought } from './services/crypto';
import ManifoldVisualizer from './components/ManifoldVisualizer';
import TerminalChat from './components/TerminalChat';
import CryptographicChain from './components/CryptographicChain';

export default () => {
  const [report, setReport] = useState<any>(null);
  const [stress, setStress] = useState(0.15);

  const sync = useCallback(async () => {
    const res = await runCognitionCycle({ scan: "market_resonance" });
    const sealed = await Promise.all(res.thoughts.map(t => sealThought(t.content, t.reasoning, t.modality)));
    setReport({ ...res, thoughts: sealed });
    setStress(res.state.instabilityProbability);
  }, []);

  useEffect(() => { sync(); }, [sync]);

  return (
    <div className="min-h-screen p-10 flex flex-col gap-8 bg-[#05070a]">
      <header className="flex justify-between items-center border-b border-white/10 pb-8">
        <h1 className="text-4xl font-black text-white tracking-tighter">ABYTHRAL <span className="text-emerald-500">AFCE</span></h1>
        <button onClick={sync} className="px-8 py-3 bg-white text-black font-bold uppercase rounded-xl">Sync Substrate</button>
      </header>
      <main className="grid grid-cols-12 gap-8 flex-grow">
        <div className="col-span-8 flex flex-col gap-8">
          <div className="h-[400px] glass-panel panel-command rounded-3xl overflow-hidden"><TerminalChat onStressUpdate={setStress} /></div>
          <div className="flex-grow glass-panel panel-spatial rounded-3xl overflow-hidden"><ManifoldVisualizer stress={stress} /></div>
        </div>
        <div className="col-span-4 glass-panel panel-vault rounded-3xl p-8 overflow-y-auto"><CryptographicChain thoughts={report?.thoughts || []} /></div>
      </main>
    </div>
  );
};

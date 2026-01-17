
import React from 'react';
import { ChemicalInfo } from '../types';

interface Props {
  chemical: ChemicalInfo;
}

const ChemicalCard: React.FC<Props> = ({ chemical }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-4 rounded-xl hover:border-pink-500/50 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-3 h-3 rounded-full ${chemical.color} shadow-[0_0_10px_rgba(255,255,255,0.3)]`}></div>
        <h3 className="font-bold text-lg text-white">{chemical.name}</h3>
      </div>
      <p className="text-pink-400 text-sm font-semibold mb-2 font-thai">{chemical.nameThai}</p>
      <div className="text-xs font-mono uppercase text-slate-400 mb-2 tracking-wider">
        Primary Role: {chemical.role}
      </div>
      <p className="text-slate-300 text-sm leading-relaxed italic">
        "{chemical.description}"
      </p>
    </div>
  );
};

export default ChemicalCard;

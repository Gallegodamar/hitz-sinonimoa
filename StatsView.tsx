
import React from 'react';

interface StatsViewProps {
  score: number;
  total: number;
}

const StatsView: React.FC<StatsViewProps> = ({ score, total }) => {
  const percentage = total === 0 ? 0 : Math.round((score / total) * 100);

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-900">Zure aurrerapena</h2>
        <p className="text-slate-500">Gaur ikasitakoaren laburpena</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
          <div className="text-4xl font-black text-indigo-600 mb-1">{total}</div>
          <div className="text-slate-500 text-xs font-bold uppercase">Saiakerak</div>
        </div>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
          <div className="text-4xl font-black text-green-600 mb-1">{score}</div>
          <div className="text-slate-500 text-xs font-bold uppercase">Asmatutakoak</div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
          <div className="text-4xl font-black text-amber-500 mb-1">{percentage}%</div>
          <div className="text-slate-500 text-xs font-bold uppercase">Eraginkortasuna</div>
        </div>
      </div>

      <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <h3 className="text-2xl font-bold">Jarraitu horrela!</h3>
          <p className="text-indigo-100 max-w-md">
            Hiztegia handitzea ezinbestekoa da hizkuntza baten jabe egiteko. Sinonimoak ezagutzeak zure euskara aberatsagoa egingo du.
          </p>
          <div className="flex space-x-2 pt-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${i < Math.floor(percentage / 20) ? 'bg-white' : 'bg-indigo-400 opacity-50'}`}></div>
            ))}
          </div>
        </div>
        <i className="fas fa-medal absolute -bottom-4 -right-4 text-9xl text-indigo-500 opacity-30 transform rotate-12"></i>
      </div>
    </div>
  );
};

export default StatsView;

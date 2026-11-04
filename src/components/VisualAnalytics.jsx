import React from 'react';
import { BarChart3, Clock, AlertTriangle, ArrowRight, CheckCircle, Zap } from 'lucide-react';
import { formatMinutes } from '../utils/calculator';

export default function VisualAnalytics({ results }) {
  const { winding, moulding, taping, braiding, finishing, totals } = results;

  const stages = [
    {
      name: 'Winding',
      time: winding.totalTime,
      setup: winding.setupTime,
      run: winding.processTime,
      labour: winding.labourHours,
      color: 'bg-blue-500',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/30'
    },
    {
      name: 'Moulding',
      time: moulding.leadTime,
      setup: 0,
      run: moulding.leadTime,
      labour: moulding.labourHours,
      color: 'bg-violet-500',
      textColor: 'text-violet-400',
      borderColor: 'border-violet-500/30'
    },
    ...(taping.enabled ? [{
      name: 'Taping',
      time: taping.totalTime,
      setup: taping.setupTime,
      run: taping.processTime,
      labour: taping.labourHours,
      color: 'bg-cyan-500',
      textColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/30'
    }] : []),
    ...(braiding.enabled ? [{
      name: 'Braiding',
      time: braiding.totalTime,
      setup: braiding.setupTime,
      run: braiding.processTime,
      labour: braiding.labourHours,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30'
    }] : []),
    ...(finishing.enabled && finishing.totalTime > 0 ? [{
      name: 'Finishing',
      time: finishing.totalTime,
      setup: 0,
      run: finishing.totalTime,
      labour: finishing.labourHours,
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/30'
    }] : [])
  ];

  // Identify Bottleneck stage (highest lead time)
  const bottleneck = stages.reduce((max, s) => s.time > max.time ? s : max, stages[0] || { name: 'None', time: 0 });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      
      {/* Title & Bottleneck Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            Production Routing Flow & Bottleneck Analysis
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Sequential shop-floor timeline and machine cycle allocation
          </p>
        </div>

        {bottleneck && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium self-start sm:self-auto">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Critical Path Bottleneck: <strong>{bottleneck.name}</strong> ({formatMinutes(bottleneck.time)})</span>
          </div>
        )}
      </div>

      {/* Production Sequence Pipeline (Gantt-style representation) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Sequential Process Chain</span>
          <span>Lead Time Accumulation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {stages.map((stage, idx) => {
            const pct = totals.grandTotalMinutes > 0 ? ((stage.time / totals.grandTotalMinutes) * 100).toFixed(1) : 0;
            return (
              <div 
                key={stage.name}
                className="bg-slate-950/70 rounded-xl p-3 border border-slate-800 relative hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-600" />
                      Step {idx + 1}: {stage.name}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">{pct}%</span>
                  </div>

                  <div className="text-lg font-bold font-mono text-white mb-2">
                    {formatMinutes(stage.time)}
                  </div>

                  {/* Setup vs Run Bar */}
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex mb-2">
                    {stage.setup > 0 && (
                      <div 
                        style={{ width: `${(stage.setup / stage.time) * 100}%` }} 
                        className="bg-amber-500 h-full" 
                        title={`Setup: ${stage.setup}m`}
                      />
                    )}
                    <div 
                      style={{ width: `${(stage.run / stage.time) * 100}%` }} 
                      className="bg-emerald-500 h-full" 
                      title={`Run: ${stage.run.toFixed(1)}m`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-1.5 mt-1 font-mono">
                  <span>Setup: {stage.setup}m</span>
                  <span>Run: {stage.run.toFixed(0)}m</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparative Process Bar Chart */}
      <div className="space-y-3 pt-2">
        <div className="text-xs font-semibold text-slate-300">
          Comparative Duration by Stage
        </div>
        <div className="space-y-2.5">
          {stages.map((st) => {
            const pct = totals.grandTotalMinutes > 0 ? (st.time / totals.grandTotalMinutes) * 100 : 0;
            return (
              <div key={st.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${st.color}`} />
                    {st.name}
                  </span>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-slate-400">{st.time.toFixed(1)} min</span>
                    <span className="text-slate-200 font-bold">({pct.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    style={{ width: `${pct}%` }} 
                    className={`h-full ${st.color} transition-all duration-500 rounded-full`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}


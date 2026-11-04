import React from 'react';
import { Clock, Wrench, PlayCircle, Users, Calendar, ArrowRight } from 'lucide-react';

export default function SummaryCards({ results, shiftHours = 8, setShiftHours }) {
  const { totals, winding, moulding, taping, braiding, finishing } = results;

  // Percentage shares of total time
  const windingPct = totals.grandTotalMinutes > 0 ? (winding.totalTime / totals.grandTotalMinutes) * 100 : 0;
  const mouldingPct = totals.grandTotalMinutes > 0 ? (moulding.leadTime / totals.grandTotalMinutes) * 100 : 0;
  const tapingPct = totals.grandTotalMinutes > 0 ? (taping.totalTime / totals.grandTotalMinutes) * 100 : 0;
  const braidingPct = totals.grandTotalMinutes > 0 ? (braiding.totalTime / totals.grandTotalMinutes) * 100 : 0;
  const finishingPct = totals.grandTotalMinutes > 0 ? (finishing.totalTime / totals.grandTotalMinutes) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* 4 Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Grand Total Lead Time */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/40 via-slate-900 to-slate-900/90 border border-blue-500/30 p-5 shadow-xl shadow-blue-950/40">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Total Lead Time
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
              {totals.grandTotalMinutes.toFixed(1)} mins
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
            {totals.formattedTime}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Decimal Lead Time:</span>
            <span className="font-mono text-slate-200 font-semibold">{totals.grandTotalHours.toFixed(2)} hrs</span>
          </div>
        </div>

        {/* 2. Total Setup Time */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-900/30 via-slate-900 to-slate-900/90 border border-amber-500/30 p-5 shadow-xl shadow-amber-950/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Wrench className="w-4 h-4" /> Setup & Preparation
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
              {totals.setupPercent}% of total
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
            {totals.formattedSetupTime}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Fixed Setups:</span>
            <span className="font-mono text-amber-300 font-medium">{totals.totalSetupTime} mins</span>
          </div>
        </div>

        {/* 3. Total Process / Run Time */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/30 via-slate-900 to-slate-900/90 border border-emerald-500/30 p-5 shadow-xl shadow-emerald-950/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <PlayCircle className="w-4 h-4" /> Running Process Time
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
              {totals.processPercent}% of total
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
            {totals.formattedProcessTime}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Machine Run Time:</span>
            <span className="font-mono text-emerald-300 font-medium">{totals.totalProcessTime.toFixed(1)} mins</span>
          </div>
        </div>

        {/* 4. Labour Hours & Shifts Required */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/30 via-slate-900 to-slate-900/90 border border-purple-500/30 p-5 shadow-xl shadow-purple-950/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Users className="w-4 h-4" /> Labour Estimate
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400">Shift:</span>
              <select 
                value={shiftHours} 
                onChange={(e) => setShiftHours(Number(e.target.value))}
                className="bg-slate-800 text-[10px] text-purple-300 rounded px-1.5 py-0.5 border border-purple-500/30 outline-none"
              >
                <option value={8}>8h</option>
                <option value={10}>10h</option>
                <option value={12}>12h</option>
              </select>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
            {totals.totalLabourHours.toFixed(1)} <span className="text-base font-normal text-purple-300">hrs</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Work Shifts ({shiftHours}h):</span>
            <span className="font-mono text-purple-300 font-semibold">{totals.productionShifts} shifts</span>
          </div>
        </div>

      </div>

      {/* Process Distribution Timeline Progress Bar */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3.5 shadow-sm">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-slate-300 flex items-center gap-2">
            <span>Manufacturing Flow Composition</span>
            <span className="text-[10px] font-normal text-slate-500">(Proportion of lead time spent per process)</span>
          </span>
          <span className="text-slate-400 font-mono text-[11px]">100% = {totals.formattedTime}</span>
        </div>

        {/* Stacked bar */}
        <div className="h-3.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
          {windingPct > 0 && (
            <div 
              style={{ width: `${windingPct}%` }} 
              className="bg-blue-500 h-full transition-all duration-300 hover:opacity-90"
              title={`Winding: ${winding.totalTime.toFixed(1)} min (${windingPct.toFixed(1)}%)`}
            />
          )}
          {mouldingPct > 0 && (
            <div 
              style={{ width: `${mouldingPct}%` }} 
              className="bg-violet-500 h-full transition-all duration-300 hover:opacity-90"
              title={`Moulding: ${moulding.leadTime.toFixed(1)} min (${mouldingPct.toFixed(1)}%)`}
            />
          )}
          {tapingPct > 0 && (
            <div 
              style={{ width: `${tapingPct}%` }} 
              className="bg-cyan-500 h-full transition-all duration-300 hover:opacity-90"
              title={`Taping: ${taping.totalTime.toFixed(1)} min (${tapingPct.toFixed(1)}%)`}
            />
          )}
          {braidingPct > 0 && (
            <div 
              style={{ width: `${braidingPct}%` }} 
              className="bg-emerald-500 h-full transition-all duration-300 hover:opacity-90"
              title={`Braiding: ${braiding.totalTime.toFixed(1)} min (${braidingPct.toFixed(1)}%)`}
            />
          )}
          {finishingPct > 0 && (
            <div 
              style={{ width: `${finishingPct}%` }} 
              className="bg-amber-500 h-full transition-all duration-300 hover:opacity-90"
              title={`Finishing: ${finishing.totalTime.toFixed(1)} min (${finishingPct.toFixed(1)}%)`}
            />
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-2.5 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Winding: <strong className="text-white font-mono">{winding.totalTime.toFixed(0)}m</strong> ({windingPct.toFixed(0)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
            <span>Moulding: <strong className="text-white font-mono">{moulding.leadTime.toFixed(0)}m</strong> ({mouldingPct.toFixed(0)}%)</span>
          </div>
          {taping.enabled && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span>Taping: <strong className="text-white font-mono">{taping.totalTime.toFixed(0)}m</strong> ({tapingPct.toFixed(0)}%)</span>
            </div>
          )}
          {braiding.enabled && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Braiding: <strong className="text-white font-mono">{braiding.totalTime.toFixed(0)}m</strong> ({braidingPct.toFixed(0)}%)</span>
            </div>
          )}
          {finishing.enabled && finishing.totalTime > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Finishing: <strong className="text-white font-mono">{finishing.totalTime.toFixed(0)}m</strong> ({finishingPct.toFixed(0)}%)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


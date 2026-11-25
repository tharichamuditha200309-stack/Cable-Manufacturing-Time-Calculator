import React, { useState } from 'react';
import { 
  Clock, 
  Wrench, 
  PlayCircle, 
  Users, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  Plus, 
  Equal,
  BookmarkPlus,
  History,
  ArrowRight
} from 'lucide-react';
import { formatMinutes } from '../utils/calculator.js';

export default function OverallSummaryPanel({
  results,
  cableName,
  shiftHours = 8,
  setShiftHours,
  onOpenTicketModal,
  onExportData,
  onSaveToHistory,
  onOpenHistoryModal,
  historyCount = 0
}) {
  const [copied, setCopied] = useState(false);
  const [savedToHistory, setSavedToHistory] = useState(false);
  const { totals, winding, moulding, taping, braiding, tapingAndBraiding, finishing, customTables, inputs } = results;

  // Process item values for summation
  const processes = [
    {
      id: 'winding',
      name: 'Winding Time',
      time: winding.totalTime,
      hours: winding.totalHours ?? (winding.totalTime / 60),
      active: true,
      color: 'text-blue-600',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      formula: `${winding.setupTime}m setup + (${winding.ratePerMeterPerRound} × ${inputs.length}m × ${inputs.rounds}r${winding.multiplier > 1 ? ` × ${winding.multiplier}` : ''})`
    },
    {
      id: 'moulding',
      name: 'Moulding Time',
      time: moulding.leadTime,
      hours: moulding.totalHours ?? (moulding.leadTime / 60),
      active: moulding.fittingType !== 'None',
      color: 'text-violet-600',
      badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
      formula: moulding.fittingType === 'None' ? 'No moulding' : `${moulding.fittingType} ${moulding.fittingSize} (${moulding.endsCount} end${moulding.endsCount > 1 ? 's' : ''})`
    },
    {
      id: 'taping_and_braiding',
      name: 'Taping and Braiding Total',
      subtopic: 'Taping and Braiding',
      time: (tapingAndBraiding?.totalTime) ?? (taping.totalTime + braiding.totalTime),
      hours: (tapingAndBraiding?.totalHours) ?? ((taping.totalTime + braiding.totalTime) / 60),
      active: taping.enabled || braiding.enabled,
      color: 'text-emerald-700',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      formula: `Taping: ${taping.enabled ? `${taping.totalTime.toFixed(1)}m (${(taping.totalTime / 60).toFixed(2)}h)` : '0m'} + Braiding: ${braiding.enabled ? `${braiding.totalTime.toFixed(1)}m (${(braiding.totalTime / 60).toFixed(2)}h)` : '0m'}`
    },
    ...(finishing?.enabled && finishing.totalTime > 0 ? [{
      id: 'finishing',
      name: 'Finishing Operations',
      time: finishing.totalTime,
      hours: finishing.totalHours ?? (finishing.totalTime / 60),
      active: true,
      color: 'text-amber-600',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      formula: `${finishing.items.length} operation(s) auto-calculated`
    }] : []),
    ...(customTables?.enabled && customTables.totalTime > 0 ? [{
      id: 'customTables',
      name: 'Custom Process Tables',
      time: customTables.totalTime,
      hours: customTables.totalHours ?? (customTables.totalTime / 60),
      active: true,
      color: 'text-indigo-600',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      formula: `${customTables.items.length} operation(s)`
    }] : [])
  ];

  const handleCopySummary = () => {
    const tapingBraidingTime = (tapingAndBraiding?.totalTime) ?? (taping.totalTime + braiding.totalTime);
    const tapingBraidingHrs = (tapingAndBraiding?.totalHours) ?? (tapingBraidingTime / 60);

    const text = `Cable Manufacturing Overall Time Summary:
Item: ${cableName} (${inputs.cableType || 'Standard'})
Length: ${inputs.length}m | Rounds: ${inputs.rounds} | Post-Tape Dia: ${inputs.postTapingDiameter}mm | Outer Dia: ${inputs.finalOuterDiameter?.toFixed(1) ?? inputs.cableOD}mm | Fitting: ${inputs.fittingType} ${inputs.fittingSize}
----------------------------------------
Winding Time:          ${winding.totalTime.toFixed(1)} mins (${(winding.totalTime / 60).toFixed(2)} hrs)
Moulding Time:         ${moulding.leadTime.toFixed(1)} mins (${(moulding.leadTime / 60).toFixed(2)} hrs)
Taping and Braiding:   ${tapingBraidingTime.toFixed(1)} mins (${tapingBraidingHrs.toFixed(2)} hrs)
  - Taping Portion:    ${taping.enabled ? taping.totalTime.toFixed(1) : '0'} mins (${(taping.totalTime / 60).toFixed(2)} hrs)
  - Braiding Portion:  ${braiding.enabled ? braiding.totalTime.toFixed(1) : '0'} mins (${(braiding.totalTime / 60).toFixed(2)} hrs)
${finishing?.enabled ? `Finishing Time:        ${finishing.totalTime.toFixed(1)} mins (${(finishing.totalTime / 60).toFixed(2)} hrs)\n` : ''}----------------------------------------
OVERALL TOTAL TIME:    ${totals.grandTotalMinutes.toFixed(1)} mins (${totals.grandTotalHours.toFixed(2)} hrs)
Setup Time:            ${totals.totalSetupTime} mins (${(totals.totalSetupTime / 60).toFixed(2)} hrs)
Run Time:              ${totals.totalProcessTime.toFixed(1)} mins (${(totals.totalProcessTime / 60).toFixed(2)} hrs)
Labour Hours:          ${totals.totalLabourHours.toFixed(1)} hrs (~${totals.productionShifts} shifts)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveClick = () => {
    onSaveToHistory();
    setSavedToHistory(true);
    setTimeout(() => setSavedToHistory(false), 2000);
  };

  return (
    <div className="bg-[#939da4] border border-[#768087] rounded-2xl p-6 shadow-md space-y-6 sticky top-20">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#768087]/80">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700 flex items-center gap-1.5 font-heading">
            <Clock className="w-4 h-4 text-blue-700" /> Manufacturing Lead Time
          </span>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight mt-0.5 font-heading">
            Overall Cable Time
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenHistoryModal}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-slate-700 border border-blue-200 transition-colors shadow-2xs font-sans"
            title="View process history"
          >
            <History className="w-3.5 h-3.5 text-blue-600" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-medium font-sans">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* BIG NUMBER DISPLAY CARD */}
      <div className="bg-[#f8faff] rounded-2xl p-6 border-2 border-blue-200 shadow-2xs text-center relative overflow-hidden">
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1 font-sans">
          Total Calculated Manufacturing Time
        </div>
        
        {/* HUGE Number Display (Poppins SemiBold / Inter Medium) - Primary Decimal Hours */}
        <div className="text-5xl sm:text-6xl font-semibold text-slate-900 tracking-tight font-heading py-1">
          {totals.grandTotalHours.toFixed(2)} hrs
        </div>

        {/* Big Total Minutes badge */}
        <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white shadow-xs">
          <span className="text-base font-semibold font-sans tracking-tight">
            {totals.grandTotalMinutes.toFixed(1)} Total Minutes
          </span>
          <span className="text-xs font-medium text-blue-100 font-sans">
            ({Math.floor(totals.grandTotalMinutes / 60)}h {Math.round(totals.grandTotalMinutes % 60)}m)
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-around text-xs text-slate-600 font-sans font-medium">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-normal">Decimal Hours</span>
            <span className="font-semibold text-slate-800 text-sm">{totals.grandTotalHours.toFixed(2)} hrs</span>
          </div>
          <div className="h-6 w-px bg-blue-200" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-normal">Est. Labour</span>
            <span className="font-semibold text-slate-800 text-sm">{totals.totalLabourHours.toFixed(1)} hrs</span>
          </div>
          <div className="h-6 w-px bg-blue-200" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-normal">Work Shifts</span>
            <span className="font-semibold text-blue-700 text-sm">{totals.productionShifts} shifts</span>
          </div>
        </div>
      </div>

      {/* SUMMATION OF EACH PROCESS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 font-heading">
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            Summation of Process Times
          </span>
          <span className="text-[11px] text-slate-700 font-sans font-medium">
            Winding + Moulding + Taping & Braiding + Finishing
          </span>
        </div>

        {/* Math summation list */}
        <div className="bg-[#f8faff] rounded-xl p-4 border border-blue-100 shadow-2xs space-y-2.5">
          {processes.map((proc, index) => {
            const pct = totals.grandTotalMinutes > 0 ? ((proc.time / totals.grandTotalMinutes) * 100).toFixed(0) : 0;
            return (
              <div 
                key={proc.id} 
                className={`flex items-center justify-between text-xs py-2 px-2.5 rounded-lg transition-all ${
                  proc.active ? 'bg-white border border-slate-200 shadow-2xs' : 'opacity-40 line-through'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-sans text-xs w-4 font-normal">
                    {index === 0 ? '' : '+'}
                  </span>
                  <div>
                    <span className="font-medium text-slate-800 font-sans">{proc.name}</span>
                    <span className="text-[10px] text-slate-500 block font-sans font-normal">{proc.formula}</span>
                  </div>
                </div>

                <div className="text-right font-sans">
                  <div className="text-sm font-semibold text-slate-900">
                    {proc.active ? `${proc.time.toFixed(1)} min` : '0 min'}
                    <span className="text-xs font-bold text-blue-700 ml-1.5">
                      ({proc.active ? `${proc.hours.toFixed(2)} hrs` : '0.00 hrs'})
                    </span>
                  </div>
                  {proc.active && (
                    <span className="text-[10px] text-slate-400 block font-normal">
                      ({pct}%)
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Summation line & Result */}
          <div className="pt-2 border-t border-blue-200 flex items-center justify-between font-sans bg-blue-100/60 p-2.5 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Equal className="w-4 h-4 text-blue-600 font-semibold" />
              <span className="font-semibold text-slate-900 text-sm uppercase">
                Overall Total:
              </span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-blue-800">
                {totals.grandTotalMinutes.toFixed(1)} <span className="text-xs font-medium text-slate-600">min</span>
                <span className="text-base font-extrabold text-blue-900 ml-2">
                  ({totals.grandTotalHours.toFixed(2)} hrs)
                </span>
              </span>
              <span className="text-[11px] text-slate-600 font-medium block">
                = {Math.floor(totals.grandTotalMinutes / 60)}h {Math.round(totals.grandTotalMinutes % 60)}m | Work Shifts: {totals.productionShifts} shifts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Setup Allowance vs Machine Run Time */}
      <div className="grid grid-cols-2 gap-3 text-xs font-sans">
        <div className="bg-[#f8faff] border border-blue-100 rounded-xl p-3 shadow-2xs">
          <div className="text-slate-500 font-medium flex items-center gap-1.5 mb-1 text-[11px]">
            <Wrench className="w-3.5 h-3.5 text-amber-500" />
            Total Setup Time
          </div>
          <div className="text-xl font-semibold text-slate-900">
            {totals.formattedSetupTime}
          </div>
          <div className="text-[10px] text-slate-500 font-normal">
            {totals.totalSetupTime} min ({totals.setupPercent}%)
          </div>
        </div>

        <div className="bg-[#f8faff] border border-blue-100 rounded-xl p-3 shadow-2xs">
          <div className="text-slate-500 font-medium flex items-center gap-1.5 mb-1 text-[11px]">
            <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
            Machine Run Time
          </div>
          <div className="text-xl font-semibold text-slate-900">
            {totals.formattedProcessTime}
          </div>
          <div className="text-[10px] text-slate-500 font-normal">
            {totals.totalProcessTime.toFixed(1)} min ({totals.processPercent}%)
          </div>
        </div>
      </div>

      {/* Actions: Save to History, Copy Summary, Job Ticket, Export */}
      <div className="space-y-2 pt-2 border-t border-slate-300 font-sans">
        
        {/* Save to History Button */}
        <button
          type="button"
          onClick={handleSaveClick}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all active:scale-[0.99]"
        >
          {savedToHistory ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Saved to Process History!</span>
            </>
          ) : (
            <>
              <BookmarkPlus className="w-4 h-4" />
              <span>Save Calculation to Process History</span>
            </>
          )}
        </button>

        {/* Copy button */}
        <button
          type="button"
          onClick={handleCopySummary}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all active:scale-[0.99]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Overall Time Summary</span>
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onOpenTicketModal}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium bg-white hover:bg-blue-50 text-slate-800 border border-slate-200 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Job Ticket</span>
          </button>

          <button
            type="button"
            onClick={onExportData}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium bg-white hover:bg-blue-50 text-slate-800 border border-slate-200 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

    </div>
  );
}

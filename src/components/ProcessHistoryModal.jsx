import React from 'react';
import { 
  History, 
  Trash2, 
  RotateCcw, 
  X, 
  Download, 
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle,
  ExternalLink,
  Plus
} from 'lucide-react';
import { formatMinutes } from '../utils/calculator.js';

export default function ProcessHistoryModal({
  isOpen,
  onClose,
  history,
  onDeleteHistoryItem,
  onClearAllHistory,
  onLoadHistoryItem
}) {
  if (!isOpen) return null;

  const handleExportHistoryCSV = () => {
    if (history.length === 0) return;

    const headers = [
      'Timestamp',
      'Job/Cable Name',
      'Length (m)',
      'Rounds',
      'Fitting Type',
      'Fitting Size',
      'Braiding Layers',
      'Winding Time (min)',
      'Moulding Time (min)',
      'Taping Time (min)',
      'Braiding Time (min)',
      'OVERALL TIME (min)',
      'Formatted Overall Time'
    ];

    const rows = history.map(item => [
      `"${item.timestamp}"`,
      `"${item.cableName}"`,
      item.inputs.length,
      item.inputs.rounds,
      `"${item.inputs.fittingType}"`,
      `"${item.inputs.fittingSize}"`,
      item.inputs.braidingLayersCount,
      item.breakdown.windingTime.toFixed(1),
      item.breakdown.mouldingTime.toFixed(1),
      item.breakdown.tapingTime.toFixed(1),
      item.breakdown.braidingTime.toFixed(1),
      item.overallMinutes.toFixed(1),
      `"${item.formattedTime}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Cable_Manufacturing_Process_History_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700 border border-blue-200">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-900 font-heading">
                  Process History & Calculation Log
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium font-sans">
                  {history.length} {history.length === 1 ? 'record' : 'records'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans font-normal">
                Review completed cable process calculations, load previous specs, or remove entries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleExportHistoryCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors shadow-2xs"
                  title="Export all history to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  onClick={onClearAllHistory}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-red-50 text-red-600 border border-red-200 transition-colors shadow-2xs"
                  title="Clear all saved history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {history.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center border border-slate-200">
                <History className="w-7 h-7" />
              </div>
              <div className="text-sm font-bold text-slate-700">No Process History Recorded Yet</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Whenever you configure a cable calculation, click <strong>"Save to Process History"</strong> on the right panel to store and track it here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 hover:bg-slate-50/90 border border-slate-200 rounded-xl p-4 transition-all shadow-2xs space-y-3"
                >
                  {/* Top Bar of Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-extrabold text-sm text-slate-900">
                        {item.cableName}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {item.timestamp}
                      </span>
                    </div>

                    {/* BIG OVERALL TIME BADGE */}
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Overall Time</div>
                        <div className="text-lg font-black text-blue-600 font-mono leading-tight">
                          {item.formattedTime}
                        </div>
                      </div>
                      <div className="text-xs font-mono font-bold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-lg border border-blue-200">
                        {item.overallMinutes.toFixed(1)}m
                      </div>
                    </div>
                  </div>

                  {/* Specifications & Process Summation Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs items-center">
                    
                    {/* Cable Specs (Span 5) */}
                    <div className="md:col-span-5 bg-white p-2.5 rounded-lg border border-slate-200 space-y-1 font-mono text-[11px]">
                      <div className="text-slate-400 text-[10px] uppercase font-bold font-sans">Cable Specifications</div>
                      <div className="text-slate-800">
                        Length: <strong className="text-slate-900">{item.inputs.length}m</strong> ({(item.inputs.length * 1000).toLocaleString()}mm)
                      </div>
                      <div className="text-slate-800">
                        Rounds: <strong className="text-slate-900">{item.inputs.rounds} rnds</strong>
                      </div>
                      <div className="text-slate-800">
                        Fitting: <strong className="text-slate-900">{item.inputs.fittingType} ({item.inputs.fittingSize})</strong>
                      </div>
                      <div className="text-slate-800">
                        Braiding: <strong className="text-slate-900">{item.inputs.braidingLayersCount} Layer(s)</strong>
                      </div>
                    </div>

                    {/* Summation of Processes (Span 5) */}
                    <div className="md:col-span-5 bg-white p-2.5 rounded-lg border border-slate-200 space-y-1 font-mono text-[11px]">
                      <div className="text-slate-400 text-[10px] uppercase font-bold font-sans">Process Times Summation</div>
                      <div className="flex justify-between text-slate-700">
                        <span>Winding:</span>
                        <strong className="text-slate-900">{item.breakdown.windingTime.toFixed(1)} min</strong>
                      </div>
                      <div className="flex justify-between text-slate-700">
                        <span>Moulding:</span>
                        <strong className="text-slate-900">{item.breakdown.mouldingTime.toFixed(1)} min</strong>
                      </div>
                      <div className="flex justify-between text-slate-700">
                        <span>Taping:</span>
                        <strong className="text-slate-900">{item.breakdown.tapingTime.toFixed(1)} min</strong>
                      </div>
                      <div className="flex justify-between text-slate-700">
                        <span>Braiding:</span>
                        <strong className="text-slate-900">{item.breakdown.braidingTime.toFixed(1)} min</strong>
                      </div>
                    </div>

                    {/* Action buttons (Span 2) */}
                    <div className="md:col-span-2 flex flex-row md:flex-col gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => onLoadHistoryItem(item)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-colors"
                        title="Load these parameters into the calculator"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Load</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteHistoryItem(item.id)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 transition-colors"
                        title="Delete this history entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Processes are saved locally in your browser session.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}


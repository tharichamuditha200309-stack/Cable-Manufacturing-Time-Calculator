import React from 'react';
import { 
  RotateCcw, 
  Table, 
  Printer, 
  Sparkles, 
  Download, 
  Layers,
  Clock,
  History
} from 'lucide-react';

export default function Header({ 
  cableName, 
  setCableName, 
  onLoadPreset, 
  onReset, 
  onOpenDataModal, 
  onOpenTicketModal,
  onOpenHistoryModal,
  historyCount = 0,
  onExportData,
  totalTimeFormatted
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Cable Title */}
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-xl bg-blue-600 p-0.5 shadow-sm shadow-blue-500/20 flex items-center justify-center">
              <div className="h-full w-full bg-blue-600 rounded-[10px] flex items-center justify-center">
                <Layers className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                  CableCalc <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">PRO</span>
                </h1>
                <span className="text-xs text-slate-500 hidden sm:inline">| Overall Manufacturing Time Calculator</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <input 
                  type="text" 
                  value={cableName}
                  onChange={(e) => setCableName(e.target.value)}
                  placeholder="Enter Job / Cable Reference..."
                  className="text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-300 focus:border-blue-500 rounded px-2.5 py-1 text-slate-800 placeholder-slate-400 outline-none w-60 transition-colors font-mono font-medium shadow-2xs"
                  title="Click to edit Job or Cable Part Reference"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Presets dropdown */}
            <div className="relative group">
              <button 
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 transition-all shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Presets</span>
              </button>
              <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 hidden group-hover:block hover:block z-50">
                <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">Load Cable Specification</div>
                <button 
                  onClick={() => onLoadPreset('standard-15m')}
                  className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
                >
                  <div className="font-semibold text-slate-900">Standard 15m Cable</div>
                  <div className="text-[10px] text-slate-500">15m • 50 rnds • Thimble Sz 2 • 32×1 Braid</div>
                </button>
                <button 
                  onClick={() => onLoadPreset('heavy-28m')}
                  className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
                >
                  <div className="font-semibold text-slate-900">Heavy Marine 28m Cable</div>
                  <div className="text-[10px] text-slate-500">28m • 100 rnds • Spool OD45 • 2x 32×2 Braid</div>
                </button>
                <button 
                  onClick={() => onLoadPreset('short-6m')}
                  className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
                >
                  <div className="font-semibold text-slate-900">Compact Harness 6m</div>
                  <div className="text-[10px] text-slate-500">6m • 25 rnds • Thimble Sz 1 • 16×1 Braid</div>
                </button>
                <button 
                  onClick={() => onLoadPreset('long-45m')}
                  className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
                >
                  <div className="font-semibold text-slate-900">Long Run 45m Spool Cable</div>
                  <div className="text-[10px] text-slate-500">45m • 200 rnds • Spool OD75 • 64×1 Braid</div>
                </button>
              </div>
            </div>

            {/* Process History */}
            <button 
              onClick={onOpenHistoryModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 transition-all shadow-2xs"
              title="View saved process calculations history"
            >
              <History className="w-3.5 h-3.5 text-blue-600" />
              <span>History</span>
              {historyCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                  {historyCount}
                </span>
              )}
            </button>

            {/* View Rates Matrix */}
            <button 
              onClick={onOpenDataModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 transition-all shadow-2xs"
              title="View original Excel timing study data and speed charts"
            >
              <Table className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Rate Tables</span>
            </button>

            {/* Job Ticket / Print */}
            <button 
              onClick={onOpenTicketModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 transition-all shadow-2xs"
              title="Printable shop floor job traveler ticket"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Job Ticket</span>
            </button>

            {/* Export CSV */}
            <button 
              onClick={onExportData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 transition-all shadow-2xs"
              title="Export calculation breakdown to CSV"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* Reset */}
            <button 
              onClick={onReset}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-slate-300 transition-all"
              title="Reset inputs to defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Total pill badge */}
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-200">
              <Clock className="w-4 h-4 text-blue-600" />
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase text-slate-400 leading-tight">Overall Time</div>
                <div className="text-sm font-black text-slate-900 font-mono leading-tight">{totalTimeFormatted}</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}

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
    <header className="bg-blue-600 border-b border-blue-700 shadow-md shadow-blue-900/10 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Cable Title */}
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-xl bg-white/20 p-0.5 shadow-xs flex items-center justify-center border border-white/25">
              <div className="h-full w-full rounded-[10px] flex items-center justify-center">
                <Layers className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2 font-heading">
                  CableCalc <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30 font-sans">PRO</span>
                </h1>
                <span className="text-xs text-blue-100 hidden sm:inline font-sans font-normal">| Overall Manufacturing Time Calculator</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <input 
                  type="text" 
                  value={cableName}
                  onChange={(e) => setCableName(e.target.value)}
                  placeholder="Enter Job / Cable Reference..."
                  className="text-xs bg-blue-700/80 hover:bg-blue-700 focus:bg-white border border-blue-400/50 focus:border-white rounded px-2.5 py-1 text-white focus:text-slate-900 placeholder-blue-200 outline-none w-60 transition-colors font-sans font-normal shadow-inner"
                  title="Click to edit Job or Cable Part Reference"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons (Inter Medium for Navigation Menu) */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Presets dropdown */}
            <div className="relative group">
              <button 
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-blue-50 text-slate-800 border border-blue-100 transition-all shadow-xs font-sans"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Presets</span>
              </button>
              <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 hidden group-hover:block hover:block z-50">
                <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase font-sans">Load Cable Specification</div>
                <button 
                  onClick={() => onLoadPreset('standard-15m')}
                  className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-blue-50 text-slate-700 transition-colors font-sans font-medium"
                >
                  <div className="font-semibold text-slate-900">Standard 15m Cable</div>
                  <div className="text-[10px] text-slate-500 font-normal">15m • 50 rnds • Thimble Sz 2 • 32×1 Braid</div>
                </button>
                <button 
                  onClick={() => onLoadPreset('heavy-28m')}
                  className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-blue-50 text-slate-700 transition-colors font-sans font-medium"
                >
                  <div className="font-semibold text-slate-900">Heavy Marine 28m Cable</div>
                  <div className="text-[10px] text-slate-500 font-normal">28m • 100 rnds • Spool OD45 • 2x 32×2 Braid</div>
                </button>
                <button 
                  onClick={() => onLoadPreset('short-6m')}
                  className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-blue-50 text-slate-700 transition-colors font-sans font-medium"
                >
                  <div className="font-semibold text-slate-900">Compact Harness 6m</div>
                  <div className="text-[10px] text-slate-500 font-normal">6m • 25 rnds • Thimble Sz 1 • 16×1 Braid</div>
                </button>
                <button 
                  onClick={() => onLoadPreset('long-45m')}
                  className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-blue-50 text-slate-700 transition-colors font-sans font-medium"
                >
                  <div className="font-semibold text-slate-900">Long Run 45m Spool Cable</div>
                  <div className="text-[10px] text-slate-500 font-normal">45m • 200 rnds • Spool OD75 • 64×1 Braid</div>
                </button>
              </div>
            </div>

            {/* Process History */}
            <button 
              onClick={onOpenHistoryModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-blue-50 text-slate-800 border border-blue-100 transition-all shadow-xs font-sans"
              title="View saved process calculations history"
            >
              <History className="w-3.5 h-3.5 text-blue-600" />
              <span>History</span>
              {historyCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-medium">
                  {historyCount}
                </span>
              )}
            </button>

            {/* View Rates Matrix */}
            <button 
              onClick={onOpenDataModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-blue-50 text-slate-800 border border-blue-100 transition-all shadow-xs font-sans"
              title="View original Excel timing study data and speed charts"
            >
              <Table className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Rate Tables</span>
            </button>

            {/* Job Ticket / Print */}
            <button 
              onClick={onOpenTicketModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-blue-50 text-slate-800 border border-blue-100 transition-all shadow-xs font-sans"
              title="Printable shop floor job traveler ticket"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Job Ticket</span>
            </button>

            {/* Export CSV */}
            <button 
              onClick={onExportData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-blue-50 text-slate-800 border border-blue-100 transition-all shadow-xs font-sans"
              title="Export calculation breakdown to CSV"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* Reset */}
            <button 
              onClick={onReset}
              className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-blue-700/80 border border-transparent hover:border-blue-500 transition-all"
              title="Reset inputs to defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Total pill badge */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-blue-400/40">
              <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl shadow-xs border border-blue-100">
                <Clock className="w-4 h-4 text-blue-600" />
                <div className="text-right">
                  <div className="text-[9px] font-semibold uppercase text-blue-600 leading-tight font-sans">Overall Time</div>
                  <div className="text-xs font-semibold text-slate-900 leading-tight font-sans">{totalTimeFormatted}</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}

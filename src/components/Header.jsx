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
    <header className="bg-[#13171d] border-b border-[#242b35] shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Cable Title */}
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-xl bg-white/10 p-0.5 shadow-xs flex items-center justify-center border border-white/15">
              <div className="h-full w-full rounded-[10px] flex items-center justify-center">
                <Layers className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2 font-heading">
                  CableCalc <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/15 text-slate-200 border border-white/20 font-sans">PRO</span>
                </h1>
                <span className="text-xs text-slate-400 hidden sm:inline font-sans font-normal">| Overall Manufacturing Time Calculator</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <input 
                  type="text" 
                  value={cableName}
                  onChange={(e) => setCableName(e.target.value)}
                  placeholder="Enter Job / Cable Reference..."
                  className="text-xs bg-[#202632] hover:bg-[#272e3d] focus:bg-white text-white focus:text-slate-900 placeholder-slate-400 border border-[#374052] focus:border-white rounded px-2.5 py-1 outline-none w-60 transition-colors font-sans font-normal shadow-inner"
                  title="Click to edit Job or Cable Part Reference"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons (Dark Ash Theme with High Contrast) */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Presets dropdown */}
            <div className="relative group">
              <button 
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#202632] hover:bg-[#2b3444] text-slate-100 border border-[#374052] transition-all shadow-xs font-sans"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Presets</span>
              </button>
              <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 hidden group-hover:block hover:block z-50">
                <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase font-sans">Load Cable Specification</div>
                <button 
                  onClick={() => onLoadPreset('tandem-10layer')}
                  className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-emerald-50 text-slate-700 transition-colors font-sans font-medium bg-emerald-50/40 border border-emerald-100 mb-1"
                >
                  <div className="font-semibold text-emerald-900 flex items-center justify-between">
                    <span>10-Layer Tandem (32×1)</span>
                    <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded">Tandem</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal">15m • 50 rnds • 2 Ends • 4 Pairs + 2 Singles</div>
                </button>
                <button 
                  onClick={() => onLoadPreset('standard-15m')}
                  className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-blue-50 text-slate-700 transition-colors font-sans font-medium"
                >
                  <div className="font-semibold text-slate-900">Standard 15m Cable</div>
                  <div className="text-[10px] text-slate-500 font-normal">15m • 50 rnds • 2 Ends • Thimble Sz 2 • 32×1</div>
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#202632] hover:bg-[#2b3444] text-slate-100 border border-[#374052] transition-all shadow-xs font-sans"
              title="View saved process calculations history"
            >
              <History className="w-3.5 h-3.5 text-blue-400" />
              <span>History</span>
              {historyCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-blue-500 text-white text-[10px] font-semibold">
                  {historyCount}
                </span>
              )}
            </button>

            {/* View Rates Matrix */}
            <button 
              onClick={onOpenDataModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#202632] hover:bg-[#2b3444] text-slate-100 border border-[#374052] transition-all shadow-xs font-sans"
              title="View original Excel timing study data and speed charts"
            >
              <Table className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Rate Tables</span>
            </button>

            {/* Job Ticket / Print */}
            <button 
              onClick={onOpenTicketModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#202632] hover:bg-[#2b3444] text-slate-100 border border-[#374052] transition-all shadow-xs font-sans"
              title="Printable shop floor job traveler ticket"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Job Ticket</span>
            </button>

            {/* Export CSV */}
            <button 
              onClick={onExportData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#202632] hover:bg-[#2b3444] text-slate-100 border border-[#374052] transition-all shadow-xs font-sans"
              title="Export calculation breakdown to CSV"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* Reset */}
            <button 
              onClick={onReset}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#202632] border border-transparent hover:border-[#374052] transition-all"
              title="Reset inputs to defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Total pill badge */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-700/60">
              <div className="flex items-center gap-2 bg-[#202632] px-3 py-1 rounded-xl shadow-xs border border-[#374052]">
                <Clock className="w-4 h-4 text-blue-400" />
                <div className="text-right">
                  <div className="text-[9px] font-semibold uppercase text-slate-400 leading-tight font-sans">Overall Time</div>
                  <div className="text-xs font-semibold text-white leading-tight font-sans">{totalTimeFormatted}</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}

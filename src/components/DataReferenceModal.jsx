import React, { useState } from 'react';
import { X, Table, RotateCw, Disc, ShieldCheck, Layers, CheckCircle2 } from 'lucide-react';
import { WINDING_DATA, MOULDING_DATA, TAPING_DATA, BRAIDING_DATA, FINISHING_DATA } from '../data/manufacturingData.js';

export default function DataReferenceModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('winding');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700 border border-blue-200">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Production Timing Study — Reference Tables
              </h3>
              <p className="text-xs text-slate-500">
                Empirical baseline study data used for automated lead time and speed calculations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-200 bg-white overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('winding')}
            className={`flex items-center gap-1.5 px-3.5 py-2 border-b-2 font-bold transition-colors whitespace-nowrap ${
              activeTab === 'winding' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" /> Winding Data
          </button>
          <button
            onClick={() => setActiveTab('moulding')}
            className={`flex items-center gap-1.5 px-3.5 py-2 border-b-2 font-bold transition-colors whitespace-nowrap ${
              activeTab === 'moulding' 
                ? 'border-violet-600 text-violet-600' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Disc className="w-3.5 h-3.5" /> Moulding Data
          </button>
          <button
            onClick={() => setActiveTab('taping')}
            className={`flex items-center gap-1.5 px-3.5 py-2 border-b-2 font-bold transition-colors whitespace-nowrap ${
              activeTab === 'taping' 
                ? 'border-cyan-600 text-cyan-600' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Taping Data
          </button>
          <button
            onClick={() => setActiveTab('braiding')}
            className={`flex items-center gap-1.5 px-3.5 py-2 border-b-2 font-bold transition-colors whitespace-nowrap ${
              activeTab === 'braiding' 
                ? 'border-emerald-600 text-emerald-600' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Braiding Data
          </button>
          <button
            onClick={() => setActiveTab('finishing')}
            className={`flex items-center gap-1.5 px-3.5 py-2 border-b-2 font-bold transition-colors whitespace-nowrap ${
              activeTab === 'finishing' 
                ? 'border-amber-600 text-amber-600' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Finishing Data
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* TAB 1: WINDING */}
          {activeTab === 'winding' && (
            <div className="space-y-4">
              <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 text-slate-700">
                <span className="font-bold text-blue-700">Calculation Rule:</span> Setup is <strong>30 minutes</strong> for all cables. Winding run-time = <strong>(Winding time for 1m) × Length × Rounds</strong>.
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Length Range & Speed Parameters</h4>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left font-mono">
                    <thead className="bg-slate-100 text-slate-600 text-[11px]">
                      <tr>
                        <th className="p-2.5">Length Range</th>
                        <th className="p-2.5">Samples</th>
                        <th className="p-2.5">Avg Lead Time (min)</th>
                        <th className="p-2.5">Avg Labour (hrs)</th>
                        <th className="p-2.5">Lead Time / 1m</th>
                        <th className="p-2.5 text-blue-700 font-bold">Winding Time / 1m</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      {WINDING_DATA.lengthRanges.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">{r.label}</td>
                          <td className="p-2.5">{r.samples}</td>
                          <td className="p-2.5">{r.avgLeadTime}</td>
                          <td className="p-2.5">{r.avgLabourHrs}</td>
                          <td className="p-2.5">{r.leadTimePerMeter}</td>
                          <td className="p-2.5 font-bold text-blue-700">{r.windingTimePerMeter}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Detailed Breakdown by Rounds</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {WINDING_DATA.lengthRanges.map(r => (
                    <div key={r.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div className="font-bold text-slate-900 mb-1.5">{r.label}</div>
                      <div className="space-y-1 text-[11px] font-mono text-slate-600">
                        {r.byRounds.map((br, i) => (
                          <div key={i} className="flex justify-between">
                            <span>Rounds {br.roundsRange}:</span>
                            <span className="text-slate-900 font-medium">{br.avgLeadTime} min ({br.samples} spls, {br.avgLabourHrs}h lab)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MOULDING */}
          {activeTab === 'moulding' && (
            <div className="space-y-4">
              <div className="bg-violet-50/70 p-3.5 rounded-xl border border-violet-200 text-slate-700">
                <span className="font-bold text-violet-700">Calculation Rule:</span> Lead time is selected directly according to the fitting type and fitting size.
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Thimble Fittings (Sizes 1 to 6)</h4>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left font-mono">
                    <thead className="bg-slate-100 text-slate-600 text-[11px]">
                      <tr>
                        <th className="p-2.5">Fitting Type</th>
                        <th className="p-2.5">Fitting Size</th>
                        <th className="p-2.5">Samples</th>
                        <th className="p-2.5 text-violet-700 font-bold">Lead Time (min)</th>
                        <th className="p-2.5">Lead Time (hrs)</th>
                        <th className="p-2.5">Labour Hours</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      {MOULDING_DATA.items.Thimble.map((item) => (
                        <tr key={item.size} className="hover:bg-slate-50">
                          <td className="p-2.5 text-slate-500">Thimble</td>
                          <td className="p-2.5 font-bold text-slate-900">{item.label}</td>
                          <td className="p-2.5">{item.samples}</td>
                          <td className="p-2.5 font-bold text-violet-700">{item.leadTimeMin}</td>
                          <td className="p-2.5">{item.leadTimeHrs}</td>
                          <td className="p-2.5">{item.labourHrs}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Spool Fittings (OD Ranges)</h4>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left font-mono">
                    <thead className="bg-slate-100 text-slate-600 text-[11px]">
                      <tr>
                        <th className="p-2.5">Fitting Type</th>
                        <th className="p-2.5">Fitting Size</th>
                        <th className="p-2.5">Samples</th>
                        <th className="p-2.5 text-violet-700 font-bold">Lead Time (min)</th>
                        <th className="p-2.5">Lead Time (hrs)</th>
                        <th className="p-2.5">Labour Hours</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      {MOULDING_DATA.items.Spool.map((item) => (
                        <tr key={item.size} className="hover:bg-slate-50">
                          <td className="p-2.5 text-slate-500">Spool</td>
                          <td className="p-2.5 font-bold text-slate-900">{item.label}</td>
                          <td className="p-2.5">{item.samples}</td>
                          <td className="p-2.5 font-bold text-violet-700">{item.leadTimeMin}</td>
                          <td className="p-2.5">{item.leadTimeHrs}</td>
                          <td className="p-2.5">{item.labourHrs}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TAPING */}
          {activeTab === 'taping' && (
            <div className="space-y-4">
              <div className="bg-cyan-50/70 p-3.5 rounded-xl border border-cyan-200 text-slate-700">
                <span className="font-bold text-cyan-700">Calculation Rule:</span> Setup is <strong>20 minutes</strong> for all cables. Taping run-time = <strong>(Taping time for 1m) × Length</strong>.
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left font-mono">
                  <thead className="bg-slate-100 text-slate-600 text-[11px]">
                    <tr>
                      <th className="p-2.5">Length Range</th>
                      <th className="p-2.5">Samples</th>
                      <th className="p-2.5">Avg Lead Time (min)</th>
                      <th className="p-2.5">Labour Hours</th>
                      <th className="p-2.5 text-cyan-700 font-bold">Taping Time / 1m (min)</th>
                      <th className="p-2.5">Lead Time / 1m (min)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {TAPING_DATA.lengthRanges.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-900">{r.label}</td>
                        <td className="p-2.5">{r.samples}</td>
                        <td className="p-2.5">{r.avgLeadTime}</td>
                        <td className="p-2.5">{r.labourHrs}</td>
                        <td className="p-2.5 font-bold text-cyan-700">{r.tapingTimePerMeter}</td>
                        <td className="p-2.5">{r.leadTimePerMeter}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: BRAIDING */}
          {activeTab === 'braiding' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 text-slate-700">
                <span className="font-bold text-emerald-700">Calculation Rule:</span> Setup is <strong>90 minutes</strong> base + <strong>10 minutes for each layer</strong>. Process time = <strong>(Braiding time for 1m) × Length</strong>.
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left font-mono">
                  <thead className="bg-slate-100 text-slate-600 text-[11px]">
                    <tr>
                      <th className="p-2.5">Length Range</th>
                      <th className="p-2.5">Layer Description</th>
                      <th className="p-2.5">Bobbins</th>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5 text-emerald-700 font-bold">Rate / 1m (min)</th>
                      <th className="p-2.5">Avg Braiding Time (min/layer)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {BRAIDING_DATA.layerDetails.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-900">{item.lengthRange} m</td>
                        <td className="p-2.5 font-bold text-emerald-700">{item.desc}</td>
                        <td className="p-2.5">{item.bobbins}</td>
                        <td className="p-2.5">Type {item.type}</td>
                        <td className="p-2.5 font-bold text-emerald-700">{item.leadTimePerMeter}</td>
                        <td className="p-2.5">{item.avgBraidingTimePerLayer} min</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: FINISHING */}
          {activeTab === 'finishing' && (
            <div className="space-y-4">
              <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 text-slate-700">
                <span className="font-bold text-amber-700">Finishing Reference:</span> Quality inspection, cut-back, breaking, and packing standards.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {FINISHING_DATA.map((item) => (
                  <div key={item.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="font-bold text-slate-900 mb-2">{item.name}</div>
                    <div className="space-y-1.5 font-mono text-[11px]">
                      {item.specs.map((s, idx) => (
                        <div key={idx} className="flex justify-between text-slate-700 border-b border-slate-200 pb-1">
                          <span>{s.spec}:</span>
                          <span className="text-amber-700 font-bold">{s.processTime} min ({s.labourHrs}h lab)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close Reference
          </button>
        </div>

      </div>
    </div>
  );
}

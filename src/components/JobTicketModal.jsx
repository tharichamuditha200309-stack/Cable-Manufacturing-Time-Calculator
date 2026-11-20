import React from 'react';
import { X, Printer, CheckSquare, Layers, Clock, ShieldCheck, QrCode } from 'lucide-react';
import { formatMinutes } from '../utils/calculator';

export default function JobTicketModal({ isOpen, onClose, results, cableName }) {
  if (!isOpen) return null;

  const { winding, moulding, taping, braiding, finishing, totals, inputs } = results;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Action Bar (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold">Manufacturing Job Traveler & Work Order Ticket</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow transition-colors"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Job Ticket Body */}
        <div className="p-8 overflow-y-auto font-sans card-print space-y-6">
          
          {/* Ticket Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
            <div>
              <div className="text-2xl font-black tracking-tight text-slate-950 uppercase">
                PRODUCTION ROUTING TRAVELER
              </div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                CABLE MANUFACTURING WORK ORDER & TIME ALLOTMENT
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-sm font-bold text-slate-900">
                  Item: <span className="font-mono text-blue-700">{cableName || 'CABLE-PROD-SPEC-01'}</span>
                </span>
                <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-800 rounded font-mono">
                  Rev: 1.0
                </span>
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <div className="border border-slate-300 p-2 rounded text-center mb-1">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Planned Total Lead Time</div>
                <div className="text-2xl font-black text-slate-950 font-mono">{totals.formattedTime}</div>
                <div className="text-[10px] text-slate-600 font-mono">{totals.grandTotalMinutes.toFixed(1)} minutes</div>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Date: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div className="grid grid-cols-4 gap-3 bg-slate-100 p-3.5 rounded-lg border border-slate-300 text-xs font-mono">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Length</div>
              <div className="font-bold text-slate-950 text-sm">{inputs.length} Meters</div>
              <div className="text-[10px] text-slate-500">{(inputs.length * 1000).toLocaleString()} mm</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Winding Rounds</div>
              <div className="font-bold text-slate-950 text-sm">{inputs.rounds} Rounds</div>
              <div className="text-[10px] text-slate-500">{winding.range.id}m cohort</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">End Fittings</div>
              <div className="font-bold text-slate-950 text-sm">{inputs.fittingType}</div>
              <div className="text-[10px] text-slate-500">{inputs.fittingSize} ({inputs.endsCount} end{inputs.endsCount > 1 ? 's' : ''})</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Braiding Layers</div>
              <div className="font-bold text-slate-950 text-sm">
                {braiding.enabled ? `${braiding.layers.length} Layer(s)` : 'None'}
              </div>
              <div className="text-[10px] text-slate-500">
                {braiding.enabled ? (
                  braiding.pairCount > 0 
                    ? `${braiding.pairCount} Tandem Pairs + ${braiding.singleCount} Single Runs`
                    : braiding.layers.map(l => l.desc).join(', ')
                ) : 'Bypassed'}
              </div>
            </div>
          </div>

          {/* Operation Routing Table */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Sequential Workstation Operations & Machine Routing
            </div>
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-200 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300">Op #</th>
                  <th className="p-2 border-r border-slate-300">Operation Name</th>
                  <th className="p-2 border-r border-slate-300">Parameters / Speed</th>
                  <th className="p-2 border-r border-slate-300 text-right">Setup</th>
                  <th className="p-2 border-r border-slate-300 text-right">Process</th>
                  <th className="p-2 border-r border-slate-300 text-right">Target Total</th>
                  <th className="p-2 text-center w-28">Sign-off / Pass</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 text-slate-800 font-mono">
                
                {/* Op 10: Winding */}
                <tr>
                  <td className="p-2 border-r border-slate-300 font-bold">10</td>
                  <td className="p-2 border-r border-slate-300 font-sans font-semibold">
                    Winding Station
                  </td>
                  <td className="p-2 border-r border-slate-300 text-[11px]">
                    {winding.ratePerMeterPerRound} min/m/rnd × {inputs.length}m × {inputs.rounds}r
                  </td>
                  <td className="p-2 border-r border-slate-300 text-right">{winding.setupTime}m</td>
                  <td className="p-2 border-r border-slate-300 text-right">{winding.processTime.toFixed(1)}m</td>
                  <td className="p-2 border-r border-slate-300 text-right font-bold text-slate-950">
                    {formatMinutes(winding.totalTime)}
                  </td>
                  <td className="p-2 text-center border-dashed border-slate-300">
                    [ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ]
                  </td>
                </tr>

                {/* Op 20: Moulding */}
                <tr>
                  <td className="p-2 border-r border-slate-300 font-bold">20</td>
                  <td className="p-2 border-r border-slate-300 font-sans font-semibold">
                    Moulding & Termination
                  </td>
                  <td className="p-2 border-r border-slate-300 text-[11px]">
                    {moulding.fittingType} ({moulding.fittingSize}) × {moulding.endsCount}
                  </td>
                  <td className="p-2 border-r border-slate-300 text-right">—</td>
                  <td className="p-2 border-r border-slate-300 text-right">{moulding.leadTime.toFixed(1)}m</td>
                  <td className="p-2 border-r border-slate-300 text-right font-bold text-slate-950">
                    {formatMinutes(moulding.leadTime)}
                  </td>
                  <td className="p-2 text-center border-dashed border-slate-300">
                    [ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ]
                  </td>
                </tr>

                {/* Op 30: Taping */}
                {taping.enabled && (
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-bold">30</td>
                    <td className="p-2 border-r border-slate-300 font-sans font-semibold">
                      Taping Process
                    </td>
                    <td className="p-2 border-r border-slate-300 text-[11px]">
                      {taping.ratePerMeter} min/m × {inputs.length}m
                    </td>
                    <td className="p-2 border-r border-slate-300 text-right">{taping.setupTime}m</td>
                    <td className="p-2 border-r border-slate-300 text-right">{taping.processTime.toFixed(1)}m</td>
                    <td className="p-2 border-r border-slate-300 text-right font-bold text-slate-950">
                      {formatMinutes(taping.totalTime)}
                    </td>
                    <td className="p-2 text-center border-dashed border-slate-300">
                      [ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ]
                    </td>
                  </tr>
                )}

                {/* Op 40: Braiding */}
                {braiding.enabled && (
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-bold">40</td>
                    <td className="p-2 border-r border-slate-300 font-sans font-semibold">
                      Braiding ({braiding.layers.length} Layers{braiding.pairCount ? ` • ${braiding.pairCount} Tandem Pairs` : ''})
                    </td>
                    <td className="p-2 border-r border-slate-300 text-[11px]">
                      {braiding.groups && braiding.groups.length > 0 
                        ? braiding.groups.map(g => g.type === 'tandem_pair' ? `[L${g.layerIndices.join('+L')}: Tandem]` : `[L${g.primaryLayer}: Single]`).join(', ')
                        : braiding.layers.map(l => `${l.desc}`).join(', ')}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-right">{braiding.setupTime}m</td>
                    <td className="p-2 border-r border-slate-300 text-right">{braiding.processTime.toFixed(1)}m</td>
                    <td className="p-2 border-r border-slate-300 text-right font-bold text-slate-950">
                      {formatMinutes(braiding.totalTime)}
                    </td>
                    <td className="p-2 text-center border-dashed border-slate-300">
                      [ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ]
                    </td>
                  </tr>
                )}

                {/* Op 50: Finishing */}
                {finishing.enabled && finishing.totalTime > 0 && (
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-bold">50</td>
                    <td className="p-2 border-r border-slate-300 font-sans font-semibold">
                      Finishing & Inspection
                    </td>
                    <td className="p-2 border-r border-slate-300 text-[11px]">
                      {finishing.items.map(i => i.name).join(', ')}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-right">—</td>
                    <td className="p-2 border-r border-slate-300 text-right">{finishing.totalTime}m</td>
                    <td className="p-2 border-r border-slate-300 text-right font-bold text-slate-950">
                      {formatMinutes(finishing.totalTime)}
                    </td>
                    <td className="p-2 text-center border-dashed border-slate-300">
                      [ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ]
                    </td>
                  </tr>
                )}

                {/* Grand Total Row */}
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-900 text-slate-950">
                  <td colSpan="3" className="p-2.5 text-right font-sans uppercase">
                    Total Scheduled Allotment:
                  </td>
                  <td className="p-2.5 text-right border-r border-slate-300">{totals.totalSetupTime}m</td>
                  <td className="p-2.5 text-right border-r border-slate-300">{totals.totalProcessTime.toFixed(1)}m</td>
                  <td className="p-2.5 text-right border-r border-slate-300 text-base font-black">
                    {totals.formattedTime}
                  </td>
                  <td className="p-2.5 text-center text-[10px] text-slate-600 font-sans">
                    QC Final Release
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          {/* Quality & Production Approvals */}
          <div className="grid grid-cols-3 gap-4 border-t border-slate-300 pt-5 text-xs">
            <div className="border border-slate-300 p-3 rounded h-20 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Production Lead Engineer</span>
              <div className="border-b border-slate-400 w-3/4 mb-1" />
            </div>
            <div className="border border-slate-300 p-3 rounded h-20 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Quality Inspector</span>
              <div className="border-b border-slate-400 w-3/4 mb-1" />
            </div>
            <div className="border border-slate-300 p-3 rounded h-20 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Packaging & Dispatch Sign</span>
              <div className="border-b border-slate-400 w-3/4 mb-1" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}


import React from 'react';
import { 
  RotateCw, 
  Disc, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { formatMinutes } from '../utils/calculator';

export default function StageBreakdown({ results, onOpenDataModal }) {
  const { winding, moulding, taping, braiding, finishing, totals, inputs } = results;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          Individual Stage Breakdown & Formulas
        </h3>
        <button
          onClick={onOpenDataModal}
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition-colors"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          Compare with Excel Averages
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* 1. WINDING STAGE CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <RotateCw className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Stage 1: Winding</h4>
                <div className="text-[11px] text-slate-400">Setup 30m + (Speed × Length × Rounds)</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-blue-400 font-mono">
                {formatMinutes(winding.totalTime)}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">{winding.totalTime.toFixed(1)} mins</div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Fixed Setup Allowance:</span>
              <span className="font-mono">{winding.setupTime} mins</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Winding Speed (1m):</span>
              <span className="font-mono text-blue-300">{winding.ratePerMeterPerRound} min/m/rnd</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Cable Length × Rounds:</span>
              <span className="font-mono">{inputs.length}m × {inputs.rounds} rounds</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Process Running Time:</span>
              <span className="font-mono text-emerald-400 font-semibold">{winding.processTime.toFixed(1)} mins</span>
            </div>
          </div>

          {/* Formula calculation badge */}
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300">
            <div className="text-slate-500 text-[10px] uppercase font-semibold mb-0.5">Applied Formula:</div>
            {winding.setupTime}m + ({winding.ratePerMeterPerRound} × {inputs.length} × {inputs.rounds}) = <strong className="text-white">{winding.totalTime.toFixed(1)} min</strong>
          </div>

          {/* Historical study context */}
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
            <span>Historical Cohort: {winding.range.id}m ({winding.range.samples} samples)</span>
            <span className="font-mono">Est. Labour: {winding.labourHours.toFixed(1)}h</span>
          </div>
        </div>

        {/* 2. MOULDING STAGE CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
                <Disc className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Stage 2: Moulding</h4>
                <div className="text-[11px] text-slate-400">End Fitting Lead Time Lookup</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-violet-400 font-mono">
                {formatMinutes(moulding.leadTime)}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">{moulding.leadTime.toFixed(1)} mins</div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Fitting Category:</span>
              <span className="font-semibold text-white">{moulding.fittingType}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Fitting Specification:</span>
              <span className="font-mono text-violet-300">{moulding.fittingSize}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Terminations Moulded:</span>
              <span className="font-mono">{moulding.endsCount} End(s)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Unit Lead Time per End:</span>
              <span className="font-mono text-emerald-400 font-semibold">
                {moulding.detail ? moulding.detail.leadTimeMin : 0} mins ({moulding.detail ? moulding.detail.leadTimeHrs : 0} hrs)
              </span>
            </div>
          </div>

          {/* Formula calculation badge */}
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300">
            <div className="text-slate-500 text-[10px] uppercase font-semibold mb-0.5">Applied Formula:</div>
            {moulding.fittingType === 'None' ? (
              <span>0 mins (No Moulding Configured)</span>
            ) : (
              <span>{moulding.detail ? moulding.detail.leadTimeMin : 0} mins × {moulding.endsCount} end(s) = <strong className="text-white">{moulding.leadTime.toFixed(1)} min</strong></span>
            )}
          </div>

          {/* Historical study context */}
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
            <span>Historical Study: {moulding.detail ? `${moulding.detail.samples} samples` : 'N/A'}</span>
            <span className="font-mono">Est. Labour: {moulding.labourHours.toFixed(1)}h</span>
          </div>
        </div>

        {/* 3. TAPING STAGE CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Stage 3: Taping</h4>
                <div className="text-[11px] text-slate-400">Setup 20m + (Speed × Length)</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-cyan-400 font-mono">
                {taping.enabled ? formatMinutes(taping.totalTime) : 'Bypassed'}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                {taping.enabled ? `${taping.totalTime.toFixed(1)} mins` : '0 mins'}
              </div>
            </div>
          </div>

          {taping.enabled ? (
            <>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Fixed Setup Allowance:</span>
                  <span className="font-mono">{taping.setupTime} mins</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Taping Speed (1m):</span>
                  <span className="font-mono text-cyan-300">{taping.ratePerMeter} min/m</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Cable Length:</span>
                  <span className="font-mono">{inputs.length}m</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Process Running Time:</span>
                  <span className="font-mono text-emerald-400 font-semibold">{taping.processTime.toFixed(1)} mins</span>
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300">
                <div className="text-slate-500 text-[10px] uppercase font-semibold mb-0.5">Applied Formula:</div>
                {taping.setupTime}m + ({taping.ratePerMeter} × {inputs.length}m) = <strong className="text-white">{taping.totalTime.toFixed(1)} min</strong>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                <span>Cohort: {taping.range.label} ({taping.range.samples} samples)</span>
                <span className="font-mono">Est. Labour: {taping.labourHours.toFixed(1)}h</span>
              </div>
            </>
          ) : (
            <div className="py-4 text-center text-xs text-slate-500">
              Taping stage has been toggled off for this cable specification.
            </div>
          )}
        </div>

        {/* 4. BRAIDING STAGE CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Stage 4: Braiding</h4>
                <div className="text-[11px] text-slate-400">
                  Setup (90m + 10m/layer) + Process Time
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-emerald-400 font-mono">
                {braiding.enabled ? formatMinutes(braiding.totalTime) : 'Bypassed'}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                {braiding.enabled ? `${braiding.totalTime.toFixed(1)} mins` : '0 mins'}
              </div>
            </div>
          </div>

          {braiding.enabled ? (
            <>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Base Setup + Layer Increment:</span>
                  <span className="font-mono">{braiding.baseSetup}m + ({braiding.layers.length} × {braiding.setupPerLayer}m) = {braiding.setupTime}m</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Configured Layers:</span>
                  <span className="font-mono text-emerald-300">{braiding.layers.length} Layer(s)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Cumulative Process Run Time:</span>
                  <span className="font-mono text-emerald-400 font-semibold">{braiding.processTime.toFixed(1)} mins</span>
                </div>
              </div>

              {/* Layer specs summary */}
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                <div className="text-slate-500 text-[10px] uppercase font-semibold">Layer Breakdown:</div>
                {braiding.layers.map((l, i) => (
                  <div key={i} className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Layer {l.layerIndex} ({l.desc}):</span>
                    <span>{l.ratePerMeter} min/m × {inputs.length}m = <strong className="text-emerald-300">{l.layerTime.toFixed(1)}m</strong></span>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                <span>Setup: {braiding.setupTime}m | Run: {braiding.processTime.toFixed(1)}m</span>
                <span className="font-mono">Est. Labour: {braiding.labourHours.toFixed(1)}h</span>
              </div>
            </>
          ) : (
            <div className="py-4 text-center text-xs text-slate-500">
              Braiding stage has been toggled off for this cable specification.
            </div>
          )}
        </div>

      </div>

      {/* 5. FINISHING STAGE (If enabled) */}
      {finishing.enabled && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Stage 5: Finishing & Quality Operations</h4>
                <div className="text-[11px] text-slate-400">Testing, Cable Breaking, Coiling, Polishing & Packaging</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-amber-400 font-mono">
                {formatMinutes(finishing.totalTime)}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">{finishing.totalTime} mins</div>
            </div>
          </div>

          {finishing.items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              {finishing.items.map((it, idx) => (
                <div key={idx} className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between">
                  <div>
                    <div className="font-medium text-slate-200">{it.name}</div>
                    <div className="text-[10px] text-slate-400">{it.spec}</div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-amber-300 font-semibold">{it.time} min</div>
                    <div className="text-[10px] text-slate-500">{it.labourHrs}h lab</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-500">No finishing operations selected above.</div>
          )}
        </div>
      )}

    </div>
  );
}


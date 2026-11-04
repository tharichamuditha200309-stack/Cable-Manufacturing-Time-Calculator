import React, { useState } from 'react';
import { Package, CalendarCheck, Clock, TrendingDown, Layers, ArrowRight } from 'lucide-react';
import { formatMinutes } from '../utils/calculator';

export default function BatchCalculator({ results, shiftHours = 8 }) {
  const [quantity, setQuantity] = useState(10);
  const [setupMode, setSetupMode] = useState('amortized'); // 'amortized' (continuous) or 'per_cable'

  const { totals } = results;
  const numQty = Math.max(1, Number(quantity) || 1);

  // If per cable: total = grandTotalMinutes * quantity
  // If amortized: total = totalSetupTime + (totalProcessTime * quantity)
  const batchMinutes = setupMode === 'amortized'
    ? totals.totalSetupTime + (totals.totalProcessTime * numQty)
    : totals.grandTotalMinutes * numQty;

  const perCableTotalMinutes = totals.grandTotalMinutes * numQty;
  const timeSavedMinutes = setupMode === 'amortized' ? perCableTotalMinutes - batchMinutes : 0;
  
  const batchHours = batchMinutes / 60;
  const totalShifts = (batchHours / shiftHours).toFixed(1);
  const totalDays = (Number(totalShifts) / 2).toFixed(1); // 2 shifts/day standard assumption

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            Batch Production Run Estimator
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Model multi-unit volume manufacturing and setup amortisation
          </p>
        </div>

        {/* Setup strategy toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setSetupMode('amortized')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              setupMode === 'amortized' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Continuous Run (Single Setup)
          </button>
          <button
            type="button"
            onClick={() => setSetupMode('per_cable')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              setupMode === 'per_cable' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Individual Setups
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        
        {/* Quantity selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Batch Order Quantity:
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              max="10000"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-500 pointer-events-none">units</span>
          </div>

          <div className="flex gap-1.5 mt-2">
            {[5, 10, 25, 50, 100].map(q => (
              <button
                key={q}
                onClick={() => setQuantity(q)}
                className={`px-2 py-0.5 text-[10px] rounded font-mono ${
                  Number(quantity) === q 
                    ? 'bg-emerald-600 text-white font-bold' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Total Batch Time */}
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Total Batch Lead Time</div>
          <div className="text-2xl font-extrabold text-white font-mono tracking-tight">
            {formatMinutes(batchMinutes)}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {batchHours.toFixed(1)} hrs ({batchMinutes.toFixed(0)} min)
          </div>
        </div>

        {/* Schedule & Shifts */}
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Estimated Production Schedule</div>
          <div className="text-2xl font-extrabold text-purple-400 font-mono tracking-tight">
            {totalShifts} <span className="text-xs font-normal text-slate-400">shifts</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            ≈ {totalDays} work days (2 shifts/day)
          </div>
        </div>

        {/* Setup Efficiency / Time Saved */}
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Batch Run Efficiency</div>
          {setupMode === 'amortized' && numQty > 1 ? (
            <div>
              <div className="text-xl font-extrabold text-emerald-400 font-mono tracking-tight flex items-center gap-1">
                <TrendingDown className="w-4 h-4" />
                {formatMinutes(timeSavedMinutes)}
              </div>
              <div className="text-[11px] text-emerald-500 font-mono">
                Saved by amortizing setup
              </div>
            </div>
          ) : (
            <div>
              <div className="text-sm font-semibold text-slate-300">
                Setup: {totals.totalSetupTime * numQty} min
              </div>
              <div className="text-[11px] text-slate-500">
                Each unit re-incurs full setup
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}


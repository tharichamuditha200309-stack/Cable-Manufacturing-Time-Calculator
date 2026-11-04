import React, { useState } from 'react';
import { 
  Ruler, 
  RotateCw, 
  Disc, 
  Layers, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Settings2, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  SlidersHorizontal 
} from 'lucide-react';
import { MOULDING_DATA, BRAIDING_DATA, FINISHING_DATA } from '../data/manufacturingData.js';

export default function InputPanel({
  length,
  setLength,
  rounds,
  setRounds,
  
  // Winding
  windingSetup,
  setWindingSetup,
  customWindingRate,
  setCustomWindingRate,
  windingResults,

  // Moulding
  fittingType,
  setFittingType,
  fittingSize,
  setFittingSize,
  endsCount,
  setEndsCount,
  customMouldingLeadTime,
  setCustomMouldingLeadTime,
  mouldingResults,

  // Taping
  includeTaping,
  setIncludeTaping,
  tapingSetup,
  setTapingSetup,
  customTapingRate,
  setCustomTapingRate,
  tapingResults,

  // Braiding
  includeBraiding,
  setIncludeBraiding,
  braidingBaseSetup,
  setBraidingBaseSetup,
  braidingSetupPerLayer,
  setBraidingSetupPerLayer,
  braidingLayers,
  setBraidingLayers,
  braidingResults,

  // Finishing
  includeFinishing,
  setIncludeFinishing,
  selectedFinishing,
  setSelectedFinishing
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleLayerBobbinChange = (index, bobbins) => {
    const updated = [...braidingLayers];
    updated[index] = { ...updated[index], bobbins: Number(bobbins), customRate: null };
    setBraidingLayers(updated);
  };

  const handleLayerTypeChange = (index, type) => {
    const updated = [...braidingLayers];
    updated[index] = { ...updated[index], type: Number(type), customRate: null };
    setBraidingLayers(updated);
  };

  const addLayer = () => {
    if (braidingLayers.length >= 6) return;
    const last = braidingLayers[braidingLayers.length - 1] || { bobbins: 32, type: 1 };
    setBraidingLayers([
      ...braidingLayers,
      { id: String(Date.now()), bobbins: last.bobbins, type: last.type, customRate: null }
    ]);
  };

  const removeLayer = (index) => {
    if (braidingLayers.length <= 1) return;
    setBraidingLayers(braidingLayers.filter((_, i) => i !== index));
  };

  const applyFirstLayerToAll = () => {
    if (braidingLayers.length === 0) return;
    const first = braidingLayers[0];
    const updated = braidingLayers.map(l => ({
      ...l,
      bobbins: first.bobbins,
      type: first.type,
      customRate: first.customRate
    }));
    setBraidingLayers(updated);
  };

  const handleFinishingSelect = (itemId, specIndex) => {
    setSelectedFinishing(prev => ({
      ...prev,
      [itemId]: specIndex === '' ? null : Number(specIndex)
    }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Header with Title and Advanced Toggle */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-600" />
            Cable Specifications & Stage Parameters
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enter cable specifications to calculate the overall manufacturing time
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
            showAdvanced 
              ? 'bg-blue-50 text-blue-700 border-blue-300' 
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Advanced Overrides</span>
          {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* 1. Core Cable Parameters (Length & Rounds) */}
      <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Ruler className="w-4 h-4 text-blue-600" /> 1. Cable Dimensions & Winding Inputs
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
            Range: {windingResults.range.label}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Cable Length */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Cable Length (Meters)
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                = {(Number(length) * 1000).toLocaleString()} mm
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0.1"
                max="500"
                step="0.5"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-mono font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. 15"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none font-medium">m</span>
            </div>
            {/* Quick length presets */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] font-semibold text-slate-400">Quick:</span>
              {[5, 10, 15, 20, 25, 35, 45].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setLength(val)}
                  className={`px-2 py-0.5 text-[10px] rounded font-mono transition-colors border ${
                    Number(length) === val
                      ? 'bg-blue-600 text-white font-bold border-blue-600'
                      : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {val}m
                </button>
              ))}
            </div>
          </div>

          {/* Number of Rounds */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-blue-600" /> Number of Rounds
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                Speed: {windingResults.ratePerMeterPerRound} min/m
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="1000"
                step="1"
                value={rounds}
                onChange={(e) => setRounds(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-mono font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. 50"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none font-medium">rnds</span>
            </div>
            {/* Quick rounds presets */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] font-semibold text-slate-400">Quick:</span>
              {[25, 50, 75, 100, 150, 200].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setRounds(val)}
                  className={`px-2 py-0.5 text-[10px] rounded font-mono transition-colors border ${
                    Number(rounds) === val
                      ? 'bg-blue-600 text-white font-bold border-blue-600'
                      : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Winding formula note */}
        <div className="mt-3 pt-2.5 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span className="font-mono">
            Winding: 30m setup + ({windingResults.ratePerMeterPerRound} min/m/rnd × {length}m × {rounds}r)
          </span>
          <span className="font-mono font-semibold text-blue-700">
            = {windingResults.totalTime.toFixed(1)} min
          </span>
        </div>

        {/* Advanced Overrides for Winding */}
        {showAdvanced && (
          <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-600 block mb-1 font-semibold">Winding Setup (min):</label>
              <input
                type="number"
                value={windingSetup}
                onChange={(e) => setWindingSetup(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-mono"
              />
              <span className="text-[10px] text-slate-400">Fixed baseline is 30 mins</span>
            </div>
            <div>
              <label className="text-slate-600 block mb-1 font-semibold">Speed Override (min/m/rnd):</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.0001"
                  value={customWindingRate ?? ''}
                  onChange={(e) => setCustomWindingRate(e.target.value === '' ? null : e.target.value)}
                  placeholder={String(windingResults.range.windingTimePerMeter)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-mono"
                />
                {customWindingRate !== null && (
                  <button
                    type="button"
                    onClick={() => setCustomWindingRate(null)}
                    className="text-[11px] text-blue-600 hover:underline shrink-0"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Moulding Stage (End Fittings & Size) */}
      <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Disc className="w-4 h-4 text-violet-600" /> 2. Moulding End Fittings
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 font-medium">
            {fittingType === 'None' ? 'No Moulding' : `${fittingType} • ${fittingSize}`}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Fitting Type */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Fitting Type
            </label>
            <select
              value={fittingType}
              onChange={(e) => {
                const newType = e.target.value;
                setFittingType(newType);
                if (newType === 'Thimble') setFittingSize('2');
                else if (newType === 'Spool') setFittingSize('OD45 - OD75');
                else setFittingSize('None');
              }}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-violet-500 outline-none"
            >
              <option value="Thimble">Thimble</option>
              <option value="Spool">Spool</option>
              <option value="None">None (No Moulding)</option>
            </select>
          </div>

          {/* Fitting Size */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Fitting Size
            </label>
            <select
              disabled={fittingType === 'None'}
              value={fittingSize}
              onChange={(e) => setFittingSize(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-violet-500 outline-none disabled:opacity-50"
            >
              {fittingType === 'Thimble' && MOULDING_DATA.items.Thimble.map(item => (
                <option key={item.size} value={item.size}>
                  {item.label} ({item.leadTimeMin} min / {item.leadTimeHrs} hrs)
                </option>
              ))}
              {fittingType === 'Spool' && MOULDING_DATA.items.Spool.map(item => (
                <option key={item.size} value={item.size}>
                  {item.label} ({item.leadTimeMin} min / {item.leadTimeHrs} hrs)
                </option>
              ))}
              {fittingType === 'None' && (
                <option value="None">None</option>
              )}
            </select>
          </div>

          {/* Ends Count */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Moulded Terminations
            </label>
            <select
              disabled={fittingType === 'None'}
              value={endsCount}
              onChange={(e) => setEndsCount(Number(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-mono font-medium focus:ring-2 focus:ring-violet-500 outline-none disabled:opacity-50"
            >
              <option value={1}>1 End (Standard)</option>
              <option value={2}>2 Ends (Both Terminations)</option>
            </select>
          </div>

        </div>

        {/* Moulding formula note */}
        <div className="mt-3 pt-2.5 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span className="font-mono">
            {fittingType === 'None' ? 'No moulding time' : `Chart Lead Time: ${mouldingResults.detail ? mouldingResults.detail.leadTimeMin : 0} min × ${endsCount} end(s)`}
          </span>
          <span className="font-mono font-semibold text-violet-700">
            = {mouldingResults.leadTime.toFixed(1)} min
          </span>
        </div>

        {/* Advanced Overrides for Moulding */}
        {showAdvanced && fittingType !== 'None' && (
          <div className="mt-3 p-3 bg-white rounded-lg border border-violet-200 text-xs">
            <label className="text-slate-600 block mb-1 font-semibold">Custom Moulding Lead Time per End (min):</label>
            <div className="flex items-center gap-2 max-w-xs">
              <input
                type="number"
                step="0.1"
                value={customMouldingLeadTime ?? ''}
                onChange={(e) => setCustomMouldingLeadTime(e.target.value === '' ? null : e.target.value)}
                placeholder={mouldingResults.detail ? String(mouldingResults.detail.leadTimeMin) : '0'}
                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-mono"
              />
              {customMouldingLeadTime !== null && (
                <button
                  type="button"
                  onClick={() => setCustomMouldingLeadTime(null)}
                  className="text-[11px] text-violet-600 hover:underline shrink-0"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Taping Stage (Setup: 20 min fixed + speed * length) */}
      <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="includeTaping"
              checked={includeTaping}
              onChange={(e) => setIncludeTaping(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <label htmlFor="includeTaping" className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 cursor-pointer">
              <ShieldCheck className="w-4 h-4 text-cyan-600" /> 3. Taping Stage (20 min Setup)
            </label>
          </div>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
            includeTaping 
              ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' 
              : 'bg-slate-200 text-slate-500'
          }`}>
            {includeTaping ? `Active • Rate: ${tapingResults.ratePerMeter} min/m` : 'Bypassed'}
          </span>
        </div>

        {includeTaping && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Matched Taping Speed for 1m
                </label>
                <div className="bg-white border border-slate-300 rounded-lg px-3 py-2 flex items-center justify-between text-sm">
                  <span className="text-slate-500 text-xs">Cohort: {tapingResults.range.label}</span>
                  <span className="font-mono text-cyan-700 font-bold">{tapingResults.ratePerMeter} min/m</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Fixed Setup Allowance
                </label>
                <div className="bg-white border border-slate-300 rounded-lg px-3 py-2 flex items-center justify-between text-sm">
                  <span className="text-slate-500 text-xs">Standard across all lengths</span>
                  <span className="font-mono text-cyan-700 font-bold">{tapingSetup} mins</span>
                </div>
              </div>
            </div>

            {/* Taping formula note */}
            <div className="mt-3 pt-2.5 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span className="font-mono">
                Taping: {tapingSetup}m setup + ({tapingResults.ratePerMeter} min/m × {length}m)
              </span>
              <span className="font-mono font-semibold text-cyan-700">
                = {tapingResults.totalTime.toFixed(1)} min
              </span>
            </div>

            {/* Advanced Overrides for Taping */}
            {showAdvanced && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-cyan-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Taping Setup (min):</label>
                  <input
                    type="number"
                    value={tapingSetup}
                    onChange={(e) => setTapingSetup(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Taping Speed (min/m):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.0001"
                      value={customTapingRate ?? ''}
                      onChange={(e) => setCustomTapingRate(e.target.value === '' ? null : e.target.value)}
                      placeholder={String(tapingResults.range.tapingTimePerMeter)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-mono"
                    />
                    {customTapingRate !== null && (
                      <button
                        type="button"
                        onClick={() => setCustomTapingRate(null)}
                        className="text-[11px] text-cyan-600 hover:underline shrink-0"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 4. Braiding Stage (Setup: 90 mins base + 10 mins per layer) */}
      <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="includeBraiding"
              checked={includeBraiding}
              onChange={(e) => setIncludeBraiding(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <label htmlFor="includeBraiding" className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 cursor-pointer">
              <Layers className="w-4 h-4 text-emerald-600" /> 4. Braiding Layers Architecture
            </label>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
            Setup: {braidingResults.setupTime}m (90m + {braidingLayers.length}×10m)
          </span>
        </div>

        {includeBraiding && (
          <div className="space-y-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-700 font-bold">Number of Layers:</span>
                <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {braidingLayers.length}
                </span>
                <span className="text-slate-400 text-[11px]">(+10m setup added per layer)</span>
              </div>
              <div className="flex items-center gap-2">
                {braidingLayers.length > 1 && (
                  <button
                    type="button"
                    onClick={applyFirstLayerToAll}
                    className="text-[11px] text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded px-2.5 py-1 transition-colors"
                  >
                    Match All to Layer 1
                  </button>
                )}
                <button
                  type="button"
                  onClick={addLayer}
                  disabled={braidingLayers.length >= 6}
                  className="flex items-center gap-1 text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white rounded px-2.5 py-1 font-bold transition-colors disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Layer
                </button>
              </div>
            </div>

            {/* Individual Layer Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {braidingLayers.map((layer, index) => {
                const calc = braidingResults.layers[index] || { ratePerMeter: 2.0, layerTime: 30 };
                return (
                  <div 
                    key={layer.id || index}
                    className="bg-white border border-slate-200 rounded-xl p-3 space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold flex items-center justify-center border border-emerald-300">
                          L{index + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          Braiding Layer {index + 1}
                        </span>
                      </div>
                      {braidingLayers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLayer(index)}
                          className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                          title="Remove this layer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[11px] text-slate-600 font-semibold block mb-1">Bobbins (Carriers):</label>
                        <select
                          value={layer.bobbins}
                          onChange={(e) => handleLayerBobbinChange(index, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-900 font-mono font-medium outline-none focus:border-emerald-500"
                        >
                          <option value={16}>16 Bobbins</option>
                          <option value={32}>32 Bobbins</option>
                          <option value={64}>64 Bobbins</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-600 font-semibold block mb-1">Braid Type:</label>
                        <select
                          value={layer.type}
                          onChange={(e) => handleLayerTypeChange(index, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-900 font-mono font-medium outline-none focus:border-emerald-500"
                        >
                          <option value={1}>Type 1</option>
                          <option value={2}>Type 2</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded p-2 text-[11px] flex items-center justify-between border border-slate-200 font-mono">
                      <span className="text-slate-600">
                        Speed: <strong className="text-emerald-700">{calc.ratePerMeter} min/m</strong>
                      </span>
                      <span className="text-slate-900 font-bold">
                        = {calc.layerTime.toFixed(1)} mins
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Braiding formula note */}
            <div className="mt-3 pt-2.5 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span className="font-mono">
                Braiding: {braidingResults.setupTime}m setup + {braidingResults.processTime.toFixed(1)}m run
              </span>
              <span className="font-mono font-semibold text-emerald-700">
                = {braidingResults.totalTime.toFixed(1)} min
              </span>
            </div>

            {/* Advanced Overrides for Braiding */}
            {showAdvanced && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-emerald-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Base Setup (min):</label>
                  <input
                    type="number"
                    value={braidingBaseSetup}
                    onChange={(e) => setBraidingBaseSetup(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Fixed baseline 90 mins</span>
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Setup per Layer (min):</label>
                  <input
                    type="number"
                    value={braidingSetupPerLayer}
                    onChange={(e) => setBraidingSetupPerLayer(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-mono"
                  />
                  <span className="text-[10px] text-slate-400">10 mins per layer</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Finishing Operations (Optional) */}
      <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="includeFinishing"
              checked={includeFinishing}
              onChange={(e) => setIncludeFinishing(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <label htmlFor="includeFinishing" className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 cursor-pointer">
              <CheckCircle2 className="w-4 h-4 text-amber-600" /> 5. Finishing Operations (Optional)
            </label>
          </div>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
            includeFinishing ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-200 text-slate-500'
          }`}>
            {includeFinishing ? 'Active' : 'Optional'}
          </span>
        </div>

        {includeFinishing && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {FINISHING_DATA.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs space-y-1.5 shadow-2xs">
                <label className="font-bold text-slate-800 block truncate" title={item.name}>
                  {item.name}
                </label>
                <select
                  value={selectedFinishing[item.id] ?? ''}
                  onChange={(e) => handleFinishingSelect(item.id, e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-900 text-xs outline-none"
                >
                  <option value="">None / Not Required</option>
                  {item.specs.map((s, idx) => (
                    <option key={idx} value={idx}>
                      {s.spec} ({s.processTime} min)
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

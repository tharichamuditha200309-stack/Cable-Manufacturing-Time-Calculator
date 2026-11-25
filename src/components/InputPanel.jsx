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
  SlidersHorizontal,
  Database,
  CircleDot
} from 'lucide-react';
import { MOULDING_DATA, BRAIDING_DATA, FINISHING_DATA } from '../data/manufacturingData.js';

export default function InputPanel({
  cableType = 'Torquelite',
  setCableType,
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
  postTapingDiameter = 12.0,
  setPostTapingDiameter,
  tapingSetup,
  setTapingSetup,
  customTapingRate,
  setCustomTapingRate,
  tapingResults,

  // Braiding
  includeBraiding,
  setIncludeBraiding,
  cableOD,
  setCableOD,
  braidingBaseSetup,
  setBraidingBaseSetup,
  braidingSetupPerLayer,
  setBraidingSetupPerLayer,
  braidingLayers,
  setBraidingLayers,
  braidingResults,
  tandemBraidingEnabled,
  setTandemBraidingEnabled,
  tandemOffset,
  setTandemOffset,

  // Finishing
  includeFinishing,
  setIncludeFinishing,
  selectedFinishing,
  setSelectedFinishing,
  selectedCustomTables,
  setSelectedCustomTables,
  finishingResults,
  referenceData
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const activeMoulding = referenceData?.moulding || MOULDING_DATA;
  const activeBraiding = referenceData?.braiding || BRAIDING_DATA;
  const activeFinishing = referenceData?.finishing || FINISHING_DATA;

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
    if (braidingLayers.length >= 50) return;
    const last = braidingLayers[braidingLayers.length - 1] || { bobbins: 32, type: 1 };
    setBraidingLayers([
      ...braidingLayers,
      { id: String(Date.now() + Math.random()), bobbins: last.bobbins, type: last.type, customRate: null }
    ]);
  };

  const addMultipleLayers = (count) => {
    const last = braidingLayers[braidingLayers.length - 1] || { bobbins: 32, type: 1 };
    const newLayers = [];
    const totalTarget = Math.min(50, braidingLayers.length + count);
    for (let i = braidingLayers.length; i < totalTarget; i++) {
      newLayers.push({
        id: String(Date.now() + i + Math.random()),
        bobbins: last.bobbins,
        type: last.type,
        customRate: null
      });
    }
    setBraidingLayers([...braidingLayers, ...newLayers]);
  };

  const setFixedLayersPreset = (count) => {
    const target = Math.min(50, Math.max(1, count));
    setBraidingLayers(Array.from({ length: target }, (_, i) => ({
      id: String(Date.now() + i),
      bobbins: 32,
      type: 1,
      customRate: null
    })));
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

  const handleFinishingToggle = (opId, currentEnabled) => {
    setSelectedFinishing(prev => ({
      ...prev,
      [opId]: {
        ...(typeof prev[opId] === 'object' ? prev[opId] : {}),
        enabled: !currentEnabled
      }
    }));
  };

  const handleFinishingSpecChange = (opId, specIdx) => {
    setSelectedFinishing(prev => ({
      ...prev,
      [opId]: {
        ...(typeof prev[opId] === 'object' ? prev[opId] : {}),
        enabled: true,
        specIndex: Number(specIdx)
      }
    }));
  };

  const handleCustomTableRowToggle = (tableId, rowIndex) => {
    setSelectedCustomTables(prev => {
      const cur = prev?.[tableId] || { enabled: true, rowIndices: [] };
      const exists = (cur.rowIndices || []).includes(rowIndex);
      const updatedIndices = exists 
        ? cur.rowIndices.filter(i => i !== rowIndex)
        : [...(cur.rowIndices || []), rowIndex];
      return {
        ...prev,
        [tableId]: {
          enabled: updatedIndices.length > 0,
          rowIndices: updatedIndices
        }
      };
    });
  };

  return (
    <div className="bg-[#f0f6fc] border border-blue-200/80 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Header with Title and Advanced Toggle (Poppins SemiBold for Heading) */}
      <div className="flex items-center justify-between pb-4 border-b border-[#768087]/80">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 font-heading">
            <SlidersHorizontal className="w-5 h-5 text-blue-600" />
            Cable Specifications & Stage Parameters
          </h2>
          <p className="text-xs text-slate-700 mt-0.5 font-sans font-normal">
            Enter cable specifications to calculate the overall manufacturing time
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-sans border transition-colors ${
            showAdvanced 
              ? 'bg-blue-100 text-blue-800 border-blue-300' 
              : 'bg-white text-slate-700 border-slate-300 hover:bg-blue-50'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Advanced Overrides</span>
          {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* 1. Core Cable Parameters (Length & Rounds) - Lighter Blue Box */}
      <div className="bg-[#f8faff] rounded-xl p-4 border border-blue-100 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-800 flex items-center gap-2 font-heading">
            <Ruler className="w-4 h-4 text-blue-600" /> 1. Cable Dimensions & Winding Inputs
          </span>
          <div className="flex items-center gap-2">
            {cableType === 'Torquelite Flex' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-sans font-medium">
                ⚡ 2× Flex Multiplier
              </span>
            )}
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100/70 text-blue-800 border border-blue-200 font-sans font-medium">
              Range: {windingResults.range.label}
            </span>
          </div>
        </div>

        {/* Cable Type Selector */}
        <div className="mb-4 pb-3 border-b border-blue-100">
          <label className="text-xs font-semibold text-slate-800 block mb-1.5 font-sans">
            Cable Construction Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['Fibrelite', 'Torquelite', 'Torquelite Flex'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setCableType(type)}
                className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                  cableType === type
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-semibold'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-blue-50'
                }`}
              >
                {type}
                {type === 'Torquelite Flex' && (
                  <span className="block text-[10px] font-normal opacity-90">(2× Winding Time)</span>
                )}
              </button>
            ))}
          </div>
          {cableType === 'Torquelite Flex' && (
            <div className="mt-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded px-2.5 py-1 flex items-center gap-1.5 font-medium">
              <span>⚡</span>
              <span><strong>Torquelite Flex Selected:</strong> Standard winding timing is multiplied by <strong>2×</strong>.</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Cable Length */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-700 font-sans">
                Cable Length (Meters)
              </label>
              <span className="text-[11px] font-sans font-medium text-slate-500">
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
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-sans font-normal focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-2xs"
                placeholder="e.g. 15"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none font-sans font-normal">m</span>
            </div>
            {/* Quick length presets */}
            <div className="flex flex-wrap items-center gap-1 mt-2">
              <span className="text-[10px] font-medium text-slate-400 font-sans">Quick:</span>
              {[5, 10, 15, 20, 25, 35, 45].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setLength(val)}
                  className={`px-1.5 py-0.5 text-[10px] rounded font-sans transition-colors border shrink-0 ${
                    Number(length) === val
                      ? 'bg-blue-600 text-white font-medium border-blue-600'
                      : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-blue-50 font-normal'
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
              <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5 font-sans">
                <RotateCw className="w-3.5 h-3.5 text-blue-600" /> Number of Rounds
              </label>
              <span className="text-[11px] font-sans font-medium text-slate-500">
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
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-sans font-normal focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-2xs"
                placeholder="e.g. 50"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none font-sans font-normal">rnds</span>
            </div>
            {/* Quick rounds presets */}
            <div className="flex flex-wrap items-center gap-1 mt-2">
              <span className="text-[10px] font-medium text-slate-400 font-sans">Quick:</span>
              {[25, 50, 75, 100, 150, 200].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setRounds(val)}
                  className={`px-1.5 py-0.5 text-[10px] rounded font-sans transition-colors border shrink-0 ${
                    Number(rounds) === val
                      ? 'bg-blue-600 text-white font-medium border-blue-600'
                      : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-blue-50 font-normal'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Winding formula note (Inter Medium for calculations) */}
        <div className="mt-3 pt-2.5 border-t border-blue-100 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center sm:justify-between font-sans gap-1">
          <span className="font-normal text-slate-500">
            Winding: {windingResults.setupTime}m setup + ({windingResults.ratePerMeterPerRound} min/m/rnd × {length}m × {rounds}r{windingResults.multiplier > 1 ? ` × ${windingResults.multiplier} [Flex]` : ''})
          </span>
          <span className="font-medium text-blue-700">
            = {windingResults.totalTime.toFixed(1)} min ({windingResults.totalHours.toFixed(2)} hrs)
          </span>
        </div>

        {/* Advanced Overrides for Winding */}
        {showAdvanced && (
          <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-600 block mb-1 font-medium font-sans">Winding Setup (min):</label>
              <input
                type="number"
                value={windingSetup}
                onChange={(e) => setWindingSetup(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-sans font-normal"
              />
              <span className="text-[10px] text-slate-400 font-sans font-normal">Fixed baseline is 30 mins</span>
            </div>
            <div>
              <label className="text-slate-600 block mb-1 font-medium font-sans">Speed Override (min/m/rnd):</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.0001"
                  value={customWindingRate ?? ''}
                  onChange={(e) => setCustomWindingRate(e.target.value === '' ? null : e.target.value)}
                  placeholder={String(windingResults.range.windingTimePerMeter)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-sans font-normal"
                />
                {customWindingRate !== null && (
                  <button
                    type="button"
                    onClick={() => setCustomWindingRate(null)}
                    className="text-[11px] text-blue-600 hover:underline shrink-0 font-medium font-sans"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Moulding Stage (End Fittings & Size) - Lighter Blue Box */}
      <div className="bg-[#f8faff] rounded-xl p-4 border border-blue-100 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-800 flex items-center gap-2 font-heading">
            <Disc className="w-4 h-4 text-violet-600" /> 2. Moulding End Fittings
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-800 border border-violet-200 font-sans font-medium">
            {fittingType === 'None' ? 'No Moulding' : `${fittingType} • ${fittingSize}`}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Fitting Type */}
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1.5 font-sans">
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
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-sans font-normal focus:ring-2 focus:ring-violet-500 outline-none shadow-2xs"
            >
              <option value="Thimble">Thimble</option>
              <option value="Spool">Spool</option>
              <option value="None">None (No Moulding)</option>
            </select>
          </div>

          {/* Fitting Size */}
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1.5 font-sans">
              Fitting Size
            </label>
            <select
              disabled={fittingType === 'None'}
              value={fittingSize}
              onChange={(e) => setFittingSize(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-sans font-normal focus:ring-2 focus:ring-violet-500 outline-none disabled:opacity-50 shadow-2xs"
            >
              {fittingType === 'Thimble' && activeMoulding.items.Thimble.map(item => (
                <option key={item.size} value={item.size}>
                  {item.label} ({item.leadTimeMin} min / {item.leadTimeHrs} hrs)
                </option>
              ))}
              {fittingType === 'Spool' && activeMoulding.items.Spool.map(item => (
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
            <label className="text-xs font-medium text-slate-700 block mb-1.5 font-sans">
              Moulded Terminations
            </label>
            <select
              disabled={fittingType === 'None'}
              value={endsCount}
              onChange={(e) => setEndsCount(Number(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-sans font-normal focus:ring-2 focus:ring-violet-500 outline-none disabled:opacity-50 shadow-2xs"
            >
              <option value={2}>2 Ends (Standard - Both Terminations)</option>
              <option value={1}>1 End (Single Termination)</option>
            </select>
          </div>

        </div>

        {/* Moulding formula note */}
        <div className="mt-3 pt-2.5 border-t border-blue-100 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center sm:justify-between font-sans gap-1">
          <span className="font-normal text-slate-500">
            {fittingType === 'None' ? 'No moulding time' : `Chart Lead Time: ${mouldingResults.detail ? mouldingResults.detail.leadTimeMin : 0} min × ${endsCount} end(s)`}
          </span>
          <span className="font-medium text-violet-700">
            = {mouldingResults.leadTime.toFixed(1)} min ({mouldingResults.totalHours.toFixed(2)} hrs)
          </span>
        </div>

        {/* Advanced Overrides for Moulding */}
        {showAdvanced && fittingType !== 'None' && (
          <div className="mt-3 p-3 bg-white rounded-lg border border-violet-200 text-xs">
            <label className="text-slate-600 block mb-1 font-medium font-sans">Custom Moulding Lead Time per End (min):</label>
            <div className="flex items-center gap-2 max-w-xs">
              <input
                type="number"
                step="0.1"
                value={customMouldingLeadTime ?? ''}
                onChange={(e) => setCustomMouldingLeadTime(e.target.value === '' ? null : e.target.value)}
                placeholder={mouldingResults.detail ? String(mouldingResults.detail.leadTimeMin) : '0'}
                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-sans font-normal"
              />
              {customMouldingLeadTime !== null && (
                <button
                  type="button"
                  onClick={() => setCustomMouldingLeadTime(null)}
                  className="text-[11px] text-violet-600 hover:underline shrink-0 font-medium font-sans"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Taping Stage (Setup: 20 min fixed + speed * length) - Lighter Blue Box */}
      <div className="bg-[#f8faff] rounded-xl p-4 border border-blue-100 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="includeTaping"
              checked={includeTaping}
              onChange={(e) => setIncludeTaping(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <label htmlFor="includeTaping" className="text-xs font-semibold uppercase tracking-wider text-slate-800 flex items-center gap-2 cursor-pointer font-heading">
              <ShieldCheck className="w-4 h-4 text-cyan-600" /> 3. Taping Stage ({tapingResults.setupTime} min Setup)
            </label>
          </div>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-sans font-medium ${
            includeTaping 
              ? 'bg-cyan-50 text-cyan-800 border border-cyan-200' 
              : 'bg-slate-200 text-slate-500'
          }`}>
            {includeTaping ? `Active • Rate: ${tapingResults.ratePerMeter} min/m` : 'Bypassed'}
          </span>
        </div>

        {includeTaping && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Post-Taping Diameter Input */}
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1 font-sans flex items-center justify-between">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <CircleDot className="w-3.5 h-3.5 text-cyan-600" />
                    Post-Taping Diameter
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Base OD</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0.5"
                    max="100"
                    step="0.5"
                    value={postTapingDiameter}
                    onChange={(e) => setPostTapingDiameter(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-sans font-medium focus:ring-2 focus:ring-cyan-500 outline-none shadow-2xs"
                    placeholder="e.g. 12.0"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none font-sans">mm</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Core cable diameter after taping before braiding starts
                </span>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1 font-sans">
                  Matched Taping Speed for 1m
                </label>
                <div className="bg-white border border-slate-300 rounded-lg px-3 py-2 flex items-center justify-between text-sm shadow-2xs font-sans">
                  <span className="text-slate-500 text-xs font-normal">Cohort: {tapingResults.range.label}</span>
                  <span className="text-cyan-700 font-medium">{tapingResults.ratePerMeter} min/m</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">Auto-selected from length range</span>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1 font-sans">
                  Fixed Setup Allowance
                </label>
                <div className="bg-white border border-slate-300 rounded-lg px-3 py-2 flex items-center justify-between text-sm shadow-2xs font-sans">
                  <span className="text-slate-500 text-xs font-normal">Standard across all lengths</span>
                  <span className="text-cyan-700 font-medium">{tapingResults.setupTime} mins</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">Fixed 20 mins baseline</span>
              </div>
            </div>

            {/* Taping formula note */}
            <div className="mt-3 pt-2.5 border-t border-blue-100 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center sm:justify-between font-sans gap-1">
              <span className="font-normal text-slate-500">
                Taping: {tapingResults.setupTime}m setup + ({tapingResults.ratePerMeter} min/m × {length}m)
              </span>
              <span className="font-medium text-cyan-700">
                = {tapingResults.totalTime.toFixed(1)} min ({tapingResults.totalHours.toFixed(2)} hrs)
              </span>
            </div>

            {/* Advanced Overrides for Taping */}
            {showAdvanced && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-cyan-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-600 block mb-1 font-medium font-sans">Taping Setup (min):</label>
                  <input
                    type="number"
                    value={tapingSetup}
                    onChange={(e) => setTapingSetup(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-sans font-normal"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-medium font-sans">Taping Speed (min/m):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.0001"
                      value={customTapingRate ?? ''}
                      onChange={(e) => setCustomTapingRate(e.target.value === '' ? null : e.target.value)}
                      placeholder={String(tapingResults.range.tapingTimePerMeter)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-sans font-normal"
                    />
                    {customTapingRate !== null && (
                      <button
                        type="button"
                        onClick={() => setCustomTapingRate(null)}
                        className="text-[11px] text-cyan-600 hover:underline shrink-0 font-medium font-sans"
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

      {/* 4. Braiding Stage (Setup: Base setup + setup per layer) - Lighter Blue Box */}
      <div className="bg-[#f8faff] rounded-xl p-4 border border-blue-100 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="includeBraiding"
              checked={includeBraiding}
              onChange={(e) => setIncludeBraiding(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <label htmlFor="includeBraiding" className="text-xs font-semibold uppercase tracking-wider text-slate-800 flex items-center gap-2 cursor-pointer font-heading">
              <Layers className="w-4 h-4 text-emerald-600" /> 4. Braiding Layers Architecture (Up to 50 Layers)
            </label>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {braidingResults.timeSaved > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-sans font-medium">
                ⚡ {braidingResults.timeSaved.toFixed(0)}m Saved (Tandem)
              </span>
            )}
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-sans font-medium">
              Setup: {braidingResults.setupTime}m ({braidingResults.baseSetup}m + {braidingLayers.length}×{braidingResults.perLayerSetup}m)
            </span>
          </div>
        </div>

        {includeBraiding && (
          <div className="space-y-3">
            {/* Calculated Outer Diameter (OD) Display Cell */}
            <div className="bg-gradient-to-br from-emerald-50/70 to-blue-50/60 p-3.5 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-950 uppercase tracking-wider font-heading flex items-center gap-1.5">
                    <CircleDot className="w-4 h-4 text-emerald-600" />
                    Calculated Outer Diameter (OD)
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                    +{braidingLayers.length} mm from {braidingLayers.length} Layer(s)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 font-sans">
                  {postTapingDiameter} mm base + ({braidingLayers.length} layer(s) × 1 mm) = <strong className="text-emerald-900 font-semibold">{braidingResults.finalOuterDiameter?.toFixed(1) ?? '12.0'} mm</strong> (Used for Box Preparation in Finishing)
                </p>
              </div>
              <div className="flex items-baseline gap-1.5 bg-white px-3.5 py-1.5 rounded-lg border border-emerald-200 shrink-0 shadow-2xs">
                <span className="text-2xl font-black text-slate-900 font-heading">
                  {braidingResults.finalOuterDiameter?.toFixed(1) ?? '12.0'}
                </span>
                <span className="text-sm font-semibold text-emerald-700">mm</span>
              </div>
            </div>

            {/* Toolbar with 50-layer capacity and fast layer setters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-3 rounded-lg border border-slate-200 text-xs shadow-2xs font-sans gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-700 font-medium">Layers Configured:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {braidingLayers.length} / 50
                </span>
                <span className="text-slate-400 text-[11px] font-normal">(+{braidingResults.perLayerSetup}m setup each)</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setFixedLayersPreset(10)}
                  className="text-[10px] text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded px-2 py-1 font-medium"
                  title="Configure 10 layers"
                >
                  10 L
                </button>
                <button
                  type="button"
                  onClick={() => setFixedLayersPreset(30)}
                  className="text-[10px] text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded px-2 py-1 font-medium"
                  title="Configure 30 layers"
                >
                  30 L
                </button>
                <button
                  type="button"
                  onClick={() => setFixedLayersPreset(40)}
                  className="text-[10px] text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded px-2 py-1 font-medium"
                  title="Configure 40 layers"
                >
                  40 L
                </button>
                <button
                  type="button"
                  onClick={() => setFixedLayersPreset(50)}
                  className="text-[10px] text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded px-2 py-1 font-medium"
                  title="Configure 50 layers"
                >
                  50 L
                </button>
                <button
                  type="button"
                  onClick={() => addMultipleLayers(5)}
                  disabled={braidingLayers.length >= 50}
                  className="text-[10px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded px-2 py-1 font-medium disabled:opacity-50"
                  title="Add 5 layers at once"
                >
                  +5
                </button>
                {braidingLayers.length > 1 && (
                  <button
                    type="button"
                    onClick={applyFirstLayerToAll}
                    className="text-[10px] text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded px-2 py-1 font-medium"
                  >
                    Match L1
                  </button>
                )}
                <button
                  type="button"
                  onClick={addLayer}
                  disabled={braidingLayers.length >= 50}
                  className="flex items-center gap-1 text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white rounded px-2.5 py-1 font-medium transition-colors disabled:opacity-50 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Layer
                </button>
              </div>
            </div>

            {/* 2-Machine Tandem Notification Banner */}
            {tandemBraidingEnabled && (
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-950 flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-start md:items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1 md:mt-0 animate-pulse" />
                  <span>
                    <strong>2-Machine Tandem Braiding Active:</strong> Consecutive layers with identical bobbin structures run together (+{tandemOffset}m stagger). <strong>Rule:</strong> The final layer is always braided alone.
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="bg-white px-2 py-0.5 rounded border border-emerald-300 font-semibold text-emerald-800 text-[11px]">
                    {braidingResults.pairCount || 0} Pairs ({((braidingResults.pairCount || 0) * 2)} Layers) + {braidingResults.singleCount || 0} Single Runs
                  </span>
                </div>
              </div>
            )}

            {/* Individual Layer Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {braidingLayers.map((layer, index) => {
                const calc = braidingResults.layers[index] || { ratePerMeter: 2.0, layerTime: 30 };
                return (
                  <div 
                    key={layer.id || index}
                    className={`border rounded-xl p-3 space-y-2.5 shadow-2xs transition-all ${
                      calc.isTandem
                        ? calc.runMode === 'tandem_primary'
                          ? 'bg-white border-emerald-300 ring-1 ring-emerald-200'
                          : 'bg-emerald-50/30 border-teal-300 ring-1 ring-teal-200'
                        : index === braidingLayers.length - 1 && braidingLayers.length > 1
                          ? 'bg-amber-50/30 border-amber-300'
                          : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full font-sans text-[11px] font-medium flex items-center justify-center border ${
                          calc.isTandem
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : index === braidingLayers.length - 1 && braidingLayers.length > 1
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-slate-100 text-slate-800 border-slate-300'
                        }`}>
                          L{index + 1}
                        </span>
                        <span className="text-xs font-semibold text-slate-900 font-sans">
                          Braiding Layer {index + 1}
                        </span>
                      </div>

                      {/* Run Mode Badge */}
                      <div className="flex items-center gap-1.5">
                        {calc.isTandem && calc.runMode === 'tandem_primary' && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium">
                            🔗 Machine 1 (Tandem Lead)
                          </span>
                        )}
                        {calc.isTandem && calc.runMode === 'tandem_secondary' && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200 font-medium">
                            🔗 Machine 2 (+{calc.staggerOffset}m stagger)
                          </span>
                        )}
                        {!calc.isTandem && index === braidingLayers.length - 1 && braidingLayers.length > 1 && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 font-medium" title="Rule: Final layer is always braided alone">
                            🛑 Single (Final Layer Alone)
                          </span>
                        )}
                        {!calc.isTandem && !(index === braidingLayers.length - 1 && braidingLayers.length > 1) && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                            ⚡ Single Run
                          </span>
                        )}

                        {braidingLayers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLayer(index)}
                            className="text-slate-400 hover:text-red-500 p-1 transition-colors ml-1"
                            title="Remove this layer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                      <div>
                        <label className="text-[11px] text-slate-600 font-medium block mb-1">Bobbins (Carriers):</label>
                        <select
                          value={layer.bobbins}
                          onChange={(e) => handleLayerBobbinChange(index, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-900 font-normal outline-none focus:border-emerald-500"
                        >
                          <option value={16}>16 Bobbins</option>
                          <option value={32}>32 Bobbins</option>
                          <option value={64}>64 Bobbins</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-600 font-medium block mb-1">Braid Type:</label>
                        <select
                          value={layer.type}
                          onChange={(e) => handleLayerTypeChange(index, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-900 font-normal outline-none focus:border-emerald-500"
                        >
                          <option value={1}>Type 1</option>
                          <option value={2}>Type 2</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-slate-50/80 rounded-lg p-2 text-[11px] border border-slate-200 font-sans space-y-1">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>
                          Core Dia: <strong className="text-slate-900 font-semibold">{calc.incomingDiameter?.toFixed(1) ?? (Number(postTapingDiameter) + index).toFixed(1)} mm</strong>
                          <span className="text-slate-400 ml-1">({calc.matchedRange || '0-10'} mm range)</span>
                        </span>
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
                          +1mm → {(calc.outgoingDiameter ?? (Number(postTapingDiameter) + index + 1)).toFixed(1)} mm
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                        <span className="text-slate-600 font-normal">
                          Speed: <strong className="text-emerald-700 font-semibold">{calc.ratePerMeter} min/m</strong>
                          {calc.isTandem && calc.runMode === 'tandem_secondary' && (
                            <span className="text-teal-700 ml-1">(+5m stagger)</span>
                          )}
                        </span>
                        <span className="text-slate-900 font-semibold">
                          {calc.isTandem && calc.runMode === 'tandem_secondary' ? (
                            <span title={`Nominal process time: ${calc.layerTime.toFixed(1)} mins, but runs concurrently on Machine 2 with only a ${calc.staggerOffset} min stagger`}>
                              +{calc.effectiveTime.toFixed(1)}m added <span className="text-slate-400 font-normal line-through">({calc.layerTime.toFixed(1)}m)</span>
                            </span>
                          ) : (
                            <span>= {calc.layerTime.toFixed(1)} mins</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Braiding formula note */}
            <div className="mt-3 pt-2.5 border-t border-blue-100 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center sm:justify-between font-sans gap-1">
              <span className="font-normal text-slate-500">
                Braiding: {braidingResults.setupTime}m setup ({braidingResults.baseSetup}m base + {braidingLayers.length}×{braidingResults.perLayerSetup}m) + {braidingResults.processTime.toFixed(1)}m run
                {braidingResults.timeSaved > 0 && (
                  <strong className="text-emerald-700 font-medium ml-1">
                    (-{braidingResults.timeSaved.toFixed(1)}m saved via 2 tandem machines)
                  </strong>
                )}
              </span>
              <span className="font-medium text-emerald-700">
                = {braidingResults.totalTime.toFixed(1)} min ({braidingResults.totalHours.toFixed(2)} hrs)
              </span>
            </div>

            {/* Advanced Overrides for Braiding */}
            {showAdvanced && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-emerald-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-sans">
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">Base Setup (min):</label>
                  <input
                    type="number"
                    value={braidingBaseSetup}
                    onChange={(e) => setBraidingBaseSetup(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-normal"
                  />
                  <span className="text-[10px] text-slate-400 font-normal">Base setup {braidingResults.baseSetup} mins</span>
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">Setup per Layer (min):</label>
                  <input
                    type="number"
                    value={braidingSetupPerLayer}
                    onChange={(e) => setBraidingSetupPerLayer(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-normal"
                  />
                  <span className="text-[10px] text-slate-400 font-normal">{braidingResults.perLayerSetup} mins per layer</span>
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">Tandem Stagger (min):</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    step="1"
                    value={tandemOffset}
                    onChange={(e) => setTandemOffset(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-normal"
                  />
                  <span className="text-[10px] text-slate-400 font-normal">Machine 2 start delay (default 5m)</span>
                </div>
                <div className="flex flex-col justify-center">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 mt-2">
                    <input
                      type="checkbox"
                      checked={tandemBraidingEnabled}
                      onChange={(e) => setTandemBraidingEnabled(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500"
                    />
                    <span>Enable 2-Machine Tandem</span>
                  </label>
                  <span className="text-[10px] text-slate-400 mt-1">Parallel matching layers</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Finishing Operations (Auto-Identified from Previous Data) */}
      <div className="bg-[#f8faff] rounded-xl p-4 border border-blue-100 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="includeFinishing"
              checked={includeFinishing}
              onChange={(e) => setIncludeFinishing(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <label htmlFor="includeFinishing" className="text-xs font-semibold uppercase tracking-wider text-slate-800 flex items-center gap-2 cursor-pointer font-heading">
              <CheckCircle2 className="w-4 h-4 text-amber-600" /> 5. Finishing Operations (Auto-Calculated)
            </label>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-sans font-medium ${
              includeFinishing ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-200 text-slate-500'
            }`}>
              {includeFinishing ? `${finishingResults?.totalTime?.toFixed(1) || 0} min (${finishingResults?.totalHours?.toFixed(2) || 0} hrs)` : 'Bypassed'}
            </span>
          </div>
        </div>

        {/* Auto-Detection Indicator Banner */}
        {includeFinishing && (
          <>
            <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-2.5 text-xs text-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-2xs font-sans">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-amber-900">Auto-Detected Context:</span>
                <span className="bg-white px-2 py-0.5 rounded border border-amber-300 font-medium text-amber-800 text-[11px]">
                  Type: {cableType}
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-amber-300 font-medium text-amber-800 text-[11px]">
                  Length: {length}m
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-amber-300 font-medium text-amber-800 text-[11px]">
                  Rounds: {rounds}
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-amber-300 font-medium text-amber-800 text-[11px]">
                  Fitting: {fittingType} {fittingSize}
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-amber-300 font-medium text-amber-800 text-[11px]">
                  Outer Dia: {(braidingResults?.finalOuterDiameter ?? (Number(cableOD) || 12)).toFixed(1)}mm
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-normal">
                Specs auto-matched from rate tables
              </span>
            </div>

            {/* List of auto-matched operations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 font-sans">
              {(finishingResults?.allOperations || []).map((op) => {
                const isWooden = op.note?.includes('Wooden Box');
                return (
                  <div 
                    key={op.id} 
                    className={`border rounded-xl p-3 space-y-2 text-xs shadow-2xs transition-all ${
                      op.enabled && op.isApplicable
                        ? isWooden
                          ? 'bg-amber-50/40 border-amber-300'
                          : 'bg-white border-slate-200'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 font-semibold text-slate-900 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={op.enabled}
                          disabled={!op.isApplicable}
                          onChange={() => handleFinishingToggle(op.id, op.enabled)}
                          className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                        />
                        <span className={!op.isApplicable ? 'line-through text-slate-400' : ''}>
                          {op.name}
                        </span>
                      </label>
                      {op.cableType && op.cableType !== 'All' && (
                        <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200 shrink-0 font-medium">
                          {op.cableType}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-normal">
                        Matched: <strong className="text-slate-800 font-medium">{op.spec}</strong>
                      </span>
                      <span className="font-bold text-slate-900">
                        {isWooden ? (
                          <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                            Wooden Box (0 min)
                          </span>
                        ) : op.enabled && op.isApplicable ? (
                          <span className="text-amber-800">
                            {op.processTime} min ({(op.processTime / 60).toFixed(2)} hrs)
                          </span>
                        ) : (
                          <span className="text-slate-400">0 min</span>
                        )}
                      </span>
                    </div>

                    {/* Auto-matching Reason Note */}
                    {op.note && (
                      <div className="text-[10px] text-slate-500 bg-slate-50 rounded px-2 py-1 border border-slate-200 flex items-center justify-between">
                        <span>{op.note}</span>
                        {op.specs && op.specs.length > 1 && (
                          <select
                            value={op.specIndex}
                            onChange={(e) => handleFinishingSpecChange(op.id, e.target.value)}
                            className="text-[10px] bg-white border border-slate-300 rounded px-1.5 py-0.5 text-slate-700 outline-none ml-2"
                            title="Override auto-matched specification"
                          >
                            {op.specs.map((s, idx) => (
                              <option key={idx} value={idx}>
                                {s.spec} ({s.processTime}m)
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Finishing formula note */}
            <div className="mt-2 pt-2 border-t border-blue-100 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center sm:justify-between font-sans gap-1">
              <span className="font-normal text-slate-500">
                Finishing Operations: {finishingResults?.items?.length || 0} active operations auto-calculated
              </span>
              <span className="font-medium text-amber-700">
                = {finishingResults?.totalTime?.toFixed(1) || 0} min ({finishingResults?.totalHours?.toFixed(2) || 0} hrs)
              </span>
            </div>
          </>
        )}
      </div>

      {/* 6. Custom Process Stage Tables (If created via "Add New Table") */}
      {referenceData?.customTables?.length > 0 && (
        <div className="bg-[#f8faff] rounded-xl p-4 border border-indigo-100 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-800 flex items-center gap-2 font-heading">
              <Database className="w-4 h-4 text-indigo-600" /> 6. Custom Process Tables ({referenceData.customTables.length})
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-sans font-medium">
              Click rows to include in calculation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {referenceData.customTables.map((tbl) => {
              const selection = selectedCustomTables?.[tbl.id] || { enabled: true, rowIndices: [] };
              return (
                <div key={tbl.id} className="bg-white border border-indigo-200 rounded-xl p-3 space-y-2 text-xs shadow-2xs font-sans">
                  <div className="flex items-center justify-between border-b border-indigo-100 pb-1.5">
                    <div>
                      <h4 className="font-bold text-slate-900">{tbl.name}</h4>
                      <span className="text-[10px] text-slate-500">{tbl.category}</span>
                    </div>
                    {tbl.fixedSetupTime > 0 && (
                      <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        Setup: {tbl.fixedSetupTime}m
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-1.5">
                    {tbl.rows.map((r, rIdx) => {
                      const isRowSelected = (selection.rowIndices || []).includes(rIdx);
                      return (
                        <label 
                          key={rIdx} 
                          className={`flex items-center justify-between p-1.5 rounded cursor-pointer border transition-colors ${
                            isRowSelected ? 'bg-indigo-50/70 border-indigo-300 font-medium' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isRowSelected}
                              onChange={() => handleCustomTableRowToggle(tbl.id, rIdx)}
                              className="w-3.5 h-3.5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                            />
                            <span>{r.item} ({r.spec})</span>
                          </div>
                          <strong className="text-indigo-800 font-mono">
                            {r.processTime} min ({(Number(r.processTime) / 60).toFixed(2)} hrs)
                          </strong>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

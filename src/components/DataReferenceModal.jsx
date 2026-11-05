import React, { useState, useEffect } from 'react';
import { 
  X, 
  Table, 
  RotateCw, 
  Disc, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  Edit3, 
  Save, 
  RotateCcw, 
  Check, 
  AlertCircle,
  Download
} from 'lucide-react';
import { INITIAL_REFERENCE_DATA } from '../data/manufacturingData.js';

export default function DataReferenceModal({ 
  isOpen, 
  onClose, 
  referenceData, 
  onSaveReferenceData, 
  onResetReferenceData 
}) {
  const [activeTab, setActiveTab] = useState('winding');
  const [isEditing, setIsEditing] = useState(false);
  const [localData, setLocalData] = useState(referenceData || INITIAL_REFERENCE_DATA);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync when modal opens or referenceData changes
  useEffect(() => {
    if (referenceData) {
      setLocalData(JSON.parse(JSON.stringify(referenceData)));
    }
  }, [referenceData, isOpen]);

  if (!isOpen) return null;

  // Handlers for modifying values in local copy
  const handleWindingRangeChange = (index, field, value) => {
    const updated = JSON.parse(JSON.stringify(localData));
    updated.winding.lengthRanges[index][field] = Number(value);
    setLocalData(updated);
  };

  const handleWindingSetupChange = (value) => {
    const updated = JSON.parse(JSON.stringify(localData));
    updated.winding.fixedSetupTime = Number(value);
    setLocalData(updated);
  };

  const handleMouldingItemChange = (type, index, field, value) => {
    const updated = JSON.parse(JSON.stringify(localData));
    const num = Number(value);
    updated.moulding.items[type][index][field] = num;
    if (field === 'leadTimeMin') {
      updated.moulding.items[type][index].leadTimeHrs = Number((num / 60).toFixed(2));
      updated.moulding.items[type][index].labourHrs = Number((num / 60).toFixed(2));
    }
    setLocalData(updated);
  };

  const handleTapingRangeChange = (index, field, value) => {
    const updated = JSON.parse(JSON.stringify(localData));
    updated.taping.lengthRanges[index][field] = Number(value);
    setLocalData(updated);
  };

  const handleTapingSetupChange = (value) => {
    const updated = JSON.parse(JSON.stringify(localData));
    updated.taping.fixedSetupTime = Number(value);
    setLocalData(updated);
  };

  const handleBraidingSetupChange = (field, value) => {
    const updated = JSON.parse(JSON.stringify(localData));
    updated.braiding[field] = Number(value);
    setLocalData(updated);
  };

  const handleBraidingLayerChange = (index, field, value) => {
    const updated = JSON.parse(JSON.stringify(localData));
    updated.braiding.layerDetails[index][field] = Number(value);
    setLocalData(updated);
  };

  const handleSave = () => {
    onSaveReferenceData(localData);
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all reference tables back to original Excel study values?')) {
      const defaults = JSON.parse(JSON.stringify(INITIAL_REFERENCE_DATA));
      setLocalData(defaults);
      onResetReferenceData();
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(localData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cable_reference_data_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700 border border-blue-200">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-900 font-heading">
                  Production Timing Study — Reference Tables & Rates
                </h3>
                {isEditing ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-medium font-sans animate-pulse">
                    Editing Mode Active
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-sans font-medium">
                    Standard Rates
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-sans font-normal">
                View or edit standard speeds, setup allowances, and lead time lookup tables
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Reference Table</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-600 border border-slate-300"
                >
                  Cancel
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Save confirmation banner */}
        {saveSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 flex items-center justify-between text-xs text-emerald-800 font-medium animate-in fade-in">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              Reference tables updated successfully! The calculator will now use these updated rates.
            </span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 pt-3 border-b border-slate-200 bg-white text-xs">
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('winding')}
              className={`flex items-center gap-1.5 px-3.5 py-2 border-b-2 font-bold transition-colors whitespace-nowrap ${
                activeTab === 'winding' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" /> Winding Speeds
            </button>
            <button
              onClick={() => setActiveTab('moulding')}
              className={`flex items-center gap-1.5 px-3.5 py-2 border-b-2 font-bold transition-colors whitespace-nowrap ${
                activeTab === 'moulding' 
                  ? 'border-violet-600 text-violet-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Disc className="w-3.5 h-3.5" /> Moulding Lead Times
            </button>
            <button
              onClick={() => setActiveTab('taping')}
              className={`flex items-center gap-1.5 px-3.5 py-2 border-b-2 font-bold transition-colors whitespace-nowrap ${
                activeTab === 'taping' 
                  ? 'border-cyan-600 text-cyan-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Taping Speeds
            </button>
            <button
              onClick={() => setActiveTab('braiding')}
              className={`flex items-center gap-1.5 px-3.5 py-2 border-b-2 font-bold transition-colors whitespace-nowrap ${
                activeTab === 'braiding' 
                  ? 'border-emerald-600 text-emerald-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Braiding Speeds
            </button>
          </div>

          <div className="flex items-center gap-2 pb-1">
            <button
              type="button"
              onClick={handleExportJSON}
              className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 hover:underline"
              title="Download rates as JSON file"
            >
              <Download className="w-3 h-3" />
              <span>Export JSON</span>
            </button>
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="text-[11px] text-red-600 hover:text-red-700 flex items-center gap-1 hover:underline ml-2"
              title="Reset all tables to initial Excel numbers"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          
          {/* TAB 1: WINDING */}
          {activeTab === 'winding' && (
            <div className="space-y-4">
              <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-blue-700">Winding Setup Time:</span> Standard setup time for all length ranges.
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-semibold text-xs">Setup (min):</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={localData.winding.fixedSetupTime}
                      onChange={(e) => handleWindingSetupChange(e.target.value)}
                      className="w-20 px-2 py-1 bg-white border border-blue-400 rounded text-slate-900 font-mono font-bold text-xs"
                    />
                  ) : (
                    <span className="font-mono font-extrabold text-blue-800 bg-white px-2 py-1 rounded border border-blue-200">
                      {localData.winding.fixedSetupTime} min
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Length Range & Winding Speed (min/m/round)</h4>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left font-mono">
                    <thead className="bg-slate-100 text-slate-600 text-[11px]">
                      <tr>
                        <th className="p-2.5">Length Cohort</th>
                        <th className="p-2.5 text-blue-700 font-bold">Winding Speed for 1m (min)</th>
                        <th className="p-2.5">Lead Time for 1m (min)</th>
                        <th className="p-2.5">Samples</th>
                        <th className="p-2.5">Historical Avg Time (min)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      {localData.winding.lengthRanges.map((r, idx) => (
                        <tr key={r.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">{r.label}</td>
                          <td className="p-2.5">
                            {isEditing ? (
                              <input
                                type="number"
                                step="0.0001"
                                value={r.windingTimePerMeter}
                                onChange={(e) => handleWindingRangeChange(idx, 'windingTimePerMeter', e.target.value)}
                                className="w-28 px-2 py-1 bg-white border border-blue-400 rounded text-blue-800 font-mono font-bold text-xs"
                              />
                            ) : (
                              <span className="font-bold text-blue-700">{r.windingTimePerMeter}</span>
                            )}
                          </td>
                          <td className="p-2.5">{r.leadTimePerMeter}</td>
                          <td className="p-2.5">{r.samples}</td>
                          <td className="p-2.5">{r.avgLeadTime} min</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MOULDING */}
          {activeTab === 'moulding' && (
            <div className="space-y-4">
              <div className="bg-violet-50/70 p-3.5 rounded-xl border border-violet-200 text-slate-700">
                <span className="font-bold text-violet-700">Moulding Lead Time Chart:</span> The time taken to mould each fitting size.
              </div>

              {/* Thimble Table */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Thimble Fittings (Sizes 1–6)</h4>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left font-mono">
                    <thead className="bg-slate-100 text-slate-600 text-[11px]">
                      <tr>
                        <th className="p-2.5">Fitting Type</th>
                        <th className="p-2.5">Size</th>
                        <th className="p-2.5 text-violet-700 font-bold">Lead Time (min)</th>
                        <th className="p-2.5">Lead Time (hours)</th>
                        <th className="p-2.5">Labour Hours</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      {localData.moulding.items.Thimble.map((item, idx) => (
                        <tr key={item.size} className="hover:bg-slate-50">
                          <td className="p-2.5 text-slate-500">Thimble</td>
                          <td className="p-2.5 font-bold text-slate-900">{item.label}</td>
                          <td className="p-2.5">
                            {isEditing ? (
                              <input
                                type="number"
                                step="0.01"
                                value={item.leadTimeMin}
                                onChange={(e) => handleMouldingItemChange('Thimble', idx, 'leadTimeMin', e.target.value)}
                                className="w-28 px-2 py-1 bg-white border border-violet-400 rounded text-violet-800 font-mono font-bold text-xs"
                              />
                            ) : (
                              <span className="font-bold text-violet-700">{item.leadTimeMin} min</span>
                            )}
                          </td>
                          <td className="p-2.5">{item.leadTimeHrs} hrs</td>
                          <td className="p-2.5">{item.labourHrs} hrs</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Spool Table */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Spool Fittings (OD Ranges)</h4>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left font-mono">
                    <thead className="bg-slate-100 text-slate-600 text-[11px]">
                      <tr>
                        <th className="p-2.5">Fitting Type</th>
                        <th className="p-2.5">Size</th>
                        <th className="p-2.5 text-violet-700 font-bold">Lead Time (min)</th>
                        <th className="p-2.5">Lead Time (hours)</th>
                        <th className="p-2.5">Labour Hours</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      {localData.moulding.items.Spool.map((item, idx) => (
                        <tr key={item.size} className="hover:bg-slate-50">
                          <td className="p-2.5 text-slate-500">Spool</td>
                          <td className="p-2.5 font-bold text-slate-900">{item.label}</td>
                          <td className="p-2.5">
                            {isEditing ? (
                              <input
                                type="number"
                                step="0.01"
                                value={item.leadTimeMin}
                                onChange={(e) => handleMouldingItemChange('Spool', idx, 'leadTimeMin', e.target.value)}
                                className="w-28 px-2 py-1 bg-white border border-violet-400 rounded text-violet-800 font-mono font-bold text-xs"
                              />
                            ) : (
                              <span className="font-bold text-violet-700">{item.leadTimeMin} min</span>
                            )}
                          </td>
                          <td className="p-2.5">{item.leadTimeHrs} hrs</td>
                          <td className="p-2.5">{item.labourHrs} hrs</td>
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
              <div className="bg-cyan-50/70 p-3.5 rounded-xl border border-cyan-200 text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-cyan-700">Taping Setup Time:</span> Standard setup time across all lengths.
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-semibold text-xs">Setup (min):</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={localData.taping.fixedSetupTime}
                      onChange={(e) => handleTapingSetupChange(e.target.value)}
                      className="w-20 px-2 py-1 bg-white border border-cyan-400 rounded text-slate-900 font-mono font-bold text-xs"
                    />
                  ) : (
                    <span className="font-mono font-extrabold text-cyan-800 bg-white px-2 py-1 rounded border border-cyan-200">
                      {localData.taping.fixedSetupTime} min
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Taping Speed for 1m (min/m)</h4>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left font-mono">
                    <thead className="bg-slate-100 text-slate-600 text-[11px]">
                      <tr>
                        <th className="p-2.5">Length Cohort</th>
                        <th className="p-2.5 text-cyan-700 font-bold">Taping Speed for 1m (min)</th>
                        <th className="p-2.5">Lead Time for 1m (min)</th>
                        <th className="p-2.5">Samples</th>
                        <th className="p-2.5">Historical Avg Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      {localData.taping.lengthRanges.map((r, idx) => (
                        <tr key={r.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">{r.label}</td>
                          <td className="p-2.5">
                            {isEditing ? (
                              <input
                                type="number"
                                step="0.0001"
                                value={r.tapingTimePerMeter}
                                onChange={(e) => handleTapingRangeChange(idx, 'tapingTimePerMeter', e.target.value)}
                                className="w-28 px-2 py-1 bg-white border border-cyan-400 rounded text-cyan-800 font-mono font-bold text-xs"
                              />
                            ) : (
                              <span className="font-bold text-cyan-700">{r.tapingTimePerMeter}</span>
                            )}
                          </td>
                          <td className="p-2.5">{r.leadTimePerMeter}</td>
                          <td className="p-2.5">{r.samples}</td>
                          <td className="p-2.5">{r.avgLeadTime} min</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BRAIDING */}
          {activeTab === 'braiding' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 text-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-700">Base Setup Allowance:</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={localData.braiding.baseSetupTime}
                      onChange={(e) => handleBraidingSetupChange('baseSetupTime', e.target.value)}
                      className="w-20 px-2 py-1 bg-white border border-emerald-400 rounded text-slate-900 font-mono font-bold text-xs"
                    />
                  ) : (
                    <span className="font-mono font-extrabold text-emerald-800 bg-white px-2 py-1 rounded border border-emerald-200">
                      {localData.braiding.baseSetupTime} min
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-700">Setup per Layer:</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={localData.braiding.setupTimePerLayer}
                      onChange={(e) => handleBraidingSetupChange('setupTimePerLayer', e.target.value)}
                      className="w-20 px-2 py-1 bg-white border border-emerald-400 rounded text-slate-900 font-mono font-bold text-xs"
                    />
                  ) : (
                    <span className="font-mono font-extrabold text-emerald-800 bg-white px-2 py-1 rounded border border-emerald-200">
                      {localData.braiding.setupTimePerLayer} min
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Braiding Carrier Rates (min/m)</h4>
                <div className="overflow-x-auto rounded-lg border border-slate-200 max-h-96">
                  <table className="w-full text-left font-mono">
                    <thead className="bg-slate-100 text-slate-600 text-[11px] sticky top-0">
                      <tr>
                        <th className="p-2.5">Length Cohort</th>
                        <th className="p-2.5">Description</th>
                        <th className="p-2.5">Bobbins</th>
                        <th className="p-2.5">Type</th>
                        <th className="p-2.5 text-emerald-700 font-bold">Speed for 1m (min)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      {localData.braiding.layerDetails.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">{item.lengthRange} m</td>
                          <td className="p-2.5 font-bold text-emerald-700">{item.desc}</td>
                          <td className="p-2.5">{item.bobbins}</td>
                          <td className="p-2.5">Type {item.type}</td>
                          <td className="p-2.5">
                            {isEditing ? (
                              <input
                                type="number"
                                step="0.0001"
                                value={item.leadTimePerMeter}
                                onChange={(e) => handleBraidingLayerChange(idx, 'leadTimePerMeter', e.target.value)}
                                className="w-24 px-2 py-1 bg-white border border-emerald-400 rounded text-emerald-800 font-mono font-bold text-xs"
                              />
                            ) : (
                              <span className="font-bold text-emerald-700">{item.leadTimePerMeter}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {isEditing ? 'Editing active. Click "Save Changes" to apply.' : 'Any customized rates are saved to your browser.'}
          </span>
          <div className="flex items-center gap-2">
            {isEditing && (
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors"
              >
                Save Changes
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

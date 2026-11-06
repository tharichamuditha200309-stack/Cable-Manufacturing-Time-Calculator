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
  Download,
  Plus,
  Trash2,
  Database,
  PlusCircle,
  FolderPlus
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

  // New Table Creator State
  const [isCreatingTable, setIsCreatingTable] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableCategory, setNewTableCategory] = useState('');
  const [newTableFixedSetup, setNewTableFixedSetup] = useState(0);

  // Sync when modal opens or referenceData changes
  useEffect(() => {
    if (referenceData) {
      const cloned = JSON.parse(JSON.stringify(referenceData));
      if (!cloned.customTables) cloned.customTables = [];
      if (!cloned.finishing) cloned.finishing = JSON.parse(JSON.stringify(INITIAL_REFERENCE_DATA.finishing));
      setLocalData(cloned);
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

  // Handlers for Finishing Operations Table
  const handleFinishingSpecChange = (opIndex, specIndex, field, value) => {
    const updated = JSON.parse(JSON.stringify(localData));
    if (!updated.finishing) updated.finishing = JSON.parse(JSON.stringify(INITIAL_REFERENCE_DATA.finishing));
    if (field === 'processTime' || field === 'labours' || field === 'labourHrs') {
      const num = Number(value);
      updated.finishing[opIndex].specs[specIndex][field] = num;
      // Auto-calculate approximate labour hrs if processTime or labours change
      if (field === 'processTime') {
        const labours = updated.finishing[opIndex].specs[specIndex].labours || 1;
        updated.finishing[opIndex].specs[specIndex].labourHrs = Number(((num / 60) * labours).toFixed(2));
      }
    } else {
      updated.finishing[opIndex].specs[specIndex][field] = value;
    }
    setLocalData(updated);
  };

  const handleFinishingOpMetaChange = (opIndex, field, value) => {
    const updated = JSON.parse(JSON.stringify(localData));
    if (!updated.finishing) updated.finishing = JSON.parse(JSON.stringify(INITIAL_REFERENCE_DATA.finishing));
    updated.finishing[opIndex][field] = value;
    setLocalData(updated);
  };

  const handleAddFinishingSpec = (opIndex) => {
    const updated = JSON.parse(JSON.stringify(localData));
    if (!updated.finishing) updated.finishing = JSON.parse(JSON.stringify(INITIAL_REFERENCE_DATA.finishing));
    updated.finishing[opIndex].specs.push({
      spec: 'New Specification',
      processTime: 30,
      labours: 2,
      labourHrs: 1.0
    });
    setLocalData(updated);
  };

  const handleDeleteFinishingSpec = (opIndex, specIndex) => {
    const updated = JSON.parse(JSON.stringify(localData));
    if (!updated.finishing) return;
    if (updated.finishing[opIndex].specs.length <= 1) {
      if (window.confirm('Delete this entire finishing operation?')) {
        updated.finishing.splice(opIndex, 1);
      }
    } else {
      updated.finishing[opIndex].specs.splice(specIndex, 1);
    }
    setLocalData(updated);
  };

  const handleAddFinishingOp = () => {
    const updated = JSON.parse(JSON.stringify(localData));
    if (!updated.finishing) updated.finishing = JSON.parse(JSON.stringify(INITIAL_REFERENCE_DATA.finishing));
    const newId = `op_${Date.now()}`;
    updated.finishing.push({
      id: newId,
      cableType: 'All',
      name: 'New Finishing Process',
      category: 'Finishing',
      specs: [
        { spec: 'Standard Spec', processTime: 30, labours: 2, labourHrs: 1.0 }
      ]
    });
    setLocalData(updated);
  };

  // Handlers for "Add New Table" Custom Tables
  const handleCreateNewTable = () => {
    if (!newTableName.trim()) {
      alert('Please enter a name for the new table.');
      return;
    }
    const updated = JSON.parse(JSON.stringify(localData));
    if (!updated.customTables) updated.customTables = [];
    const newId = `custom_${Date.now()}`;
    const newTable = {
      id: newId,
      name: newTableName.trim(),
      category: newTableCategory.trim() || 'Custom Process Table',
      fixedSetupTime: Number(newTableFixedSetup) || 0,
      rows: [
        { id: '1', item: 'Operation / Item 1', spec: 'Standard', processTime: 30, labours: 2, labourHrs: 1.0 },
        { id: '2', item: 'Operation / Item 2', spec: 'Standard', processTime: 45, labours: 2, labourHrs: 1.5 }
      ]
    };
    updated.customTables.push(newTable);
    setLocalData(updated);
    setIsCreatingTable(false);
    setNewTableName('');
    setNewTableCategory('');
    setNewTableFixedSetup(0);
    setActiveTab(newId);
  };

  const handleAddCustomTableRow = (tableId) => {
    const updated = JSON.parse(JSON.stringify(localData));
    const table = updated.customTables.find(t => t.id === tableId);
    if (!table) return;
    table.rows.push({
      id: String(Date.now()),
      item: `New Operation ${table.rows.length + 1}`,
      spec: 'Standard',
      processTime: 30,
      labours: 2,
      labourHrs: 1.0
    });
    setLocalData(updated);
  };

  const handleCustomTableRowChange = (tableId, rowIndex, field, value) => {
    const updated = JSON.parse(JSON.stringify(localData));
    const table = updated.customTables.find(t => t.id === tableId);
    if (!table) return;
    if (field === 'processTime' || field === 'labours' || field === 'labourHrs') {
      const num = Number(value);
      table.rows[rowIndex][field] = num;
      if (field === 'processTime') {
        const labours = table.rows[rowIndex].labours || 1;
        table.rows[rowIndex].labourHrs = Number(((num / 60) * labours).toFixed(2));
      }
    } else {
      table.rows[rowIndex][field] = value;
    }
    setLocalData(updated);
  };

  const handleDeleteCustomTableRow = (tableId, rowIndex) => {
    const updated = JSON.parse(JSON.stringify(localData));
    const table = updated.customTables.find(t => t.id === tableId);
    if (!table || table.rows.length <= 1) return;
    table.rows.splice(rowIndex, 1);
    setLocalData(updated);
  };

  const handleDeleteCustomTable = (tableId) => {
    if (window.confirm('Are you sure you want to delete this custom rate table?')) {
      const updated = JSON.parse(JSON.stringify(localData));
      updated.customTables = (updated.customTables || []).filter(t => t.id !== tableId);
      setLocalData(updated);
      setActiveTab('finishing');
    }
  };

  const handleCustomTableSetupChange = (tableId, value) => {
    const updated = JSON.parse(JSON.stringify(localData));
    const table = updated.customTables.find(t => t.id === tableId);
    if (!table) return;
    table.fixedSetupTime = Number(value);
    setLocalData(updated);
  };

  const handleSave = () => {
    onSaveReferenceData(localData);
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all reference tables back to original Excel study values? (Custom tables will be cleared)')) {
      const defaults = JSON.parse(JSON.stringify(INITIAL_REFERENCE_DATA));
      defaults.customTables = [];
      setLocalData(defaults);
      onResetReferenceData();
      setIsEditing(false);
      setSaveSuccess(true);
      setActiveTab('winding');
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

  // Find active custom table if activeTab corresponds to one
  const activeCustomTable = (localData.customTables || []).find(t => t.id === activeTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
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
                View, modify, and add rate tables from your Excel engineering study
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
                <span>Edit Tables</span>
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

        {/* Tab Navigation with "Add New Table" Button */}
        <div className="flex items-center justify-between px-6 pt-2.5 border-b border-slate-200 bg-white text-xs">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-[75%]">
            <button
              onClick={() => { setActiveTab('winding'); setIsCreatingTable(false); }}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors whitespace-nowrap ${
                activeTab === 'winding' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" /> Winding
            </button>
            <button
              onClick={() => { setActiveTab('moulding'); setIsCreatingTable(false); }}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors whitespace-nowrap ${
                activeTab === 'moulding' 
                  ? 'border-violet-600 text-violet-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Disc className="w-3.5 h-3.5" /> Moulding
            </button>
            <button
              onClick={() => { setActiveTab('taping'); setIsCreatingTable(false); }}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors whitespace-nowrap ${
                activeTab === 'taping' 
                  ? 'border-cyan-600 text-cyan-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Taping
            </button>
            <button
              onClick={() => { setActiveTab('braiding'); setIsCreatingTable(false); }}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors whitespace-nowrap ${
                activeTab === 'braiding' 
                  ? 'border-emerald-600 text-emerald-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Braiding
            </button>
            
            {/* TAB 5: FINISHING (Newly added) */}
            <button
              onClick={() => { setActiveTab('finishing'); setIsCreatingTable(false); }}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors whitespace-nowrap ${
                activeTab === 'finishing' 
                  ? 'border-amber-600 text-amber-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Finishing Table
            </button>

            {/* Custom Tables Dynamic Tabs */}
            {(localData.customTables || []).map((table) => (
              <button
                key={table.id}
                onClick={() => { setActiveTab(table.id); setIsCreatingTable(false); }}
                className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors whitespace-nowrap ${
                  activeTab === table.id 
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40 rounded-t' 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-indigo-500" />
                <span>{table.name}</span>
              </button>
            ))}

            {/* "+ Add New Table" Action Button */}
            <button
              type="button"
              onClick={() => setIsCreatingTable(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 ml-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors whitespace-nowrap"
              title="Add a new custom process rate table"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Table</span>
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

          {/* INLINE MODAL / CREATOR: Add New Table */}
          {isCreatingTable && (
            <div className="bg-indigo-50/70 border-2 border-dashed border-indigo-300 rounded-xl p-4 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
                    <FolderPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-heading">Create New Rate Table</h4>
                    <p className="text-[11px] text-slate-500">Define a new manufacturing process table with custom operations and rates</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreatingTable(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Table Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                    placeholder="e.g. Armoring, Sheathing, Inspection"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Category / Description
                  </label>
                  <input
                    type="text"
                    value={newTableCategory}
                    onChange={(e) => setNewTableCategory(e.target.value)}
                    placeholder="e.g. Outer Coverings, Quality Assurance"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Fixed Setup Time (Minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newTableFixedSetup}
                    onChange={(e) => setNewTableFixedSetup(e.target.value)}
                    placeholder="0"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-indigo-200">
                <button
                  type="button"
                  onClick={() => setIsCreatingTable(false)}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateNewTable}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-2xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Create Table</span>
                </button>
              </div>
            </div>
          )}
          
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

          {/* TAB 5: FINISHING (Newly added from study CSV) */}
          {activeTab === 'finishing' && (
            <div className="space-y-4">
              <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-amber-800">FINISHING — Average Lead and Labour Hours:</span> Standard operations from production study (Cut back, shrink tube, testing, breaking, coiling, polishing, packaging).
                </div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleAddFinishingOp}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shrink-0 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Process</span>
                  </button>
                )}
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200 max-h-[460px]">
                <table className="w-full text-left font-mono">
                  <thead className="bg-slate-100 text-slate-700 text-[11px] sticky top-0 z-10 border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Cable Type</th>
                      <th className="p-2.5">Process Name</th>
                      <th className="p-2.5">Specifications</th>
                      <th className="p-2.5 text-amber-700 font-bold">Process Time (min)</th>
                      <th className="p-2.5">No. of Labours</th>
                      <th className="p-2.5">Avg Labour Hours</th>
                      {isEditing && <th className="p-2.5 text-center w-24">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {(localData.finishing || []).map((op, opIdx) => (
                      op.specs.map((spec, specIdx) => (
                        <tr key={`${op.id}_${specIdx}`} className="hover:bg-slate-50">
                          {/* Cable Type */}
                          <td className="p-2.5 text-slate-600 text-xs font-sans">
                            {isEditing && specIdx === 0 ? (
                              <input
                                type="text"
                                value={op.cableType || 'All'}
                                onChange={(e) => handleFinishingOpMetaChange(opIdx, 'cableType', e.target.value)}
                                className="w-24 px-2 py-1 bg-white border border-amber-300 rounded text-slate-900 font-sans text-xs"
                              />
                            ) : (
                              specIdx === 0 ? (
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200">
                                  {op.cableType || 'All'}
                                </span>
                              ) : (
                                <span className="text-slate-300 text-[10px]">—</span>
                              )
                            )}
                          </td>

                          {/* Process Name */}
                          <td className="p-2.5 font-bold text-slate-900 text-xs font-sans">
                            {isEditing && specIdx === 0 ? (
                              <input
                                type="text"
                                value={op.name}
                                onChange={(e) => handleFinishingOpMetaChange(opIdx, 'name', e.target.value)}
                                className="w-full min-w-[180px] px-2 py-1 bg-white border border-amber-300 rounded text-slate-900 font-sans text-xs font-semibold"
                              />
                            ) : (
                              specIdx === 0 ? op.name : <span className="text-slate-300 text-[10px] font-normal">↳</span>
                            )}
                          </td>

                          {/* Specifications */}
                          <td className="p-2.5 font-sans font-medium text-slate-700">
                            {isEditing ? (
                              <input
                                type="text"
                                value={spec.spec}
                                onChange={(e) => handleFinishingSpecChange(opIdx, specIdx, 'spec', e.target.value)}
                                className="w-full min-w-[140px] px-2 py-1 bg-white border border-amber-300 rounded text-slate-900 text-xs"
                              />
                            ) : (
                              spec.spec
                            )}
                          </td>

                          {/* Process Time (min) */}
                          <td className="p-2.5">
                            {isEditing ? (
                              <input
                                type="number"
                                step="1"
                                value={spec.processTime}
                                onChange={(e) => handleFinishingSpecChange(opIdx, specIdx, 'processTime', e.target.value)}
                                className="w-20 px-2 py-1 bg-white border border-amber-400 rounded text-amber-800 font-mono font-bold text-xs"
                              />
                            ) : (
                              <strong className="text-amber-700">{spec.processTime} min</strong>
                            )}
                          </td>

                          {/* No. of Labours */}
                          <td className="p-2.5">
                            {isEditing ? (
                              <input
                                type="number"
                                step="1"
                                min="1"
                                value={spec.labours}
                                onChange={(e) => handleFinishingSpecChange(opIdx, specIdx, 'labours', e.target.value)}
                                className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 font-mono text-xs"
                              />
                            ) : (
                              <span>{spec.labours}</span>
                            )}
                          </td>

                          {/* Avg Labour Hours */}
                          <td className="p-2.5">
                            {isEditing ? (
                              <input
                                type="number"
                                step="0.01"
                                value={spec.labourHrs}
                                onChange={(e) => handleFinishingSpecChange(opIdx, specIdx, 'labourHrs', e.target.value)}
                                className="w-20 px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 font-mono text-xs"
                              />
                            ) : (
                              <span>{spec.labourHrs} hrs</span>
                            )}
                          </td>

                          {/* Actions (if editing) */}
                          {isEditing && (
                            <td className="p-2.5 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleAddFinishingSpec(opIdx)}
                                  className="p-1 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded"
                                  title="Add new specification under this process"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteFinishingSpec(opIdx, specIdx)}
                                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                                  title="Delete this row"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DYNAMIC CUSTOM TABLE TAB */}
          {activeCustomTable && (
            <div className="space-y-4">
              <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-200 text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-900 text-sm font-heading">{activeCustomTable.name}</span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200 font-sans font-semibold">
                      {activeCustomTable.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Custom process stage rate table</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-indigo-200">
                    <span className="text-slate-600 font-medium text-xs">Setup (min):</span>
                    {isEditing ? (
                      <input
                        type="number"
                        value={activeCustomTable.fixedSetupTime}
                        onChange={(e) => handleCustomTableSetupChange(activeCustomTable.id, e.target.value)}
                        className="w-16 px-1.5 py-0.5 bg-slate-50 border border-indigo-300 rounded font-mono font-bold text-xs"
                      />
                    ) : (
                      <span className="font-mono font-bold text-indigo-700">{activeCustomTable.fixedSetupTime} min</span>
                    )}
                  </div>

                  {isEditing && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAddCustomTableRow(activeCustomTable.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Row</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomTable(activeCustomTable.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-medium transition-colors"
                        title="Delete this entire table"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Table</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left font-mono">
                  <thead className="bg-slate-100 text-slate-700 text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Operation / Item</th>
                      <th className="p-2.5">Specification</th>
                      <th className="p-2.5 text-indigo-700 font-bold">Process Time (min)</th>
                      <th className="p-2.5">Labours</th>
                      <th className="p-2.5">Labour Hours</th>
                      {isEditing && <th className="p-2.5 text-center w-20">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {activeCustomTable.rows.map((row, rIdx) => (
                      <tr key={row.id || rIdx} className="hover:bg-slate-50">
                        {/* Operation / Item */}
                        <td className="p-2.5 font-bold text-slate-900 font-sans text-xs">
                          {isEditing ? (
                            <input
                              type="text"
                              value={row.item}
                              onChange={(e) => handleCustomTableRowChange(activeCustomTable.id, rIdx, 'item', e.target.value)}
                              className="w-full min-w-[150px] px-2 py-1 bg-white border border-indigo-300 rounded text-slate-900 font-sans text-xs"
                            />
                          ) : (
                            row.item
                          )}
                        </td>

                        {/* Specification */}
                        <td className="p-2.5 font-sans font-medium text-slate-700">
                          {isEditing ? (
                            <input
                              type="text"
                              value={row.spec}
                              onChange={(e) => handleCustomTableRowChange(activeCustomTable.id, rIdx, 'spec', e.target.value)}
                              className="w-full min-w-[130px] px-2 py-1 bg-white border border-indigo-300 rounded text-slate-900 text-xs"
                            />
                          ) : (
                            row.spec
                          )}
                        </td>

                        {/* Process Time (min) */}
                        <td className="p-2.5">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.5"
                              value={row.processTime}
                              onChange={(e) => handleCustomTableRowChange(activeCustomTable.id, rIdx, 'processTime', e.target.value)}
                              className="w-24 px-2 py-1 bg-white border border-indigo-400 rounded text-indigo-800 font-mono font-bold text-xs"
                            />
                          ) : (
                            <strong className="text-indigo-700">{row.processTime} min</strong>
                          )}
                        </td>

                        {/* Labours */}
                        <td className="p-2.5">
                          {isEditing ? (
                            <input
                              type="number"
                              step="1"
                              min="1"
                              value={row.labours}
                              onChange={(e) => handleCustomTableRowChange(activeCustomTable.id, rIdx, 'labours', e.target.value)}
                              className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 font-mono text-xs"
                            />
                          ) : (
                            <span>{row.labours}</span>
                          )}
                        </td>

                        {/* Labour Hours */}
                        <td className="p-2.5">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.01"
                              value={row.labourHrs}
                              onChange={(e) => handleCustomTableRowChange(activeCustomTable.id, rIdx, 'labourHrs', e.target.value)}
                              className="w-20 px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 font-mono text-xs"
                            />
                          ) : (
                            <span>{row.labourHrs} hrs</span>
                          )}
                        </td>

                        {/* Actions */}
                        {isEditing && (
                          <td className="p-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomTableRow(activeCustomTable.id, rIdx)}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                              title="Delete this row"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {isEditing ? 'Editing active. Click "Save Changes" to apply.' : 'Any customized rates or new tables are saved automatically to your local browser storage.'}
          </span>
          <div className="flex items-center gap-2">
            {isEditing && (
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors shadow-2xs"
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

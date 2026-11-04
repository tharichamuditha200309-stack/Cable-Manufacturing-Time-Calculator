import React, { useState, useMemo } from 'react';
import Header from './components/Header.jsx';
import OverallSummaryPanel from './components/OverallSummaryPanel.jsx';
import InputPanel from './components/InputPanel.jsx';
import DataReferenceModal from './components/DataReferenceModal.jsx';
import JobTicketModal from './components/JobTicketModal.jsx';
import { calculateCableTimes } from './utils/calculator.js';

export default function App() {
  // Cable Metadata
  const [cableName, setCableName] = useState('Standard Industrial Cable #01');
  const [shiftHours, setShiftHours] = useState(8);

  // Core Inputs
  const [length, setLength] = useState(15);
  const [rounds, setRounds] = useState(50);

  // Winding Stage
  const [windingSetup, setWindingSetup] = useState(30);
  const [customWindingRate, setCustomWindingRate] = useState(null);

  // Moulding Stage
  const [fittingType, setFittingType] = useState('Thimble');
  const [fittingSize, setFittingSize] = useState('2');
  const [endsCount, setEndsCount] = useState(1);
  const [customMouldingLeadTime, setCustomMouldingLeadTime] = useState(null);

  // Taping Stage
  const [includeTaping, setIncludeTaping] = useState(true);
  const [tapingSetup, setTapingSetup] = useState(20);
  const [customTapingRate, setCustomTapingRate] = useState(null);

  // Braiding Stage
  const [includeBraiding, setIncludeBraiding] = useState(true);
  const [braidingBaseSetup, setBraidingBaseSetup] = useState(90);
  const [braidingSetupPerLayer, setBraidingSetupPerLayer] = useState(10);
  const [braidingLayers, setBraidingLayers] = useState([
    { id: '1', bobbins: 32, type: 1, customRate: null }
  ]);

  // Finishing Stage (Optional)
  const [includeFinishing, setIncludeFinishing] = useState(false);
  const [selectedFinishing, setSelectedFinishing] = useState({});

  // Modals
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  // Perform Calculation
  const results = useMemo(() => {
    return calculateCableTimes({
      length,
      rounds,
      windingSetup,
      customWindingRate,
      fittingType,
      fittingSize,
      endsCount,
      customMouldingLeadTime,
      includeTaping,
      tapingSetup,
      customTapingRate,
      includeBraiding,
      braidingBaseSetup,
      braidingSetupPerLayer,
      braidingLayers,
      includeFinishing,
      selectedFinishing,
      shiftHours
    });
  }, [
    length,
    rounds,
    windingSetup,
    customWindingRate,
    fittingType,
    fittingSize,
    endsCount,
    customMouldingLeadTime,
    includeTaping,
    tapingSetup,
    customTapingRate,
    includeBraiding,
    braidingBaseSetup,
    braidingSetupPerLayer,
    braidingLayers,
    includeFinishing,
    selectedFinishing,
    shiftHours
  ]);

  // Preset Loader
  const handleLoadPreset = (presetId) => {
    if (presetId === 'standard-15m') {
      setCableName('Standard 15m Control Cable');
      setLength(15);
      setRounds(50);
      setFittingType('Thimble');
      setFittingSize('2');
      setEndsCount(1);
      setIncludeTaping(true);
      setIncludeBraiding(true);
      setBraidingLayers([{ id: '1', bobbins: 32, type: 1, customRate: null }]);
      setIncludeFinishing(false);
    } else if (presetId === 'heavy-28m') {
      setCableName('Heavy Marine 28m Armored Cable');
      setLength(28);
      setRounds(100);
      setFittingType('Spool');
      setFittingSize('OD45 - OD75');
      setEndsCount(2);
      setIncludeTaping(true);
      setIncludeBraiding(true);
      setBraidingLayers([
        { id: '1', bobbins: 32, type: 2, customRate: null },
        { id: '2', bobbins: 32, type: 2, customRate: null }
      ]);
      setIncludeFinishing(true);
      setSelectedFinishing({ cutback_shrink: 1, testing: 0 });
    } else if (presetId === 'short-6m') {
      setCableName('Compact Harness 6m');
      setLength(6);
      setRounds(25);
      setFittingType('Thimble');
      setFittingSize('1');
      setEndsCount(1);
      setIncludeTaping(true);
      setIncludeBraiding(true);
      setBraidingLayers([{ id: '1', bobbins: 16, type: 1, customRate: null }]);
      setIncludeFinishing(false);
    } else if (presetId === 'long-45m') {
      setCableName('Long Run 45m Spool Cable');
      setLength(45);
      setRounds(200);
      setFittingType('Spool');
      setFittingSize('OD75 - OD120');
      setEndsCount(1);
      setIncludeTaping(true);
      setIncludeBraiding(true);
      setBraidingLayers([{ id: '1', bobbins: 64, type: 1, customRate: null }]);
      setIncludeFinishing(false);
    }
  };

  // Reset to initial baseline
  const handleReset = () => {
    setCableName('Standard Industrial Cable #01');
    setLength(15);
    setRounds(50);
    setWindingSetup(30);
    setCustomWindingRate(null);
    setFittingType('Thimble');
    setFittingSize('2');
    setEndsCount(1);
    setCustomMouldingLeadTime(null);
    setIncludeTaping(true);
    setTapingSetup(20);
    setCustomTapingRate(null);
    setIncludeBraiding(true);
    setBraidingBaseSetup(90);
    setBraidingSetupPerLayer(10);
    setBraidingLayers([{ id: '1', bobbins: 32, type: 1, customRate: null }]);
    setIncludeFinishing(false);
    setSelectedFinishing({});
  };

  // Export Data to CSV
  const handleExportData = () => {
    const csvContent = [
      ['Metric', 'Value'],
      ['Job/Cable Name', cableName],
      ['Length (m)', results.inputs.length],
      ['Length (mm)', results.inputs.lengthMm],
      ['Rounds', results.inputs.rounds],
      ['Fitting Type', results.inputs.fittingType],
      ['Fitting Size', results.inputs.fittingSize],
      ['Moulded Ends', results.inputs.endsCount],
      ['Braiding Layers Count', results.braiding.layers.length],
      ['Winding Time (min)', results.winding.totalTime.toFixed(2)],
      ['Moulding Time (min)', results.moulding.leadTime.toFixed(2)],
      ['Taping Time (min)', results.taping.totalTime.toFixed(2)],
      ['Braiding Time (min)', results.braiding.totalTime.toFixed(2)],
      ['Finishing Time (min)', results.finishing.totalTime.toFixed(2)],
      ['OVERALL TIME (min)', results.totals.grandTotalMinutes.toFixed(2)],
      ['OVERALL TIME (hrs)', results.totals.grandTotalHours.toFixed(2)],
      ['Formatted Overall Time', results.totals.formattedTime],
      ['Total Setup Time (min)', results.totals.totalSetupTime],
      ['Total Process Run Time (min)', results.totals.totalProcessTime.toFixed(2)],
      ['Estimated Labour Hours', results.totals.totalLabourHours.toFixed(2)],
      ['Production Shifts', results.totals.productionShifts]
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${cableName.replace(/\s+/g, '_')}_Manufacturing_Time.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      
      {/* Top Application Header */}
      <Header
        cableName={cableName}
        setCableName={setCableName}
        onLoadPreset={handleLoadPreset}
        onReset={handleReset}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        onOpenTicketModal={() => setIsTicketModalOpen(true)}
        onExportData={handleExportData}
        totalTimeFormatted={results.totals.formattedTime}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Two-Column Responsive Layout: Inputs on Left, Overall Time Summation on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Inputs (Span 7) */}
          <div className="lg:col-span-7 space-y-6">
            <InputPanel
              length={length}
              setLength={setLength}
              rounds={rounds}
              setRounds={setRounds}
              
              windingSetup={windingSetup}
              setWindingSetup={setWindingSetup}
              customWindingRate={customWindingRate}
              setCustomWindingRate={setCustomWindingRate}
              windingResults={results.winding}

              fittingType={fittingType}
              setFittingType={setFittingType}
              fittingSize={fittingSize}
              setFittingSize={setFittingSize}
              endsCount={endsCount}
              setEndsCount={setEndsCount}
              customMouldingLeadTime={customMouldingLeadTime}
              setCustomMouldingLeadTime={setCustomMouldingLeadTime}
              mouldingResults={results.moulding}

              includeTaping={includeTaping}
              setIncludeTaping={setIncludeTaping}
              tapingSetup={tapingSetup}
              setTapingSetup={setTapingSetup}
              customTapingRate={customTapingRate}
              setCustomTapingRate={setCustomTapingRate}
              tapingResults={results.taping}

              includeBraiding={includeBraiding}
              setIncludeBraiding={setIncludeBraiding}
              braidingBaseSetup={braidingBaseSetup}
              setBraidingBaseSetup={setBraidingBaseSetup}
              braidingSetupPerLayer={braidingSetupPerLayer}
              setBraidingSetupPerLayer={setBraidingSetupPerLayer}
              braidingLayers={braidingLayers}
              setBraidingLayers={setBraidingLayers}
              braidingResults={results.braiding}

              includeFinishing={includeFinishing}
              setIncludeFinishing={setIncludeFinishing}
              selectedFinishing={selectedFinishing}
              setSelectedFinishing={setSelectedFinishing}
            />
          </div>

          {/* Right Column: Prominent Overall Time & Summation of Processes (Span 5) */}
          <div className="lg:col-span-5">
            <OverallSummaryPanel
              results={results}
              cableName={cableName}
              shiftHours={shiftHours}
              setShiftHours={setShiftHours}
              onOpenTicketModal={() => setIsTicketModalOpen(true)}
              onExportData={handleExportData}
            />
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-medium text-slate-700">Cable Manufacturing Overall Time Calculator</span>
          <span className="font-mono text-slate-500">
            Overall Time = Winding (30m + Speed×L×R) + Moulding + Taping (20m + Speed×L) + Braiding (90m + 10m/layer + Speed×L)
          </span>
        </div>
      </footer>

      {/* Modals */}
      <DataReferenceModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
      />

      <JobTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        results={results}
        cableName={cableName}
      />

    </div>
  );
}

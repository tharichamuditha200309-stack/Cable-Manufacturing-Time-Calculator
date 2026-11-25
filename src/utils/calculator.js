import { WINDING_DATA, MOULDING_DATA, TAPING_DATA, BRAIDING_DATA, FINISHING_DATA } from '../data/manufacturingData.js';

/**
 * Find the matching winding length range
 */
export function getWindingRange(length, windingData = WINDING_DATA) {
  const l = Number(length) || 0;
  const ranges = windingData?.lengthRanges || WINDING_DATA.lengthRanges;
  if (l <= 10) return ranges[0];
  if (l <= 20) return ranges[1];
  if (l <= 30) return ranges[2];
  if (l <= 40) return ranges[3];
  return ranges[4] || ranges[ranges.length - 1];
}

/**
 * Find matching taping length range
 */
export function getTapingRange(length, tapingData = TAPING_DATA) {
  const l = Number(length) || 0;
  const ranges = tapingData?.lengthRanges || TAPING_DATA.lengthRanges;
  if (l <= 10) return ranges[0];
  if (l <= 20) return ranges[1];
  if (l <= 30) return ranges[2];
  if (l <= 40) return ranges[3];
  return ranges[4] || ranges[ranges.length - 1];
}

/**
 * Find matching braiding rate by cable diameter, bobbins, and type
 * Based on exact sheet:
 * 16×1: 0-10 (3.0), 10-20 (2.5)
 * 16×2: 0-10 (2.7), 10-20 (2.25)
 * 32×1: 0-10 (4.0), 10-20 (2.5), 20-30 (2.25)
 * 32×2: 0-10 (3.6), 10-20 (2.7), 20-30 (2.5)
 * 64×1: 20-30 (1.5), 30-50 (1.4)
 * 64×2: 20-30 (1.35), 30-50 (1.26)
 */
export function getBraidingRateByDiameter(diameter, bobbins, type, braidingData = BRAIDING_DATA) {
  const d = Math.max(0.1, Number(diameter) || 0);
  const layers = braidingData?.layerDetails || BRAIDING_DATA.layerDetails;
  const numBobbins = Number(bobbins);
  const numType = Number(type);

  // Determine standard diameter bucket
  let diaRange = '0-10';
  if (d > 10 && d <= 20) diaRange = '10-20';
  else if (d > 20 && d <= 30) diaRange = '20-30';
  else if (d > 30) diaRange = '30-50';

  // Find exact match
  const exact = layers.find(
    item => item.diameterRange === diaRange && Number(item.bobbins) === numBobbins && Number(item.type) === numType
  );
  if (exact) {
    return { ...exact, matchedRange: diaRange };
  }

  // Fallback for bobbins not in that diameter range (e.g. 64 bobbins at < 20mm or 16 bobbins at > 20mm)
  const matches = layers.filter(
    item => Number(item.bobbins) === numBobbins && Number(item.type) === numType
  );

  if (matches.length > 0) {
    if (d <= matches[0].minDia) return { ...matches[0], matchedRange: matches[0].diameterRange };
    return { ...matches[matches.length - 1], matchedRange: matches[matches.length - 1].diameterRange };
  }

  return {
    diameterRange: diaRange,
    desc: `${numBobbins}×${numType}`,
    ratePerMeter: 2.5,
    matchedRange: diaRange
  };
}

/**
 * Auto-match finishing operations based on previous cable parameters
 */
export function autoMatchFinishingOperations({
  cableType = 'Torquelite',
  length = 15,
  rounds = 50,
  fittingType = 'Thimble',
  fittingSize = '2',
  cableOD = 25,
  finishingData = FINISHING_DATA,
  userSelections = {} // { [opId]: { enabled: boolean, specIndex: number } }
}) {
  const numLength = Number(length) || 0;
  const numRounds = Number(rounds) || 0;
  const numOD = Number(cableOD) || 0;
  const fittingNum = Number(String(fittingSize).replace(/\D+/g, '')) || 2;
  const isTorquelite = cableType === 'Torquelite';
  const isTorqueliteFlex = cableType === 'Torquelite Flex';
  const isFibrelite = cableType === 'Fibrelite';

  const results = [];

  (finishingData || FINISHING_DATA).forEach((op) => {
    let isApplicable = false;
    let matchedSpecIndex = 0;
    let matchedSpec = null;
    let note = '';
    let autoTime = 0;
    let autoLabourHrs = 0;

    if (op.id === 'cutback_shrink') {
      if (isTorquelite) {
        isApplicable = true;
        const idx = op.specs.findIndex(s => s.minBound <= fittingNum && fittingNum <= s.maxBound);
        matchedSpecIndex = idx !== -1 ? idx : Math.min(op.specs.length - 1, Math.max(0, fittingNum - 2));
        matchedSpec = op.specs[matchedSpecIndex] || op.specs[0];
        note = `Auto-matched to Fitting Size ${fittingNum}`;
      } else {
        isApplicable = false;
        note = 'Only for Torquelite cables';
      }
    } else if (op.id === 'cutback_flex') {
      if (isTorqueliteFlex) {
        isApplicable = true;
        matchedSpecIndex = 0;
        matchedSpec = op.specs[0];
        note = 'Standard Cut back for Torquelite Flex';
      } else {
        isApplicable = false;
        note = 'Only for Torquelite Flex cables';
      }
    } else if (op.id === 'testing') {
      isApplicable = true;
      matchedSpecIndex = 0;
      matchedSpec = op.specs[0];
      note = 'Standard Testing for all cable types';
    } else if (op.id === 'breaking') {
      isApplicable = true;
      let idx = 0;
      if (numRounds <= 50) idx = 0;
      else if (numRounds <= 100) idx = 1 < op.specs.length ? 1 : 0;
      else if (numRounds <= 500) idx = 2 < op.specs.length ? 2 : 0;
      else idx = op.specs.length - 1;

      matchedSpecIndex = idx;
      matchedSpec = op.specs[matchedSpecIndex] || op.specs[0];
      note = `Auto-matched to ${numRounds} rounds (${matchedSpec.spec})`;
    } else if (op.id === 'coiling') {
      isApplicable = true;
      let idx = 0;
      if (numLength <= 10) idx = 0;
      else if (numLength <= 20) idx = 1 < op.specs.length ? 1 : 0;
      else if (numLength <= 30) idx = 2 < op.specs.length ? 2 : 1;
      else idx = 3 < op.specs.length ? 3 : op.specs.length - 1;

      matchedSpecIndex = idx;
      matchedSpec = op.specs[matchedSpecIndex] || op.specs[0];
      note = `Auto-matched to ${numLength}m length (${matchedSpec.spec})`;
    } else if (op.id === 'polishing') {
      if (fittingType === 'None') {
        isApplicable = false;
        note = 'No moulding fitting selected';
      } else {
        isApplicable = true;
        if (fittingNum <= 1) {
          matchedSpecIndex = 0;
          matchedSpec = op.specs[0] || { spec: 'Size 1', processTime: 0, labourHrs: 0 };
          note = 'Size 1 fitting — No polishing required (0 min)';
        } else if (fittingNum <= 3) {
          matchedSpecIndex = 1 < op.specs.length ? 1 : 0;
          matchedSpec = op.specs[matchedSpecIndex];
          note = `Auto-matched to Fitting Size ${fittingNum} (Size 2-3)`;
        } else {
          matchedSpecIndex = 2 < op.specs.length ? 2 : op.specs.length - 1;
          matchedSpec = op.specs[matchedSpecIndex];
          note = `Auto-matched to Fitting Size ${fittingNum} (Size 4-6)`;
        }
      }
    } else if (op.id === 'box_prep_flex_fibre') {
      if (isFibrelite || isTorqueliteFlex) {
        isApplicable = true;
        if (numOD > 56) {
          matchedSpecIndex = -1;
          matchedSpec = { spec: 'Wooden Box', processTime: 0, labours: 0, labourHrs: 0 };
          note = `Wooden Box (Cable OD ${numOD}mm > 56mm — 0 min required)`;
        } else if (numOD > 52) {
          matchedSpecIndex = 2 < op.specs.length ? 2 : op.specs.length - 1;
          matchedSpec = op.specs[matchedSpecIndex];
          note = `Auto-matched to OD ${numOD}mm (52-56mm box)`;
        } else if (numOD > 32) {
          matchedSpecIndex = 1 < op.specs.length ? 1 : 0;
          matchedSpec = op.specs[matchedSpecIndex];
          note = `Auto-matched to OD ${numOD}mm (32-52mm box)`;
        } else {
          matchedSpecIndex = 0;
          matchedSpec = op.specs[0];
          note = `Auto-matched to OD ${numOD}mm (0-32mm box)`;
        }
      } else {
        isApplicable = false;
        note = 'Only for Fibrelite or Torquelite Flex cables';
      }
    } else if (op.id === 'box_prep_torquelite') {
      if (isTorquelite) {
        isApplicable = true;
        if (numOD > 28) {
          matchedSpecIndex = -1;
          matchedSpec = { spec: 'Wooden Box', processTime: 0, labours: 0, labourHrs: 0 };
          note = `Wooden Box (Cable OD ${numOD}mm > 28mm — 0 min required)`;
        } else if (numOD > 26) {
          matchedSpecIndex = 2 < op.specs.length ? 2 : op.specs.length - 1;
          matchedSpec = op.specs[matchedSpecIndex];
          note = `Auto-matched to OD ${numOD}mm (26-28mm box)`;
        } else if (numOD > 16) {
          matchedSpecIndex = 1 < op.specs.length ? 1 : 0;
          matchedSpec = op.specs[matchedSpecIndex];
          note = `Auto-matched to OD ${numOD}mm (16-26mm box)`;
        } else {
          matchedSpecIndex = 0;
          matchedSpec = op.specs[0];
          note = `Auto-matched to OD ${numOD}mm (0-16mm box)`;
        }
      } else {
        isApplicable = false;
        note = 'Only for Torquelite cables';
      }
    } else {
      isApplicable = true;
      matchedSpecIndex = 0;
      matchedSpec = op.specs?.[0] || { spec: 'Standard', processTime: 30, labourHrs: 1 };
      note = 'Default specification';
    }

    const userOverride = userSelections[op.id];
    let isEnabled = isApplicable;
    let effectiveSpec = matchedSpec;
    let effectiveIndex = matchedSpecIndex;

    if (userOverride !== undefined) {
      if (typeof userOverride === 'boolean') {
        isEnabled = userOverride;
      } else if (typeof userOverride === 'object' && userOverride !== null) {
        if (userOverride.enabled !== undefined) isEnabled = userOverride.enabled;
        if (userOverride.specIndex !== undefined && userOverride.specIndex !== null && userOverride.specIndex !== -1) {
          effectiveIndex = userOverride.specIndex;
          effectiveSpec = op.specs[effectiveIndex] || matchedSpec;
          note = `User selected: ${effectiveSpec?.spec}`;
        }
      } else if (typeof userOverride === 'number') {
        effectiveIndex = userOverride;
        effectiveSpec = op.specs[effectiveIndex] || matchedSpec;
        note = `User selected: ${effectiveSpec?.spec}`;
      }
    }

    autoTime = (isEnabled && effectiveSpec) ? (Number(effectiveSpec.processTime) || 0) : 0;
    autoLabourHrs = (isEnabled && effectiveSpec) ? (Number(effectiveSpec.labourHrs) || 0) : 0;

    results.push({
      id: op.id,
      name: op.name,
      category: op.category,
      cableType: op.cableType,
      isApplicable,
      enabled: isEnabled,
      specIndex: effectiveIndex,
      spec: effectiveSpec?.spec || 'None',
      processTime: autoTime,
      labourHrs: autoLabourHrs,
      note,
      specs: op.specs || []
    });
  });

  return results;
}

/**
 * Format minutes into readable "Xh Ym" and decimal hours
 */
export function formatMinutes(minutes) {
  const totalMins = Math.max(0, Number(minutes) || 0);
  const hrs = Math.floor(totalMins / 60);
  const mins = Math.round(totalMins % 60);

  if (hrs === 0) {
    return `${mins}m`;
  }
  return `${hrs}h ${mins}m`;
}

/**
 * Calculate full cable manufacturing timing
 */
export function calculateCableTimes({
  cableType = 'Torquelite',
  length = 15, // meters
  rounds = 50,
  windingSetup = 30, // mins
  customWindingRate = null,
  
  fittingType = 'Thimble',
  fittingSize = '2',
  endsCount = 2,
  customMouldingLeadTime = null,

  includeTaping = true,
  tapingSetup = 20, // mins
  customTapingRate = null,

  includeBraiding = true,
  postTapingDiameter = 12.0, // mm Post-Taping Core Diameter (input under Taping)
  cableOD = 25, // legacy mm Outer Diameter
  braidingBaseSetup = 90, // mins
  braidingSetupPerLayer = 10, // mins per layer
  braidingLayers = [
    { id: '1', bobbins: 32, type: 1, customRate: null }
  ],
  tandemBraidingEnabled = true,
  tandemOffset = 5, // minutes stagger between machine 1 and 2

  includeFinishing = true,
  selectedFinishing = {}, // map of { [itemId]: { enabled: boolean, specIndex: number } | number | boolean }
  selectedCustomTables = {}, // map of { [tableId]: { enabled: boolean, rowIndices: number[] } }
  shiftHours = 8,
  referenceData = null
}) {
  const windingData = referenceData?.winding || WINDING_DATA;
  const mouldingData = referenceData?.moulding || MOULDING_DATA;
  const tapingData = referenceData?.taping || TAPING_DATA;
  const braidingData = referenceData?.braiding || BRAIDING_DATA;
  const finishingData = referenceData?.finishing || FINISHING_DATA;

  const numLength = Math.max(0.1, Number(length) || 1);
  const numRounds = Math.max(1, Number(rounds) || 1);
  const numEnds = Math.max(0, Number(endsCount) || 1);
  
  // Diameter growth: starts at Post-Taping diameter, grows by 1.0mm per braided layer
  const startDiameter = Math.max(0.1, Number(postTapingDiameter) || Number(cableOD) || 12.0);
  const layerCount = includeBraiding ? braidingLayers.length : 0;
  const finalOuterDiameter = startDiameter + (layerCount * 1.0);

  // 1. WINDING CALCULATION
  const isFlex = String(cableType || '').toLowerCase().includes('flex');
  const windingMultiplier = isFlex ? 2 : 1;
  const windingRange = getWindingRange(numLength, windingData);
  const windingRate = customWindingRate !== null && customWindingRate !== undefined && customWindingRate !== ''
    ? Number(customWindingRate)
    : Number(windingRange.windingTimePerMeter);
  
  const windingSetupTime = Number(windingSetup ?? windingData.fixedSetupTime ?? 30) || 0;
  const windingProcessTime = windingRate * numLength * numRounds * windingMultiplier;
  const windingTotalTime = windingSetupTime + windingProcessTime;
  
  // Historical labour hours ratio
  const windingLabourHoursRatio = windingRange.avgLeadTime > 0 
    ? (windingRange.avgLabourHrs / (windingRange.avgLeadTime / 60)) 
    : 1.0;
  const windingLabourHours = (windingTotalTime / 60) * windingLabourHoursRatio;

  // 2. MOULDING CALCULATION (1 or 2 Ends as chosen by user)
  let mouldingLeadTime = 0;
  let mouldingLabourHours = 0;
  let mouldingDetail = null;

  if (fittingType && fittingType !== 'None' && mouldingData.items?.[fittingType]) {
    const item = mouldingData.items[fittingType].find(i => String(i.size) === String(fittingSize)) 
      || mouldingData.items[fittingType][0];
    
    if (item) {
      mouldingDetail = item;
      const unitTime = (customMouldingLeadTime !== null && customMouldingLeadTime !== undefined && customMouldingLeadTime !== '')
        ? Number(customMouldingLeadTime)
        : Number(item.leadTimeMin);
      mouldingLeadTime = unitTime * numEnds;
      mouldingLabourHours = (Number(item.labourHrs) || (unitTime / 60)) * numEnds;
    }
  }

  // 3. TAPING CALCULATION
  let tapingSetupTime = 0;
  let tapingProcessTime = 0;
  let tapingTotalTime = 0;
  let tapingLabourHours = 0;
  let tapingRange = null;
  let tapingRate = 0;

  if (includeTaping) {
    tapingRange = getTapingRange(numLength, tapingData);
    tapingRate = customTapingRate !== null && customTapingRate !== undefined && customTapingRate !== ''
      ? Number(customTapingRate)
      : Number(tapingRange.tapingTimePerMeter);
    
    tapingSetupTime = Number(tapingSetup ?? tapingData.fixedSetupTime ?? 20) || 0;
    tapingProcessTime = tapingRate * numLength;
    tapingTotalTime = tapingSetupTime + tapingProcessTime;
    
    const tapingLabourRatio = tapingRange.avgLeadTime > 0 
      ? (tapingRange.labourHrs / (tapingRange.avgLeadTime / 60)) 
      : 1.0;
    tapingLabourHours = (tapingTotalTime / 60) * tapingLabourRatio;
  }

  // 4. BRAIDING CALCULATION WITH DIAMETER SPEED & TANDEM PAIRING
  let braidingSetupTime = 0;
  let braidingProcessTime = 0;
  let braidingSequentialProcessTime = 0;
  let braidingTimeSaved = 0;
  let braidingTotalTime = 0;
  let braidingLabourHours = 0;
  const calculatedLayers = [];
  const braidingGroups = [];

  const isTandemEnabled = Boolean(tandemBraidingEnabled);
  const numTandemOffset = Math.max(0, Number(tandemOffset) || 0);

  if (includeBraiding && braidingLayers.length > 0) {
    const baseSetup = Number(braidingBaseSetup ?? braidingData.baseSetupTime ?? 90) || 0;
    const perLayerSetup = Number(braidingSetupPerLayer ?? braidingData.setupTimePerLayer ?? 10) || 0;
    braidingSetupTime = baseSetup + (layerCount * perLayerSetup);

    // 1. Calculate raw layer nominal times based on each layer's incoming diameter
    const rawLayers = braidingLayers.map((layer, idx) => {
      const incomingDiameter = startDiameter + (idx * 1.0);
      const outgoingDiameter = incomingDiameter + 1.0;
      const match = getBraidingRateByDiameter(incomingDiameter, layer.bobbins, layer.type, braidingData);
      const rate = (layer.customRate !== null && layer.customRate !== undefined && layer.customRate !== '')
        ? Number(layer.customRate)
        : Number(match.ratePerMeter);
      
      const layerTime = rate * numLength;
      braidingSequentialProcessTime += layerTime;

      return {
        layerIndex: idx + 1,
        bobbins: Number(layer.bobbins),
        type: Number(layer.type),
        desc: `${layer.bobbins}×${layer.type}`,
        incomingDiameter,
        outgoingDiameter,
        matchedRange: match.matchedRange || match.diameterRange,
        ratePerMeter: rate,
        layerTime,
        avgBraidingTimePerLayer: match.avgBraidingTimePerLayer
      };
    });

    // 2. Group into Tandem Passes (2 machines) vs Single Machine Runs
    // Rules:
    // - Consecutive layers with the same bobbin structure run on 2 machines simultaneously.
    // - Offset of ~5 mins between machine 1 and machine 2.
    // - Regardless of odd or even layer count, the LAST layer of the cable is ALWAYS braided alone (single).
    //   Therefore, the last pair cannot include the final layer.
    let i = 0;
    while (i < rawLayers.length) {
      const current = rawLayers[i];
      const next = (i + 1 < rawLayers.length) ? rawLayers[i + 1] : null;

      const isNextTheLastLayer = (i + 1) === (rawLayers.length - 1);
      const sameStructure = next && 
        current.bobbins === next.bobbins && 
        current.type === next.type;

      if (isTandemEnabled && sameStructure && !isNextTheLastLayer) {
        // TANDEM PAIR RUN (2 Machines)
        const groupProcessTime = Math.max(current.layerTime, next.layerTime) + numTandemOffset;
        const sequentialTime = current.layerTime + next.layerTime;
        const savedTime = Math.max(0, sequentialTime - groupProcessTime);

        const group = {
          groupIndex: braidingGroups.length + 1,
          type: 'tandem_pair',
          desc: `${current.desc} (2 Machines Tandem)`,
          layerIndices: [current.layerIndex, next.layerIndex],
          primaryLayer: current.layerIndex,
          secondaryLayer: next.layerIndex,
          staggerOffset: numTandemOffset,
          processTime: groupProcessTime,
          sequentialTime,
          timeSaved: savedTime
        };
        braidingGroups.push(group);
        braidingProcessTime += groupProcessTime;

        calculatedLayers.push({
          ...current,
          groupIndex: group.groupIndex,
          runMode: 'tandem_primary',
          runModeLabel: `Tandem Lead (Machine 1, paired with L${next.layerIndex})`,
          isTandem: true,
          pairedWith: next.layerIndex,
          staggerOffset: 0,
          effectiveTime: current.layerTime
        });

        calculatedLayers.push({
          ...next,
          groupIndex: group.groupIndex,
          runMode: 'tandem_secondary',
          runModeLabel: `Tandem Follower (Machine 2, +${numTandemOffset}m stagger)`,
          isTandem: true,
          pairedWith: current.layerIndex,
          staggerOffset: numTandemOffset,
          effectiveTime: numTandemOffset
        });

        i += 2;
      } else {
        // SINGLE MACHINE RUN
        const isFinalLayer = (i === rawLayers.length - 1);
        let reason = 'Single Machine Run';
        if (isFinalLayer && rawLayers.length > 1) {
          reason = 'Final Layer (Always braided alone)';
        } else if (next && !sameStructure) {
          reason = 'Different bobbin structure from next layer';
        } else if (isNextTheLastLayer && sameStructure) {
          reason = 'Single (Next layer is final layer and must run alone)';
        }

        const group = {
          groupIndex: braidingGroups.length + 1,
          type: 'single',
          desc: `${current.desc} (Single Machine)`,
          layerIndices: [current.layerIndex],
          primaryLayer: current.layerIndex,
          secondaryLayer: null,
          staggerOffset: 0,
          processTime: current.layerTime,
          sequentialTime: current.layerTime,
          timeSaved: 0,
          reason
        };
        braidingGroups.push(group);
        braidingProcessTime += current.layerTime;

        calculatedLayers.push({
          ...current,
          groupIndex: group.groupIndex,
          runMode: 'single',
          runModeLabel: isFinalLayer && rawLayers.length > 1 ? 'Single (Final Layer Rule)' : 'Single Machine Run',
          isTandem: false,
          pairedWith: null,
          staggerOffset: 0,
          effectiveTime: current.layerTime,
          reason
        });

        i += 1;
      }
    }

    braidingTimeSaved = Math.max(0, braidingSequentialProcessTime - braidingProcessTime);
    braidingTotalTime = braidingSetupTime + braidingProcessTime;
    braidingLabourHours = (braidingTotalTime / 60) * 0.95;
  }

  // Combined Taping and Braiding
  const combinedTapingBraidingTime = tapingTotalTime + braidingTotalTime;
  const combinedTapingBraidingHours = combinedTapingBraidingTime / 60;
  const combinedTapingBraidingLabour = tapingLabourHours + braidingLabourHours;

  // 5. FINISHING CALCULATION (Auto-matched from previous inputs using finalOuterDiameter)
  const matchedFinishingOps = autoMatchFinishingOperations({
    cableType,
    length: numLength,
    rounds: numRounds,
    fittingType,
    fittingSize,
    cableOD: finalOuterDiameter,
    finishingData,
    userSelections: selectedFinishing
  });

  let finishingTotalTime = 0;
  let finishingLabourHours = 0;
  const finishingItems = [];

  if (includeFinishing) {
    matchedFinishingOps.forEach(item => {
      if (item.enabled) {
        finishingTotalTime += item.processTime;
        finishingLabourHours += item.labourHrs;
        finishingItems.push({
          id: item.id,
          name: item.name,
          category: item.category,
          spec: item.spec,
          time: item.processTime,
          labourHrs: item.labourHrs,
          note: item.note
        });
      }
    });
  }

  // 6. CUSTOM PROCESS TABLES CALCULATION
  let customTablesTotalTime = 0;
  let customTablesSetupTime = 0;
  let customTablesProcessTime = 0;
  let customTablesLabourHours = 0;
  const customTableItems = [];

  const customTablesList = referenceData?.customTables || [];
  if (customTablesList.length > 0 && selectedCustomTables) {
    customTablesList.forEach(table => {
      const selection = selectedCustomTables[table.id];
      if (selection && selection.enabled) {
        const tableSetup = Number(table.fixedSetupTime) || 0;
        customTablesSetupTime += tableSetup;

        let tableRowTime = 0;
        let tableLabour = 0;
        const selectedIndices = selection.rowIndices || [];
        selectedIndices.forEach(idx => {
          const row = table.rows?.[idx];
          if (row) {
            const time = Number(row.processTime) || 0;
            const labour = Number(row.labourHrs) || ((time / 60) * (Number(row.labours) || 1));
            tableRowTime += time;
            tableLabour += labour;
            customTableItems.push({
              tableName: table.name,
              item: row.item,
              spec: row.spec,
              time,
              labourHrs: labour
            });
          }
        });
        customTablesProcessTime += tableRowTime;
        customTablesTotalTime += (tableSetup + tableRowTime);
        customTablesLabourHours += tableLabour;
      }
    });
  }

  // TOTALS
  const grandTotalMinutes = windingTotalTime + mouldingLeadTime + tapingTotalTime + braidingTotalTime + finishingTotalTime + customTablesTotalTime;
  const totalSetupTime = windingSetupTime + tapingSetupTime + braidingSetupTime + customTablesSetupTime;
  const totalProcessTime = windingProcessTime + mouldingLeadTime + tapingProcessTime + braidingProcessTime + finishingTotalTime + customTablesProcessTime;
  const totalLabourHours = windingLabourHours + mouldingLabourHours + tapingLabourHours + braidingLabourHours + finishingLabourHours + customTablesLabourHours;

  const totalHours = grandTotalMinutes / 60;
  const shiftVal = Math.max(1, Number(shiftHours) || 8);
  const productionShifts = totalHours / shiftVal;

  return {
    inputs: {
      cableType,
      length: numLength,
      lengthMm: numLength * 1000,
      rounds: numRounds,
      postTapingDiameter: startDiameter,
      cableOD: finalOuterDiameter,
      finalOuterDiameter,
      fittingType,
      fittingSize,
      endsCount: numEnds,
      includeTaping,
      includeBraiding,
      includeFinishing
    },
    winding: {
      cableType,
      multiplier: windingMultiplier,
      setupTime: windingSetupTime,
      ratePerMeterPerRound: windingRate,
      processTime: windingProcessTime,
      totalTime: windingTotalTime,
      totalHours: windingTotalTime / 60,
      formattedTime: `${windingTotalTime.toFixed(1)} min (${(windingTotalTime / 60).toFixed(2)} hrs)`,
      labourHours: windingLabourHours,
      range: windingRange
    },
    moulding: {
      fittingType,
      fittingSize,
      endsCount: numEnds,
      leadTime: mouldingLeadTime,
      totalHours: mouldingLeadTime / 60,
      formattedTime: `${mouldingLeadTime.toFixed(1)} min (${(mouldingLeadTime / 60).toFixed(2)} hrs)`,
      labourHours: mouldingLabourHours,
      detail: mouldingDetail
    },
    taping: {
      enabled: includeTaping,
      postTapingDiameter: startDiameter,
      setupTime: tapingSetupTime,
      ratePerMeter: tapingRate,
      processTime: tapingProcessTime,
      totalTime: tapingTotalTime,
      totalHours: tapingTotalTime / 60,
      formattedTime: `${tapingTotalTime.toFixed(1)} min (${(tapingTotalTime / 60).toFixed(2)} hrs)`,
      labourHours: tapingLabourHours,
      range: tapingRange
    },
    braiding: {
      enabled: includeBraiding,
      postTapingDiameter: startDiameter,
      finalOuterDiameter,
      calculatedOuterDiameter: finalOuterDiameter,
      cableOD: finalOuterDiameter,
      tandemEnabled: isTandemEnabled,
      tandemOffset: numTandemOffset,
      baseSetup: Number(braidingBaseSetup ?? braidingData.baseSetupTime ?? 90) || 0,
      setupPerLayer: Number(braidingSetupPerLayer ?? braidingData.setupTimePerLayer ?? 10) || 0,
      setupTime: braidingSetupTime,
      processTime: braidingProcessTime,
      sequentialProcessTime: braidingSequentialProcessTime,
      timeSaved: braidingTimeSaved,
      totalTime: braidingTotalTime,
      totalHours: braidingTotalTime / 60,
      formattedTime: `${braidingTotalTime.toFixed(1)} min (${(braidingTotalTime / 60).toFixed(2)} hrs)`,
      labourHours: braidingLabourHours,
      layers: calculatedLayers,
      groups: braidingGroups,
      pairCount: braidingGroups.filter(g => g.type === 'tandem_pair').length,
      singleCount: braidingGroups.filter(g => g.type === 'single').length
    },
    tapingAndBraiding: {
      enabled: includeTaping || includeBraiding,
      totalTime: combinedTapingBraidingTime,
      totalHours: combinedTapingBraidingHours,
      formattedTime: `${combinedTapingBraidingTime.toFixed(1)} min (${combinedTapingBraidingHours.toFixed(2)} hrs)`,
      tapingTime: tapingTotalTime,
      braidingTime: braidingTotalTime,
      tapingHours: tapingTotalTime / 60,
      braidingHours: braidingTotalTime / 60,
      labourHours: combinedTapingBraidingLabour,
      tapingSetup: tapingSetupTime,
      braidingSetup: braidingSetupTime
    },
    finishing: {
      enabled: includeFinishing,
      totalTime: finishingTotalTime,
      totalHours: finishingTotalTime / 60,
      formattedTime: `${finishingTotalTime.toFixed(1)} min (${(finishingTotalTime / 60).toFixed(2)} hrs)`,
      labourHours: finishingLabourHours,
      items: finishingItems,
      allOperations: matchedFinishingOps
    },
    customTables: {
      enabled: customTablesTotalTime > 0,
      totalTime: customTablesTotalTime,
      totalHours: customTablesTotalTime / 60,
      formattedTime: `${customTablesTotalTime.toFixed(1)} min (${(customTablesTotalTime / 60).toFixed(2)} hrs)`,
      setupTime: customTablesSetupTime,
      processTime: customTablesProcessTime,
      labourHours: customTablesLabourHours,
      items: customTableItems
    },
    totals: {
      grandTotalMinutes,
      grandTotalHours: totalHours,
      formattedHours: `${totalHours.toFixed(2)} hrs`,
      formattedTotal: `${totalHours.toFixed(2)} hrs (${Math.floor(grandTotalMinutes / 60)}h ${Math.round(grandTotalMinutes % 60)}m)`,
      formattedTime: `${totalHours.toFixed(2)} hrs`,
      totalMinutesStr: `${grandTotalMinutes.toFixed(1)} min`,
      totalSetupTime,
      setupHours: totalSetupTime / 60,
      formattedSetupTime: `${totalSetupTime.toFixed(1)} min (${(totalSetupTime / 60).toFixed(2)} hrs)`,
      totalProcessTime,
      processHours: totalProcessTime / 60,
      formattedProcessTime: `${totalProcessTime.toFixed(1)} min (${(totalProcessTime / 60).toFixed(2)} hrs)`,
      totalLabourHours,
      productionShifts: Number(productionShifts.toFixed(2)),
      setupPercent: grandTotalMinutes > 0 ? Math.round((totalSetupTime / grandTotalMinutes) * 100) : 0,
      processPercent: grandTotalMinutes > 0 ? Math.round((totalProcessTime / grandTotalMinutes) * 100) : 0
    }
  };
}

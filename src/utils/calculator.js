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
 * Find matching braiding rate for length, bobbins, and type
 */
export function getBraidingRate(length, bobbins, type, braidingData = BRAIDING_DATA) {
  const l = Number(length) || 0;
  const layers = braidingData?.layerDetails || BRAIDING_DATA.layerDetails;

  let lenRange = '1-10';
  if (l > 10 && l <= 20) lenRange = '10-20';
  else if (l > 20 && l <= 30) lenRange = '20-30';
  else if (l > 30 && l <= 40) lenRange = '30-40';
  else if (l > 40) lenRange = '41-50';

  const match = layers.find(
    item => item.lengthRange === lenRange && Number(item.bobbins) === Number(bobbins) && Number(item.type) === Number(type)
  );

  if (match) return match;

  // Fallback if specific length range not measured
  const fallback = layers.find(
    item => Number(item.bobbins) === Number(bobbins) && Number(item.type) === Number(type)
  );

  return fallback || {
    desc: `${bobbins}×${type}`,
    leadTimePerMeter: 2.5,
    avgBraidingTimePerLayer: 45
  };
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
  braidingBaseSetup = 90, // mins
  braidingSetupPerLayer = 10, // mins per layer
  braidingLayers = [
    { id: '1', bobbins: 32, type: 1, customRate: null }
  ],
  tandemBraidingEnabled = true,
  tandemOffset = 5, // minutes stagger between machine 1 and 2

  includeFinishing = false,
  selectedFinishing = {}, // map of { [itemId]: specIndex }
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

  // 1. WINDING CALCULATION
  const windingRange = getWindingRange(numLength, windingData);
  const windingRate = customWindingRate !== null && customWindingRate !== undefined && customWindingRate !== ''
    ? Number(customWindingRate)
    : Number(windingRange.windingTimePerMeter);
  
  const windingSetupTime = Number(windingSetup ?? windingData.fixedSetupTime ?? 30) || 0;
  const windingProcessTime = windingRate * numLength * numRounds;
  const windingTotalTime = windingSetupTime + windingProcessTime;
  
  // Historical labour hours ratio
  const windingLabourHoursRatio = windingRange.avgLeadTime > 0 
    ? (windingRange.avgLabourHrs / (windingRange.avgLeadTime / 60)) 
    : 1.0;
  const windingLabourHours = (windingTotalTime / 60) * windingLabourHoursRatio;

  // 2. MOULDING CALCULATION
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

  // 4. BRAIDING CALCULATION
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
    const layerCount = braidingLayers.length;
    const baseSetup = Number(braidingBaseSetup ?? braidingData.baseSetupTime ?? 90) || 0;
    const perLayerSetup = Number(braidingSetupPerLayer ?? braidingData.setupTimePerLayer ?? 10) || 0;
    braidingSetupTime = baseSetup + (layerCount * perLayerSetup);

    // 1. Calculate raw layer nominal times
    const rawLayers = braidingLayers.map((layer, idx) => {
      const match = getBraidingRate(numLength, layer.bobbins, layer.type, braidingData);
      const rate = (layer.customRate !== null && layer.customRate !== undefined && layer.customRate !== '')
        ? Number(layer.customRate)
        : Number(match.leadTimePerMeter);
      
      const layerTime = rate * numLength;
      braidingSequentialProcessTime += layerTime;

      return {
        layerIndex: idx + 1,
        bobbins: Number(layer.bobbins),
        type: Number(layer.type),
        desc: `${layer.bobbins}×${layer.type}`,
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

      // Check pairing eligibility:
      // Can pair if:
      // 1. Tandem enabled
      // 2. Next layer exists
      // 3. Next layer is NOT the cable's final layer (i + 1 !== rawLayers.length - 1)
      // 4. Same bobbin structure (bobbins and type match)
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

  // 5. FINISHING CALCULATION
  let finishingTotalTime = 0;
  let finishingLabourHours = 0;
  const finishingItems = [];

  if (includeFinishing) {
    Object.entries(selectedFinishing).forEach(([itemId, specIdx]) => {
      if (specIdx !== null && specIdx !== undefined && specIdx !== -1) {
        const op = finishingData.find(f => f.id === itemId);
        if (op && op.specs[specIdx]) {
          const spec = op.specs[specIdx];
          finishingTotalTime += spec.processTime;
          finishingLabourHours += spec.labourHrs;
          finishingItems.push({
            name: op.name,
            spec: spec.spec,
            time: spec.processTime,
            labourHrs: spec.labourHrs
          });
        }
      }
    });
  }

  // TOTALS
  const grandTotalMinutes = windingTotalTime + mouldingLeadTime + tapingTotalTime + braidingTotalTime + finishingTotalTime;
  const totalSetupTime = windingSetupTime + tapingSetupTime + braidingSetupTime;
  const totalProcessTime = windingProcessTime + mouldingLeadTime + tapingProcessTime + braidingProcessTime + finishingTotalTime;
  const totalLabourHours = windingLabourHours + mouldingLabourHours + tapingLabourHours + braidingLabourHours + finishingLabourHours;

  const totalHours = grandTotalMinutes / 60;
  const shiftVal = Math.max(1, Number(shiftHours) || 8);
  const productionShifts = totalHours / shiftVal;

  return {
    inputs: {
      length: numLength,
      lengthMm: numLength * 1000,
      rounds: numRounds,
      fittingType,
      fittingSize,
      endsCount: numEnds,
      includeTaping,
      includeBraiding,
      includeFinishing
    },
    winding: {
      setupTime: windingSetupTime,
      ratePerMeterPerRound: windingRate,
      processTime: windingProcessTime,
      totalTime: windingTotalTime,
      labourHours: windingLabourHours,
      range: windingRange
    },
    moulding: {
      fittingType,
      fittingSize,
      endsCount: numEnds,
      leadTime: mouldingLeadTime,
      labourHours: mouldingLabourHours,
      detail: mouldingDetail
    },
    taping: {
      enabled: includeTaping,
      setupTime: tapingSetupTime,
      ratePerMeter: tapingRate,
      processTime: tapingProcessTime,
      totalTime: tapingTotalTime,
      labourHours: tapingLabourHours,
      range: tapingRange
    },
    braiding: {
      enabled: includeBraiding,
      tandemEnabled: isTandemEnabled,
      tandemOffset: numTandemOffset,
      baseSetup: Number(braidingBaseSetup ?? braidingData.baseSetupTime ?? 90) || 0,
      setupPerLayer: Number(braidingSetupPerLayer ?? braidingData.setupTimePerLayer ?? 10) || 0,
      setupTime: braidingSetupTime,
      processTime: braidingProcessTime,
      sequentialProcessTime: braidingSequentialProcessTime,
      timeSaved: braidingTimeSaved,
      totalTime: braidingTotalTime,
      labourHours: braidingLabourHours,
      layers: calculatedLayers,
      groups: braidingGroups,
      pairCount: braidingGroups.filter(g => g.type === 'tandem_pair').length,
      singleCount: braidingGroups.filter(g => g.type === 'single').length
    },
    finishing: {
      enabled: includeFinishing,
      totalTime: finishingTotalTime,
      labourHours: finishingLabourHours,
      items: finishingItems
    },
    totals: {
      grandTotalMinutes,
      grandTotalHours: totalHours,
      formattedTime: formatMinutes(grandTotalMinutes),
      totalSetupTime,
      formattedSetupTime: formatMinutes(totalSetupTime),
      totalProcessTime,
      formattedProcessTime: formatMinutes(totalProcessTime),
      totalLabourHours,
      productionShifts: Number(productionShifts.toFixed(2)),
      setupPercent: grandTotalMinutes > 0 ? Math.round((totalSetupTime / grandTotalMinutes) * 100) : 0,
      processPercent: grandTotalMinutes > 0 ? Math.round((totalProcessTime / grandTotalMinutes) * 100) : 0
    }
  };
}

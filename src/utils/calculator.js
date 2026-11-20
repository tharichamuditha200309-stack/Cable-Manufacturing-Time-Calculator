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
    // If diameter is lower than lowest range available, use lowest
    if (d <= matches[0].minDia) return { ...matches[0], matchedRange: matches[0].diameterRange };
    // If higher than highest available, use highest
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
  endsCount = 2, // Always 2 ends per user requirement
  customMouldingLeadTime = null,

  includeTaping = true,
  tapingSetup = 20, // mins
  customTapingRate = null,

  includeBraiding = true,
  postTapingDiameter = 12.0, // mm (input)
  braidingBaseSetup = 90, // mins
  braidingSetupPerLayer = 10, // mins per layer
  braidingLayers = [
    { id: '1', bobbins: 32, type: 1, customRate: null }
  ],

  includeFinishing = false,
  selectedFinishing = {},
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
  const numEnds = 2; // Always 2 ends (both terminations)

  // 1. WINDING CALCULATION
  const windingRange = getWindingRange(numLength, windingData);
  const windingRate = customWindingRate !== null && customWindingRate !== undefined && customWindingRate !== ''
    ? Number(customWindingRate)
    : Number(windingRange.windingTimePerMeter);
  
  const windingSetupTime = Number(windingSetup ?? windingData.fixedSetupTime ?? 30) || 0;
  const windingProcessTime = windingRate * numLength * numRounds;
  const windingTotalTime = windingSetupTime + windingProcessTime;
  
  const windingLabourHoursRatio = windingRange.avgLeadTime > 0 
    ? (windingRange.avgLabourHrs / (windingRange.avgLeadTime / 60)) 
    : 1.0;
  const windingLabourHours = (windingTotalTime / 60) * windingLabourHoursRatio;

  // 2. MOULDING CALCULATION (Always 2 Ends)
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
      mouldingLeadTime = unitTime * numEnds; // 2 Ends
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

  // 4. BRAIDING CALCULATION WITH DIAMETER GROWTH & TANDEM PARALLEL MACHINES
  let braidingSetupTime = 0;
  let braidingProcessTime = 0;
  let braidingTotalTime = 0;
  let braidingLabourHours = 0;
  const calculatedLayers = [];
  const executionBlocks = [];

  const startDiameter = Math.max(0.1, Number(postTapingDiameter) || 12.0);
  const layerCount = includeBraiding ? braidingLayers.length : 0;
  const finalOuterDiameter = startDiameter + (layerCount * 1.0); // +1mm per layer

  if (includeBraiding && layerCount > 0) {
    const baseSetup = Number(braidingBaseSetup ?? braidingData.baseSetupTime ?? 90) || 0;
    const perLayerSetup = Number(braidingSetupPerLayer ?? braidingData.setupTimePerLayer ?? 10) || 0;
    braidingSetupTime = baseSetup + (layerCount * perLayerSetup);

    // Step A: Calculate individual layer diameters, rates, and solo run times
    braidingLayers.forEach((layer, idx) => {
      const incomingDiameter = startDiameter + (idx * 1.0); // +1mm for each previous layer
      const outgoingDiameter = incomingDiameter + 1.0;
      
      const match = getBraidingRateByDiameter(incomingDiameter, layer.bobbins, layer.type, braidingData);
      const rate = (layer.customRate !== null && layer.customRate !== undefined && layer.customRate !== '')
        ? Number(layer.customRate)
        : Number(match.ratePerMeter);
      
      const soloRunTime = rate * numLength;

      calculatedLayers.push({
        layerIndex: idx + 1,
        bobbins: layer.bobbins,
        type: layer.type,
        desc: `${layer.bobbins}×${layer.type}`,
        incomingDiameter,
        outgoingDiameter,
        matchedRange: match.matchedRange || match.diameterRange,
        ratePerMeter: rate,
        soloRunTime,
        executionMode: 'solo', // will be updated below
        pairedWith: null,
        blockTime: soloRunTime
      });
    });

    // Step B: Pair layers in tandem with 2 machines
    // Rule:
    // 1. Two consecutive layers with the SAME bobbin structure can run in tandem (2 machines, +5 min lag).
    // 2. The LAST layer is ALWAYS braided alone (solo).
    // Example with 10 layers: (1,2), (3,4), (5,6), (7,8), 9 solo, 10 solo.
    // Example with 3 layers: (1,2), 3 solo.
    const TANDEM_LAG = 5.0; // 5 minutes time difference when 2 machines run
    let i = 0;

    while (i < layerCount) {
      const isLastLayer = (i === layerCount - 1);
      const nextIsLastLayer = (i + 1 === layerCount - 1);
      const hasNext = (i + 1 < layerCount);

      const canPair = hasNext 
        && !nextIsLastLayer // Next layer must NOT be the final layer (because final layer is always alone!)
        && calculatedLayers[i].desc === calculatedLayers[i + 1].desc;

      if (canPair) {
        // Run in tandem with Machine 2 starting 5 mins after Machine 1
        const layerA = calculatedLayers[i];
        const layerB = calculatedLayers[i + 1];
        
        // Total time for the tandem pair = max(timeA, timeB) + 5 min lag
        const pairTime = Math.max(layerA.soloRunTime, layerB.soloRunTime) + TANDEM_LAG;

        layerA.executionMode = 'tandem_primary';
        layerA.pairedWith = i + 2; // 1-based index
        layerA.blockTime = pairTime;

        layerB.executionMode = 'tandem_secondary';
        layerB.pairedWith = i + 1;
        layerB.blockTime = 0; // counted in primary

        executionBlocks.push({
          type: 'tandem',
          layers: [i + 1, i + 2],
          desc: `${layerA.desc} (Tandem Machines)`,
          time: pairTime,
          explanation: `Layers ${i + 1} & ${i + 2}: 2 machines run together with 5 min lag (${Math.max(layerA.soloRunTime, layerB.soloRunTime).toFixed(1)}m + 5m = ${pairTime.toFixed(1)}m)`
        });

        braidingProcessTime += pairTime;
        i += 2; // Advance past both paired layers
      } else {
        // Run solo (single machine)
        const layer = calculatedLayers[i];
        layer.executionMode = isLastLayer ? 'solo_final' : 'solo';
        layer.pairedWith = null;
        layer.blockTime = layer.soloRunTime;

        executionBlocks.push({
          type: 'solo',
          layers: [i + 1],
          desc: `${layer.desc} (${isLastLayer ? 'Final Solo Layer' : 'Single Machine'})`,
          time: layer.soloRunTime,
          explanation: `Layer ${i + 1}: ${layer.soloRunTime.toFixed(1)}m (${isLastLayer ? 'Always braided alone as final layer' : 'Single machine run'})`
        });

        braidingProcessTime += layer.soloRunTime;
        i += 1;
      }
    }

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
      postTapingDiameter: startDiameter,
      finalOuterDiameter,
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
      endsCount: numEnds, // Always 2
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
      baseSetup: Number(braidingBaseSetup ?? braidingData.baseSetupTime ?? 90) || 0,
      setupPerLayer: Number(braidingSetupPerLayer ?? braidingData.setupTimePerLayer ?? 10) || 0,
      setupTime: braidingSetupTime,
      processTime: braidingProcessTime,
      totalTime: braidingTotalTime,
      labourHours: braidingLabourHours,
      layers: calculatedLayers,
      executionBlocks,
      postTapingDiameter: startDiameter,
      finalOuterDiameter
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

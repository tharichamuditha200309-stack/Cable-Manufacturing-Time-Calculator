import { WINDING_DATA, MOULDING_DATA, TAPING_DATA, BRAIDING_DATA, FINISHING_DATA } from '../data/manufacturingData.js';

/**
 * Find the matching winding length range
 */
export function getWindingRange(length) {
  const l = Number(length) || 0;
  if (l <= 10) return WINDING_DATA.lengthRanges[0];
  if (l <= 20) return WINDING_DATA.lengthRanges[1];
  if (l <= 30) return WINDING_DATA.lengthRanges[2];
  if (l <= 40) return WINDING_DATA.lengthRanges[3];
  return WINDING_DATA.lengthRanges[4];
}

/**
 * Find matching taping length range
 */
export function getTapingRange(length) {
  const l = Number(length) || 0;
  if (l <= 10) return TAPING_DATA.lengthRanges[0];
  if (l <= 20) return TAPING_DATA.lengthRanges[1];
  if (l <= 30) return TAPING_DATA.lengthRanges[2];
  if (l <= 40) return TAPING_DATA.lengthRanges[3];
  return TAPING_DATA.lengthRanges[4];
}

/**
 * Find matching braiding rate for length, bobbins, and type
 */
export function getBraidingRate(length, bobbins, type) {
  const l = Number(length) || 0;
  let lenRange = '1-10';
  if (l > 10 && l <= 20) lenRange = '10-20';
  else if (l > 20 && l <= 30) lenRange = '20-30';
  else if (l > 30 && l <= 40) lenRange = '30-40';
  else if (l > 40) lenRange = '41-50';

  const match = BRAIDING_DATA.layerDetails.find(
    item => item.lengthRange === lenRange && item.bobbins === Number(bobbins) && item.type === Number(type)
  );

  if (match) return match;

  // Fallback if specific length range not measured
  const fallback = BRAIDING_DATA.layerDetails.find(
    item => item.bobbins === Number(bobbins) && item.type === Number(type)
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
  endsCount = 1,
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

  includeFinishing = false,
  selectedFinishing = {}, // map of { [itemId]: specIndex }
  shiftHours = 8
}) {
  const numLength = Math.max(0.1, Number(length) || 1);
  const numRounds = Math.max(1, Number(rounds) || 1);
  const numEnds = Math.max(0, Number(endsCount) || 1);

  // 1. WINDING CALCULATION
  // Formula: setup (30 mins) + (winding time for 1m * length * no. of rounds)
  const windingRange = getWindingRange(numLength);
  const windingRate = customWindingRate !== null && customWindingRate !== undefined && customWindingRate !== ''
    ? Number(customWindingRate)
    : windingRange.windingTimePerMeter;
  
  const windingSetupTime = Number(windingSetup) || 0;
  const windingProcessTime = windingRate * numLength * numRounds;
  const windingTotalTime = windingSetupTime + windingProcessTime;
  
  // Historical labour hours ratio
  const windingLabourHoursRatio = windingRange.avgLeadTime > 0 
    ? (windingRange.avgLabourHrs / (windingRange.avgLeadTime / 60)) 
    : 1.0;
  const windingLabourHours = (windingTotalTime / 60) * windingLabourHoursRatio;

  // 2. MOULDING CALCULATION
  // Lead time chosen directly according to chart for fitting type and size
  let mouldingLeadTime = 0;
  let mouldingLabourHours = 0;
  let mouldingDetail = null;

  if (fittingType && fittingType !== 'None' && MOULDING_DATA.items[fittingType]) {
    const item = MOULDING_DATA.items[fittingType].find(i => String(i.size) === String(fittingSize)) 
      || MOULDING_DATA.items[fittingType][0];
    
    if (item) {
      mouldingDetail = item;
      const unitTime = (customMouldingLeadTime !== null && customMouldingLeadTime !== undefined && customMouldingLeadTime !== '')
        ? Number(customMouldingLeadTime)
        : item.leadTimeMin;
      mouldingLeadTime = unitTime * numEnds;
      mouldingLabourHours = (item.labourHrs || (unitTime / 60)) * numEnds;
    }
  }

  // 3. TAPING CALCULATION
  // Formula: setup (20 mins) + (taping time of 1m * length)
  let tapingSetupTime = 0;
  let tapingProcessTime = 0;
  let tapingTotalTime = 0;
  let tapingLabourHours = 0;
  let tapingRange = null;
  let tapingRate = 0;

  if (includeTaping) {
    tapingRange = getTapingRange(numLength);
    tapingRate = customTapingRate !== null && customTapingRate !== undefined && customTapingRate !== ''
      ? Number(customTapingRate)
      : tapingRange.tapingTimePerMeter;
    
    tapingSetupTime = Number(tapingSetup) || 0;
    tapingProcessTime = tapingRate * numLength;
    tapingTotalTime = tapingSetupTime + tapingProcessTime;
    
    const tapingLabourRatio = tapingRange.avgLeadTime > 0 
      ? (tapingRange.labourHrs / (tapingRange.avgLeadTime / 60)) 
      : 1.0;
    tapingLabourHours = (tapingTotalTime / 60) * tapingLabourRatio;
  }

  // 4. BRAIDING CALCULATION
  // Formula: setup = 90 mins base + 10 mins per layer; process time = braiding time for 1m * length (summed over layers)
  let braidingSetupTime = 0;
  let braidingProcessTime = 0;
  let braidingTotalTime = 0;
  let braidingLabourHours = 0;
  const calculatedLayers = [];

  if (includeBraiding && braidingLayers.length > 0) {
    const layerCount = braidingLayers.length;
    const baseSetup = Number(braidingBaseSetup) || 0;
    const perLayerSetup = Number(braidingSetupPerLayer) || 0;
    braidingSetupTime = baseSetup + (layerCount * perLayerSetup);

    braidingLayers.forEach((layer, idx) => {
      const match = getBraidingRate(numLength, layer.bobbins, layer.type);
      const rate = (layer.customRate !== null && layer.customRate !== undefined && layer.customRate !== '')
        ? Number(layer.customRate)
        : match.leadTimePerMeter;
      
      const layerTime = rate * numLength;
      braidingProcessTime += layerTime;

      calculatedLayers.push({
        layerIndex: idx + 1,
        bobbins: layer.bobbins,
        type: layer.type,
        desc: `${layer.bobbins}×${layer.type}`,
        ratePerMeter: rate,
        layerTime,
        avgBraidingTimePerLayer: match.avgBraidingTimePerLayer
      });
    });

    braidingTotalTime = braidingSetupTime + braidingProcessTime;
    braidingLabourHours = (braidingTotalTime / 60) * 0.95; // Industry standard baseline
  }

  // 5. FINISHING CALCULATION (Optional Process Module)
  let finishingTotalTime = 0;
  let finishingLabourHours = 0;
  const finishingItems = [];

  if (includeFinishing) {
    Object.entries(selectedFinishing).forEach(([itemId, specIdx]) => {
      if (specIdx !== null && specIdx !== undefined && specIdx !== -1) {
        const op = FINISHING_DATA.find(f => f.id === itemId);
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
      baseSetup: Number(braidingBaseSetup) || 0,
      setupPerLayer: Number(braidingSetupPerLayer) || 0,
      setupTime: braidingSetupTime,
      processTime: braidingProcessTime,
      totalTime: braidingTotalTime,
      labourHours: braidingLabourHours,
      layers: calculatedLayers
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

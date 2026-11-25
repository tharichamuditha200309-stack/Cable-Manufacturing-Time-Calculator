// Cable Manufacturing Reference Data from Production Study

export const WINDING_DATA = {
  fixedSetupTime: 30, // minutes (fixed for all cables)
  lengthRanges: [
    {
      id: '1-10',
      minLen: 1,
      maxLen: 10,
      label: '1–10 m (1,000–10,000 mm)',
      windingTimePerMeter: 0.5491, // min/m/round
      leadTimePerMeter: 0.8526,
      samples: 1,
      avgLeadTime: 300,
      avgLabourHrs: 9,
      byRounds: [
        { roundsRange: '1–50', minR: 1, maxR: 50, samples: 1, avgLeadTime: 165, avgLabourHrs: 3.25 },
        { roundsRange: '51–100', minR: 51, maxR: 100, samples: 1, avgLeadTime: 187.5, avgLabourHrs: 3.75 },
        { roundsRange: '101–200', minR: 101, maxR: 200, samples: 2, avgLeadTime: 202.5, avgLabourHrs: 3.625 },
        { roundsRange: '201–300', minR: 201, maxR: 300, samples: 2, avgLeadTime: 225, avgLabourHrs: 4.25 },
      ]
    },
    {
      id: '11-20',
      minLen: 11,
      maxLen: 20,
      label: '11–20 m (10,001–20,000 mm)',
      windingTimePerMeter: 0.2318,
      leadTimePerMeter: 0.5119,
      samples: 4,
      avgLeadTime: 156.25,
      avgLabourHrs: 4.33,
      byRounds: [
        { roundsRange: '1–50', minR: 1, maxR: 50, samples: 7, avgLeadTime: 162.14, avgLabourHrs: 3.69 },
        { roundsRange: '51–100', minR: 51, maxR: 100, samples: 2, avgLeadTime: 225, avgLabourHrs: 3.75 },
      ]
    },
    {
      id: '21-30',
      minLen: 21,
      maxLen: 30,
      label: '21–30 m (20,001–30,000 mm)',
      windingTimePerMeter: 0.0901,
      leadTimePerMeter: 0.1881,
      samples: 1,
      avgLeadTime: 150,
      avgLabourHrs: 4.5,
      byRounds: [
        { roundsRange: '1–50', minR: 1, maxR: 50, samples: 3, avgLeadTime: 135, avgLabourHrs: 2.92 },
        { roundsRange: '51–100', minR: 51, maxR: 100, samples: 3, avgLeadTime: 140, avgLabourHrs: 3.83 },
        { roundsRange: '101–200', minR: 101, maxR: 200, samples: 3, avgLeadTime: 415, avgLabourHrs: 7.58 },
        { roundsRange: '201–300', minR: 201, maxR: 300, samples: 1, avgLeadTime: 360, avgLabourHrs: 6.5 },
      ]
    },
    {
      id: '31-40',
      minLen: 31,
      maxLen: 40,
      label: '31–40 m (30,001–40,000 mm)',
      windingTimePerMeter: 0.0926,
      leadTimePerMeter: 0.1411,
      samples: 2,
      avgLeadTime: 165,
      avgLabourHrs: 4.75,
      byRounds: [
        { roundsRange: '1–50', minR: 1, maxR: 50, samples: 1, avgLeadTime: 270, avgLabourHrs: 4.5 },
        { roundsRange: '51–100', minR: 51, maxR: 100, samples: 6, avgLeadTime: 225, avgLabourHrs: 4.95 },
      ]
    },
    {
      id: '41-50',
      minLen: 41,
      maxLen: 50,
      label: '41–50 m (40,001–50,000 mm)',
      windingTimePerMeter: 0.0383,
      leadTimePerMeter: 0.0466,
      samples: 4,
      avgLeadTime: 742.8,
      avgLabourHrs: 23.38,
      byRounds: [
        { roundsRange: '51–100', minR: 51, maxR: 100, samples: 2, avgLeadTime: 300, avgLabourHrs: 7 },
        { roundsRange: '101–200', minR: 101, maxR: 200, samples: 2, avgLeadTime: 330, avgLabourHrs: 8.625 },
        { roundsRange: '201–300', minR: 201, maxR: 300, samples: 1, avgLeadTime: 960, avgLabourHrs: 30.5 },
        { roundsRange: '601–700', minR: 601, maxR: 700, samples: 1, avgLeadTime: 1350, avgLabourHrs: 43.5 },
      ]
    }
  ],
  overallRoundsSummary: [
    { range: '1–50', samples: 6, avgLeadTimeMin: 147.5, avgLeadTimeHrs: 2.46, avgLabourHrs: 4.64 },
    { range: '51–100', samples: 2, avgLeadTimeMin: 300, avgLeadTimeHrs: 5.0, avgLabourHrs: 9.0 },
    { range: '101–200', samples: 2, avgLeadTimeMin: 330, avgLeadTimeHrs: 5.5, avgLabourHrs: 9.75 },
    { range: '201–300', samples: 1, avgLeadTimeMin: 960, avgLeadTimeHrs: 16.0, avgLabourHrs: 30.5 },
    { range: '501–700', samples: 1, avgLeadTimeMin: 1350, avgLeadTimeHrs: 22.5, avgLabourHrs: 43.5 },
  ]
};

export const MOULDING_DATA = {
  types: ['Thimble', 'Spool', 'None'],
  items: {
    Thimble: [
      { size: '1', label: 'Size 1', samples: 2, leadTimeMin: 295, leadTimeHrs: 4.92, labourHrs: 4.92 },
      { size: '2', label: 'Size 2', samples: 6, leadTimeMin: 311.67, leadTimeHrs: 5.19, labourHrs: 5.19 },
      { size: '3', label: 'Size 3', samples: 4, leadTimeMin: 305, leadTimeHrs: 5.08, labourHrs: 5.08 },
      { size: '4', label: 'Size 4', samples: 5, leadTimeMin: 394, leadTimeHrs: 6.57, labourHrs: 6.77 },
      { size: '5', label: 'Size 5', samples: 4, leadTimeMin: 508.75, leadTimeHrs: 8.48, labourHrs: 7.48 },
      { size: '6', label: 'Size 6', samples: 2, leadTimeMin: 555, leadTimeHrs: 9.25, labourHrs: 9.25 },
    ],
    Spool: [
      { size: 'OD25 - OD45', label: 'OD25 - OD45', samples: 3, leadTimeMin: 295, leadTimeHrs: 4.92, labourHrs: 4.92 },
      { size: 'OD45 - OD75', label: 'OD45 - OD75', samples: 4, leadTimeMin: 367.5, leadTimeHrs: 6.13, labourHrs: 6.13 },
      { size: 'OD75 - OD120', label: 'OD75 - OD120', samples: 3, leadTimeMin: 488, leadTimeHrs: 8.13, labourHrs: 8.14 },
    ],
    None: [
      { size: 'None', label: 'None (No Moulding)', samples: 0, leadTimeMin: 0, leadTimeHrs: 0, labourHrs: 0 }
    ]
  }
};

export const TAPING_DATA = {
  fixedSetupTime: 20, // minutes (fixed for all cables)
  lengthRanges: [
    { id: '1-10', minLen: 1, maxLen: 10, label: '1–10 m', samples: 3, avgLeadTime: 23.33, labourHrs: 0.388, tapingTimePerMeter: 7.35, leadTimePerMeter: 3.72 },
    { id: '11-20', minLen: 11, maxLen: 20, label: '11–20 m', samples: 6, avgLeadTime: 100, labourHrs: 1.67, tapingTimePerMeter: 6.3413, leadTimePerMeter: 6.3281 },
    { id: '21-30', minLen: 21, maxLen: 30, label: '21–30 m', samples: 6, avgLeadTime: 118.33, labourHrs: 1.972, tapingTimePerMeter: 5.372, leadTimePerMeter: 5.9676 },
    { id: '31-40', minLen: 31, maxLen: 40, label: '31–40 m', samples: 10, avgLeadTime: 118.75, labourHrs: 2.167, tapingTimePerMeter: 3.315, leadTimePerMeter: 4.0283 },
    { id: '41-50', minLen: 41, maxLen: 50, label: '41–50 m', samples: 4, avgLeadTime: 118.33, labourHrs: 1.916, tapingTimePerMeter: 2.5441, leadTimePerMeter: 2.7346 },
  ]
};

export const BRAIDING_DATA = {
  baseSetupTime: 90, // minutes (setup for all cables)
  setupTimePerLayer: 10, // minutes added for each layer
  diameterIncrementPerLayer: 1.0, // mm added to diameter per braided layer
  tandemMachineLag: 5.0, // minutes lag when running 2 machines in tandem
  bobbinOptions: [16, 32, 64],
  typeOptions: [1, 2],
  
  // Exact table from sheet: Diameter Range, Layer Description, Average Braiding time for 1m
  layerDetails: [
    { diameterRange: '0-10', minDia: 0, maxDia: 10, bobbins: 16, type: 1, desc: '16×1', ratePerMeter: 3.0 },
    { diameterRange: '10-20', minDia: 10, maxDia: 20, bobbins: 16, type: 1, desc: '16×1', ratePerMeter: 2.5 },
    { diameterRange: '0-10', minDia: 0, maxDia: 10, bobbins: 16, type: 2, desc: '16×2', ratePerMeter: 2.7 },
    { diameterRange: '10-20', minDia: 10, maxDia: 20, bobbins: 16, type: 2, desc: '16×2', ratePerMeter: 2.25 },
    { diameterRange: '0-10', minDia: 0, maxDia: 10, bobbins: 32, type: 1, desc: '32×1', ratePerMeter: 4.0 },
    { diameterRange: '10-20', minDia: 10, maxDia: 20, bobbins: 32, type: 1, desc: '32×1', ratePerMeter: 2.5 },
    { diameterRange: '20-30', minDia: 20, maxDia: 30, bobbins: 32, type: 1, desc: '32×1', ratePerMeter: 2.25 },
    { diameterRange: '0-10', minDia: 0, maxDia: 10, bobbins: 32, type: 2, desc: '32×2', ratePerMeter: 3.6 },
    { diameterRange: '10-20', minDia: 10, maxDia: 20, bobbins: 32, type: 2, desc: '32×2', ratePerMeter: 2.7 },
    { diameterRange: '20-30', minDia: 20, maxDia: 30, bobbins: 32, type: 2, desc: '32×2', ratePerMeter: 2.5 },
    { diameterRange: '20-30', minDia: 20, maxDia: 30, bobbins: 64, type: 1, desc: '64×1', ratePerMeter: 1.5 },
    { diameterRange: '30-50', minDia: 30, maxDia: 50, bobbins: 64, type: 1, desc: '64×1', ratePerMeter: 1.4 },
    { diameterRange: '20-30', minDia: 20, maxDia: 30, bobbins: 64, type: 2, desc: '64×2', ratePerMeter: 1.35 },
    { diameterRange: '30-50', minDia: 30, maxDia: 50, bobbins: 64, type: 2, desc: '64×2', ratePerMeter: 1.26 },
  ]
};

export const CABLE_TYPES = ['Fibrelite', 'Torquelite', 'Torquelite Flex'];

export const FINISHING_DATA = [
  { 
    id: 'cutback_shrink', 
    cableType: 'Torquelite', 
    name: 'Cut back & shrink tube installment', 
    category: 'Cut Back',
    matchField: 'fittingSize',
    specs: [
      { spec: 'Size 2', processTime: 60, labours: 2, labourHrs: 2, minBound: 2, maxBound: 2 },
      { spec: 'Size 3', processTime: 90, labours: 2, labourHrs: 3, minBound: 3, maxBound: 3 },
      { spec: 'Size 4', processTime: 120, labours: 2, labourHrs: 4, minBound: 4, maxBound: 4 },
      { spec: 'Size 5', processTime: 150, labours: 2, labourHrs: 5, minBound: 5, maxBound: 5 },
    ]
  },
  { 
    id: 'cutback_flex', 
    cableType: 'Torquelite Flex', 
    name: 'Cut back', 
    category: 'Cut Back',
    matchField: 'fixed',
    specs: [
      { spec: 'Standard', processTime: 60, labours: 2, labourHrs: 2, minBound: 0, maxBound: 999 }
    ]
  },
  { 
    id: 'testing', 
    cableType: 'All', 
    name: 'Testing', 
    category: 'Quality',
    matchField: 'fixed',
    specs: [
      { spec: 'Standard Testing', processTime: 45, labours: 2, labourHrs: 2, minBound: 0, maxBound: 999 }
    ]
  },
  { 
    id: 'breaking', 
    cableType: 'All', 
    name: 'Cable breaking', 
    category: 'Breaking',
    matchField: 'rounds',
    specs: [
      { spec: 'Rounds 1-50', processTime: 20, labours: 4, labourHrs: 1.33, minBound: 1, maxBound: 50 },
      { spec: 'Rounds 51-100', processTime: 30, labours: 5, labourHrs: 2.5, minBound: 51, maxBound: 100 },
      { spec: 'Rounds 101-500', processTime: 30, labours: 6, labourHrs: 3.0, minBound: 101, maxBound: 500 },
      { spec: 'Rounds 501-1000', processTime: 40, labours: 25, labourHrs: 16.67, minBound: 501, maxBound: 1000 },
    ]
  },
  { 
    id: 'coiling', 
    cableType: 'All', 
    name: 'Coiling', 
    category: 'Handling',
    matchField: 'length',
    specs: [
      { spec: 'Length 1-10', processTime: 15, labours: 2, labourHrs: 1.0, minBound: 0, maxBound: 10 },
      { spec: 'Length 10.001-20', processTime: 30, labours: 4, labourHrs: 2.67, minBound: 10.001, maxBound: 20 },
      { spec: 'Length 20.001-30', processTime: 40, labours: 4, labourHrs: 2.67, minBound: 20.001, maxBound: 30 },
      { spec: 'Length 30.001-40', processTime: 40, labours: 5, labourHrs: 3.33, minBound: 30.001, maxBound: 40 },
    ]
  },
  { 
    id: 'polishing', 
    cableType: 'All', 
    name: 'Fitting Polishing & cleaning', 
    category: 'Finishing',
    matchField: 'fittingSize',
    specs: [
      { spec: 'Size 1', processTime: 20, labours: 1, labourHrs: 0.33, minBound: 0, maxBound: 1 },
      { spec: 'Size 2-3', processTime: 30, labours: 1, labourHrs: 0.5, minBound: 2, maxBound: 3 },
      { spec: 'Size 4-6', processTime: 60, labours: 1, labourHrs: 1.0, minBound: 4, maxBound: 6 },
    ]
  },
  { 
    id: 'box_prep_flex_fibre', 
    cableType: 'Fibrelite/Torquelite Flex', 
    name: 'Box Preparation (Fibrelite & Torquelite Flex)', 
    category: 'Packaging',
    matchField: 'cableOD',
    woodenThreshold: 56,
    specs: [
      { spec: '0 < OD <= 32 mm', processTime: 30, labours: 1, labourHrs: 1.0, minBound: 0, maxBound: 32 },
      { spec: '32 < OD <= 52 mm', processTime: 45, labours: 1, labourHrs: 1.5, minBound: 32.001, maxBound: 52 },
      { spec: '52 < OD <= 56 mm', processTime: 60, labours: 2, labourHrs: 2.0, minBound: 52.001, maxBound: 56.001 },
    ]
  },
  { 
    id: 'box_prep_torquelite', 
    cableType: 'Torquelite', 
    name: 'Box Preparation (Torquelite)', 
    category: 'Packaging',
    matchField: 'cableOD',
    woodenThreshold: 28,
    specs: [
      { spec: '0 < OD <= 16 mm', processTime: 45, labours: 1, labourHrs: 0.75, minBound: 0, maxBound: 16 },
      { spec: '16 < OD <= 26 mm', processTime: 90, labours: 1, labourHrs: 1.5, minBound: 16.001, maxBound: 26 },
      { spec: '26 < OD <= 28 mm', processTime: 150, labours: 2, labourHrs: 5.0, minBound: 26.001, maxBound: 28 },
    ]
  }
];

export const REFERENCE_DATA_VERSION = '2026.11.25_v3_post_tape_od';

export const INITIAL_REFERENCE_DATA = {
  _version: REFERENCE_DATA_VERSION,
  winding: WINDING_DATA,
  moulding: MOULDING_DATA,
  taping: TAPING_DATA,
  braiding: BRAIDING_DATA,
  finishing: FINISHING_DATA,
  customTables: []
};



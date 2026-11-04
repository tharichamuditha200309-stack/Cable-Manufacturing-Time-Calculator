# Cable Manufacturing Time Calculator & Production Planning Dashboard

A modern, high-precision industrial engineering dashboard built with **React**, **Vite**, and **Tailwind CSS** to calculate total manufacturing lead times, machine running times, setup allowances, and labour requirements for custom cable manufacturing.

---

## 🚀 Key Features

- **Automated Stage Computations**:
  - **Winding**: Automatically selects the speed (min/m/round) based on cable length cohort, adds 30 min fixed setup allowance, and multiplies by length and number of rounds.
  - **Moulding**: Selects lead time from the engineering study for Thimble (Sizes 1–6) or Spool (OD ranges) fittings, supporting single or double-ended terminations.
  - **Taping**: Automatically selects taping speed (min/m) based on length cohort and applies fixed 20 min setup allowance.
  - **Braiding Architecture Builder**: Configures multiple braiding layers (16, 32, 64 bobbins and Type 1/2), applying baseline 90 min setup + 10 min setup per layer, and computes layer-by-layer run time.
  - **Finishing & Quality**: Optional module for Testing, Cut back & shrink tube, Cable breaking, Coiling, Polishing, and Box Preparation.
- **Executive KPI Cards**:
  - Total Lead Time in formatted `Hours & Minutes` and decimal hours.
  - Setup Time vs Machine Run Time ratio and percentages.
  - Labour hours and production shifts estimate (configurable 8h, 10h, or 12h shifts).
- **Interactive Routing & Gantt Timeline**: Visualizes the sequential flow of workstations, highlighting the critical-path bottleneck stage.
- **Batch Production Run Estimator**: Models batch volumes (e.g. 5, 10, 50, 100 cables) with setup amortisation for continuous runs vs individual setups.
- **Full Reference Rate Tables Modal**: Interactive inspector showing the raw data points, sample counts, and average lead times from the original Excel production study.
- **Printable Shop Floor Job Traveler Ticket**: Generates a clean, print-ready work order and routing traveler with checklist sign-off boxes.
- **Quick Presets**: 1-click loading for standard specifications (Standard 15m, Heavy Marine 28m, Compact 6m, Long Run 45m).
- **Export Capabilities**: Export job specs and lead time breakdown to CSV format.

---

## 📐 Mathematical Formulation

### 1. Winding Stage
$$\text{Winding Time} = \text{Setup (30 min)} + \left(\text{Winding Speed}_{\text{1m}} \times \text{Length (m)} \times \text{Rounds}\right)$$

| Length Range | Cohort Label | Winding Speed (min/m/round) | Lead Time for 1m (min) |
| :--- | :--- | :--- | :--- |
| **1 – 10 m** | 1–10,000 mm | `0.5491` | `0.8526` |
| **11 – 20 m** | 10,001–20,000 mm | `0.2318` | `0.5119` |
| **21 – 30 m** | 20,001–30,000 mm | `0.0901` | `0.1881` |
| **31 – 40 m** | 30,001–40,000 mm | `0.0926` | `0.1411` |
| **41 – 50 m** | 40,001–50,000 mm | `0.0383` | `0.0466` |

---

### 2. Moulding Stage
$$\text{Moulding Time} = \text{Lead Time}_{\text{Chart}} \times \text{Number of Moulded Ends}$$

- **Thimble**:
  - Size 1: `295.00 min` (4.92 hrs)
  - Size 2: `311.67 min` (5.19 hrs)
  - Size 3: `305.00 min` (5.08 hrs)
  - Size 4: `394.00 min` (6.57 hrs)
  - Size 5: `508.75 min` (8.48 hrs)
  - Size 6: `555.00 min` (9.25 hrs)
- **Spool**:
  - OD25 – OD45: `295.00 min` (4.92 hrs)
  - OD45 – OD75: `367.50 min` (6.13 hrs)
  - OD75 – OD120: `488.00 min` (8.13 hrs)

---

### 3. Taping Stage
$$\text{Taping Time} = \text{Setup (20 min)} + \left(\text{Taping Speed}_{\text{1m}} \times \text{Length (m)}\right)$$

| Length Range | Taping Speed (min/m) | Average Lead Time / 1m (min) |
| :--- | :--- | :--- |
| **1 – 10 m** | `7.3500` | `3.7200` |
| **11 – 20 m** | `6.3413` | `6.3281` |
| **21 – 30 m** | `5.3720` | `5.9676` |
| **31 – 40 m** | `3.3150` | `4.0283` |
| **41 – 50 m** | `2.5441` | `2.7346` |

---

### 4. Braiding Stage
$$\text{Braiding Setup} = 90\text{ min} + (10\text{ min} \times \text{Layers})$$
$$\text{Braiding Run Time} = \sum_{i=1}^{\text{Layers}} \left(\text{Rate}_{i} \times \text{Length}\right)$$
$$\text{Total Braiding Time} = \text{Braiding Setup} + \text{Braiding Run Time}$$

Carrier bobbins supported: **16, 32, 64** carriers with **Type 1** and **Type 2** weaves.

---

### 5. Total Manufacturing Lead Time
$$\text{Total Time} = \text{Winding Time} + \text{Moulding Time} + \text{Taping Time} + \text{Braiding Time} \ (+ \text{Finishing Time})$$

---

## 🛠️ Tech Stack

- **React 18** (Modern hooks, `useMemo`, modular component architecture)
- **Vite 6** (Blazing fast bundling & HMR)
- **Tailwind CSS 3** (Industrial dark theme, responsive grid, print styles)
- **Lucide React** (Clean engineering & shop floor iconography)

---

## 📦 Getting Started

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

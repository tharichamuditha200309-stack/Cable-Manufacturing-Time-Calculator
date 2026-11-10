# IT Handover & Technical Documentation
## Cable Manufacturing Time Calculator & Production Planning Dashboard

**Version:** 1.0.0  
**Technology:** React 18, Vite 6, Tailwind CSS 3, Lucide React  
**Architecture:** Client-Side Single Page Application (SPA) / Static Web App  
**Target Environment:** Company Intranet (IIS / Nginx / Docker) or Cloud (Azure / AWS / Netlify / Vercel)

---

## 1. Executive Summary & Architecture

This application is an industrial engineering calculator and production planning dashboard designed to compute cable manufacturing lead times across all stages:
1. **Winding** (length cohorts, speed min/m/round, 30m setup)
2. **Moulding** (Thimble sizes 1–6, Spool OD ranges, 1 or 2 ends)
3. **Taping** (length cohorts, speed min/m, 20m setup)
4. **Braiding Architecture** (Carrier bobbins 16/32/64, Type 1/2, parallel 2-machine staggering logic, 90m base + 10m/layer setup)
5. **Finishing & Quality Testing** (dynamic expandable process table)

### Zero-Backend Architecture
- **Pure Client-Side**: No backend server or SQL database is required to run this application.
- **Data Persistence**: Reference rates, custom table edits, and calculation history are automatically persisted in the client's browser using `localStorage`.
- **Exporting**: Direct client-side CSV generation and shop-floor Job Traveler ticket printing (`@media print` CSS included).

---

## 2. Requirements & Development Setup

### System Prerequisites
- **Node.js**: Version `18.x` or `20.x` (LTS recommended)
- **Package Manager**: `npm` (bundled with Node.js) or `pnpm` / `yarn`
- **Modern Browser**: Chrome, Edge, Firefox, Safari

### Local Development Setup
```bash
# 1. Navigate to the project root directory
cd Cable-Manufacturing-Time-Calculator

# 2. Install dependencies
npm install

# 3. Start local development server with Hot Module Replacement (HMR)
npm run dev
```
The application will start on `http://localhost:5173`. Any code changes will reflect instantly in the browser.

### Production Build
```bash
# Generates optimized static assets into the /dist folder
npm run build

# Preview the production build locally
npm run preview
```
The output directory `dist/` contains standalone HTML, JS, and CSS files ready to be served by any web server.

---

## 3. How to Make Future Changes (Code Map)

All engineering formulas, rate tables, and UI components are strictly modularized. Here is where IT can make changes:

| If you need to change... | File to edit | Description |
| :--- | :--- | :--- |
| **Default Speeds & Rate Tables** | `src/data/manufacturingData.js` | Contains standard winding speeds, moulding tables, taping speeds, braiding carrier rates, and finishing items. |
| **Calculation Logic & Formulas** | `src/utils/calculator.js` | All mathematical models: Winding formula, Moulding multiplication, Taping formula, Braiding parallel staggered machine logic, shift conversions, and batch economics. |
| **Input Fields & Form Layout** | `src/components/InputPanel.jsx` | Stage forms for cable length, moulding dropdowns, braiding builder, finishing toggles, and advanced overrides. |
| **KPIs & Summary Panels** | `src/components/OverallSummaryPanel.jsx` | Total lead time counter, hours/shift breakdown, process summation list. |
| **Rate Table Inspector & Editor** | `src/components/DataReferenceModal.jsx` | The interactive modal allowing engineers to view/edit baseline rate tables and add custom rate tables. |
| **Shop Floor Job Traveler Ticket** | `src/components/JobTicketModal.jsx` | Print layout and traveller work order generated for machine operators. |
| **History & Local Storage** | `src/components/ProcessHistoryModal.jsx` | Saved cable history management and restore mechanism. |
| **Colors, Theme & Fonts** | `src/index.css` & `tailwind.config.js` | Theme colors, dark header `#13171d`, ash background `#848e94`, and Poppins/Inter typography. |

---

## 4. Hosting & Deployment Options

Because this is a static Single Page Application (SPA), hosting is extremely lightweight and fast. Choose the option that fits your company's infrastructure:

### Option A: Internal Company Intranet (Windows Server / IIS)
1. Run `npm run build` to generate the `dist/` folder.
2. In **IIS Manager**:
   - Create a new Website or Virtual Directory (e.g., `CableCalculator`).
   - Set the Physical Path to the `dist` folder.
   - Ensure the server allows `.js`, `.css`, and `.html` MIME types.
3. Access via internal company network URL: e.g. `http://cable-calc.yourcompany.local`.

### Option B: Linux Server (Nginx or Apache)
Example Nginx configuration:
```nginx
server {
    listen 80;
    server_name cable-calc.yourcompany.local;

    root /var/www/cable-manufacturing-calculator/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Option C: Docker Container
You can containerize the `dist` output with a lightweight Nginx image:
```dockerfile
# Multi-stage Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Option D: Cloud Hosting (Azure / AWS / Vercel / Netlify)
- **Azure Static Web Apps**: Connect directly to your Git repository or deploy the `dist` folder using the Azure CLI.
- **AWS S3 + CloudFront**: Upload `dist/` to an S3 bucket configured for static web hosting.
- **Vercel / Netlify**: Simply link the Git repo, set Build Command to `npm run build` and Output Directory to `dist`.

---

## 5. Source Code Delivery Checklist
When handing over to IT, ensure:
1. Provide the complete project directory (excluding `node_modules` which will be generated via `npm install`).
2. Provide Git repository access (if using GitLab, GitHub, or Azure DevOps).
3. Provide this `IT_HANDOVER.md` guide.


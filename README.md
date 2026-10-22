# CNAPP Dynamic Security Dashboard

A dynamic, customizable Cloud Security (CNAPP) Dashboard built with **React**, **TypeScript**, **Tailwind CSS**, and **Redux Toolkit**. The entire dashboard layout is driven by a central JSON data structure and allows users to dynamically add, remove, toggle, and search widgets across categories with state persistence.

---

## 🚀 Live Demo & Screenshots

Built to match the reference CNAPP Dashboard specification:
- **Header**: Breadcrumbs (`Home > Dashboard V2`), Global Live Search (`Search anything...`), Notification indicator, and User profile.
- **Action Bar**: `Add Widget +` button, Reset/Refresh to default state, options menu, and Time Range filter (`Last 2 days`).
- **Dashboard Sections & Visualizations**:
  - **CSPM Executive Dashboard**:
    - *Cloud Accounts*: SVG Donut Chart with center total and connected / not connected status breakdown.
    - *Cloud Account Risk Assessment*: Multi-segment Donut Chart with Passed, Failed, Warning, and Not Available counts.
  - **CWPP Dashboard**:
    - *Top 5 Namespace Specific Alerts* & *Workload Alerts*: Empty graph state with illustrative chart icons and *"No Graph data available!"* message.
  - **Registry Scan**:
    - *Image Risk Assessment*: Horizontal multi-segment stacked progress bar with Critical, High, Medium, and Low severity breakdowns.
    - *Image Security Issues*: Horizontal stacked progress bar with total image count and severity tags.
  - **Placeholder Cards**: `+ Add Widget` card at the end of each category row.

---

## ✨ Key Features

1. **JSON-Driven Architecture**:
   - Initialized via `src/data/initialDashboardData.json`.
   - Each category contains an `id`, `name`, `shortCode`, and a collection of `widgets`.
   - Widgets define visual types (`donut`, `stacked-bar`, `empty-graph`, `custom-text`), metrics, and text content.

2. **Dynamic Widget Management**:
   - **Inline Removal**: Click the `✕` cross icon in the top right of any widget card to remove it immediately.
   - **Slide-out Drawer ("+ Add Widget")**:
     - Accessed from the top action bar or any category's `+ Add Widget` card.
     - Category tabs (`CSPM`, `CWPP`, `Image`, `Ticket`).
     - **Checklist Toggle**: Check or uncheck existing widgets to mount or unmount them dynamically.
     - **Custom Widget Creation**: Add a custom widget with a **Widget Name** and **Widget Text / Content** to any category.
     - **Confirm / Cancel** buttons to commit changes.

3. **Live Global Search**:
   - The top search bar filters widgets in real-time across all categories.
   - Matches widget names, descriptions, and metric labels.
   - Displays real-time matching count and an empty-search fallback with quick reset.

4. **State Management & Local Storage Persistence**:
   - Built with **Redux Toolkit** (`@reduxjs/toolkit` and `react-redux`).
   - All operations (`removeWidget`, `addNewWidget`, `toggleWidgetSelection`, `resetDashboard`) are processed through typed Redux actions.
   - Custom listener middleware automatically synchronizes the state to `localStorage`, so your widgets persist across browser refreshes.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) + React-Redux
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📦 Project Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── charts/
│   │   │   ├── CustomTextWidget.tsx  # Dynamic user-added widget renderer
│   │   │   ├── DonutChart.tsx        # High-fidelity SVG Donut Chart
│   │   │   ├── EmptyStateChart.tsx   # "No Graph data available" empty state
│   │   │   └── StackedBarChart.tsx   # Multi-segment horizontal vulnerability bar
│   │   ├── ActionBar.tsx             # Action bar (Add Widget, Refresh, Filter)
│   │   ├── AddWidgetCard.tsx         # Category placeholder card
│   │   ├── CategorySection.tsx       # Category grid wrapper
│   │   ├── Navbar.tsx                # Top navigation with live search
│   │   └── WidgetCard.tsx            # Card wrapper with delete (✕) button
│   └── drawer/
│       └── AddWidgetDrawer.tsx       # Slide-out drawer with tabs, checklist & form
├── data/
│   └── initialDashboardData.json     # Dynamic JSON schema & seed data
├── store/
│   ├── dashboardSlice.ts             # Redux actions and reducers
│   └── index.ts                      # Redux store & localStorage middleware
├── types/
│   └── dashboard.ts                  # TypeScript interfaces and models
├── App.tsx                           # Main application layout and search filtering
├── index.css                         # Tailwind CSS and global typography
└── main.tsx                          # App root with Redux Provider
```

---

## 💻 Local Setup & Execution Steps

### Prerequisites
Make sure you have **Node.js** (v18 or higher) and **npm** installed on your machine.

### 1. Clone or Extract the Project
```bash
# If cloned from Git:
git clone https://github.com/nija-kukadiya/CNAPP-Dynamic-Security-Dashboard.git
cd CNAPP-Dynamic-Security-Dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173
```

### 4. Build for Production
To test TypeScript compilation and build the optimized production bundle:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 📄 JSON Data Schema Example

```json
{
  "categories": [
    {
      "id": "cspm",
      "name": "CSPM Executive Dashboard",
      "shortCode": "CSPM",
      "widgets": [
        {
          "id": "cspm-1",
          "name": "Cloud Accounts",
          "type": "donut",
          "total": 2,
          "totalLabel": "Connected (2)",
          "metrics": [
            { "label": "Connected", "value": 2, "color": "#3b82f6" },
            { "label": "Not Connected", "value": 2, "color": "#93c5fd" }
          ]
        }
      ]
    }
  ]
}
```

---

## 👨‍💻 Author
**Nija Kukadiya**  
Senior Software Engineer / Tech Lead  
Surat, India

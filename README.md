# Zorvyn Finance Dashboard UI

Frontend assignment implementation using React (TypeScript) and Tailwind CSS.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS (via `@tailwindcss/vite`)
- Recharts for visualizations
- Lucide React icons
- Framer Motion for transitions and animations

## How to Run

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Feature Overview

### 1) Dashboard Overview

- Summary cards: Total Balance, Income, Expenses
- Time-based visualization: Balance trend (`AreaChart`)
- Categorical visualization: Spending breakdown by category (`PieChart`)

### 2) Transactions Section

- Transaction fields: Date, Amount, Category, Type, Note
- Interactions:
  - Search (category or note)
  - Filter by type
  - Filter by category
  - Amount range filter
  - Date range filter
  - Grouping by category, month, or type
  - Sort by date or amount
- Export options: CSV and JSON
- Graceful no-data state when filters return no results

### 3) Basic Role-Based UI (Frontend Simulation)

- Role switcher: `Viewer` / `Admin`
- Viewer:
  - Read-only dashboard and transactions
- Admin:
  - Add new transaction
  - Edit existing transaction

### 4) Insights Section

- Highest spending category
- Monthly comparison of expenses
- Helpful observation from current totals (income vs expenses)

### 5) State Management

Managed using React hooks (`useState`, `useMemo`) for:

- Transactions dataset
- Role selection
- Theme mode (dark/light)
- Filters and sorting
- Add/edit form state
- Derived metrics and chart data

### 6) Optional Enhancements Included

- Single-page architecture with all required sections in one dashboard view
- Mock API integration with simulated async delays
- Data persistence using local storage
- Dark mode toggle
- Animated page elements and section transitions
- Export functionality (CSV/JSON)
- Advanced filtering and grouping

### 7) UI/UX Details

- Responsive layout for mobile and desktop
- Clean card-based dashboard structure
- Distinct visual tokens for income/expense states
- Empty states for chart/table sections

## Project Structure

- `src/App.tsx`: single-page dashboard composition
- `src/context/FinanceContext.tsx`: centralized app state + derived data + persistence
- `src/services/mockApi.ts`: mock async API layer
- `src/components/*`: modular UI components by section
- `src/index.css`: global styles, theme tokens, transitions
- `vite.config.ts`: Vite plugin config including Tailwind

## Assumptions

- Uses mock frontend API layer (no backend server required)
- Currency formatting uses `INR` locale for finance display

## Notes for Review

This project intentionally prioritizes frontend architecture, interaction flow, and clarity over backend integration, matching the assignment scope.

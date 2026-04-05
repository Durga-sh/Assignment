# Zorvyn Finance Dashboard UI

Frontend assignment implementation built with React, TypeScript, Vite, and Tailwind CSS.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Zustand (state management)
- Recharts (charts)
- Framer Motion (animations)
- Lucide + Tabler Icons

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Run development server

```bash
npm run dev
```

3. Build production bundle

```bash
npm run build
```

4. Run lint checks

```bash
npm run lint
```

5. Preview production build

```bash
npm run preview
```

## Current Features

### 1. Dashboard Overview

- KPI cards for Net Balance, Total Income, Total Expenses, and Savings Rate.
- Income vs Expenses monthly comparison (bar chart).
- Spending by Category (donut chart + legend percentages).
- Balance Trend (area chart).
- Spending by Division list and transaction count snapshot card.

### 2. Transactions Management

- List with fields: Date, Category, Type, Amount, Note.
- Search by category/note.
- Filters:
  - Type
  - Category
  - Min/Max amount
  - Date range
- Sorting by date or amount.
- Grouping by none/category/month/type.
- CSV and JSON export.
- Add Transaction (Income/Expense) for Admin role.
- Edit Transaction for Admin role.
- Empty-state handling for no matching records.

### 3. Insights

- User-friendly KPI cards:
  - Income vs Expenses (shown as simple `x` ratio)
  - Average transaction value
  - Highest spending category
  - Balance growth
- Monthly income vs expenses chart.
- Monthly breakdown table (income, expenses, net).
- Balance snapshots list with per-month delta.

### 4. Roles and Permissions

- Viewer and Admin role switcher in header.
- Viewer permissions:
  - View overview, transactions, and insights
  - Export data
- Admin permissions:
  - All Viewer permissions
  - Create and edit transactions
- Permission logic is centralized in [src/lib/permissions.ts](src/lib/permissions.ts).

### 5. Theme and UX

- Dark/light mode toggle.
- Animated page and card transitions.
- Responsive layout across desktop and mobile widths.
- Reusable UI primitives (Button, Badge, Card).
- Cleaned UI controls by removing non-functional card menu actions and unused header notification action.

## State Management (Zustand)

State is managed with a centralized Zustand store in [src/store/finance-store.ts](src/store/finance-store.ts).

Store includes:

- Core state: role, theme, transactions, filters, sort, loading.
- Derived state:
  - categories
  - filteredTransactions
  - groupedTransactions
  - summary
  - trendData
  - spendingBreakdown
  - insights
- Actions:
  - bootstrap
  - setRole
  - setTheme
  - setFilters
  - setSort
  - addTransaction
  - updateTransaction

Components subscribe via selectors using [src/context/useFinance.ts](src/context/useFinance.ts) to reduce unnecessary re-renders.

## Data and Persistence

- Mock API layer in [src/services/mockApi.ts](src/services/mockApi.ts) with simulated delay.
- Seed data in [src/data/mockTransactions.ts](src/data/mockTransactions.ts).
- Local storage persistence:
  - Transactions: `zorvyn_transactions_v3`
  - Role: `zorvyn_role`
  - Theme: `zorvyn_theme`

Important:

- Seed data is written only on first load (or when storage is missing/corrupt).
- If you change mock data and want to reseed, clear local storage for `zorvyn_transactions_v3` and reload.
- Mock seed dates are normalized to avoid future-date entries so latest-first sorting behaves predictably.

## Sorting and Latest Transaction Behavior

- Date sorting is deterministic.
- For same-date rows, transaction id timestamp is used as a tie-breaker so newer entries remain stable and visible in latest-first view.

## Project Structure

- [src/App.tsx](src/App.tsx): App bootstrap and layout mount.
- [src/store/finance-store.ts](src/store/finance-store.ts): Zustand store and derived logic.
- [src/context/useFinance.ts](src/context/useFinance.ts): selector hook wrapper.
- [src/components](src/components): UI and feature components.
- [src/pages](src/pages): Overview, Transactions, Insights screens.
- [src/services/mockApi.ts](src/services/mockApi.ts): mock async data operations.
- [src/data/mockTransactions.ts](src/data/mockTransactions.ts): seeded finance dataset.
- [src/utils/export.ts](src/utils/export.ts): CSV/JSON export helpers.
- [src/index.css](src/index.css): design tokens and global styling.

## Assignment Scope Notes

- This is a frontend-focused submission with mock persistence.
- Currency display is INR format.
- Emphasis is on modular architecture, role-driven UX, responsive behavior, and maintainable state handling.

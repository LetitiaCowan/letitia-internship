# Architecture Overview

This document explains the component structure, state flow, data handling, and timer implementation used in the NFT Marketplace.

The app is built with React 17 and follows a client-side rendered (CSR) architecture with component-based composition.

## 🧩 Rendering Model

The application uses React's client-side rendering with component composition to optimize:

- **Performance** — Efficient re-renders with React hooks
- **User Experience** — Smooth animations and real-time updates
- **Bundle Size** — Code splitting and lazy loading where applicable
- **Interactivity** — Real-time countdown timers and dynamic content

### Component Rendering

All components are client-side rendered React components:

- **Page Components** — Route-level containers (`Home`, `Explore`, `ItemDetails`, `Author`)
- **Feature Components** — Section-level components (`NewItems`, `HotCollections`, `TopSellers`)
- **UI Components** — Reusable presentational components (`ItemCard`, `CountdownTimer`, `Skeleton`)

Components use React hooks (`useState`, `useEffect`) for state management and side effects.

## ⏱️ Timer Implementation

The countdown timer system is a core feature that uses `Date.now()` for real-time auction expiry calculations.

### Timer Architecture

**CountdownTimer Component** (`src/components/UI/CountdownTimer.jsx`)

- Uses `Date.now()` to get current timestamp in milliseconds
- Converts to seconds for calculation: `Math.floor(Date.now() / 1000)`
- Handles both millisecond (13 digits) and second (10 digits) timestamp formats
- Updates every second using `setInterval` with proper cleanup
- Calculates time difference and formats as "Xh Ym Zs"

### Timer Integration

Timers are embedded in `ItemCard` components across the app:

- **New Items Section** — Carousel of new NFTs with countdown timers
- **Explore Page** — All browseable items display timers
- Each timer receives `expiryDate` from API data
- Real-time updates without page refresh

### Timer Calculation Flow

```
API Response (expiryDate)
    ↓
ItemCard Component
    ↓
CountdownTimer Component
    ↓
useEffect Hook
    ├── Date.now() → Current Time
    ├── Format Detection (ms vs seconds)
    ├── Calculate Difference
    └── setInterval (updates every 1s)
    ↓
Display Countdown
```

## 🗂️ Component Structure

The app is organized into:

### `/src/pages`
Route-based page components:
- `Home` — Landing page with featured content
- `Explore` — Browse and filter all NFTs
- `ItemDetails` — Detailed NFT information
- `Author` — Creator profile and collections

### `/src/components`
Reusable components organized by feature:

- **`/home`** — Home page sections (NewItems, HotCollections, TopSellers, etc.)
- **`/explore`** — Explore page components
- **`/author`** — Author-related components
- **`/UI`** — Reusable UI components (ItemCard, CountdownTimer, Skeleton)

### Component Hierarchy

```
App
├── Nav
├── Router
│   ├── Home
│   │   ├── Landing
│   │   ├── HotCollections
│   │   ├── NewItems → ItemCard → CountdownTimer
│   │   ├── TopSellers
│   │   └── BrowseByCategory
│   ├── Explore
│   │   └── ExploreItems → ItemCard → CountdownTimer
│   ├── ItemDetails
│   └── Author
│       └── AuthorItems → ItemCard → CountdownTimer
└── Footer
```

## 🔄 State Management

The application uses React's built-in state management:

### Local Component State

- **useState** — Component-level state (items, loading, likes, etc.)
- **useEffect** — Side effects (API calls, timers, subscriptions)

### State Flow Pattern

```
Component Mount
    ↓
useEffect Hook
    ↓
Axios API Call
    ↓
setState (useState)
    ↓
Re-render with Data
```

### Timer State Management

```javascript
// Timer uses local state with interval cleanup
useEffect(() => {
  const interval = setInterval(updateCountdown, 1000);
  return () => clearInterval(interval); // Cleanup
}, [expiryDate]);
```

## 📡 Data Flow

### API Integration

Data comes from Firebase Cloud Functions:

- **Base URL**: `https://us-central1-nft-cloud-functions.cloudfunctions.net`
- **Endpoints**:
  - `/newItems` — New NFT items
  - `/explore?filter={value}` — All items with filtering
  - `/itemDetails?nftId={id}` — Individual NFT details
  - `/hotCollections` — Trending collections
  - `/author?id={id}` — Creator information

### Data Fetching Pattern

```javascript
useEffect(() => {
  async function fetchData() {
    const { data } = await axios.get(API_ENDPOINT);
    setItems(data);
    setIsLoaded(true);
  }
  fetchData();
}, []);
```

### Timer Data Flow

1. API returns `item.expiryDate` (timestamp)
2. `ItemCard` receives item data
3. `CountdownTimer` receives `expiryDate` prop
4. Timer calculates difference using `Date.now()`
5. Updates every second with `setInterval`

## 🎨 Styling Architecture

### CSS Organization

```
src/css/
├── styles/
│   ├── style.css (main styles)
│   ├── bootstrap.min.css (framework)
│   └── animate.css (animations)
├── colors/
│   └── scheme-*.css (theme variations)
└── fonts/
    └── [font libraries]
```

### Responsive Design

- **Bootstrap Grid** — Responsive layout system
- **Custom Breakpoints** — Carousel components adapt to screen size
- **Mobile-First** — Optimized for all device sizes

## 🚀 Performance Optimizations

### Timer Optimizations

1. **Interval Cleanup** — Prevents memory leaks by clearing intervals on unmount
2. **Conditional Rendering** — Only renders timer when `expiryDate` exists
3. **Efficient Calculations** — Minimal computation per update cycle
4. **Format Detection** — Automatic handling of different timestamp formats

### Component Optimizations

1. **Skeleton Loaders** — Improve perceived performance during data fetching
2. **Lazy Loading** — Images use `lazy` attribute for deferred loading
3. **Conditional Rendering** — Components only render when data is available
4. **Animation Optimization** — AOS configured with `once: true` for single animations

## 🔐 Error Handling

### Timer Error Handling

```javascript
// Missing expiry date
if (!expiryDate) {
  setTimeLeft("Expired");
  return;
}

// Format detection handles edge cases
const expiryInSeconds = expiryDate > 9999999999 
  ? Math.floor(expiryDate / 1000) 
  : expiryDate;
```

## 🎯 Design Patterns

### 1. Component Composition
- Small, reusable components (ItemCard, CountdownTimer)
- Composition over inheritance

### 2. Container/Presentational Pattern
- Pages act as containers
- Components are presentational

### 3. Custom Hooks Pattern
- `useEffect` for side effects
- `useState` for state management

### 4. Props Drilling
- Data passed down through component hierarchy
- Timer props: `item.expiryDate` → `ItemCard` → `CountdownTimer`

## ⚡ Timer-Specific Architecture Decisions

### Why Date.now()?

- **Reliability** — Provides accurate, system-synchronized timestamps
- **Performance** — Efficient native JavaScript API
- **Compatibility** — Works across all modern browsers
- **Precision** — Millisecond precision for accurate countdown calculations

### Timer Update Frequency

- **1 Second Intervals** — Balance between accuracy and performance
- **Real-time Updates** — Provides live countdown experience
- **Cleanup Strategy** — Prevents memory leaks with proper interval cleanup

### Format Handling

- **Flexible Input** — Handles both millisecond and second timestamps
- **Automatic Detection** — No manual configuration needed
- **Backward Compatible** — Works with various API response formats

## 📱 Responsive Layout

Built with Bootstrap CSS framework, ensuring:

- **Mobile-First Design** — Optimized for small screens
- **Flexible Grid Layouts** — Responsive columns and rows
- **Custom Breakpoints** — Carousel components adapt to screen size
- **Consistent Spacing** — Bootstrap utilities for margins and padding

The app adapts cleanly to mobile, tablet, and desktop viewports.

## 🚀 Future Improvements

- **State Management** — Consider Redux or Context API for global state
- **API Layer** — Abstract API calls into a service layer
- **Error Boundaries** — Add React error boundaries for better error handling
- **Testing** — Add unit and integration tests
- **TypeScript** — Consider migrating for type safety
- **Code Splitting** — Implement React.lazy for route-based splitting
- **Timer Optimization** — Consider Web Workers for heavy calculations if needed

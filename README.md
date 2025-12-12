# NFT Marketplace

A modern, responsive NFT marketplace built with React. Browse collections, explore items, and view detailed NFT information with real-time countdown timers for auction expiry dates.

👉 Architecture Docs: [ARCHITECTURE.md](./ARCHITECTURE.md)

## 🚀 Features

- **Browse & Explore** — Featured collections, new items, top sellers, and category browsing
- **Item Details** — Comprehensive NFT information with creator and owner details
- **Real-time Countdown Timers** — Live auction expiry countdowns using `Date.now()` for accurate time calculations
- **Search & Filter** — Sort items by price, likes, and other criteria
- **Author Profiles** — Explore collections by specific creators
- **Responsive Design** — Fully mobile, tablet, and desktop friendly
- **Loading States** — Skeleton loaders for smooth user experience
- **Smooth Animations** — Scroll-triggered animations with AOS

## 🧰 Tech Stack

**Frontend**
- React 17
- React Router DOM 6
- Bootstrap CSS
- Custom CSS themes

**State & Logic**
- React Hooks (useState, useEffect)
- Local component state management

**Data Fetching**
- Axios
- Firebase Cloud Functions API

**UI Components**
- React Slick (carousels)
- AOS (scroll animations)
- React Icons

## ⏱️ Countdown Timer Implementation

The countdown timer system uses `Date.now()` to calculate real-time auction expiry countdowns:

- **Format Detection** — Automatically handles millisecond (13 digits) and second (10 digits) timestamps
- **Real-time Updates** — Updates every second using `setInterval` with proper cleanup
- **Integration** — Embedded in `ItemCard` components across New Items and Explore pages
- **Calculation** — Uses `Date.now()` for accurate current timestamp, converts to seconds, and calculates time difference

```javascript
// Timer calculation using Date.now()
const now = Math.floor(Date.now() / 1000);
const expiryInSeconds = expiryDate > 9999999999 
  ? Math.floor(expiryDate / 1000) 
  : expiryDate;
const timeDiff = expiryInSeconds - now;
```

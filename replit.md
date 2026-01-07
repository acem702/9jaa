# 9ja Markets - Political Sentiment Platform

## Overview

9ja Markets is a political sentiment platform that uses YES/NO confidence markets with Automated Market Maker (AMM) pricing. Users express confidence on political questions by trading virtual "influence credits" for YES or NO positions. The platform features real-time price discovery using the constant product formula (k = yes_pool × no_pool).

Key features include:
- Confidence markets for political questions with YES/NO positions
- AMM-based automatic price discovery
- User portfolios tracking positions and profit/loss
- Leaderboards for top traders
- Interactive price charts using Plotly

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS v4 with custom CSS variables for theming
- **State Management**: React Context API for authentication state
- **Charts**: Plotly.js via react-plotly.js for interactive price visualization (loaded dynamically to avoid SSR issues)

### Routing Structure
- `/` - Home page with market listings
- `/market/[id]` - Individual market detail pages
- `/portfolio` - User's trading positions (protected)
- `/activity` - Transaction history (protected)
- `/leaderboard` - Top traders rankings
- `/login` and `/register` - Authentication pages

### Authentication Pattern
- Token-based authentication stored in localStorage
- AuthContext provider wraps the entire application
- ProtectedRoute component for guarding authenticated pages
- API service handles token management and automatic header injection

### API Integration
- Centralized API service in `lib/api.ts`
- Connects to a Laravel backend (external service, not included in this repo)
- RESTful endpoints for questions, trades, positions, and user data
- Environment variable `NEXT_PUBLIC_API_URL` for backend URL configuration

### Component Structure
- `Navbar` - Global navigation with authentication state
- `TradePanel` - Trading interface for buying/selling positions
- `PriceChart` - Plotly-based price history visualization
- `ProtectedRoute` - Authentication guard wrapper

## External Dependencies

### Backend API
- Laravel-based REST API (separate service)
- Expected at `http://localhost:8000/api/v1` by default
- Provides endpoints for:
  - User authentication (login, register, logout)
  - Questions/markets CRUD
  - Trading (quotes, execute trades)
  - Positions and portfolio data
  - Leaderboards and statistics

### Third-Party Libraries
- **plotly.js / react-plotly.js** - Interactive charting library for price history visualization
- **next/font** - Google Fonts integration (Geist font family)

### Environment Configuration
- `NEXT_PUBLIC_API_URL` - Backend API base URL

### Development Server
- Runs on port 5000 (configured in package.json scripts)
- Configured for Replit deployment with allowed dev origins for `*.replit.dev`, `*.repl.co`, and `*.replit.app` domains
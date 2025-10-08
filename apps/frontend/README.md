# PC Builder Frontend

A modern React application for browsing and filtering PC components. Built with React 19, TypeScript, TailwindCSS, and Vite.

## ✨ Features

- 🔍 Advanced filtering (category, brand, price, specs)
- 💰 Multi-currency support (VND, USD)
- 🌍 Multi-language support (Vietnamese, English)
- 🎨 Dark/Light theme with persistence
- 🔎 Real-time search with debouncing
- 📱 Fully responsive design
- ⚡ Optimized performance with React Query caching

## 🛠️ Tech Stack

- React 19.1
- TypeScript 5.8
- Vite 6.3
- TailwindCSS 4.1
- Zustand (state management)
- TanStack Query (data fetching)
- React Router 7.7
- Framer Motion (animations)

## 📋 Prerequisites

- Node.js v18+
- Backend API running on `http://localhost:8080`

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd apps/frontend
npm install
```

### 2. Environment Configuration

Create `.env` file:

```env
VITE_API_URL=http://localhost:8080/api/
```

### 3. Start Development Server

```bash
npm run dev
```

Access at `http://localhost:5173`

## 📁 Project Structure

```text
src/
├── components/    # React components
├── pages/         # Page components
├── hooks/         # Custom hooks
├── stores/        # Zustand stores
├── services/      # API services
├── types/         # TypeScript types
├── utils/         # Utility functions
├── layouts/       # Layout components
└── index.css      # Global styles
```

## 📖 Available Scripts

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint
npm run format        # Format code with Prettier
npm run check-types   # Type check
```

## 🎯 Key Components

### ActiveFilters

Displays active filter chips with options to remove or clear all.

### ComponentFilter

Sidebar with category, brand, and price range filtering.

### ComponentCard

Grid card displaying individual component details.

### StickyNavbar

Navigation bar with theme toggle and route links.

### PriceRangeSlider

Interactive slider for price filtering with min/max inputs.

## 🌐 Internationalization

The app supports multiple languages through URL routing:

```text
/vn/components →  Vietnamese (VND)
/en/components →  English (USD)
```

Supported locales can be extended in `src/utils/getUserLocale.ts`

## 🎨 Theming

Theme is managed by `useTheme()` hook and stored in localStorage:

- **Light**: Default light theme
- **Dark**: Dark theme
- **System**: Uses system preference

## 🔧 API Integration

Base URL: `http://localhost:8080/api/v1`

Key endpoints:

- `GET /components` - Get components with filters
- `GET /components/:id` - Get single component
- `GET /components/filters` - Get available filters
- `GET /categories` - Get categories
- `GET /brands` - Get brands

See [Backend README](../backend/README.md) for full API documentation.

## 📦 State Management

Global state is managed with Zustand:

```typescript
const {
  filters, // Current filters
  pagination, // Page info
  activeFilters, // Active filter chips
  setFilters, // Update filters
  clearFilter, // Clear all
  removeFilter, // Remove specific filter
} = useComponentStore();
```

## ⚡ Performance Optimizations

- React Query caches API responses (5-min stale time)
- Search is debounced by 400ms
- Images are lazy-loaded
- Heavy components use React.memo()
- Automatic code splitting via Vite

## 🐛 Troubleshooting

**API requests fail**: Ensure backend is running and `VITE_API_URL` is correct

**Theme not persisting**: Check browser localStorage permissions

**Build fails**: Run `npm run check-types` to find type errors

## 📚 Related Documentation

- [Backend README](../backend/README.md) - API docs and setup
- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/)

## 📄 License

MIT License - part of PC Builder project

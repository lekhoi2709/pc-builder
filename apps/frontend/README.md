<p align="center">
  <picture>
    <img src="/apps/frontend/public/logo/pc-builder-logo-transparent-2.png" width="500" alt="PC Builder">
  </picture>
</p>
<div align="center">
  <p align="center">
    <a href="https://opensource.org/licenses/MIT"><img alt="MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg"/></a>
    <a href="https://react.dev"><img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react" /></a>
      <a href="https://www.typescriptlang.org/"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript" /></a>
  <a href="https://vitejs.dev"><img alt="Vite" src="https://img.shields.io/badge/Vite-6.3-646CFF?logo=vite" /></a>
  </p>

<p>A modern, performant React application for browsing and filtering PC components with an intuitive interface, multi-language support, and real-time filtering capabilities.</p>

<p align="center">
<a href="https://pc-builder-frontend-orcin.vercel.app">Live Demo</a>
•
<a href="#">Documentation</a>
•
<a href="#">Report Bug</a>
•
<a href="#">Request Feature</a>
</p>

</div>

---

## Features

- Advanced filtering (category, brand, price, specs)
- Multi-currency support (VND, USD)
- Dark/Light theme with persistence
- Real-time search with debouncing
- Fully responsive design
- Optimized performance with React Query caching

## Tech Stack

| Category             | Technologies                      |
| -------------------- | --------------------------------- |
| **Core**             | React 19, TypeScript              |
| **Build Tool**       | Vite                              |
| **Styling**          | TailwindCSS 4                     |
| **State Management** | Zustand                           |
| **Data Fetching**    | TanStack Query                    |
| **Routing**          | React Router                      |
| **Animations**       | Framer Motion                     |
| **Icons**            | Lucide React                      |
| **Analytics**        | Vercel Analytics & Speed Insights |
| **Utilities**        | tailwind-merge                    |

## Prerequisites

- **Node.js** v18+ (LTS recommended)
- **npm** or **pnpm** or **yarn**
- **Backend API** running (see [Backend README](../backend/README.md))

## Getting Started

### 1. Install Dependencies

```bash
cd apps/frontend
npm install
```

### 2. Environment Configuration

Create `.env` file:

```env
VITE_API_URL=http://localhost:8080/api/
VITE_IP_API=https://ipapi.co/json/?key=YOUR_API_KEY
```

**Environment Variables:**

- `VITE_API_URL` - Backend API base URL (required)
- `VITE_IP_API` - IP geolocation API endpoint (optional, for auto-locale detection)

### 3. Start Development Server

```bash
npm run dev
```

Access the application at `http://localhost:5173`

The app will automatically redirect to your locale:

- Vietnamese users: `http://localhost:5173/vn/`
- English users: `http://localhost:5173/en/`

## Project Structure

```bash
src/
├── assets/              # Static assets
│   └── react.svg
├── components/          # React components
│   ├── ActiveFilters.tsx           # Filter chips display
│   ├── ComponentCard.tsx           # Product card
│   ├── ComponentFilter.tsx         # Filter sidebar
│   ├── NavigationBarMobile.tsx     # Mobile nav drawer
│   ├── PriceRangeSlider.tsx       # Price filter
│   ├── ProgressBar.tsx            # Loading indicator
│   ├── SearchComponentBar.tsx     # Search input
│   ├── SideBarButton.tsx          # Toggle button
│   ├── StickyNavbar.tsx           # Desktop navbar
│   └── ThemeToggle.tsx            # Theme switcher
├── hooks/               # Custom React hooks
│   ├── useHoverIndicator.ts       # Nav indicator animation
│   ├── useMediaQuery.ts           # Responsive helpers
│   ├── useScrollPosition.ts       # Scroll detection
│   ├── useSideBarOpen.ts          # Sidebar state
│   └── useTheme.ts                # Theme management
├── layouts/             # Layout components
│   ├── HomeLayout.tsx             # Home page layout
│   ├── Layout.tsx                 # Main app layout
│   └── SideBarLayout.tsx          # Sidebar wrapper
├── pages/               # Page components
│   ├── About.tsx                  # About page
│   ├── Components.tsx             # Component listing
│   └── Home.tsx                   # Home page
├── services/            # API services
│   └── api.ts                     # API client
├── stores/              # Zustand stores
│   ├── componentStore.ts          # Component state
│   └── exclusivePanelStore.ts    # Panel state
├── types/               # TypeScript types
│   └── components.ts              # Type definitions
├── utils/               # Utility functions
│   ├── getLocalizedPrice.ts      # Price formatting
│   └── getUserLocale.ts          # Locale detection
├── index.css            # Global styles & theme
├── main.tsx             # App entry point
└── routes.tsx           # Route configuration
```

## Available Scripts

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint
npm run format        # Format code with Prettier
npm run check-types   # Type check
```

## Troubleshooting

**API requests fail**: Ensure backend is running and `VITE_API_URL` is correct

**Theme not persisting**: Check browser localStorage permissions

**Build fails**: Run `npm run check-types` to find type errors

## Related Documentation

- [Backend README](../backend/README.md) - API docs and setup
- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/)

---

## License

MIT License - part of PC Builder project

---

<div align="center">

Made with ❤️ by [Le Dinh Khoi](https://github.com/lekhoi2709)

</div>

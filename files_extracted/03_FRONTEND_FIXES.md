# 🎨 FRONTEND FIXES - CÓDIGO CORREGIDO
## Todas las correcciones de React/Next.js

---

# 📋 ÍNDICE DE CORRECCIONES

```
1. Better Error Handling en API Client
2. Environment Variables Validation
3. TypeScript Type Safety (Zod Validation)
4. Image Optimization (Next.js Image)
5. Performance: Code Splitting
6. Accessibility (A11y) Improvements
7. Better Loading & Error States
8. Responsive Design Enhancements
9. .env.local.example
10. README Improvements
```

---

# ✅ FIX 1: BETTER API CLIENT ERROR HANDLING

**Archivo:** `frontend/src/lib/api.ts`

**Reemplazar contenido completo con:**

```typescript
type ApiErrorResponse = {
  error?: string;
  message?: string;
  status?: number;
  details?: unknown;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = 'Network error') {
    super(message, 0);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends ApiError {
  constructor(message: string = 'Request timeout') {
    super(message, 408);
    this.name = 'TimeoutError';
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const REQUEST_TIMEOUT = 30000; // 30 seconds

if (!API_URL) {
  throw new Error(
    'NEXT_PUBLIC_API_URL is not defined. Check your .env.local file.'
  );
}

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string, timeout: number = REQUEST_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      // Handle non-OK responses
      if (!response.ok) {
        let errorData: ApiErrorResponse;
        
        try {
          errorData = await response.json();
        } catch {
          errorData = {};
        }

        throw new ApiError(
          errorData.message || errorData.error || `HTTP ${response.status}`,
          response.status,
          errorData.details
        );
      }

      // Parse successful response
      const data = await response.json();
      
      // Extract data if wrapped in success/data structure
      if (data.success && data.data !== undefined) {
        return data.data;
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof TypeError) {
        if (error.message.includes('fetch')) {
          throw new NetworkError('Failed to connect to server');
        }
      }

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new TimeoutError(`Request timeout after ${this.timeout}ms`);
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error',
        500,
        error
      );
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // ============================================
  // CATEGORIES
  // ============================================
  getCategories(): Promise<Category[]> {
    return this.get<Category[]>('/categories');
  }

  getCategoryById(id: string): Promise<Category> {
    return this.get<Category>(`/categories/${id}`);
  }

  // ============================================
  // STANDINGS
  // ============================================
  getStandings(categoryId: string): Promise<Standing[]> {
    return this.get<Standing[]>(`/standings/${categoryId}`);
  }

  // ============================================
  // SCORERS / TOP PLAYERS
  // ============================================
  getTopScorers(categoryId: string, limit: number = 10): Promise<TopScorer[]> {
    return this.get<TopScorer[]>(
      `/scorers/${categoryId}/top?limit=${limit}`
    );
  }

  // ============================================
  // MATCHES
  // ============================================
  getMatches(categoryId: string): Promise<Match[]> {
    return this.get<Match[]>(`/matches?categoryId=${categoryId}`);
  }

  getMatchById(id: string): Promise<Match> {
    return this.get<Match>(`/matches/${id}`);
  }

  // ============================================
  // TEAMS
  // ============================================
  getTeams(categoryId: string): Promise<Team[]> {
    return this.get<Team[]>(`/teams?categoryId=${categoryId}`);
  }

  getTeamById(id: string): Promise<TeamDetail> {
    return this.get<TeamDetail>(`/teams/${id}`);
  }

  // ============================================
  // PLAYERS
  // ============================================
  getPlayersByTeam(teamId: string): Promise<Player[]> {
    return this.get<Player[]>(`/players?teamId=${teamId}`);
  }

  // ============================================
  // HEALTH
  // ============================================
  async health(): Promise<{ status: string }> {
    return this.get<{ status: string }>('/health');
  }
}

export const apiClient = new ApiClient(API_URL);

export { ApiError, NetworkError, TimeoutError };
```

**Tiempo:** 1-2 horas

---

# ✅ FIX 2: ENVIRONMENT VARIABLES VALIDATION

**Archivo:** `frontend/src/config/env.ts`

**Crear nuevo archivo:**

```typescript
// Validate environment variables at build time
const requiredEnvVars = ['NEXT_PUBLIC_API_URL'] as const;

const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}

export const config = {
  api: {
    url: process.env.NEXT_PUBLIC_API_URL!,
  },
  hero: {
    animationUrl: process.env.NEXT_PUBLIC_HERO_ANIMATION_URL || '',
  },
} as const;

// Type-safe access
export type Config = typeof config;
```

**Actualizar** `frontend/app/page.tsx`:

```typescript
'use client';

import { config } from '@/config/env';
import { HeroSection } from '@/components/sports/HeroSection';
// ... rest of imports

export default function Home() {
  const { data: categories, loading, error } = useCategories();

  return (
    <>
      <HeroSection animationUrl={config.hero.animationUrl} />
      {/* ... rest of component */}
    </>
  );
}
```

**Tiempo:** 30 minutos

---

# ✅ FIX 3: ZODVALIDATION FOR TYPE SAFETY

**Instalar:**
```bash
npm install zod
```

**Crear archivo:** `frontend/src/lib/validation.ts`

```typescript
import { z } from 'zod';

// ============================================
// CATEGORY
// ============================================
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6})$/i),
  description: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Category = z.infer<typeof CategorySchema>;

// ============================================
// TEAM
// ============================================
export const TeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  crestUrl: z.string().url().optional(),
  categoryId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Team = z.infer<typeof TeamSchema>;

// ============================================
// PLAYER
// ============================================
export const PlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  photoUrl: z.string().url().optional(),
  position: z.enum(['Delantero', 'Medio', 'Defensa', 'Portero']),
  jerseyNumber: z.number(),
  teamId: z.string(),
  categoryId: z.string(),
  seasonGoals: z.number().default(0),
  seasonPoints: z.number().default(0),
  seasonMatches: z.number().default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Player = z.infer<typeof PlayerSchema>;

// ============================================
// MATCH
// ============================================
export const MatchSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  homeTeamId: z.string(),
  awayTeamId: z.string(),
  date: z.string().datetime(),
  venue: z.string(),
  status: z.enum(['scheduled', 'in_progress', 'finished']),
  homeGoals: z.number().nullable().optional(),
  awayGoals: z.number().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Match = z.infer<typeof MatchSchema>;

// ============================================
// STANDING
// ============================================
export const StandingSchema = z.object({
  teamId: z.string(),
  teamName: z.string(),
  teamCrest: z.string().optional(),
  position: z.number(),
  played: z.number(),
  wins: z.number(),
  draws: z.number(),
  losses: z.number(),
  goalsFor: z.number(),
  goalsAgainst: z.number(),
  goalDifference: z.number(),
  points: z.number(),
});

export type Standing = z.infer<typeof StandingSchema>;

// ============================================
// TOP SCORER
// ============================================
export const TopScorerSchema = z.object({
  playerId: z.string(),
  playerName: z.string(),
  playerPhoto: z.string().optional(),
  teamId: z.string(),
  teamName: z.string(),
  goals: z.number(),
  assists: z.number(),
  points: z.number(),
});

export type TopScorer = z.infer<typeof TopScorerSchema>;

// Validation helper
export const validateData = <T extends z.ZodSchema>(
  schema: T,
  data: unknown
): z.infer<T> | null => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
    }
    return null;
  }
};
```

**Actualizar hooks:** `frontend/src/lib/hooks.ts`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { apiClient, ApiError } from './api';
import { validateData, CategorySchema, TeamSchema, MatchSchema, StandingSchema, TopScorerSchema } from './validation';

interface UseDataState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export const useCategories = () => {
  const [state, setState] = useState<UseDataState<Category[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const response = await apiClient.getCategories();
        
        // Validate response
        const categories = response.map(cat => 
          validateData(CategorySchema, cat)
        ).filter(Boolean) as Category[];

        setState({
          data: categories.length > 0 ? categories : [],
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error : new Error('Unknown error'),
        });
      }
    };

    fetchCategories();
  }, []);

  return state;
};

export const useTeamPlayers = (teamId: string | null) => {
  const [state, setState] = useState<UseDataState<Player[]>>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!teamId) return;

    const fetchPlayers = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const response = await apiClient.getPlayersByTeam(teamId);
        
        const players = response.map(player =>
          validateData(PlayerSchema, player)
        ).filter(Boolean) as Player[];

        setState({
          data: players,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error : new Error('Unknown error'),
        });
      }
    };

    fetchPlayers();
  }, [teamId]);

  return state;
};

export const useStandings = (categoryId: string | null) => {
  const [state, setState] = useState<UseDataState<Standing[]>>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!categoryId) return;

    const fetchStandings = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const response = await apiClient.getStandings(categoryId);
        
        const standings = response.map(standing =>
          validateData(StandingSchema, standing)
        ).filter(Boolean) as Standing[];

        setState({
          data: standings,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error : new Error('Unknown error'),
        });
      }
    };

    fetchStandings();
  }, [categoryId]);

  return state;
};

// ... similar for other hooks
```

**Tiempo:** 2-3 horas

---

# ✅ FIX 4: IMAGE OPTIMIZATION

**Archivo:** `frontend/next.config.mjs`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'lottie.host',
      'api.condepor.com',
      // Add your CDN domains here
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
```

**Crear componente:** `frontend/src/components/ui/OptimizedImage.tsx`

```typescript
import Image, { ImageProps } from 'next/image';
import { forwardRef } from 'react';

interface OptimizedImageProps
  extends Omit<ImageProps, 'src' | 'alt'> {
  src: string | null;
  alt: string;
  fallback?: string;
}

export const OptimizedImage = forwardRef<
  HTMLImageElement,
  OptimizedImageProps
>(({ src, alt, fallback = '/placeholder.svg', ...props }, ref) => {
  return (
    <Image
      ref={ref}
      src={src || fallback}
      alt={alt}
      {...props}
      quality={75}
      priority={false}
      loading="lazy"
      onError={(e) => {
        const img = e.target as HTMLImageElement;
        if (img.src !== fallback) {
          img.src = fallback;
        }
      }}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';
```

**Usar en componentes:**

```typescript
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export function PlayerCard({ player }: { player: Player }) {
  return (
    <div className="rounded-lg overflow-hidden bg-white shadow">
      <OptimizedImage
        src={player.photoUrl}
        alt={player.name}
        width={300}
        height={300}
        className="w-full aspect-square object-cover"
      />
      {/* ... rest */}
    </div>
  );
}
```

**Tiempo:** 1-2 horas

---

# ✅ FIX 5: CODE SPLITTING & LAZY LOADING

**Archivo:** `frontend/app/page.tsx`

```typescript
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { useCategories } from '@/lib/hooks';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

// Lazy load heavy components
const HeroSection = dynamic(
  () => import('@/components/sports/HeroSection').then(mod => ({ default: mod.HeroSection })),
  {
    loading: () => <div className="h-96 bg-gradient-to-r from-blue-500 to-purple-600" />,
    ssr: true,
  }
);

const CategoryCard = dynamic(
  () => import('@/components/sports/CategoryCard').then(mod => ({ default: mod.CategoryCard })),
  { ssr: true }
);

export default function Home() {
  const { data: categories, loading, error } = useCategories();

  return (
    <>
      <Suspense fallback={<div className="h-96" />}>
        <HeroSection />
      </Suspense>

      <section id="categories" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Categorías
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Selecciona una categoría para ver la tabla de posiciones, partidos
            y goleadores
          </p>

          {loading && <LoadingSpinner />}

          {error && (
            <EmptyState
              icon="❌"
              title="Error al cargar categorías"
              description={error.message}
            />
          )}

          {categories && categories.length === 0 && !loading && !error && (
            <EmptyState
              icon="📋"
              title="Sin categorías"
              description="No hay categorías disponibles"
            />
          )}

          {categories && categories.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  {...category}
                  delay={index * 0.1}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
```

**Tiempo:** 1 hora

---

# ✅ FIX 6: ACCESSIBILITY IMPROVEMENTS

**Actualizar componentes con ARIA labels:**

**`frontend/src/components/sports/StandingsTable.tsx`:**

```typescript
export function StandingsTable({ standings }: { standings: Standing[] }) {
  return (
    <div className="overflow-x-auto" role="region" aria-label="League standings table">
      <table className="w-full" aria-describedby="standings-description">
        <thead className="bg-gray-100 border-b-2 border-gray-200">
          <tr>
            <th scope="col" className="px-4 py-2 text-left text-sm font-semibold">
              Pos.
            </th>
            <th scope="col" className="px-4 py-2 text-left text-sm font-semibold">
              Equipo
            </th>
            <th scope="col" className="px-4 py-2 text-center text-sm font-semibold">
              PJ
            </th>
            <th scope="col" className="px-4 py-2 text-center text-sm font-semibold">
              G
            </th>
            <th scope="col" className="px-4 py-2 text-center text-sm font-semibold">
              E
            </th>
            <th scope="col" className="px-4 py-2 text-center text-sm font-semibold">
              P
            </th>
            <th scope="col" className="px-4 py-2 text-center text-sm font-semibold">
              GF
            </th>
            <th scope="col" className="px-4 py-2 text-center text-sm font-semibold">
              GC
            </th>
            <th scope="col" className="px-4 py-2 text-center text-sm font-semibold">
              Pts
            </th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing) => (
            <tr
              key={standing.teamId}
              className="border-b hover:bg-gray-50 transition-colors"
              role="row"
            >
              <td className="px-4 py-2 text-sm font-medium">{standing.position}</td>
              <td className="px-4 py-2 text-sm font-medium">
                <a
                  href={`/teams/${standing.teamId}`}
                  className="text-blue-600 hover:text-blue-800 underline"
                  aria-label={`Ver jugadores de ${standing.teamName}`}
                >
                  {standing.teamName}
                </a>
              </td>
              <td className="px-4 py-2 text-sm text-center">{standing.played}</td>
              <td className="px-4 py-2 text-sm text-center text-green-600 font-semibold">
                {standing.wins}
              </td>
              <td className="px-4 py-2 text-sm text-center text-yellow-600 font-semibold">
                {standing.draws}
              </td>
              <td className="px-4 py-2 text-sm text-center text-red-600 font-semibold">
                {standing.losses}
              </td>
              <td className="px-4 py-2 text-sm text-center">{standing.goalsFor}</td>
              <td className="px-4 py-2 text-sm text-center">{standing.goalsAgainst}</td>
              <td className="px-4 py-2 text-sm text-center font-bold bg-blue-50">
                {standing.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p id="standings-description" className="sr-only">
        Tabla de posiciones ordenada por puntos en orden descendente.
        Puedes hacer clic en los nombres de los equipos para ver los jugadores.
      </p>
    </div>
  );
}
```

**Agregar skip link en layout:**

```typescript
export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="es">
      <body>
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2"
        >
          Saltar al contenido principal
        </a>
        <header>{/* nav */}</header>
        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
```

**Tiempo:** 1-2 horas

---

# ✅ FIX 7: BETTER LOADING & ERROR STATES

**Crear:** `frontend/src/components/common/ErrorBoundary.tsx`

```typescript
'use client';

import { ReactNode } from 'react';
import { EmptyState } from './EmptyState';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <EmptyState
            icon="❌"
            title="Algo salió mal"
            description={this.state.error?.message || 'Por favor recarga la página'}
          />
        )
      );
    }

    return this.props.children;
  }
}
```

**Usar en layout:**

```typescript
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

**Tiempo:** 1 hora

---

# ✅ FIX 8: CREATE .env.local.example

**Archivo:** `frontend/.env.local.example`

```env
# ================================
# API CONFIGURATION
# ================================
# Local development
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Staging
# NEXT_PUBLIC_API_URL=https://staging-api.condepor.com/api

# Production
# NEXT_PUBLIC_API_URL=https://api.condepor.com/api

# ================================
# OPTIONAL: Hero Section Animation
# ================================
# Lottie animation URL (optional)
# Get from: https://lottie.host/
NEXT_PUBLIC_HERO_ANIMATION_URL=""
```

**Tiempo:** 5 minutos

---

# ✅ FIX 9: FRONTEND README

**Archivo:** `frontend/README.md`

```markdown
# CONDEPOR Frontend

Next.js 14 + React 18 + TypeScript + Tailwind CSS

## Features

- ✅ Server-side rendering with Next.js 14
- ✅ Type-safe development with TypeScript
- ✅ Responsive design with Tailwind CSS
- ✅ Optimized images and code splitting
- ✅ Error boundary and error handling
- ✅ Accessibility (A11y) support

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

```bash
cp .env.local.example .env.local
# Update NEXT_PUBLIC_API_URL if needed
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   ├── sports/      # Domain-specific components
│   └── common/      # Common components
├── lib/             # Utilities and helpers
│   ├── api.ts       # API client
│   ├── hooks.ts     # React hooks
│   ├── validation.ts # Zod validation schemas
│   └── utils.ts     # Utility functions
└── types/           # TypeScript types
```

## Deployment

### Vercel

```bash
# Connect GitHub repository to Vercel
# Set environment variables in Vercel dashboard:
# - NEXT_PUBLIC_API_URL
# - NEXT_PUBLIC_HERO_ANIMATION_URL (optional)
```

### Docker

```bash
docker build -t condepor-frontend .
docker run -p 3000:3000 condepor-frontend
```

## API Integration

API client is located in `src/lib/api.ts`.

Example:

```typescript
import { apiClient } from '@/lib/api';

// Get categories
const categories = await apiClient.getCategories();

// Get standings for a category
const standings = await apiClient.getStandings(categoryId);
```

## Error Handling

All API errors are caught and typed with `ApiError`.

```typescript
try {
  const data = await apiClient.getCategories();
} catch (error) {
  if (error instanceof NetworkError) {
    // Handle network errors
  } else if (error instanceof TimeoutError) {
    // Handle timeout
  } else if (error instanceof ApiError) {
    // Handle API errors
  }
}
```

## Performance Tips

- Images are automatically optimized with Next.js Image
- Code splitting is enabled for dynamic imports
- Use `next/dynamic` for heavy components

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast compliance

## Contributing

1. Create feature branch
2. Make changes
3. Run `npm run lint`
4. Submit pull request

## License

ISC
```

**Tiempo:** 30 minutos

---

# 📋 CHECKLIST FRONTEND

```
[ ] FIX 1: Better API error handling
[ ] FIX 2: Environment variables validation
[ ] FIX 3: Zod validation schemas
[ ] FIX 4: Image optimization
[ ] FIX 5: Code splitting & lazy loading
[ ] FIX 6: Accessibility improvements
[ ] FIX 7: Error boundary & states
[ ] FIX 8: Create .env.local.example
[ ] FIX 9: Frontend README

Validaciones:
[ ] npm run lint (sin errores)
[ ] npm run build (sin errores)
[ ] npm run dev (inicia sin errores)
[ ] Verificar todos los endpoints funcionan
[ ] Test en diferentes navegadores
[ ] Test responsive en móvil
```

---

# ⏱️ TIEMPO TOTAL FRONTEND

```
FIX 1:  1-2 horas
FIX 2:  30 min
FIX 3:  2-3 horas
FIX 4:  1-2 horas
FIX 5:  1 hora
FIX 6:  1-2 horas
FIX 7:  1 hora
FIX 8:  5 min
FIX 9:  30 min
───────────────
TOTAL: 9-14 horas

Parallelizable: 5-7 horas con 2 programadores
```

---

**Fin de Frontend Fixes**

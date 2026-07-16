# 🎨 DeporteHN - FRONTEND ULTRA DETALLADO
## Next.js 14 + Tailwind + Framer Motion - Arquitectura Profesional

---

# 📋 TABLA DE CONTENIDOS

1. [Flujo de Usuario](#flujo-de-usuario)
2. [Arquitectura Frontend](#arquitectura-frontend)
3. [Setup Inicial](#setup-inicial)
4. [Componentes Base UI](#componentes-base-ui)
5. [Componentes Deportivos](#componentes-deportivos)
6. [API Client](#api-client)
7. [Hooks Personalizados](#hooks-personalizados)
8. [Páginas](#páginas)
9. [Testing](#testing)

---

# 🗺️ FLUJO DE USUARIO

```
┌─────────────────────────────────────────────────────┐
│           HOME PAGE (/)                              │
├─────────────────────────────────────────────────────┤
│                                                       │
│   ┌─────────────────────────────────────────────┐   │
│   │  HERO SECTION                               │   │
│   │  - Título + Descripción                     │   │
│   │  - Animación (usuario proporciona link)     │   │
│   │  - Botones CTA                              │   │
│   └─────────────────────────────────────────────┘   │
│                                                       │
│   ┌─────────────────────────────────────────────┐   │
│   │  SELECTOR DE CATEGORÍAS                     │   │
│   │  ┌─────────┐ ┌─────────┐ ┌─────────┐       │   │
│   │  │ U-12    │ │ U-14    │ │ U-16    │       │   │
│   │  └────┬────┘ └─────────┘ └─────────┘       │   │
│   │       │ (click)                             │   │
│   └───────┼─────────────────────────────────────┘   │
│           │                                          │
│           ▼                                          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│    CATEGORY PAGE (/categories/[categoryId])          │
├─────────────────────────────────────────────────────┤
│                                                       │
│  TABS: [Tabla] [Partidos] [Goleadores]              │
│                                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │  TABLA DE POSICIONES                        │   │
│  │  ┌──┬────────────┬───┬──────┐               │   │
│  │  │POS│ EQUIPO     │PJ │ PTOS │               │   │
│  │  ├──┼────────────┼───┼──────┤               │   │
│  │  │ 1│ Real Madrid│ 10│ 23   │ ◄─── Click   │   │
│  │  │ 2│ Barcelona  │ 10│ 21   │               │   │
│  │  │ 3│ Atlético   │ 10│ 19   │               │   │
│  │  └──┴────────────┴───┴──────┘               │   │
│  └─────────────────────────────────────────────┘   │
│           │                                         │
│           ▼                                         │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│    TEAM PLAYERS PAGE (/teams/[teamId])              │
├─────────────────────────────────────────────────────┤
│                                                       │
│  Real Madrid - 9 Jugadores                          │
│                                                       │
│  ┌──────────────┐  ┌──────────────┐ ┌─────────┐    │
│  │              │  │              │ │ Vinicius│    │
│  │   [FOTO]     │  │   [FOTO]     │ │ Jr      │    │
│  │              │  │              │ │         │    │
│  │ Vinicius Jr  │  │ Bellingham   │ │Delantero│    │
│  │ Delantero #7 │  │ Medio #5     │ │  #7    │    │
│  └──────────────┘  └──────────────┘ └─────────┘    │
│                                                       │
│  (Grid responsivo de jugadores)                      │
│                                                       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│    MATCHES PAGE (/matches/[categoryId])              │
├─────────────────────────────────────────────────────┤
│                                                       │
│  TABS: [Próximos] [En Juego] [Terminados]          │
│                                                       │
│  ┌──────────────────────────────────────────────┐  │
│  │ Real Madrid vs Barcelona - 15/02/2024 14:00 │  │
│  │ Estadio Bernabéu                            │  │
│  │ Estado: Próximo                             │  │
│  │ [Ver Detalles]                              │  │
│  └──────────────────────────────────────────────┘  │
│                                                       │
│  ┌──────────────────────────────────────────────┐  │
│  │ Barcelona vs Atlético - EN JUEGO             │  │
│  │ Camp Nou - 1-1 (45')                        │  │
│  │ [Ver Estadísticas]                          │  │
│  └──────────────────────────────────────────────┘  │
│                                                       │
│  ┌──────────────────────────────────────────────┐  │
│  │ Valencia vs Madrid - 12/02/2024 ✓            │  │
│  │ Mestalla - Resultado: 2-1                   │  │
│  │ [Ver Resumen]                               │  │
│  └──────────────────────────────────────────────┘  │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

# 🏗️ ARQUITECTURA FRONTEND

```
frontend/
├── app/
│   ├── layout.tsx                    # Layout global
│   ├── page.tsx                      # Home con hero + categorías
│   ├── categories/
│   │   └── [categoryId]/
│   │       └── page.tsx              # Tabla de posiciones
│   ├── teams/
│   │   └── [teamId]/
│   │       └── page.tsx              # Lista de jugadores
│   ├── matches/
│   │   └── [categoryId]/
│   │       └── page.tsx              # Partidos (3 secciones)
│   └── globals.css
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Card.tsx              # Componente reutilizable
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Tabs.tsx              # Para switching entre secciones
│   │   │   ├── Loading.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   │
│   │   ├── sports/
│   │   │   ├── CategoryCard.tsx      # Tarjeta de categoría
│   │   │   ├── StandingsTable.tsx    # Tabla de posiciones
│   │   │   ├── PlayerCard.tsx        # Tarjeta de jugador
│   │   │   ├── TeamCard.tsx          # Tarjeta de equipo (clickeable)
│   │   │   ├── MatchCard.tsx         # Tarjeta de partido
│   │   │   ├── ScorerTable.tsx       # Tabla de goleadores
│   │   │   └── HeroSection.tsx       # Hero section
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            # Navegación
│   │   │   ├── Footer.tsx
│   │   │   └── Container.tsx
│   │   │
│   │   └── common/
│   │       ├── LoadingSpinner.tsx
│   │       └── EmptyState.tsx
│   │
│   ├── lib/
│   │   ├── api.ts                    # API client
│   │   ├── hooks.ts                  # Hooks personalizados
│   │   ├── utils.ts                  # Funciones utilitarias
│   │   └── constants.ts              # Constantes
│   │
│   └── types/
│       └── index.ts                  # TypeScript types
│
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

# ✅ PASO 1: SETUP INICIAL

## 1.1 Crear proyecto (si no existe)

```bash
# Si necesitas crear desde cero
npx create-next-app@latest frontend --typescript --tailwind --app

# Si ya existe, ir al directorio
cd frontend
```

## 1.2 Instalar dependencias

```bash
npm install

# Instalar Framer Motion para animaciones
npm install framer-motion

# Instalar iconos
npm install lucide-react

# Instalar librería para notificaciones
npm install react-hot-toast

# Instalar SWR para data fetching
npm install swr

# TypeScript types
npm install --save-dev @types/react @types/node
```

## 1.3 package.json completo

**`frontend/package.json`:**

```json
{
  "name": "deportehn-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.376.0",
    "react-hot-toast": "^2.4.1",
    "swr": "^2.2.4"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.3.0"
  }
}
```

## 1.4 .env.local

**`frontend/.env.local`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_APP_NAME=DeporteHN
```

## 1.5 tsconfig.json

**`frontend/tsconfig.json`:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "baseUrl": "./",
    "paths": {
      "@/*": ["./src/*"]
    },
    "allowJs": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

## 1.6 tailwind.config.js

**`frontend/tailwind.config.js`:**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#2563eb",
        "primary-dark": "#1e40af",
        "primary-light": "#3b82f6",
        "secondary": "#dc2626",
        "success": "#16a34a",
        "warning": "#ea580c",
        "neutral": "#6b7280",
      },
      fontFamily: {
        "sans": ["system-ui", "sans-serif"],
        "display": ["Syne", "system-ui"],
      },
      fontSize: {
        "xs": "0.75rem",
        "sm": "0.875rem",
        "base": "1rem",
        "lg": "1.125rem",
        "xl": "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
      },
      boxShadow: {
        "card": "0 4px 6px rgba(0, 0, 0, 0.1)",
        "elevated": "0 20px 25px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
```

---

# ✅ PASO 2: TIPOS TYPESCRIPT

**`frontend/src/types/index.ts`:**

```typescript
/**
 * TIPOS COMPARTIDOS FRONTEND
 * Espejo de backend pero para Frontend
 */

export interface Category {
  id: string;
  name: string;
  color: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  crestUrl: string | null;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Player {
  id: string;
  name: string;
  photoUrl: string | null;
  position: "Delantero" | "Medio" | "Defensa" | "Portero";
  jerseyNumber: number;
  teamId: string;
  categoryId: string;
  seasonGoals: number;
  seasonPoints: number;
  seasonMatches: number;
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  id: string;
  categoryId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  venue: string;
  status: "scheduled" | "in_progress" | "finished";
  homeGoals: number | null;
  awayGoals: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Standing {
  position: number;
  teamId: string;
  teamName: string;
  teamCrest: string | null;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface TopScorer {
  position: number;
  playerId: string;
  playerName: string;
  teamName: string;
  teamCrest: string | null;
  goals: number;
  points: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}
```

---

# ✅ PASO 3: COMPONENTES BASE UI

## 3.1 Card Component

**`frontend/src/components/ui/Card.tsx`:**

```typescript
import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  animationDelay?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hover = true,
  animationDelay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay, duration: 0.4 }}
      onClick={onClick}
      className={`
        bg-white rounded-xl p-6 shadow-card
        border border-gray-100
        ${hover ? 'hover:shadow-elevated hover:-translate-y-1 cursor-pointer transition-all' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};
```

## 3.2 Button Component

**`frontend/src/components/ui/Button.tsx`:**

```typescript
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  loading = false,
}) => {
  const baseStyle = `
    font-semibold rounded-lg
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2
  `;

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400',
    success: 'bg-success text-white hover:bg-green-700 focus:ring-success',
    danger: 'bg-secondary text-white hover:bg-red-700 focus:ring-secondary',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? '...' : children}
    </button>
  );
};
```

## 3.3 Badge Component

**`frontend/src/components/ui/Badge.tsx`:**

```typescript
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-orange-100 text-orange-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    primary: 'bg-primary/10 text-primary',
  };

  const sizes = {
    sm: 'text-xs px-2 py-1 rounded-full',
    md: 'text-sm px-3 py-1.5 rounded-full',
  };

  return (
    <span className={`font-semibold ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};
```

## 3.4 Tabs Component

**`frontend/src/components/ui/Tabs.tsx`:**

```typescript
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab = tabs[0]?.id || '',
  onChange,
  children,
}) => {
  const [active, setActive] = useState(defaultTab);

  const handleTabClick = (tabId: string) => {
    setActive(tabId);
    onChange?.(tabId);
  };

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex gap-2 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              px-4 py-2 font-semibold text-sm transition-colors
              ${
                active === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={active}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
};
```

## 3.5 Loading Spinner

**`frontend/src/components/common/LoadingSpinner.tsx`:**

```typescript
import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};
```

## 3.6 Empty State

**`frontend/src/components/common/EmptyState.tsx`:**

```typescript
import React from 'react';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="text-center py-12">
      {icon && <div className="mb-4 text-4xl">{icon}</div>}
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 mb-6 max-w-sm mx-auto">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="primary">
          {action.label}
        </Button>
      )}
    </div>
  );
};
```

---

# ✅ PASO 4: COMPONENTES DEPORTIVOS

## 4.1 CategoryCard

**`frontend/src/components/sports/CategoryCard.tsx`:**

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

interface CategoryCardProps {
  id: string;
  name: string;
  color: string;
  description?: string;
  delay?: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  name,
  color,
  description,
  delay = 0,
}) => {
  return (
    <Link href={`/categories/${id}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.4 }}
      >
        <Card hover className="text-center">
          {/* Color Indicator */}
          <div
            className="w-12 h-12 rounded-full mx-auto mb-4"
            style={{ backgroundColor: color }}
          />

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2">{name}</h3>

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}

          {/* CTA */}
          <div className="mt-4 text-primary font-semibold text-sm">
            Ver Detalles →
          </div>
        </Card>
      </motion.div>
    </Link>
  );
};
```

## 4.2 StandingsTable

**`frontend/src/components/sports/StandingsTable.tsx`:**

```typescript
import React from 'react';
import { Standing } from '@/types';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

interface StandingsTableProps {
  standings: Standing[];
}

export const StandingsTable: React.FC<StandingsTableProps> = ({
  standings,
}) => {
  const getPositionColor = (position: number) => {
    if (position === 1) return 'bg-yellow-100 text-yellow-800';
    if (position <= 4) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
              POS
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
              EQUIPO
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">
              PJ
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">
              G
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">
              E
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">
              P
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">
              GF
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">
              GC
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">
              DIF
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
              PTS
            </th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team) => (
            <Link
              href={`/teams/${team.teamId}`}
              key={team.teamId}
            >
              <tr className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer">
                <td className="px-4 py-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${getPositionColor(
                      team.position
                    )}`}
                  >
                    {team.position}
                  </div>
                </td>
                <td className="px-4 py-3 flex items-center gap-2">
                  {team.teamCrest && (
                    <img
                      src={team.teamCrest}
                      alt={team.teamName}
                      className="w-6 h-6 object-cover rounded"
                    />
                  )}
                  <span className="font-semibold text-gray-900">
                    {team.teamName}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-gray-700">
                  {team.played}
                </td>
                <td className="px-4 py-3 text-center text-green-600 font-semibold">
                  {team.wins}
                </td>
                <td className="px-4 py-3 text-center text-yellow-600 font-semibold">
                  {team.draws}
                </td>
                <td className="px-4 py-3 text-center text-red-600 font-semibold">
                  {team.losses}
                </td>
                <td className="px-4 py-3 text-center text-gray-700">
                  {team.goalsFor}
                </td>
                <td className="px-4 py-3 text-center text-gray-700">
                  {team.goalsAgainst}
                </td>
                <td className="px-4 py-3 text-center text-gray-700">
                  {team.goalDifference > 0 ? '+' : ''}
                  {team.goalDifference}
                </td>
                <td className="px-4 py-3 text-right">
                  <Badge variant="primary">{team.points} pts</Badge>
                </td>
              </tr>
            </Link>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

## 4.3 PlayerCard

**`frontend/src/components/sports/PlayerCard.tsx`:**

```typescript
import React from 'react';
import { Player } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';

interface PlayerCardProps {
  player: Player;
  delay?: number;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className="text-center">
        {/* Photo */}
        {player.photoUrl ? (
          <img
            src={player.photoUrl}
            alt={player.name}
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-gray-500 text-sm">Sin foto</span>
          </div>
        )}

        {/* Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {player.name}
        </h3>

        {/* Position & Jersey */}
        <Badge variant="info" size="sm" className="mb-4">
          {player.position} #{player.jerseyNumber}
        </Badge>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-xl font-bold text-secondary">
              {player.seasonGoals}
            </div>
            <div className="text-xs text-gray-600">Goles</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-xl font-bold text-primary">
              {player.seasonPoints.toFixed(0)}
            </div>
            <div className="text-xs text-gray-600">Puntos</div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
```

## 4.4 MatchCard

**`frontend/src/components/sports/MatchCard.tsx`:**

```typescript
import React from 'react';
import { Match } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import { formatDate, formatTime } from '@/lib/utils';

interface MatchCardProps {
  match: Match;
  delay?: number;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, delay = 0 }) => {
  const isFinished = match.status === 'finished';
  const isLive = match.status === 'in_progress';
  const isScheduled = match.status === 'scheduled';

  const getStatusBadge = () => {
    if (isFinished) return <Badge variant="success">Finalizado</Badge>;
    if (isLive) return <Badge variant="danger">EN VIVO</Badge>;
    return <Badge variant="info">Próximo</Badge>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card hover>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">
              {formatDate(match.date)} - {formatTime(match.date)}
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {match.venue}
            </p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Match */}
        <div className="flex items-center justify-between gap-4">
          {/* Home Team */}
          <div className="text-center flex-1">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              {match.homeTeam.name}
            </p>
            {isFinished || isLive ? (
              <p className="text-3xl font-bold text-primary">
                {match.homeGoals}
              </p>
            ) : (
              <p className="text-xl text-gray-400">-</p>
            )}
          </div>

          {/* VS */}
          <div className="text-gray-400 font-bold">VS</div>

          {/* Away Team */}
          <div className="text-center flex-1">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              {match.awayTeam.name}
            </p>
            {isFinished || isLive ? (
              <p className="text-3xl font-bold text-secondary">
                {match.awayGoals}
              </p>
            ) : (
              <p className="text-xl text-gray-400">-</p>
            )}
          </div>
        </div>

        {/* Live Indicator */}
        {isLive && (
          <div className="mt-4 text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block w-3 h-3 bg-red-500 rounded-full"
            />
            <p className="text-xs text-red-600 font-semibold ml-2">EN VIVO</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
};
```

## 4.5 HeroSection

**`frontend/src/components/sports/HeroSection.tsx`:**

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface HeroSectionProps {
  animationUrl?: string; // URL que proporciona el usuario
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  animationUrl = '',
}) => {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-primary via-primary-light to-secondary flex items-center justify-center overflow-hidden">
      {/* Background Animation Container */}
      {animationUrl && (
        <div className="absolute inset-0 z-0">
          <iframe
            src={animationUrl}
            className="w-full h-full"
            style={{
              border: 'none',
              pointerEvents: 'none',
            }}
          />
        </div>
      )}

      {/* Fallback gradient if no animation */}
      {!animationUrl && (
        <div className="absolute inset-0 z-0">
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-primary-light/20 rounded-full"
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            ⚽ DeporteHN
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            Gestión integral de ligas y torneos de fútbol
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              // Scroll to categories
              document.getElementById('categories')?.scrollIntoView({
                behavior: 'smooth',
              });
            }}
          >
            Explorar Categorías
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-primary"
          >
            Ver Más
          </Button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 z-10 text-center"
      >
        <p className="text-white/70 text-sm mb-2">Desplázate para continuar</p>
        <div className="text-white/50">↓</div>
      </motion.div>
    </div>
  );
};
```

---

# ✅ PASO 5: API CLIENT

**`frontend/src/lib/api.ts`:**

```typescript
/**
 * API CLIENT
 * Centraliza todas las llamadas al backend
 * 
 * PRINCIPIO: Single Source of Truth
 * - Una sola forma de llamar al API
 * - Fácil de mantener y debugear
 * - Manejo centralizado de errores
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

class ApiClient {
  /**
   * Request genérico con error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // ============================================
  // CATEGORÍAS
  // ============================================

  async getCategories() {
    return this.request('/categories');
  }

  async getCategory(id: string) {
    return this.request(`/categories/${id}`);
  }

  // ============================================
  // EQUIPOS
  // ============================================

  async getTeams(filters?: Record<string, string>) {
    const query = new URLSearchParams(filters);
    return this.request(`/teams?${query.toString()}`);
  }

  async getTeam(id: string) {
    return this.request(`/teams/${id}`);
  }

  // ============================================
  // JUGADORES
  // ============================================

  async getPlayers(filters?: Record<string, string>) {
    const query = new URLSearchParams(filters);
    return this.request(`/players?${query.toString()}`);
  }

  async getPlayer(id: string) {
    return this.request(`/players/${id}`);
  }

  // ============================================
  // PARTIDOS
  // ============================================

  async getMatches(filters?: Record<string, string>) {
    const query = new URLSearchParams(filters);
    return this.request(`/matches?${query.toString()}`);
  }

  async getMatch(id: string) {
    return this.request(`/matches/${id}`);
  }

  // ============================================
  // STANDINGS
  // ============================================

  async getStandings(categoryId: string) {
    return this.request(`/standings/${categoryId}`);
  }

  // ============================================
  // GOLEADORES
  // ============================================

  async getScorers(categoryId: string, limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    return this.request(`/scorers/${categoryId}/top${query}`);
  }

  async getAllScorers(categoryId: string) {
    return this.request(`/scorers/${categoryId}`);
  }
}

export const apiClient = new ApiClient();
```

---

# ✅ PASO 6: HOOKS PERSONALIZADOS

**`frontend/src/lib/hooks.ts`:**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { apiClient } from './api';
import { Category, Team, Player, Match, Standing, TopScorer } from '@/types';

/**
 * HOOKS PERSONALIZADOS
 * Encapsulan lógica de data fetching
 * 
 * PATRÓN: Cada hook es responsable de un recurso
 * - useCategories() - Categorías
 * - useTeam() - Equipo específico
 * - usePlayers() - Jugadores
 * - useMatches() - Partidos
 * - useStandings() - Tabla
 * - useScorers() - Goleadores
 */

interface UseDataState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// ============================================
// CATEGORÍAS
// ============================================

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
        setState({
          data: response,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error as Error,
        });
      }
    };

    fetchCategories();
  }, []);

  return state;
};

// ============================================
// JUGADORES DE UN EQUIPO
// ============================================

export const useTeamPlayers = (teamId: string | undefined) => {
  const [state, setState] = useState<UseDataState<Player[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!teamId) return;

    const fetchPlayers = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const response = await apiClient.getPlayers({ teamId });
        setState({
          data: response,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error as Error,
        });
      }
    };

    fetchPlayers();
  }, [teamId]);

  return state;
};

// ============================================
// PARTIDOS DE UNA CATEGORÍA
// ============================================

export const useCategoryMatches = (categoryId: string | undefined) => {
  const [state, setState] = useState<UseDataState<Match[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!categoryId) return;

    const fetchMatches = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const response = await apiClient.getMatches({ categoryId });
        setState({
          data: response,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error as Error,
        });
      }
    };

    fetchMatches();
  }, [categoryId]);

  return state;
};

// ============================================
// TABLA DE POSICIONES
// ============================================

export const useStandings = (categoryId: string | undefined) => {
  const [state, setState] = useState<UseDataState<Standing[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!categoryId) return;

    const fetchStandings = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const response = await apiClient.getStandings(categoryId);
        setState({
          data: response.standings,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error as Error,
        });
      }
    };

    fetchStandings();
  }, [categoryId]);

  return state;
};

// ============================================
// GOLEADORES
// ============================================

export const useScorers = (categoryId: string | undefined, limit?: number) => {
  const [state, setState] = useState<UseDataState<TopScorer[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!categoryId) return;

    const fetchScorers = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const response = await apiClient.getScorers(categoryId, limit);
        setState({
          data: response.scorers,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error as Error,
        });
      }
    };

    fetchScorers();
  }, [categoryId, limit]);

  return state;
};
```

---

# ✅ PASO 7: UTILIDADES

**`frontend/src/lib/utils.ts`:**

```typescript
/**
 * FUNCIONES UTILIDADES
 */

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
};

export const formatTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (date: string | Date): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const getMatchStatus = (
  status: 'scheduled' | 'in_progress' | 'finished'
): string => {
  const statusMap = {
    scheduled: 'Próximo',
    in_progress: 'En juego',
    finished: 'Finalizado',
  };
  return statusMap[status];
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
```

---

# ✅ PASO 8: PÁGINAS

## 8.1 Layout Global

**`frontend/app/layout.tsx`:**

```typescript
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import '../src/styles/globals.css';

export const metadata: Metadata = {
  title: 'DeporteHN - Gestión de Ligas de Fútbol',
  description:
    'Plataforma interactiva para gestionar ligas y torneos de fútbol',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
```

## 8.2 Home Page

**`frontend/app/page.tsx`:**

```typescript
'use client';

import { HeroSection } from '@/components/sports/HeroSection';
import { CategoryCard } from '@/components/sports/CategoryCard';
import { useCategories } from '@/lib/hooks';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

const ANIMATION_URL =
  'https://lottie.host/12345abc/animation.json'; // Usuario proporcionará esto

export default function Home() {
  const { data: categories, loading, error } = useCategories();

  return (
    <>
      {/* Hero Section */}
      <HeroSection animationUrl={ANIMATION_URL} />

      {/* Categorías */}
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
              description="Intenta recargar la página"
            />
          )}

          {categories && categories.length === 0 && (
            <EmptyState
              icon="📋"
              title="Sin categorías"
              description="No hay categorías disponibles"
            />
          )}

          {categories && (
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

## 8.3 Category Page

**`frontend/app/categories/[categoryId]/page.tsx`:**

```typescript
'use client';

import { useState } from 'react';
import { useStandings, useScorers, useCategoryMatches } from '@/lib/hooks';
import { StandingsTable } from '@/components/sports/StandingsTable';
import { Tabs } from '@/components/ui/Tabs';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { MatchCard } from '@/components/sports/MatchCard';
import { Trophy, Calendar } from 'lucide-react';

interface PageProps {
  params: {
    categoryId: string;
  };
}

export default function CategoryPage({ params }: PageProps) {
  const categoryId = params.categoryId;
  const { data: standings, loading: standingsLoading } =
    useStandings(categoryId);
  const { data: matches, loading: matchesLoading } =
    useCategoryMatches(categoryId);
  const { data: scorers, loading: scorersLoading } = useScorers(categoryId, 10);

  const [activeTab, setActiveTab] = useState('standings');

  const tabs = [
    { id: 'standings', label: 'Tabla de Posiciones' },
    { id: 'matches', label: 'Partidos', icon: <Calendar className="w-4 h-4" /> },
    { id: 'scorers', label: 'Goleadores', icon: <Trophy className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Categoría</h1>

        {/* Tabs */}
        <Tabs tabs={tabs} defaultTab="standings" onChange={setActiveTab}>
          {/* TAB 1: TABLA DE POSICIONES */}
          {activeTab === 'standings' && (
            <>
              {standingsLoading && <LoadingSpinner />}
              {standings && standings.length === 0 && (
                <EmptyState
                  icon="📊"
                  title="Sin partidos"
                  description="Aún no hay partidos jugados en esta categoría"
                />
              )}
              {standings && <StandingsTable standings={standings} />}
            </>
          )}

          {/* TAB 2: PARTIDOS */}
          {activeTab === 'matches' && (
            <>
              {matchesLoading && <LoadingSpinner />}
              {matches && matches.length === 0 && (
                <EmptyState
                  icon="⚽"
                  title="Sin partidos"
                  description="No hay partidos programados"
                />
              )}
              {matches && (
                <div className="grid gap-6">
                  {matches.map((match, index) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      delay={index * 0.05}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* TAB 3: GOLEADORES */}
          {activeTab === 'scorers' && (
            <>
              {scorersLoading && <LoadingSpinner />}
              {scorers && scorers.length === 0 && (
                <EmptyState
                  icon="⚽"
                  title="Sin goles"
                  description="Aún no hay goleadores"
                />
              )}
              {scorers && (
                <div className="space-y-3">
                  {scorers.map((scorer) => (
                    <div
                      key={scorer.playerId}
                      className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-card transition flex items-center gap-4"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center font-bold text-yellow-700">
                        {scorer.position}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-gray-900">
                          {scorer.playerName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {scorer.teamName}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-secondary">
                          {scorer.goals}
                        </div>
                        <div className="text-xs text-gray-600">goles</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}
```

## 8.4 Team Players Page

**`frontend/app/teams/[teamId]/page.tsx`:**

```typescript
'use client';

import { useTeamPlayers } from '@/lib/hooks';
import { PlayerCard } from '@/components/sports/PlayerCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

interface PageProps {
  params: {
    teamId: string;
  };
}

export default function TeamPlayersPage({ params }: PageProps) {
  const { data: players, loading, error } = useTeamPlayers(params.teamId);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Jugadores</h1>
        <p className="text-gray-600 mb-8">
          Lista de jugadores del equipo
        </p>

        {loading && <LoadingSpinner />}

        {error && (
          <EmptyState
            icon="❌"
            title="Error al cargar"
            description="No pudimos cargar los jugadores"
          />
        )}

        {players && players.length === 0 && (
          <EmptyState
            icon="👥"
            title="Sin jugadores"
            description="Este equipo no tiene jugadores registrados"
          />
        )}

        {players && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {players.map((player, index) => (
              <PlayerCard key={player.id} player={player} delay={index * 0.05} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

## 8.5 Matches Page (3 Secciones)

**`frontend/app/matches/[categoryId]/page.tsx`:**

```typescript
'use client';

import { useCategoryMatches } from '@/lib/hooks';
import { MatchCard } from '@/components/sports/MatchCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Tabs } from '@/components/ui/Tabs';
import { useState } from 'react';

interface PageProps {
  params: {
    categoryId: string;
  };
}

export default function MatchesPage({ params }: PageProps) {
  const { data: allMatches, loading } = useCategoryMatches(params.categoryId);
  const [activeTab, setActiveTab] = useState('scheduled');

  // Filtrar partidos por estado
  const scheduledMatches = allMatches?.filter((m) => m.status === 'scheduled') || [];
  const liveMatches = allMatches?.filter((m) => m.status === 'in_progress') || [];
  const finishedMatches = allMatches?.filter((m) => m.status === 'finished') || [];

  const tabs = [
    { id: 'scheduled', label: `Próximos (${scheduledMatches.length})` },
    { id: 'live', label: `En Juego (${liveMatches.length})` },
    { id: 'finished', label: `Terminados (${finishedMatches.length})` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Partidos</h1>
        <p className="text-gray-600 mb-8">
          Próximos partidos, en juego y resultados
        </p>

        {loading && <LoadingSpinner />}

        {!loading && allMatches && (
          <Tabs tabs={tabs} defaultTab="scheduled" onChange={setActiveTab}>
            {/* Próximos */}
            {activeTab === 'scheduled' && (
              <>
                {scheduledMatches.length === 0 ? (
                  <EmptyState
                    icon="📅"
                    title="Sin partidos próximos"
                    description="No hay partidos programados"
                  />
                ) : (
                  <div className="grid gap-6">
                    {scheduledMatches.map((match, index) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        delay={index * 0.05}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* En Juego */}
            {activeTab === 'live' && (
              <>
                {liveMatches.length === 0 ? (
                  <EmptyState
                    icon="⚽"
                    title="Sin partidos en vivo"
                    description="No hay partidos en juego"
                  />
                ) : (
                  <div className="grid gap-6">
                    {liveMatches.map((match, index) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        delay={index * 0.05}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Terminados */}
            {activeTab === 'finished' && (
              <>
                {finishedMatches.length === 0 ? (
                  <EmptyState
                    icon="✓"
                    title="Sin resultados"
                    description="No hay partidos terminados"
                  />
                ) : (
                  <div className="grid gap-6">
                    {finishedMatches.map((match, index) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        delay={index * 0.05}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </Tabs>
        )}
      </div>
    </div>
  );
}
```

---

# ✅ PASO 9: GLOBAL STYLES

**`frontend/app/globals.css`:**

```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary: #2563eb;
  --color-primary-dark: #1e40af;
  --color-primary-light: #3b82f6;
  --color-secondary: #dc2626;
  --color-success: #16a34a;
  --color-warning: #ea580c;
  --color-neutral: #6b7280;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: #fafafa;
  color: #1f2937;
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f3f4f6;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
```

---

# ✅ PASO 10: ESTRUCTURA COMPLETA DE CARPETAS

```bash
# Crear carpeta src
mkdir -p frontend/src/components/{ui,sports,layout,common}
mkdir -p frontend/src/lib
mkdir -p frontend/src/types

# Crear carpetas de páginas
mkdir -p frontend/app/categories/[categoryId]
mkdir -p frontend/app/teams/[teamId]
mkdir -p frontend/app/matches/[categoryId]

# Crear carpeta de estilos
mkdir -p frontend/app/styles
```

---

# ✅ PASO 11: INSTALAR Y EJECUTAR

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev

# Debería mostrar:
# ▲ Next.js 14.0.0
# - Local: http://localhost:3000
```

---

# ✅ TESTING

## Home Page
```
http://localhost:3000
✓ Ve hero section
✓ Ve categorías abajo
```

## Tabla de Posiciones
```
Click en cualquier categoría
✓ Ve tabla con equipos
✓ Ve tabs para partidos y goleadores
```

## Jugadores del Equipo
```
Click en equipo en la tabla
✓ Ve lista de jugadores con fotos
✓ Ve posición y número de dorsal
```

## Partidos
```
Click en tab "Partidos"
✓ Ve 3 secciones: Próximos, En Juego, Terminados
✓ Ve resultados finales en terminados
```

---

# 🎯 RESUMEN

Tienes un frontend COMPLETO:

✅ **Componentes Reutilizables**
- Card, Button, Badge, Tabs
- Totalmente desacoplados
- Fáciles de modificar

✅ **Componentes Deportivos**
- CategoryCard
- StandingsTable
- PlayerCard
- MatchCard
- HeroSection

✅ **Páginas según Flujo**
- Home con hero + categorías
- Category con tabla + tabs
- Team players con galería
- Matches con 3 secciones

✅ **Data Fetching**
- API Client centralizado
- Hooks personalizados
- Error handling

✅ **Animaciones**
- Framer Motion en cards
- Loading states
- Transiciones suaves

¿Necesitas algo más o empezamos a testearlo? 🚀

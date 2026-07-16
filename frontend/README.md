# CONDEPOR Frontend & UI/Accessibility

Plataforma interactiva para la gestión de ligas y torneos de fútbol, desarrollada con **Next.js 14**, **React 18**, **TypeScript** y **Tailwind CSS**, con estética deportiva estilo MARCA LaLiga Obsidian.

## 🌟 Características Principales

- ✅ **Diseño MARCA LaLiga Obsidian**: Estética deportiva premium con proporciones estrictamente aseguradas (`StandingsTable`, `MatchCard`, etc.).
- ✅ **API Client Robusto (`src/lib/api.ts`)**: Manejo tipado de errores con clases especializadas (`ApiError`, `NetworkError`, `TimeoutError`) y soporte para timeouts por `AbortController`.
- ✅ **Validación con Zod (`src/lib/validation.ts`)**: Tipado estricto y seguro de respuestas del backend con fallbacks resistentes ante fallas de red o variaciones de datos.
- ✅ **Gestión de Entorno (`src/config/env.ts`)**: Validación de variables de entorno e importación centralizada en tiempo de construcción y ejecución.
- ✅ **Boundary de Errores (`ErrorBoundary.tsx`)**: Captura de errores de renderizado en React con interfaz de recuperación (`EmptyState`) sin interrumpir la navegación.
- ✅ **Accesibilidad Completa (A11y)**:
  - Enlace de salto rápido al contenido principal (`#main-content`).
  - Roles ARIA (`role="region"`, `role="article"`, `role="tablist"`, `role="tab"`, `role="tabpanel"`).
  - Encabezados de tabla semánticos con `scope="col"` y descripciones para lectores de pantalla (`aria-describedby`).
  - Etiquetas descriptivas `aria-label` e indicadores de estado `aria-busy` / `aria-disabled`.

---

## 🚀 Configuración Inicial

### Prerrequisitos

- **Node.js 18+**
- **npm** o **yarn**

### Instalación de dependencias

```bash
npm install
```

### Variables de Entorno

Copia el archivo de ejemplo para crear tu configuración local:

```bash
cp .env.local.example .env.local
```

En `.env.local` puedes definir:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_HERO_ANIMATION_URL=""
```

---

## 🛠️ Comandos de Desarrollo

### Ejecutar en modo desarrollo

```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

### Verificación de Tipos (TypeScript)

```bash
npx tsc --noEmit
```

### Construcción para Producción

```bash
npm run build
npm run start
```

---

## 📁 Estructura del Proyecto

```
src/
├── app/              # Directorio de páginas Next.js (App Router)
├── components/       # Componentes de React
│   ├── ui/           # Componentes UI reutilizables (Badge, Button, Card, Tabs)
│   ├── sports/       # Componentes deportivos (StandingsTable, MatchCard, etc.)
│   └── common/       # Componentes comunes (ErrorBoundary, EmptyState, LoadingSpinner)
├── config/           # Configuración y validación de variables de entorno (env.ts)
├── lib/              # Utilidades y lógica central
│   ├── api.ts        # Cliente API centralizado y manejo de errores
│   ├── hooks.ts      # Hooks personalizados de React con validación Zod
│   ├── validation.ts # Esquemas y validadores de Zod
│   └── utils.ts      # Funciones auxiliares de formato y estilos
└── types/            # Interfaces e definiciones compartidas de TypeScript
```

---

## 🛡️ Manejo de Errores en API

Todas las excepciones del cliente API se capturan e instancian como clases herederas de `ApiError`:

```typescript
import { apiClient, NetworkError, TimeoutError, ApiError } from '@/lib/api';

try {
  const categories = await apiClient.getCategories();
} catch (error) {
  if (error instanceof NetworkError) {
    // Error de red o falta de conectividad
  } else if (error instanceof TimeoutError) {
    // Tiempo de espera agotado (> 30s)
  } else if (error instanceof ApiError) {
    // Error HTTP reportado por el backend (e.g., 404, 500)
    console.error(`Status ${error.status}: ${error.message}`);
  }
}
```

---

## ♿ Accesibilidad (A11y)

Se han implementado y verificado rigurosamente estándares de accesibilidad sin comprometer los estilos ni tamaños de íconos/escudos del diseño MARCA LaLiga Obsidian:
- Navegación por teclado completa con anillos de foco visibles.
- Enlace oculto de salto al contenido principal para lectores de pantalla en `<a href="#main-content">`.
- Tablas de posiciones (`StandingsTable`) con roles semánticos, `scope="col"` y descripciones accesibles.
- Componentes de partido (`MatchCard`) con rol de artículo (`role="article"`) y resúmenes narrados del marcador.

---

## 📄 Licencia

ISC

# Landing Page Components

Componentes minimalistas para la landing page de CONDEPOR.

## Componentes

### CategorySelector
**Ubicación:** `CategorySelector.tsx`

Selector visual de categorías con grid responsive.

**Props:**
- `categories: Category[]` - Array de categorías a mostrar
- `loading: boolean` - Estado de carga
- `onSelect: (id: string) => void` - Callback al seleccionar
- `selectedId?: string` - ID de categoría seleccionada

**Características:**
- Grid responsive (1 col mobile, 2 desktop, 3 lg)
- Skeleton loader durante carga
- Empty state cuando no hay categorías
- Checkmark visual cuando está seleccionada
- Efectos hover con Framer Motion
- Usa color de categoría como background

**Ejemplo:**
```tsx
<CategorySelector
  categories={categories}
  loading={loading}
  onSelect={(id) => setSelectedCategory(id)}
  selectedId={selectedCategoryId}
/>
```

---

### ParentMatchList
**Ubicación:** `ParentMatchList.tsx`

Lista filtrable de partidos para una categoría.

**Props:**
- `matches: Match[]` - Array de partidos
- `categoryName: string` - Nombre de la categoría
- `loading: boolean` - Estado de carga
- `onSelectMatch?: (id: string) => void` - Callback al seleccionar

**Características:**
- Filtros: "Todos", "Programados", "Terminados"
- Estado reactivo de filtros con useState
- Skeleton loaders durante carga
- Empty state cuando no hay partidos
- Reutiliza MatchCard existente
- Muestra contador de partidos por filtro

**Ejemplo:**
```tsx
<ParentMatchList
  matches={matches}
  categoryName="Fútbol U-12"
  loading={loading}
  onSelectMatch={(id) => handleMatchSelection(id)}
/>
```

---

### KidsScorerList
**Ubicación:** `KidsScorerList.tsx`

Ranking visual de goleadores con medallas.

**Props:**
- `scorers: Scorer[]` - Array de goleadores
- `categoryName: string` - Nombre de categoría
- `loading: boolean` - Estado de carga

**Características:**
- Top 1: Corona (👑) con fondo dorado
- Top 2-3: Medallas (🥈🥉) con fondos plateado/bronce
- Resto: Números de posición en círculo
- Posición grande (24px)
- Nombre, equipo, goles destacados
- Animación de entrada escalonada
- Skeleton loader durante carga
- Empty state cuando no hay goleadores

**Ejemplo:**
```tsx
<KidsScorerList
  scorers={topScorers}
  categoryName="Fútbol U-14"
  loading={loading}
/>
```

---

### LandingHero
**Ubicación:** `LandingHero.tsx`

Componente reutilizable para secciones hero.

**Props:**
- `title: string` - Título principal (requerido)
- `description?: string` - Descripción/subtítulo
- `children?: ReactNode` - Contenido adicional (botones, etc)
- `imageSrc?: string` - URL de imagen de fondo
- `backgroundColor?: string` - Color de fondo

**Características:**
- Centrado y responsive
- Animaciones suaves con Framer Motion
- Overlay automático para legibilidad con imagen
- Soporta cualquier contenido como children

**Ejemplo:**
```tsx
<LandingHero
  title="Bienvenido a CONDEPOR"
  description="La plataforma oficial de categorías menores"
  imageSrc="/hero-bg.jpg"
>
  <Button>Explorar Categorías</Button>
</LandingHero>
```

---

## Características Generales

### Reutilización de Componentes
- Todos usan componentes UI existentes: `Card`, `Button`, `Badge`
- Usan `Skeleton` para loaders
- Integran `Framer Motion` para animaciones

### TypeScript Strict
- Props completamente tipadas
- Interfaces documentadas con JSDoc
- Tipos importados de `@/types`

### Accesibilidad
- Rol y aria attributes apropiados
- Labels descriptivos
- Estructura semántica correcta

### Responsive Design
- Mobile-first approach
- Tailwind breakpoints: `sm`, `md`, `lg`
- Padding/margin adaptan a viewport

### Estilos Minimalistas
- 3 colores principales: amber-400, slate-*, gris
- Bordes sutiles
- Sombras contextuales
- Sin exceso de decoración

---

## Tests

Se incluyen tests completos para los primeros 3 componentes usando Jest + React Testing Library.

### CategorySelector.test.tsx
- ✓ Renderea categorías
- ✓ Maneja loading state
- ✓ Maneja empty state
- ✓ onClick dispara onSelect
- ✓ Muestra checkmark en selected
- ✓ Aplica color de categoría
- ✓ Un checkmark por vez

### ParentMatchList.test.tsx
- ✓ Renderea matches
- ✓ Maneja loading state
- ✓ Filtros funcionan
- ✓ Empty state visible
- ✓ onSelectMatch callback
- ✓ Contadores correctos

### KidsScorerList.test.tsx
- ✓ Renderea scorers en orden
- ✓ Top 1 tiene corona/medal
- ✓ Muestra goles correctamente
- ✓ Empty state visible
- ✓ Singular/plural "Gol/Goles"
- ✓ Estilos medalist aplicados

---

## Instalación de Dependencias para Tests

Para ejecutar los tests, instala las librerías de testing:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest @types/jest
```

Luego configura Jest en `package.json` o `jest.config.js`.

---

## Notas de Implementación

1. **Sin fetching de datos**: Todos reciben datos vía props, no hacen llamadas API
2. **Minimalista**: Estilos simples, sin componentes innecesarios
3. **Reutilizable**: LandingHero puede usarse en múltiples páginas
4. **Modular**: Cada componente es independiente
5. **Animaciones**: Usando Framer Motion para transiciones suaves

---

## Ejemplo de Uso Integrado

```tsx
'use client';

import {
  CategorySelector,
  ParentMatchList,
  KidsScorerList,
  LandingHero,
} from '@/components/landing';
import { Category, Match, TopScorer } from '@/types';
import { useState } from 'react';

export default function LandingPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>();
  
  const categories: Category[] = [...];
  const matches: Match[] = [...];
  const scorers: TopScorer[] = [...];

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  return (
    <>
      <LandingHero
        title="Torneo de Menores CONDEPOR"
        description="Sigue los partidos y goleadores de tu categoría favorita"
      />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-black mb-8">Elige una categoría</h2>
        <CategorySelector
          categories={categories}
          loading={false}
          onSelect={setSelectedCategoryId}
          selectedId={selectedCategoryId}
        />

        {selectedCategory && (
          <>
            <ParentMatchList
              matches={matches.filter(m => m.categoryId === selectedCategoryId)}
              categoryName={selectedCategory.name}
              loading={false}
            />

            <KidsScorerList
              scorers={scorers.filter(s => s.teamId === selectedCategoryId)}
              categoryName={selectedCategory.name}
              loading={false}
            />
          </>
        )}
      </div>
    </>
  );
}
```

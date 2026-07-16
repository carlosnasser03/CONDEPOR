# Package.json Reference

## Backend - package.json

```json
{
  "name": "deportehn-backend",
  "private": true,
  "version": "0.1.0",
  "main": "dist/server.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "prisma generate && tsc -p tsconfig.json",
    "start": "node dist/server.js",
    "test": "vitest run"
  },
  "dependencies": {
    "@prisma/client": "^5.6.0",
    "compression": "^1.8.1",
    "cors": "^2.8.5",
    "dotenv": "^17.4.2",
    "express": "^4.18.2",
    "express-rate-limit": "^7.5.1",
    "helmet": "^7.2.0"
  },
  "devDependencies": {
    "@types/compression": "^1.8.1",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.18",
    "@types/node": "^20.14.0",
    "better-sqlite3": "^12.11.1",
    "prisma": "^5.6.0",
    "ts-node": "^10.9.1",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.5.0",
    "vitest": "^1.5.8"
  }
}
```

## Frontend - package.json

```json
{
  "name": "deportehn-frontend",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "13.5.6",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "@next/bundle-analyzer": "14.2.35",
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.5.0"
  }
}
```

## Backend tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Frontend tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "strict": false,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

## Frontend next.config.mjs

```javascript
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  compress: false,
};

export default nextConfig;
```

## Frontend tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## Frontend postcss.config.js

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

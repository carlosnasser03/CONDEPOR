'use client';

import React, { ReactNode } from 'react';
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
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-6">
            <EmptyState
              icon="❌"
              title="Algo salió mal en la interfaz"
              description={this.state.error?.message || 'Ha ocurrido un error inesperado al cargar este componente. Por favor recarga la página.'}
              action={{
                label: 'Recargar página',
                onClick: () => window.location.reload(),
              }}
            />
          </div>
        )
      );
    }

    return this.props.children;
  }
}

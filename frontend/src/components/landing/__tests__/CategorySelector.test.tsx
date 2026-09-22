import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CategorySelector } from '../CategorySelector';
import { Category } from '@/types';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  ...jest.requireActual('framer-motion'),
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock Skeleton component
jest.mock('@/components/common/Skeleton', () => ({
  CategoryCardSkeleton: () => <div data-testid="skeleton-loader">Loading</div>,
}));

describe('CategorySelector', () => {
  const mockCategories: Category[] = [
    {
      id: '1',
      name: 'Fútbol U-12',
      color: '#f59e0b',
      description: 'Categoría sub-12',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'Fútbol U-14',
      color: '#ef4444',
      description: 'Categoría sub-14',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '3',
      name: 'Fútbol U-16',
      color: '#3b82f6',
      description: 'Categoría sub-16',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ];

  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders categories correctly', () => {
    render(
      <CategorySelector
        categories={mockCategories}
        loading={false}
        onSelect={mockOnSelect}
      />
    );

    mockCategories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });

  test('displays loading state with skeleton loaders', () => {
    render(
      <CategorySelector
        categories={[]}
        loading={true}
        onSelect={mockOnSelect}
      />
    );

    const skeletons = screen.getAllByTestId('skeleton-loader');
    expect(skeletons).toHaveLength(6);
  });

  test('displays empty state when no categories', () => {
    render(
      <CategorySelector
        categories={[]}
        loading={false}
        onSelect={mockOnSelect}
      />
    );

    expect(
      screen.getByText('No hay categorías disponibles')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Vuelve más tarde para ver las categorías disponibles/i)
    ).toBeInTheDocument();
  });

  test('calls onSelect with correct id when a category is clicked', () => {
    render(
      <CategorySelector
        categories={mockCategories}
        loading={false}
        onSelect={mockOnSelect}
      />
    );

    const firstCategory = screen.getByText('Fútbol U-12').closest('div');
    if (firstCategory?.parentElement?.parentElement) {
      fireEvent.click(firstCategory.parentElement.parentElement);
    }

    expect(mockOnSelect).toHaveBeenCalledWith('1');
  });

  test('displays checkmark when category is selected', () => {
    const { rerender } = render(
      <CategorySelector
        categories={mockCategories}
        loading={false}
        onSelect={mockOnSelect}
        selectedId="1"
      />
    );

    const selectedCard = screen.getByText('Fútbol U-12').closest('div');
    expect(
      within(selectedCard?.parentElement || selectedCard!).getByText('✓')
    ).toBeInTheDocument();
  });

  test('displays description when provided', () => {
    render(
      <CategorySelector
        categories={mockCategories}
        loading={false}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Categoría sub-12')).toBeInTheDocument();
    expect(screen.getByText('Categoría sub-14')).toBeInTheDocument();
  });

  test('applies category color to indicator', () => {
    render(
      <CategorySelector
        categories={mockCategories}
        loading={false}
        onSelect={mockOnSelect}
      />
    );

    const colorIndicators = screen.getAllByLabelText(/^Categoría/);
    expect(colorIndicators[0]).toHaveStyle(`backgroundColor: ${mockCategories[0].color}`);
  });

  test('shows loading state while categories are loading', () => {
    const { rerender } = render(
      <CategorySelector
        categories={mockCategories}
        loading={true}
        onSelect={mockOnSelect}
      />
    );

    let skeletons = screen.getAllByTestId('skeleton-loader');
    expect(skeletons).toHaveLength(6);

    rerender(
      <CategorySelector
        categories={mockCategories}
        loading={false}
        onSelect={mockOnSelect}
      />
    );

    mockCategories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });

  test('renders correct number of categories', () => {
    render(
      <CategorySelector
        categories={mockCategories}
        loading={false}
        onSelect={mockOnSelect}
      />
    );

    const categoryNames = mockCategories.map((c) => c.name);
    categoryNames.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  test('only one category can show checkmark at a time', () => {
    const { rerender } = render(
      <CategorySelector
        categories={mockCategories}
        loading={false}
        onSelect={mockOnSelect}
        selectedId="1"
      />
    );

    let checkmarks = screen.getAllByText('✓');
    expect(checkmarks).toHaveLength(1);

    rerender(
      <CategorySelector
        categories={mockCategories}
        loading={false}
        onSelect={mockOnSelect}
        selectedId="2"
      />
    );

    checkmarks = screen.getAllByText('✓');
    expect(checkmarks).toHaveLength(1);
  });
});

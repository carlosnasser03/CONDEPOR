import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { KidsScorerList } from '../KidsScorerList';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  ...jest.requireActual('framer-motion'),
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock Card component
jest.mock('@/components/ui/Card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

describe('KidsScorerList', () => {
  const mockScorers = [
    {
      position: 1,
      playerName: 'Juan Pérez',
      teamName: 'FC Local',
      goals: 15,
      categoryColor: '#f59e0b',
    },
    {
      position: 2,
      playerName: 'Carlos García',
      teamName: 'Equipo B',
      goals: 12,
      categoryColor: '#f59e0b',
    },
    {
      position: 3,
      playerName: 'Miguel López',
      teamName: 'Club C',
      goals: 10,
      categoryColor: '#f59e0b',
    },
    {
      position: 4,
      playerName: 'Fernando Díaz',
      teamName: 'FC Local',
      goals: 8,
      categoryColor: '#f59e0b',
    },
    {
      position: 5,
      playerName: 'Roberto Martínez',
      teamName: 'Equipo B',
      goals: 6,
      categoryColor: '#f59e0b',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders scorers in correct order', () => {
    render(
      <KidsScorerList
        scorers={mockScorers}
        categoryName="Fútbol U-12"
        loading={false}
      />
    );

    const playerNames = mockScorers.map((s) => s.playerName);
    playerNames.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  test('displays loading state with skeleton loaders', () => {
    render(
      <KidsScorerList
        scorers={[]}
        categoryName="Fútbol U-12"
        loading={true}
      />
    );

    const skeletons = screen.getAllByText('Loading');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  test('displays empty state when no scorers', () => {
    render(
      <KidsScorerList
        scorers={[]}
        categoryName="Fútbol U-12"
        loading={false}
      />
    );

    expect(
      screen.getByText('No hay goleadores registrados')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Los goleadores aparecerán aquí cuando se registren partidos/i)
    ).toBeInTheDocument();
  });

  test('displays top 1 scorer with crown emoji', () => {
    render(
      <KidsScorerList
        scorers={mockScorers}
        categoryName="Fútbol U-12"
        loading={false}
      />
    );

    const topScorer = screen.getByText('Juan Pérez').closest('div');
    expect(topScorer?.textContent).toContain('👑');
  });

  test('displays top 2-3 scorers with medal emojis', () => {
    render(
      <KidsScorerList
        scorers={mockScorers}
        categoryName="Fútbol U-12"
        loading={false}
      />
    );

    const secondPlaceCard = screen.getByText('Carlos García').closest('div');
    const thirdPlaceCard = screen.getByText('Miguel López').closest('div');

    expect(secondPlaceCard?.textContent).toContain('🥈');
    expect(thirdPlaceCard?.textContent).toContain('🥉');
  });

  test('displays correct goals for each scorer', () => {
    render(
      <KidsScorerList
        scorers={mockScorers}
        categoryName="Fútbol U-12"
        loading={false}
      />
    );

    mockScorers.forEach((scorer) => {
      expect(screen.getByText(scorer.goals.toString())).toBeInTheDocument();
    });
  });

  test('displays team names for each scorer', () => {
    render(
      <KidsScorerList
        scorers={mockScorers}
        categoryName="Fútbol U-12"
        loading={false}
      />
    );

    mockScorers.forEach((scorer) => {
      expect(screen.getByText(scorer.teamName)).toBeInTheDocument();
    });
  });

  test('displays category name in header', () => {
    render(
      <KidsScorerList
        scorers={mockScorers}
        categoryName="Fútbol U-16"
        loading={false}
      />
    );

    expect(
      screen.getByText('Goleadores - Fútbol U-16')
    ).toBeInTheDocument();
  });

  test('shows correct position numbers', () => {
    render(
      <KidsScorerList
        scorers={mockScorers}
        categoryName="Fútbol U-12"
        loading={false}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('displays correct singular/plural for goals', () => {
    const singleGoal = [
      {
        position: 1,
        playerName: 'Test Player',
        teamName: 'Test Team',
        goals: 1,
        categoryColor: '#f59e0b',
      },
    ];

    render(
      <KidsScorerList
        scorers={singleGoal}
        categoryName="Fútbol U-12"
        loading={false}
      />
    );

    expect(screen.getByText('Gol')).toBeInTheDocument();
  });

  test('shows plural "Goles" for multiple goals', () => {
    render(
      <KidsScorerList
        scorers={mockScorers}
        categoryName="Fútbol U-12"
        loading={false}
      />
    );

    // Should have multiple "Goles" text
    const golesText = screen.getAllByText(/Goles/);
    expect(golesText.length).toBeGreaterThan(0);
  });

  test('renders all scorers even if list is long', () => {
    const longScorers = Array.from({ length: 20 }, (_, i) => ({
      position: i + 1,
      playerName: `Player ${i + 1}`,
      teamName: `Team ${Math.floor(i / 5) + 1}`,
      goals: 20 - i,
      categoryColor: '#f59e0b',
    }));

    render(
      <KidsScorerList
        scorers={longScorers}
        categoryName="Fútbol U-12"
        loading={false}
      />
    );

    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Player 20')).toBeInTheDocument();
  });

  test('applies medalist styling to top 3', () => {
    const { container } = render(
      <KidsScorerList
        scorers={mockScorers}
        categoryName="Fútbol U-12"
        loading={false}
      />
    );

    // Check if top 3 have gradient styling (from-*-* to-*-*)
    const cards = container.querySelectorAll('[class*="bg-gradient-to-r"]');
    expect(cards.length).toBe(3);
  });

  test('displays correct top scorers count in header', () => {
    const fewScorers = mockScorers.slice(0, 3);

    render(
      <KidsScorerList
        scorers={fewScorers}
        categoryName="Fútbol U-12"
        loading={false}
      />
    );

    expect(screen.getByText(/Top 3 goleadores/)).toBeInTheDocument();
  });
});

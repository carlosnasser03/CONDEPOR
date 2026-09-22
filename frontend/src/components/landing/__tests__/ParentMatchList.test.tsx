import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ParentMatchList } from '../ParentMatchList';
import { Match, Team } from '@/types';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  ...jest.requireActual('framer-motion'),
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock MatchCard component
jest.mock('@/components/sports/MatchCard', () => ({
  MatchCard: ({ match }: any) => (
    <div data-testid={`match-card-${match.id}`}>
      {match.homeTeam?.name} vs {match.awayTeam?.name}
    </div>
  ),
}));

// Mock Skeleton component
jest.mock('@/components/common/Skeleton', () => ({
  MatchCardSkeleton: () => <div data-testid="skeleton-loader">Loading</div>,
}));

// Mock Button component
jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, variant, ...props }: any) => (
    <button
      {...props}
      onClick={onClick}
      data-variant={variant}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </button>
  ),
}));

describe('ParentMatchList', () => {
  const mockTeam1: Team = {
    id: 'team-1',
    name: 'Local FC',
    crestUrl: null,
    categoryId: 'cat-1',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  const mockTeam2: Team = {
    id: 'team-2',
    name: 'Visitante United',
    crestUrl: null,
    categoryId: 'cat-1',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  const mockMatches: Match[] = [
    {
      id: 'match-1',
      categoryId: 'cat-1',
      homeTeamId: 'team-1',
      awayTeamId: 'team-2',
      homeTeam: mockTeam1,
      awayTeam: mockTeam2,
      date: '2024-02-15T14:00:00Z',
      venue: 'Estadio Central',
      status: 'scheduled',
      homeGoals: null,
      awayGoals: null,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: 'match-2',
      categoryId: 'cat-1',
      homeTeamId: 'team-1',
      awayTeamId: 'team-2',
      homeTeam: mockTeam1,
      awayTeam: mockTeam2,
      date: '2024-02-20T15:00:00Z',
      venue: 'Estadio Central',
      status: 'finished',
      homeGoals: 2,
      awayGoals: 1,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: 'match-3',
      categoryId: 'cat-1',
      homeTeamId: 'team-1',
      awayTeamId: 'team-2',
      homeTeam: mockTeam1,
      awayTeam: mockTeam2,
      date: '2024-02-25T16:00:00Z',
      venue: 'Estadio Central',
      status: 'scheduled',
      homeGoals: null,
      awayGoals: null,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ];

  const mockOnSelectMatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders matches correctly', () => {
    render(
      <ParentMatchList
        matches={mockMatches}
        categoryName="Fútbol U-12"
        loading={false}
        onSelectMatch={mockOnSelectMatch}
      />
    );

    expect(
      screen.getByText('Partidos - Fútbol U-12')
    ).toBeInTheDocument();
    expect(screen.getByTestId('match-card-match-1')).toBeInTheDocument();
    expect(screen.getByTestId('match-card-match-2')).toBeInTheDocument();
  });

  test('displays loading state with skeleton loaders', () => {
    render(
      <ParentMatchList
        matches={[]}
        categoryName="Fútbol U-12"
        loading={true}
        onSelectMatch={mockOnSelectMatch}
      />
    );

    const skeletons = screen.getAllByTestId('skeleton-loader');
    expect(skeletons).toHaveLength(3);
  });

  test('displays empty state when no matches', () => {
    render(
      <ParentMatchList
        matches={[]}
        categoryName="Fútbol U-12"
        loading={false}
        onSelectMatch={mockOnSelectMatch}
      />
    );

    expect(
      screen.getByText('No hay partidos programados')
    ).toBeInTheDocument();
  });

  test('filters to show only scheduled matches', () => {
    render(
      <ParentMatchList
        matches={mockMatches}
        categoryName="Fútbol U-12"
        loading={false}
        onSelectMatch={mockOnSelectMatch}
      />
    );

    const scheduledButton = screen.getByRole('button', { name: /Programados/ });
    fireEvent.click(scheduledButton);

    expect(screen.getByTestId('match-card-match-1')).toBeInTheDocument();
    expect(screen.getByTestId('match-card-match-3')).toBeInTheDocument();
    expect(screen.queryByTestId('match-card-match-2')).not.toBeInTheDocument();
  });

  test('filters to show only finished matches', () => {
    render(
      <ParentMatchList
        matches={mockMatches}
        categoryName="Fútbol U-12"
        loading={false}
        onSelectMatch={mockOnSelectMatch}
      />
    );

    const finishedButton = screen.getByRole('button', { name: /Terminados/ });
    fireEvent.click(finishedButton);

    expect(screen.getByTestId('match-card-match-2')).toBeInTheDocument();
    expect(screen.queryByTestId('match-card-match-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('match-card-match-3')).not.toBeInTheDocument();
  });

  test('shows all matches when "Todos" filter is clicked', () => {
    render(
      <ParentMatchList
        matches={mockMatches}
        categoryName="Fútbol U-12"
        loading={false}
        onSelectMatch={mockOnSelectMatch}
      />
    );

    const finishedButton = screen.getByRole('button', { name: /Terminados/ });
    fireEvent.click(finishedButton);

    expect(screen.queryByTestId('match-card-match-1')).not.toBeInTheDocument();

    const allButton = screen.getByRole('button', { name: /Todos/ });
    fireEvent.click(allButton);

    expect(screen.getByTestId('match-card-match-1')).toBeInTheDocument();
    expect(screen.getByTestId('match-card-match-2')).toBeInTheDocument();
    expect(screen.getByTestId('match-card-match-3')).toBeInTheDocument();
  });

  test('displays correct count of filtered matches', () => {
    render(
      <ParentMatchList
        matches={mockMatches}
        categoryName="Fútbol U-12"
        loading={false}
        onSelectMatch={mockOnSelectMatch}
      />
    );

    expect(screen.getByText(/3 partidos disponibles/)).toBeInTheDocument();
  });

  test('displays empty state message when filter shows no results', () => {
    const emptyMatches: Match[] = [
      {
        ...mockMatches[0],
        status: 'scheduled',
      },
    ];

    render(
      <ParentMatchList
        matches={emptyMatches}
        categoryName="Fútbol U-12"
        loading={false}
        onSelectMatch={mockOnSelectMatch}
      />
    );

    const finishedButton = screen.getByRole('button', { name: /Terminados/ });
    fireEvent.click(finishedButton);

    expect(
      screen.getByText(/No hay partidos programados/)
    ).toBeInTheDocument();
  });

  test('calls onSelectMatch when a match card is clicked', () => {
    render(
      <ParentMatchList
        matches={mockMatches}
        categoryName="Fútbol U-12"
        loading={false}
        onSelectMatch={mockOnSelectMatch}
      />
    );

    const matchCard = screen.getByTestId('match-card-match-1');
    fireEvent.click(matchCard);

    expect(mockOnSelectMatch).toHaveBeenCalledWith('match-1');
  });

  test('displays filter buttons with correct counts', () => {
    render(
      <ParentMatchList
        matches={mockMatches}
        categoryName="Fútbol U-12"
        loading={false}
        onSelectMatch={mockOnSelectMatch}
      />
    );

    expect(screen.getByText(/Todos \(3\)/)).toBeInTheDocument();
    expect(screen.getByText(/Programados \(2\)/)).toBeInTheDocument();
    expect(screen.getByText(/Terminados \(1\)/)).toBeInTheDocument();
  });

  test('shows category name in header', () => {
    render(
      <ParentMatchList
        matches={mockMatches}
        categoryName="Fútbol U-16"
        loading={false}
        onSelectMatch={mockOnSelectMatch}
      />
    );

    expect(
      screen.getByText('Partidos - Fútbol U-16')
    ).toBeInTheDocument();
  });
});

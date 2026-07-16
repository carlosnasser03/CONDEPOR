/**
 * API CLIENT
 * Centraliza todas las llamadas al backend con manejo robusto de errores y timeouts.
 * 
 * PRINCIPIO: Single Source of Truth
 * - Una sola forma de llamar al API
 * - Fácil de mantener y debugear
 * - Manejo centralizado y tipado de errores (`ApiError`, `NetworkError`, `TimeoutError`)
 */

import { Category, Team, Player, Match, Standing, TopScorer as Scorer } from '@/types';

// Specific API Response contracts
export interface CategoriesListResponse {
  success: boolean;
  count?: number;
  data?: Category[];
  categories?: Category[];
}

export interface CategoryDetailResponse {
  success: boolean;
  category?: Category;
  data?: Category;
}

export interface TeamsListResponse {
  success: boolean;
  count?: number;
  data?: Team[];
  teams?: Team[];
}

export interface TeamDetailResponse {
  success: boolean;
  team?: Team;
  data?: Team;
}

export interface PlayersListResponse {
  success: boolean;
  count?: number;
  data?: Player[];
  players?: Player[];
}

export interface PlayerDetailResponse {
  success: boolean;
  player?: Player;
  data?: Player;
}

export interface MatchesListResponse {
  success: boolean;
  count?: number;
  data?: Match[];
  matches?: Match[];
}

export interface MatchDetailResponse {
  success: boolean;
  match?: Match;
  data?: Match;
}

export interface StandingsResponse {
  success: boolean;
  categoryId?: string;
  count?: number;
  standings?: Standing[];
  data?: Standing[];
}

export interface ScorersResponse {
  success: boolean;
  categoryId?: string;
  count?: number;
  scorers?: Scorer[];
  data?: Scorer[];
}

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const REQUEST_TIMEOUT = 30000; // 30 seconds

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = API_URL, timeout: number = REQUEST_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * Request genérico con error handling, timeout vía AbortController y parseo estructurado
   */
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
          'Accept': 'application/json',
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
          errorData.message || errorData.error || `HTTP ${response.status} (${response.statusText})`,
          response.status,
          errorData.details
        );
      }

      // Parse successful response
      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('Failed to fetch'))) {
        throw new NetworkError('Failed to connect to server');
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

  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // ============================================
  // CATEGORÍAS
  // ============================================

  async getCategories(): Promise<Category[]> {
    const res = await this.request<CategoriesListResponse | Category[]>('/categories');
    if (Array.isArray(res)) return res;
    const list = res.data || res.categories;
    if (!res.success || !Array.isArray(list)) {
      throw new ApiError('Invalid categories API response contract', 500);
    }
    return list;
  }

  async getCategory(id: string): Promise<Category | null> {
    const res = await this.request<CategoryDetailResponse | Category>(`/categories/${id}`);
    if ('id' in res && 'name' in res) return res as Category;
    const item = (res as CategoryDetailResponse).data || (res as CategoryDetailResponse).category;
    if (!(res as CategoryDetailResponse).success || !item) {
      throw new ApiError(`Invalid category response for id: ${id}`, 404);
    }
    return item;
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return this.getCategory(id);
  }

  // ============================================
  // EQUIPOS
  // ============================================

  async getTeams(filters?: Record<string, string>): Promise<Team[]> {
    const query = filters ? new URLSearchParams(filters) : new URLSearchParams();
    const queryString = query.toString();
    const endpoint = queryString ? `/teams?${queryString}` : '/teams';
    const res = await this.request<TeamsListResponse | Team[]>(endpoint);
    if (Array.isArray(res)) return res;
    const list = res.data || res.teams;
    if (!res.success || !Array.isArray(list)) {
      throw new ApiError('Invalid teams API response contract', 500);
    }
    return list;
  }

  async getTeam(id: string): Promise<Team | null> {
    const res = await this.request<TeamDetailResponse | Team>(`/teams/${id}`);
    if ('id' in res && 'name' in res) return res as Team;
    const item = (res as TeamDetailResponse).data || (res as TeamDetailResponse).team;
    if (!(res as TeamDetailResponse).success || !item) {
      throw new ApiError(`Invalid team response for id: ${id}`, 404);
    }
    return item;
  }

  async getTeamById(id: string): Promise<Team | null> {
    return this.getTeam(id);
  }

  // ============================================
  // JUGADORES
  // ============================================

  async getPlayers(filters?: Record<string, string>): Promise<Player[]> {
    const query = filters ? new URLSearchParams(filters) : new URLSearchParams();
    const queryString = query.toString();
    const endpoint = queryString ? `/players?${queryString}` : '/players';
    const res = await this.request<PlayersListResponse | Player[]>(endpoint);
    if (Array.isArray(res)) return res;
    const list = res.data || res.players;
    if (!res.success || !Array.isArray(list)) {
      throw new ApiError('Invalid players API response contract', 500);
    }
    return list;
  }

  async getPlayer(id: string): Promise<Player | null> {
    const res = await this.request<PlayerDetailResponse | Player>(`/players/${id}`);
    if ('id' in res && 'name' in res) return res as Player;
    const item = (res as PlayerDetailResponse).data || (res as PlayerDetailResponse).player;
    if (!(res as PlayerDetailResponse).success || !item) {
      throw new ApiError(`Invalid player response for id: ${id}`, 404);
    }
    return item;
  }

  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    return this.getPlayers({ teamId });
  }

  // ============================================
  // PARTIDOS
  // ============================================

  async getMatches(filters?: Record<string, string>): Promise<Match[]> {
    const query = filters ? new URLSearchParams(filters) : new URLSearchParams();
    const queryString = query.toString();
    const endpoint = queryString ? `/matches?${queryString}` : '/matches';
    const res = await this.request<MatchesListResponse | Match[]>(endpoint);
    if (Array.isArray(res)) return res;
    const list = res.data || res.matches;
    if (!res.success || !Array.isArray(list)) {
      throw new ApiError('Invalid matches API response contract', 500);
    }
    return list;
  }

  async getMatch(id: string): Promise<Match | null> {
    const res = await this.request<MatchDetailResponse | Match>(`/matches/${id}`);
    if ('id' in res && 'homeTeamId' in res) return res as Match;
    const item = (res as MatchDetailResponse).data || (res as MatchDetailResponse).match;
    if (!(res as MatchDetailResponse).success || !item) {
      throw new ApiError(`Invalid match response for id: ${id}`, 404);
    }
    return item;
  }

  async getMatchById(id: string): Promise<Match | null> {
    return this.getMatch(id);
  }

  // ============================================
  // STANDINGS
  // ============================================

  async getStandings(categoryId: string): Promise<StandingsResponse> {
    const res = await this.request<StandingsResponse>(`/standings/${categoryId}`);
    if (!res || !res.success) {
      throw new ApiError(`Invalid standings response for category: ${categoryId}`, 500);
    }
    return res;
  }

  // ============================================
  // GOLEADORES
  // ============================================

  async getScorers(categoryId: string, limit?: number): Promise<ScorersResponse> {
    const query = limit ? `?limit=${limit}` : '';
    const res = await this.request<ScorersResponse>(`/scorers/${categoryId}/top${query}`);
    if (!res || !res.success) {
      throw new ApiError(`Invalid scorers response for category: ${categoryId}`, 500);
    }
    return res;
  }

  async getTopScorers(categoryId: string, limit: number = 10): Promise<ScorersResponse> {
    return this.getScorers(categoryId, limit);
  }

  async getAllScorers(categoryId: string): Promise<ScorersResponse> {
    const res = await this.request<ScorersResponse>(`/scorers/${categoryId}`);
    if (!res || !res.success) {
      throw new ApiError(`Invalid all scorers response for category: ${categoryId}`, 500);
    }
    return res;
  }

  // ============================================
  // HEALTH
  // ============================================

  async health(): Promise<{ status: string }> {
    return this.get<{ status: string }>('/health');
  }
}

export const apiClient = new ApiClient();
export { ApiClient };

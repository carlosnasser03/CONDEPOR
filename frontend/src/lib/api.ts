/**
 * API CLIENT
 * Centraliza todas las llamadas al backend con manejo robusto de errores y timeouts.
 * 
 * PRINCIPIO: Single Source of Truth
 * - Una sola forma de llamar al API
 * - Fácil de mantener y debugear
 * - Manejo centralizado y tipado de errores (`ApiError`, `NetworkError`, `TimeoutError`)
 */

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

  async getCategories() {
    const res = await this.request<any>('/categories');
    return res.data || res.categories || res || [];
  }

  async getCategory(id: string) {
    const res = await this.request<any>(`/categories/${id}`);
    return res.data || res.category || res;
  }

  async getCategoryById(id: string) {
    return this.getCategory(id);
  }

  // ============================================
  // EQUIPOS
  // ============================================

  async getTeams(filters?: Record<string, string>) {
    const query = filters ? new URLSearchParams(filters) : new URLSearchParams();
    const queryString = query.toString();
    const endpoint = queryString ? `/teams?${queryString}` : '/teams';
    const res = await this.request<any>(endpoint);
    return res.data || res.teams || res || [];
  }

  async getTeam(id: string) {
    const res = await this.request<any>(`/teams/${id}`);
    return res.data || res.team || res;
  }

  async getTeamById(id: string) {
    return this.getTeam(id);
  }

  // ============================================
  // JUGADORES
  // ============================================

  async getPlayers(filters?: Record<string, string>) {
    const query = filters ? new URLSearchParams(filters) : new URLSearchParams();
    const queryString = query.toString();
    const endpoint = queryString ? `/players?${queryString}` : '/players';
    const res = await this.request<any>(endpoint);
    return res.data || res.players || res || [];
  }

  async getPlayer(id: string) {
    const res = await this.request<any>(`/players/${id}`);
    return res.data || res.player || res;
  }

  async getPlayersByTeam(teamId: string) {
    return this.getPlayers({ teamId });
  }

  // ============================================
  // PARTIDOS
  // ============================================

  async getMatches(filters?: Record<string, string>) {
    const query = filters ? new URLSearchParams(filters) : new URLSearchParams();
    const queryString = query.toString();
    const endpoint = queryString ? `/matches?${queryString}` : '/matches';
    const res = await this.request<any>(endpoint);
    return res.data || res.matches || res || [];
  }

  async getMatch(id: string) {
    const res = await this.request<any>(`/matches/${id}`);
    return res.data || res.match || res;
  }

  async getMatchById(id: string) {
    return this.getMatch(id);
  }

  // ============================================
  // STANDINGS
  // ============================================

  async getStandings(categoryId: string) {
    const res = await this.request<any>(`/standings/${categoryId}`);
    return res;
  }

  // ============================================
  // GOLEADORES
  // ============================================

  async getScorers(categoryId: string, limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    const res = await this.request<any>(`/scorers/${categoryId}/top${query}`);
    return res;
  }

  async getTopScorers(categoryId: string, limit: number = 10) {
    return this.getScorers(categoryId, limit);
  }

  async getAllScorers(categoryId: string) {
    const res = await this.request<any>(`/scorers/${categoryId}`);
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

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
          'Accept': 'application/json',
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
    const res = await this.request<any>('/categories');
    return res.data || res.categories || res || [];
  }

  async getCategory(id: string) {
    const res = await this.request<any>(`/categories/${id}`);
    return res.data || res.category || res;
  }

  // ============================================
  // EQUIPOS
  // ============================================

  async getTeams(filters?: Record<string, string>) {
    const query = new URLSearchParams(filters);
    const res = await this.request<any>(`/teams?${query.toString()}`);
    return res.data || res.teams || res || [];
  }

  async getTeam(id: string) {
    const res = await this.request<any>(`/teams/${id}`);
    return res.data || res.team || res;
  }

  // ============================================
  // JUGADORES
  // ============================================

  async getPlayers(filters?: Record<string, string>) {
    const query = new URLSearchParams(filters);
    const res = await this.request<any>(`/players?${query.toString()}`);
    return res.data || res.players || res || [];
  }

  async getPlayer(id: string) {
    const res = await this.request<any>(`/players/${id}`);
    return res.data || res.player || res;
  }

  // ============================================
  // PARTIDOS
  // ============================================

  async getMatches(filters?: Record<string, string>) {
    const query = new URLSearchParams(filters);
    const res = await this.request<any>(`/matches?${query.toString()}`);
    return res.data || res.matches || res || [];
  }

  async getMatch(id: string) {
    const res = await this.request<any>(`/matches/${id}`);
    return res.data || res.match || res;
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

  async getAllScorers(categoryId: string) {
    const res = await this.request<any>(`/scorers/${categoryId}`);
    return res;
  }
}

export const apiClient = new ApiClient();

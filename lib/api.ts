import { 
  User, 
  Question, 
  TradeQuote, 
  Position, 
  PriceHistory, 
  MarketStats, 
  DashboardData, 
  Trade, 
  Sentiment, 
  PaginationMeta,
  TradeResult
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken() {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    } as Record<string, string>;

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(name: string, email: string, password: string) {
    return this.request<{
      user: User;
      token: string;
      message: string;
    }>('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, password_confirmation: password }),
    });
  }

  async login(email: string, password: string) {
    return this.request<{
      user: User;
      token: string;
      message: string;
    }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    const result = await this.request('/logout', { method: 'POST' });
    this.clearToken();
    return result;
  }

  async getCurrentUser() {
    return this.request<{ user: User }>('/user');
  }

  // Questions endpoints
  async getQuestions(status?: string, page = 1) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page.toString());
    
    return this.request<{
      questions: Question[];
      meta: PaginationMeta;
    }>(`/questions?${params}`);
  }

  async getQuestion(id: string) {
    return this.request<Question>(`/questions/${id}`);
  }

  // Trading endpoints
  async getQuote(questionId: string, position: boolean, shares: number) {
    return this.request<TradeQuote>(`/trade/questions/${questionId}/quote`, {
      method: 'POST',
      body: JSON.stringify({ position, shares }),
    });
  }

  async buyShares(questionId: string, position: boolean, shares: number) {
    return this.request<TradeResult>(`/trade/questions/${questionId}/buy`, {
      method: 'POST',
      body: JSON.stringify({ position, shares }),
    });
  }

  async sellShares(questionId: string, position: boolean, shares: number) {
    return this.request<TradeResult>(`/trade/questions/${questionId}/sell`, {
      method: 'POST',
      body: JSON.stringify({ position, shares }),
    });
  }

  async getPositions() {
    return this.request<{ positions: Position[] }>('/trade/positions');
  }

  // Chart endpoints
  async getPriceHistory(questionId: string, limit = 100) {
    return this.request<PriceHistory>(`/charts/questions/${questionId}/price-history?limit=${limit}`);
  }

  async getMarketStats(questionId: string) {
    return this.request<{ stats: MarketStats }>(`/charts/questions/${questionId}/stats`);
  }

  async getDashboard() {
    return this.request<DashboardData>('/charts/dashboard');
  }

  async getRecentTrades(questionId: string, limit = 20) {
    return this.request<{ trades: Trade[] }>(`/charts/questions/${questionId}/trades?limit=${limit}`);
  }

  async getSentiment(questionId: string) {
    return this.request<{ sentiment: Sentiment }>(`/charts/questions/${questionId}/sentiment`);
  }
}

export const api = new ApiService();
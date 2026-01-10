export interface User {
  id: number;
  name: string;
  email: string;
  influence_credits: number;
  is_admin?: boolean;
}

export interface Question {
  id: number;
  title: string;
  description: string;
  status: 'active' | 'locked' | 'resolved';
  resolution: boolean | null;
  created_at: string;
  locked_at: string | null;
  resolved_at: string | null;
  creator: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
    slug: string;
  };
  market: {
    yes_price: number;
    no_price: number;
    yes_pool: number;
    no_pool: number;
    total_volume?: number; // deprecated, use meta.total_volume
    transaction_count?: number; // deprecated, use meta.trade_count
  };
  meta?: {
    total_volume?: number;
    trade_count?: number;
    holders_count?: number;
  };
}

export interface Position {
  id: number;
  question: {
    id: number;
    title: string;
    status: string;
    resolution: boolean | null;
    resolved_at?: string;
  };
  position: string; // 'YES' or 'NO'
  position_bool: boolean;
  shares: number;
  cost: number;
  current_value: number;
  profit_loss: number;
  profit_loss_pct: number;
  current_price: number;
  created_at: string; // ISO date string
}

export interface PortfolioSummary {
  portfolio: {
    total_invested: number;
    total_value: number;
    total_pnl: number;
    total_pnl_percent: number;
  };
  positions: Position[];
  chart_data: any[]; // Will be implemented later
}

export interface Trade {
  id: number;
  type: 'buy' | 'sell' | 'resolution';
  position: string;
  shares: number;
  credits: number;
  price: number;
  user: string;
  timestamp: number;
  date: string;
}

export interface TradeQuote {
  position: string;
  shares: number;
  cost: number;
  price_per_share: number;
  current_price: number;
}

export interface TradeResult {
  message: string;
  position: any;
  transaction: {
    cost: number;
    shares: number;
    price_per_share: number;
  };
  user: {
    remaining_credits: number;
  };
}

export interface PriceHistory {
  question_id: number;
  data: Array<{
    timestamp: number;
    date: string;
    yes_price: number;
    no_price: number;
    yes_pool: number;
    no_pool: number;
  }>;
  current: {
    yes_price: number;
    no_price: number;
  };
}

export interface MarketStats {
  current_yes_price: number;
  current_no_price: number;
  price_change_24h: number | null;
  high_24h: number;
  low_24h: number;
  total_volume: number;
  total_trades: number;
  unique_traders: number;
  liquidity: {
    yes_pool: number;
    no_pool: number;
    total: number;
  };
}

export interface Sentiment {
  yes_price: number;
  no_price: number;
  yes_shares: number;
  no_shares: number;
  yes_holders: number;
  no_holders: number;
  total_holders: number;
}

export interface DashboardData {
  overview: {
    active_markets: number;
    total_volume: number;
    total_trades: number;
    active_traders: number;
  };
  trending: Array<{
    id: number;
    title: string;
    yes_price: number;
    volume_24h: number;
  }>;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  questions_count?: number;
}
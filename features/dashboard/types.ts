// ============================================
// ENUMS
// ============================================

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
export type QuoteStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
export type QuoteType = 'SOLAR' | 'GYM';

// ============================================
// LEAD
// ============================================

export interface Lead {
  id: string;
  quoteId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  systemSize: number;
  quoteValue: number;
  status: LeadStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// QUOTE
// ============================================

export interface Quote {
  id: string;
  providerId: string;
  quoteConfigId: string;
  type: QuoteType;
  input: Record<string, any>;
  result: Record<string, any>;
  customerEmail: string;
  customerName: string;
  customerPhone: string | null;
  status: QuoteStatus;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// DASHBOARD STATS
// ============================================

export interface DashboardStats {
  totalQuotes: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
  activeLeads: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
  avgQuoteValue: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
  conversionRate: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
}

// ============================================
// PROVIDER
// ============================================

export interface Provider {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// QUOTE CONFIG
// ============================================

export interface QuoteConfig {
  id: string;
  providerId: string;
  type: QuoteType;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// FILTERS
// ============================================

export interface LeadFilters {
  search?: string;
  status?: LeadStatus | 'all';
  from?: Date;
  to?: Date;
  sortBy?: 'date' | 'value' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface QuoteFilters {
  search?: string;
  status?: QuoteStatus | 'all';
  type?: QuoteType | 'all';
  from?: Date;
  to?: Date;
  sortBy?: 'date' | 'value' | 'name';
  sortOrder?: 'asc' | 'desc';
}
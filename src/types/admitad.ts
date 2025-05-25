export interface AdmitadTokenResponse {
  username: string;
  first_name: string;
  last_name: string;
  language: string;
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  group: string;
}

export interface AdmitadTokenRequest {
  client_id: string;
  scope: string;
  grant_type: 'client_credentials';
}

export interface AdmitadClientConfig {
  clientId: string;
  clientSecret: string;
  baseUrl?: string;
  base64Auth?: string;
}

export interface AdmitadApiError {
  error: string;
  error_description?: string;
}

export type AdmitadScope = 
  | 'advcampaigns'
  | 'banners'
  | 'websites'
  | 'statistics'
  | 'manage_websites'
  | 'manage_advcampaigns'
  | 'aliexpress_commission';

export interface AdmitadRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number>;
}

// AliExpress API types
export interface AliExpressCommissionRequest {
  urls: string[];
}

export interface AliExpressCommissionRate {
  product_name: string | null;
  commission_rate: number | null;
  hot_commission_rate: number | null;
  is_hot: boolean;
  url: string;
}

export interface AliExpressCommissionResponse {
  commission_rates: AliExpressCommissionRate[];
} 
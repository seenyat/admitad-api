import type {
  AdmitadTokenResponse,
  AdmitadTokenRequest,
  AdmitadClientConfig,
  AdmitadApiError,
  AdmitadScope,
  AdmitadRequestOptions,
  AliExpressCommissionRequest,
  AliExpressCommissionResponse,
  UrlShortenerRequest,
  UrlShortenerResponse,
  DeeplinkGeneratorParams,
  DeeplinkGeneratorResult
} from '../types/admitad';
import { encodeCredentials, createAuthHeader, isTokenExpired, calculateExpirationTime } from '../utils/auth';

export class AdmitadApiClient {
  private config: AdmitadClientConfig;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiresAt: number | null = null;
  private base64Auth: string;

  constructor(config: AdmitadClientConfig) {
    this.config = {
      baseUrl: 'https://api.admitad.com',
      ...config
    };

    // Use provided base64Auth or generate it from clientId and clientSecret
    this.base64Auth = config.base64Auth || encodeCredentials(config.clientId, config.clientSecret);
  }

  /**
   * Authenticates with Admitad API and obtains access token
   * @param scopes - Array of scopes to request access for
   * @returns Promise resolving to token response
   */
  async authenticate(scopes: AdmitadScope[]): Promise<AdmitadTokenResponse> {
    const url = `${this.config.baseUrl}/token/`;
    const scope = scopes.join(' ');

    const requestData = {
      client_id: this.config.clientId,
      scope,
      grant_type: 'client_credentials' as const
    };

    const body = new URLSearchParams(requestData as Record<string, string>).toString();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': createAuthHeader(this.base64Auth),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    });

    if (!response.ok) {
      const errorData: AdmitadApiError = await response.json();
      throw new Error(`Authentication failed: ${errorData.error} - ${errorData.error_description || 'Unknown error'}`);
    }

    const tokenData: AdmitadTokenResponse = await response.json();
    
    // Store token data
    this.accessToken = tokenData.access_token;
    this.refreshToken = tokenData.refresh_token;
    this.tokenExpiresAt = calculateExpirationTime(tokenData.expires_in);

    return tokenData;
  }

  /**
   * Ensures we have a valid access token, refreshing if necessary
   */
  private async ensureValidToken(): Promise<void> {
    if (!this.accessToken || !this.tokenExpiresAt || isTokenExpired(this.tokenExpiresAt)) {
      throw new Error('No valid token available. Please authenticate first.');
    }
  }

  /**
   * Makes an authenticated request to the Admitad API
   * @param endpoint - API endpoint (without base URL)
   * @param options - Request options
   * @returns Promise resolving to response data
   */
  async request<T = any>(endpoint: string, options: AdmitadRequestOptions = {}): Promise<T> {
    await this.ensureValidToken();

    const url = new URL(endpoint, this.config.baseUrl);
    
    // Add query parameters if provided
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    const requestOptions: RequestInit = {
      method: options.method || 'GET',
      headers
    };

    if (options.body && (options.method === 'POST' || options.method === 'PUT')) {
      requestOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(url.toString(), requestOptions);

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // If we can't parse error as JSON, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text() as T;
  }

  /**
   * Gets current access token
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Gets current refresh token
   */
  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  /**
   * Checks if current token is valid and not expired
   */
  isAuthenticated(): boolean {
    return !!(this.accessToken && this.tokenExpiresAt && !isTokenExpired(this.tokenExpiresAt));
  }

  /**
   * Clears stored authentication data
   */
  logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiresAt = null;
  }

  /**
   * Gets commission rates for AliExpress products
   * @param urls - Array of product URLs to check commission rates for
   * @returns Promise resolving to commission rates response
   */
  async getAliExpressCommissionRates(urls: string[]): Promise<AliExpressCommissionResponse> {
    const requestBody: AliExpressCommissionRequest = { urls };

    return await this.request<AliExpressCommissionResponse>('/aliexpress/commission_rates/', {
      method: 'POST',
      body: requestBody
    });
  }

  /**
   * Shortens an Admitad URL using the URL shortener service
   * @param link - The Admitad link to shorten (must belong to Admitad's domains)
   * @returns Promise resolving to shortened URL response
   */
  async shortenUrl(link: string): Promise<UrlShortenerResponse> {
    const requestBody = { link };

    return await this.request<UrlShortenerResponse>('/shortlink/modify/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(requestBody as Record<string, string>).toString()
    });
  }

  /**
   * Generates deeplinks for affiliate programs
   * @param websiteId - The ad space ID (w_id)
   * @param campaignId - The affiliate program ID (c_id)
   * @param params - Deeplink generation parameters
   * @returns Promise resolving to generated deeplinks
   */
  async generateDeeplinks(
    websiteId: string | number,
    campaignId: string | number,
    params: DeeplinkGeneratorParams
  ): Promise<DeeplinkGeneratorResult> {
    const endpoint = `/deeplink/${websiteId}/advcampaign/${campaignId}/`;
    
    // Convert ulp to array if it's a string
    const ulpArray = Array.isArray(params.ulp) ? params.ulp : [params.ulp];
    
    // Build query parameters
    const queryParams: Record<string, string> = {};
    
    // Add subid parameters if provided
    if (params.subid) queryParams.subid = params.subid;
    if (params.subid1) queryParams.subid1 = params.subid1;
    if (params.subid2) queryParams.subid2 = params.subid2;
    if (params.subid3) queryParams.subid3 = params.subid3;
    if (params.subid4) queryParams.subid4 = params.subid4;
    
    // Add multiple ulp parameters
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
    
    ulpArray.forEach(ulp => {
      searchParams.append('ulp', ulp);
    });

    return await this.request<DeeplinkGeneratorResult>(endpoint, {
      method: 'GET',
      params: Object.fromEntries(searchParams.entries())
    });
  }
} 
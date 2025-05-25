// Main exports
export { AdmitadApiClient } from './src/client/admitad-client';
export { createAdmitadClient, createAdmitadClientWithConfig } from './src/client/factory';

// Type exports
export type {
  AdmitadTokenResponse,
  AdmitadTokenRequest,
  AdmitadClientConfig,
  AdmitadApiError,
  AdmitadScope,
  AdmitadRequestOptions,
  AliExpressCommissionRequest,
  AliExpressCommissionRate,
  AliExpressCommissionResponse,
  UrlShortenerRequest,
  UrlShortenerResponse,
  DeeplinkGeneratorParams,
  DeeplinkGeneratorResponse,
  DeeplinkGeneratorResult
} from './src/types/admitad';

// Utility exports
export {
  encodeCredentials,
  createAuthHeader,
  isTokenExpired,
  calculateExpirationTime
} from './src/utils/auth';

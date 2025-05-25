import { AdmitadApiClient } from './admitad-client';
import type { AdmitadClientConfig } from '../types/admitad';

/**
 * Creates an Admitad API client using environment variables
 * @param customConfig - Optional custom configuration to override environment variables
 * @returns Configured AdmitadApiClient instance
 */
export function createAdmitadClient(customConfig?: Partial<AdmitadClientConfig>): AdmitadApiClient {
  const clientId = customConfig?.clientId || process.env.ADMITAD_CLIENT_ID;
  const clientSecret = customConfig?.clientSecret || process.env.ADMITAD_CLIENT_SECRET;
  const base64Auth = customConfig?.base64Auth || process.env.ADMITAD_BASE64_AUTH;
  const baseUrl = customConfig?.baseUrl || process.env.ADMITAD_API_BASE_URL;

  if (!clientId) {
    throw new Error('ADMITAD_CLIENT_ID environment variable or clientId in config is required');
  }

  if (!clientSecret && !base64Auth) {
    throw new Error('Either ADMITAD_CLIENT_SECRET environment variable or ADMITAD_BASE64_AUTH environment variable (or corresponding config values) is required');
  }

  const config: AdmitadClientConfig = {
    clientId,
    clientSecret: clientSecret || '',
    baseUrl,
    base64Auth
  };

  return new AdmitadApiClient(config);
}

/**
 * Creates an Admitad API client with explicit configuration
 * @param config - Complete client configuration
 * @returns Configured AdmitadApiClient instance
 */
export function createAdmitadClientWithConfig(config: AdmitadClientConfig): AdmitadApiClient {
  return new AdmitadApiClient(config);
} 
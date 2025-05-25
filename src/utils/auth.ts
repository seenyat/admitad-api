/**
 * Encodes client credentials to base64 for HTTP Basic authentication
 * @param clientId - The Admitad client ID
 * @param clientSecret - The Admitad client secret
 * @returns Base64 encoded string in format "clientId:clientSecret"
 */
export function encodeCredentials(clientId: string, clientSecret: string): string {
  const credentials = `${clientId}:${clientSecret}`;
  return btoa(credentials);
}

/**
 * Creates the Authorization header value for HTTP Basic authentication
 * @param base64Credentials - Base64 encoded credentials
 * @returns Authorization header value
 */
export function createAuthHeader(base64Credentials: string): string {
  return `Basic ${base64Credentials}`;
}

/**
 * Validates if a token is expired based on its expiration timestamp
 * @param expiresAt - Token expiration timestamp in milliseconds
 * @param bufferSeconds - Buffer time in seconds before considering token expired (default: 60)
 * @returns True if token is expired or will expire within buffer time
 */
export function isTokenExpired(expiresAt: number, bufferSeconds: number = 60): boolean {
  const now = Date.now();
  const bufferMs = bufferSeconds * 1000;
  return now >= (expiresAt - bufferMs);
}

/**
 * Calculates token expiration timestamp
 * @param expiresIn - Token lifetime in seconds
 * @returns Expiration timestamp in milliseconds
 */
export function calculateExpirationTime(expiresIn: number): number {
  return Date.now() + (expiresIn * 1000);
} 
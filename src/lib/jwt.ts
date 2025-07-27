// JWT utilities for token generation and verification
import jwt from 'jsonwebtoken';
import { JWTPayload, CollectionRequest, ServiceDefinition } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export interface GenerateTokenOptions {
  request: CollectionRequest;
  services: ServiceDefinition[];
  expirationDays?: number;
}

/**
 * Generate a JWT token containing the collection request data
 */
export function generateCollectionToken({ 
  request, 
  services, 
  expirationDays = 7 
}: GenerateTokenOptions): string {
  const payload: JWTPayload = {
    request,
    services,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: `${expirationDays}d`,
    issuer: 'credential-collector',
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyCollectionToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'credential-collector',
    }) as JWTPayload;
    
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Check if a token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) return true;
    
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
}

/**
 * Generate a collection URL with the token
 */
export function generateCollectionUrl(token: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${base}/collect/${encodeURIComponent(token)}`;
}
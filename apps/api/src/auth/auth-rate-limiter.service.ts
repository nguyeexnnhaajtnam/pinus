import { Injectable } from '@nestjs/common';
import { AuthenticationRateLimitException } from './auth.exception';

@Injectable()
export class AuthRateLimiter {
  private readonly buckets = new Map<string, number[]>();

  checkIp(ip: string): void {
    this.consume(`ip:${ip}`, 10);
  }

  checkRefreshSession(sessionId: string): void {
    this.consume(`session:${sessionId}`, 30);
  }

  reset(): void {
    this.buckets.clear();
  }

  private consume(key: string, limit: number): void {
    const now = Date.now();
    const active = (this.buckets.get(key) ?? []).filter(
      (timestamp) => now - timestamp < 60_000,
    );
    if (active.length >= limit) throw new AuthenticationRateLimitException();
    active.push(now);
    this.buckets.set(key, active);
  }
}

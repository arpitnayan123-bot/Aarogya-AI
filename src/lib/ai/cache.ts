// ============================================
// AAROGYA AI — IN-MEMORY CACHE
// Dedup identical AI queries for token efficiency
// ============================================

interface CacheEntry {
  data: any;
  expiresAt: number;
}

class AICache {
  private cache = new Map<string, CacheEntry>();
  private maxSize = 500;

  set(key: string, data: any, ttlSeconds: number): void {
    if (ttlSeconds <= 0) return;

    // Evict expired entries
    this.cleanup();

    // Enforce max size
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

export const aiCache = new AICache();

// ============================================
// CACHE TTL BY REQUEST TYPE
// ============================================

export function getCacheTTL(type: string): number {
  switch (type) {
    case 'symptom': return 1800;      // 30 min
    case 'lab_report': return 86400;   // 24 hr
    case 'chat': return 0;            // Never cache chat
    case 'xray': return 86400;        // 24 hr
    case 'diet': return 43200;        // 12 hr
    case 'prediction': return 7200;   // 2 hr
    case 'skin': return 86400;        // 24 hr
    default: return 300;              // 5 min
  }
}

// ============================================
// HASH INPUT FOR CACHE KEY
// ============================================

export function hashInput(input: any): string {
  const str = typeof input === 'string' ? input : JSON.stringify(input);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).substring(0, 16);
}

import { ref, reactive } from 'vue'

interface CacheItem {
  data: any
  timestamp: number
  ttl: number // time to live in milliseconds
}

interface CacheStore {
  [key: string]: CacheItem
}

// Global cache store
const cacheStore = reactive<CacheStore>({})

// Default TTL: 5 minutes (increased for better caching)
const DEFAULT_TTL = 5 * 60 * 1000

export function useCache() {
  // Get item from cache
  const get = (key: string): any | null => {
    const item = cacheStore[key]
    if (!item) return null
    
    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      // Cache expired, remove it
      delete cacheStore[key]
      return null
    }
    
    return item.data
  }
  
  // Set item in cache
  const set = (key: string, data: any, ttl: number = DEFAULT_TTL): void => {
    cacheStore[key] = {
      data,
      timestamp: Date.now(),
      ttl
    }
  }
  
  // Remove item from cache
  const remove = (key: string): void => {
    delete cacheStore[key]
  }
  
  // Clear all cache
  const clear = (): void => {
    Object.keys(cacheStore).forEach(key => {
      delete cacheStore[key]
    })
  }
  
  // Check if item exists and is valid
  const has = (key: string): boolean => {
    const item = cacheStore[key]
    if (!item) return false
    
    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      delete cacheStore[key]
      return false
    }
    
    return true
  }
  
  // Get cache statistics
  const getStats = () => {
    const now = Date.now()
    const validKeys = Object.keys(cacheStore).filter(key => {
      const item = cacheStore[key]
      return now - item.timestamp <= item.ttl
    })
    
    // Log cache statistics less frequently
    if (Math.random() < 0.05) { // 5% chance to log
      console.log(`Cache Stats: ${validKeys.length} items cached`);
      console.log('Cache Keys:', validKeys.slice(0, 5)); // Show first 5 keys
    }
    
    return {
      totalItems: validKeys.length,
      keys: validKeys
    }
  }
  
  return {
    get,
    set,
    remove,
    clear,
    has,
    getStats
  }
} 
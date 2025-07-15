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

// Default TTL: 3 minutes (reduced for better responsiveness)
const DEFAULT_TTL = 3 * 60 * 1000

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
    
    // Log cache statistics every 30 seconds
    if (Math.random() < 0.1) { // 10% chance to log
      console.log(`Cache Stats: ${validKeys.length} items cached`);
      console.log('Cache Keys:', validKeys.slice(0, 10)); // Show first 10 keys
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
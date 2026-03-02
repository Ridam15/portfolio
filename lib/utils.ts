/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ==================== Class Name Utilities ====================

/**
 * Merge class names with Tailwind CSS support
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 * 
 * @param inputs - Class values to merge
 * @returns Merged class string
 * 
 * @example
 * cn('px-2 py-1', condition && 'bg-blue-500', 'px-4') // => 'py-1 bg-blue-500 px-4'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ==================== Date Utilities ====================

/**
 * Format a date object into a human-readable string
 * 
 * @param date - Date to format (Date object or ISO string)
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 * 
 * @example
 * formatDate(new Date('2024-01-15')) // => 'January 15, 2024'
 * formatDate(new Date(), { dateStyle: 'short' }) // => '1/15/24'
 */
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat('en-US', options || defaultOptions).format(dateObj);
}

/**
 * Format a date as a relative time string (e.g., "2 days ago")
 * 
 * @param date - Date to format
 * @returns Relative time string
 * 
 * @example
 * formatRelativeTime(new Date(Date.now() - 86400000)) // => '1 day ago'
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInSec = Math.floor(diffInMs / 1000);
  const diffInMin = Math.floor(diffInSec / 60);
  const diffInHour = Math.floor(diffInMin / 60);
  const diffInDay = Math.floor(diffInHour / 24);
  const diffInMonth = Math.floor(diffInDay / 30);
  const diffInYear = Math.floor(diffInDay / 365);

  if (diffInYear > 0) {
    return `${diffInYear} year${diffInYear > 1 ? 's' : ''} ago`;
  } else if (diffInMonth > 0) {
    return `${diffInMonth} month${diffInMonth > 1 ? 's' : ''} ago`;
  } else if (diffInDay > 0) {
    return `${diffInDay} day${diffInDay > 1 ? 's' : ''} ago`;
  } else if (diffInHour > 0) {
    return `${diffInHour} hour${diffInHour > 1 ? 's' : ''} ago`;
  } else if (diffInMin > 0) {
    return `${diffInMin} minute${diffInMin > 1 ? 's' : ''} ago`;
  } else {
    return 'just now';
  }
}

// ==================== String Utilities ====================

/**
 * Truncate text to a specified length with ellipsis
 * 
 * @param text - Text to truncate
 * @param length - Maximum length (default: 100)
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns Truncated text
 * 
 * @example
 * truncateText('This is a long text', 10) // => 'This is a...'
 * truncateText('Short', 10) // => 'Short'
 */
export function truncateText(
  text: string,
  length: number = 100,
  suffix: string = '...'
): string {
  if (text.length <= length) {
    return text;
  }
  return text.substring(0, length).trim() + suffix;
}

/**
 * Convert text to URL-friendly slug
 * 
 * @param text - Text to slugify
 * @returns URL-friendly slug
 * 
 * @example
 * slugify('Hello World!') // => 'hello-world'
 * slugify('React & TypeScript') // => 'react-typescript'
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars (except spaces and hyphens)
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Capitalize the first letter of a string
 * 
 * @param text - Text to capitalize
 * @returns Capitalized text
 * 
 * @example
 * capitalize('hello world') // => 'Hello world'
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Convert text to title case
 * 
 * @param text - Text to convert
 * @returns Title cased text
 * 
 * @example
 * titleCase('hello world') // => 'Hello World'
 */
export function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

// ==================== ID Generation ====================

/**
 * Generate a unique ID
 * Uses crypto.randomUUID if available, falls back to custom implementation
 * 
 * @param prefix - Optional prefix for the ID
 * @returns Unique ID string
 * 
 * @example
 * generateId() // => '550e8400-e29b-41d4-a716-446655440000'
 * generateId('user') // => 'user-550e8400-e29b-41d4-a716-446655440000'
 */
export function generateId(prefix?: string): string {
  let id: string;

  // Use crypto.randomUUID if available (modern browsers and Node 16.7+)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    id = crypto.randomUUID();
  } else {
    // Fallback UUID v4 implementation
    id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  return prefix ? `${prefix}-${id}` : id;
}

/**
 * Generate a short unique ID (nanoid-style)
 * 
 * @param length - Length of the ID (default: 10)
 * @returns Short unique ID
 * 
 * @example
 * generateShortId() // => 'V1StGXR8_Z'
 * generateShortId(6) // => 'V1StGX'
 */
export function generateShortId(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

// ==================== Performance Utilities ====================

/**
 * Debounce function to limit the rate at which a function can fire
 * 
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds (default: 300)
 * @returns Debounced function
 * 
 * @example
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 500);
 * 
 * debouncedSearch('hello'); // Only executes after 500ms of no more calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function debounced(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Throttle function to ensure a function is called at most once in a specified period
 * 
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 * 
 * @example
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll event');
 * }, 1000);
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function throttled(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// ==================== Error Handling ====================

/**
 * Type for async function that might throw
 */
type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;

/**
 * Result type for error handling wrapper
 */
type Result<T, E = Error> =
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: E };

/**
 * Wrap an async function with error handling
 * Returns a tuple with [error, data] pattern
 * 
 * @param promise - Promise to wrap
 * @returns Result object with success flag, data, and error
 * 
 * @example
 * const result = await handleAsync(fetchData());
 * if (result.success) {
 *   console.log('Data:', result.data);
 * } else {
 *   console.error('Error:', result.error);
 * }
 */
export async function handleAsync<T>(
  promise: Promise<T>
): Promise<Result<T>> {
  try {
    const data = await promise;
    return { success: true, data, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Create an error handler wrapper for async functions
 * 
 * @param func - Async function to wrap
 * @param onError - Optional error handler
 * @returns Wrapped function that handles errors
 * 
 * @example
 * const safeFunc = withErrorHandler(async (id: string) => {
 *   return await fetchUser(id);
 * }, (error) => {
 *   console.error('Failed to fetch user:', error);
 * });
 */
export function withErrorHandler<T extends AsyncFunction>(
  func: T,
  onError?: (error: Error) => void
): (...args: Parameters<T>) => Promise<ReturnType<T> | null> {
  return async function wrapped(...args: Parameters<T>) {
    try {
      return await func(...args);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      if (onError) {
        onError(err);
      } else {
        console.error('Error in wrapped function:', err);
      }
      return null;
    }
  };
}

// ==================== Validation Utilities ====================

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 * 
 * @param value - Value to check
 * @returns True if empty, false otherwise
 * 
 * @example
 * isEmpty('') // => true
 * isEmpty([]) // => true
 * isEmpty({}) // => true
 * isEmpty('hello') // => false
 */
export function isEmpty(value: any): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Check if a string is a valid email
 * 
 * @param email - Email string to validate
 * @returns True if valid email, false otherwise
 * 
 * @example
 * isValidEmail('test@example.com') // => true
 * isValidEmail('invalid-email') // => false
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if a string is a valid URL
 * 
 * @param url - URL string to validate
 * @returns True if valid URL, false otherwise
 * 
 * @example
 * isValidUrl('https://example.com') // => true
 * isValidUrl('not-a-url') // => false
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ==================== Number Utilities ====================

/**
 * Format a number with commas
 * 
 * @param num - Number to format
 * @returns Formatted number string
 * 
 * @example
 * formatNumber(1234567) // => '1,234,567'
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format a number as currency
 * 
 * @param amount - Amount to format
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(1234.56) // => '$1,234.56'
 * formatCurrency(1234.56, 'EUR') // => '€1,234.56'
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Clamp a number between min and max values
 * 
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 * 
 * @example
 * clamp(5, 0, 10) // => 5
 * clamp(-5, 0, 10) // => 0
 * clamp(15, 0, 10) // => 10
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ==================== Array Utilities ====================

/**
 * Shuffle an array using Fisher-Yates algorithm
 * 
 * @param array - Array to shuffle
 * @returns New shuffled array
 * 
 * @example
 * shuffle([1, 2, 3, 4, 5]) // => [3, 1, 5, 2, 4]
 */
export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Get unique values from an array
 * 
 * @param array - Array to deduplicate
 * @returns Array with unique values
 * 
 * @example
 * unique([1, 2, 2, 3, 3, 3]) // => [1, 2, 3]
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Group array items by a key
 * 
 * @param array - Array to group
 * @param key - Key or function to group by
 * @returns Object with grouped items
 * 
 * @example
 * const items = [{ type: 'a', value: 1 }, { type: 'b', value: 2 }, { type: 'a', value: 3 }];
 * groupBy(items, 'type') // => { a: [...], b: [...] }
 */
export function groupBy<T>(
  array: T[],
  key: keyof T | ((item: T) => string)
): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

// ==================== Object Utilities ====================

/**
 * Deep clone an object
 * 
 * @param obj - Object to clone
 * @returns Cloned object
 * 
 * @example
 * const original = { a: 1, b: { c: 2 } };
 * const cloned = deepClone(original);
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Pick specific keys from an object
 * 
 * @param obj - Source object
 * @param keys - Keys to pick
 * @returns New object with picked keys
 * 
 * @example
 * pick({ a: 1, b: 2, c: 3 }, ['a', 'c']) // => { a: 1, c: 3 }
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Omit specific keys from an object
 * 
 * @param obj - Source object
 * @param keys - Keys to omit
 * @returns New object without omitted keys
 * 
 * @example
 * omit({ a: 1, b: 2, c: 3 }, ['b']) // => { a: 1, c: 3 }
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

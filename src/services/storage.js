// Simple localStorage helpers with error handling and key prefixing
const STORAGE_PREFIX = 'EP_STORAGE_V1_';

export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
      return true;
    } catch (error) {
      console.warn('Error removing from localStorage:', error);
      return false;
    }
  },

  clear: () => {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(STORAGE_PREFIX));
      keys.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
      return false;
    }
  }
};
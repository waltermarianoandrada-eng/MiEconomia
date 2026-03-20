/**
 * LocalStorage wrapper for MiEconomia app.
 * Ensures data is parsed and stringified securely.
 */

export const STORAGE_KEYS = {
  TRANSACTIONS: 'mieconomia_transactions',
  CATEGORIES: 'mieconomia_categories',
  SETTINGS: 'mieconomia_settings'
};

/**
 * Gets data from local storage.
 * @param {string} key 
 * @param {any} defaultValue 
 * @returns {any}
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage`, error);
    return defaultValue;
  }
};

/**
 * Saves data to local storage.
 * @param {string} key 
 * @param {any} value 
 */
export const setItem = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage`, error);
  }
};

/**
 * Clears all app data from local storage.
 */
export const clearAll = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      window.localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing localStorage', error);
  }
};

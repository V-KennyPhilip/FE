//src/utils/authTracking.js

/**
 * Check if there's an abandoned authentication form
 * @returns {Object|null} Form data or null if no abandoned form
 */
export const checkAbandonedAuth = () => {
    try {
      const storedData = localStorage.getItem('auth_form_started');
      if (!storedData) return null;
      
      const parsedData = JSON.parse(storedData);
      const timestamp = new Date(parsedData.timestamp);
      const now = new Date();
      
      // Only consider forms abandoned within the last 24 hours
      const hoursDiff = (now - timestamp) / (1000 * 60 * 60);
      
      if (hoursDiff <= 24) {
        return parsedData;
      } else {
        // Clear old data
        localStorage.removeItem('auth_form_started');
        return null;
      }
    } catch (error) {
      console.error('Error checking abandoned auth:', error);
      return null;
    }
  };
  
  /**
   * Clear the abandoned auth data
   */
  export const clearAbandonedAuth = () => {
    localStorage.removeItem('auth_form_started');
  };
  
  export default {
    checkAbandonedAuth,
    clearAbandonedAuth
  };
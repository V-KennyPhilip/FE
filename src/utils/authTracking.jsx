//src/utils/authTracking.js

/**
 * Check if there's an abandoned authentication form
 * @returns {Object|null} Form data or null if no abandoned form
 */
// src/utils/authTracking.jsx
export const checkAbandonedAuth = () => {
    try {
      const storedData = localStorage.getItem('auth_form_started');
      if (!storedData) return null;
      
      const parsedData = JSON.parse(storedData);
      const timestamp = new Date(parsedData.timestamp);
      const now = new Date();
      
      // Calculate minutes difference
      const minutesDiff = (now - timestamp) / (1000 * 60);
      
      // Only show notification if AT LEAST 1 minute has passed
      if (minutesDiff >= 1) {
        // But clear data after 24 hours to prevent perpetual storage
        if (minutesDiff <= 1440) { // 24hrs = 1440 minutes
          return parsedData;
        }
        localStorage.removeItem('auth_form_started');
        return null;
      }
      return null; // Not enough time passed yet
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
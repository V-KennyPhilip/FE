// src/utils/authTracking.jsx

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

/**
 * Set login timestamp for session duration tracking
 * @param {string|null} userId - Optional user ID to associate with login
 */
export const setLoginTimestamp = (userId = null) => {
  const loginData = {
    timestamp: new Date().toISOString(),
    userId: userId
  };
  localStorage.setItem('userLoginTimestamp', JSON.stringify(loginData));
};

/**
 * Get the login timestamp and related data
 * @returns {Object|null} Login timestamp data or null if not found
 */
export const getLoginData = () => {
  try {
    const storedData = localStorage.getItem('userLoginTimestamp');
    if (!storedData) return null;
    
    return JSON.stringify(storedData);
  } catch (error) {
    console.error('Error getting login timestamp:', error);
    return null;
  }
};

/**
 * Clear login timestamp data
 */
export const clearLoginData = () => {
  localStorage.removeItem('userLoginTimestamp');
};

/**
 * Calculate session duration based on stored login timestamp
 * @returns {Object|null} Session duration in different units or null if no login timestamp
 */
export const calculateSessionDuration = () => {
  try {
    const storedData = localStorage.getItem('userLoginTimestamp');
    if (!storedData) return null;
    
    let loginTime;
    try {
      // First try to parse as JSON (for the new format)
      const parsedData = JSON.parse(storedData);
      loginTime = new Date(parsedData.timestamp).getTime();
    } catch (e) {
      // If parsing fails, assume it's the old format (just a timestamp string)
      loginTime = new Date(storedData).getTime();
    }
    
    const currentTime = new Date().getTime();
    const durationSeconds = Math.floor((currentTime - loginTime) / 1000);
    
    return {
      seconds: durationSeconds,
      minutes: Math.floor(durationSeconds / 60),
      hours: Math.floor(durationSeconds / 3600)
    };
  } catch (error) {
    console.error('Error calculating session duration:', error);
    return null;
  }
};

export default {
  checkAbandonedAuth,
  clearAbandonedAuth,
  setLoginTimestamp,
  getLoginData,
  clearLoginData,
  calculateSessionDuration
};
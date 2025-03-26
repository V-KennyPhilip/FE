// src/Context/AmplitudeContext.jsx
import React, { createContext, useContext, useEffect } from 'react';
import * as amplitude from '@amplitude/analytics-browser';

const AmplitudeContext = createContext();

export const useAmplitude = () => useContext(AmplitudeContext);

export const AmplitudeProvider = ({ apiKey, options = {}, children }) => {
  useEffect(() => {
    // Initialize Amplitude with your API key and options
    amplitude.init(apiKey, {
      // Default configuration
      logLevel: options.logLevel || 0,
      uploadIntervalMs: options.uploadIntervalMs || 30000,
      defaultTracking: {
        sessions: true,
        pageViews: true,
        formInteractions: true,
        fileDownloads: true
      },
      // Merge with any additional options passed in
      ...options
    });
    
    if (options.debug) {
      console.log('Amplitude initialized with API key:', apiKey);
    }
    
    // Clean up on unmount
    return () => {
      // Some versions use flush instead of shutdown
      if (typeof amplitude.flush === 'function') {
        amplitude.flush();
      }
    };
  }, [apiKey, options]);

  // Tracking functions to be used throughout the app
  const trackEvent = (eventName, eventProperties = {}) => {
    amplitude.track(eventName, eventProperties);
    if (options.debug) {
      console.log(`Amplitude event tracked: ${eventName}`, eventProperties);
    }
  };

  const setUserId = (userId) => {
    amplitude.setUserId(userId);
    if (options.debug) {
      console.log(`Amplitude user identified: ${userId}`);
    }
  };

  const resetUser = () => {
    // Check the method exists before calling
    if (typeof amplitude.setUserId === 'function') {
      amplitude.setUserId(null);
    }
    
    if (options.debug) {
      console.log('Amplitude user reset');
    }
  };

  const setUserProperties = (properties) => {
    // Use identify if available
    if (amplitude.Identify) {
      const identify = new amplitude.Identify();
      Object.entries(properties).forEach(([key, value]) => {
        identify.set(key, value);
      });
      amplitude.identify(identify);
    } 
    
    if (options.debug) {
      console.log('Amplitude user properties set:', properties);
    }
  };

  // Track page views
  const trackPageView = (pageName, pageProperties = {}) => {
    trackEvent('Page Viewed', {
      page_name: pageName,
      ...pageProperties
    });
  };

  // Functions specific to your loan application
  const trackChatbotInteraction = (action, details = {}) => {
    trackEvent('Chatbot Interaction', {
      action,
      ...details
    });
  };

  const trackFormSubmission = (formName, success, details = {}) => {
    trackEvent('Form Submission', {
      form_name: formName,
      success,
      ...details
    });
  };

  // Provide all tracking functions to components
  const value = {
    trackEvent,
    setUserId,
    resetUser,
    setUserProperties,
    trackPageView,
    trackChatbotInteraction,
    trackFormSubmission
  };

  return (
    <AmplitudeContext.Provider value={value}>
      {children}
    </AmplitudeContext.Provider>
  );
};

export default AmplitudeProvider;
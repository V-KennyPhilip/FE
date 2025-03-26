// src/utils/ChatbotTracking.js
import { useAmplitude } from '../Context/AmplitudeContext';

/**
 * Hook with chatbot-specific tracking functions
 */
export const useChatbotTracking = () => {
  const { trackEvent, trackChatbotInteraction } = useAmplitude();
  
  /**
   * Track when chatbot is opened or closed
   */
  const trackChatbotToggle = (isOpen) => {
    trackChatbotInteraction('toggle', {
      is_open: isOpen,
      timestamp: new Date().toISOString()
    });
  };
  
  /**
   * Track chatbot menu navigation
   */
  const trackMenuNavigation = (fromPromptId, toPromptId, isBackNavigation = false) => {
    trackChatbotInteraction('menu_navigation', {
      from_prompt_id: fromPromptId,
      to_prompt_id: toPromptId,
      is_back_navigation: isBackNavigation,
      timestamp: new Date().toISOString()
    });
  };
  
  /**
   * Track user selection of an option
   */
  const trackOptionSelected = (optionText, promptId) => {
    trackChatbotInteraction('option_selected', {
      option_text: optionText,
      prompt_id: promptId,
      timestamp: new Date().toISOString()
    });
  };
  
  /**
   * Track when user provides feedback
   */
  const trackFeedbackSubmitted = (feedbackText, rating = null) => {
    trackChatbotInteraction('feedback_submitted', {
      feedback_length: feedbackText?.length || 0,
      has_rating: rating !== null,
      rating: rating,
      timestamp: new Date().toISOString()
    });
  };
  
  /**
   * Track form interactions in the chatbot
   */
  const trackFormInteraction = (formType, action, success = true, details = {}) => {
    trackChatbotInteraction('form_interaction', {
      form_type: formType,
      action: action, // 'open', 'submit', 'cancel'
      success: success,
      ...details,
      timestamp: new Date().toISOString()
    });
  };
  
  /**
   * Track when the chatbot displays information to the user
   */
  const trackInformationDisplayed = (infoType, details = {}) => {
    trackChatbotInteraction('information_displayed', {
      info_type: infoType, // 'loan_details', 'emi_schedule', 'account_info'
      ...details,
      timestamp: new Date().toISOString()
    });
  };
  
  /**
   * Track errors that occur in the chatbot
   */
  const trackChatbotError = (errorType, errorMessage, details = {}) => {
    trackChatbotInteraction('error', {
      error_type: errorType,
      error_message: errorMessage,
      ...details,
      timestamp: new Date().toISOString()
    });
  };
  
  /**
   * Track conversation complete
   */
  const trackConversationComplete = (totalInteractions, duration, details = {}) => {
    trackEvent('Chatbot Conversation Completed', {
      total_interactions: totalInteractions,
      duration_seconds: duration,
      ...details,
      timestamp: new Date().toISOString()
    });
  };
  
  return {
    trackChatbotToggle,
    trackMenuNavigation,
    trackOptionSelected,
    trackFeedbackSubmitted,
    trackFormInteraction,
    trackInformationDisplayed,
    trackChatbotError,
    trackConversationComplete
  };
};

export default useChatbotTracking;
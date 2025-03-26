// src/utils/userSegmentation.js
import { useAmplitude } from '../Context/AmplitudeContext';

/**
 * Hook to segment users based on their behavior and characteristics
 */
export const useUserSegmentation = () => {
  const { setUserProperties } = useAmplitude();
  
  /**
   * Segment user based on loan activity
   * @param {Object} loanData - Information about user's loans
   */
  const segmentByLoanActivity = (loanData = {}) => {
    const {
      totalLoanAmount = 0,
      activeLoans = 0,
      completedLoans = 0,
      defaultedLoans = 0,
      highestLoanAmount = 0,
      averageLoanAmount = 0,
      loanTypes = []
    } = loanData;
    
    // Determine loan activity tier
    let loanActivityTier = 'none';
    if (activeLoans > 0 || completedLoans > 0) {
      if (totalLoanAmount > 1000000) {
        loanActivityTier = 'high';
      } else if (totalLoanAmount > 100000) {
        loanActivityTier = 'medium';
      } else {
        loanActivityTier = 'low';
      }
    }
    
    // Determine primary loan type
    const primaryLoanType = loanTypes.length > 0 
      ? loanTypes.reduce((acc, curr) => acc.count > curr.count ? acc : curr).type 
      : 'unknown';
    
    // Determine risk level
    let riskLevel = 'unknown';
    if (defaultedLoans > 0) {
      riskLevel = 'high';
    } else if (completedLoans > 0) {
      riskLevel = 'low';
    } else if (activeLoans > 0) {
      riskLevel = 'medium';
    }
    
    // Set user properties for segmentation
    setUserProperties({
      loan_activity_tier: loanActivityTier,
      total_loan_amount: totalLoanAmount,
      active_loans: activeLoans,
      completed_loans: completedLoans,
      defaulted_loans: defaultedLoans,
      highest_loan_amount: highestLoanAmount,
      average_loan_amount: averageLoanAmount,
      primary_loan_type: primaryLoanType,
      risk_level: riskLevel
    });
    
    return {
      loanActivityTier,
      primaryLoanType,
      riskLevel
    };
  };
  
  /**
   * Segment user based on chatbot usage
   * @param {Object} chatbotData - Information about user's chatbot interactions
   */
  const segmentByChatbotUsage = (chatbotData = {}) => {
    const {
      totalInteractions = 0,
      lastInteractionDate = null,
      questionsAsked = 0,
      servicesUsed = [],
      feedbackGiven = false,
      feedbackScore = null
    } = chatbotData;
    
    // Determine chatbot engagement level
    let chatbotEngagement = 'none';
    if (totalInteractions > 20) {
      chatbotEngagement = 'high';
    } else if (totalInteractions > 5) {
      chatbotEngagement = 'medium';
    } else if (totalInteractions > 0) {
      chatbotEngagement = 'low';
    }
    
    // Determine days since last interaction
    const daysSinceLastInteraction = lastInteractionDate 
      ? Math.floor((new Date() - new Date(lastInteractionDate)) / (1000 * 60 * 60 * 24))
      : null;
    
    // Determine if user is active
    const isActiveChatbotUser = daysSinceLastInteraction !== null && daysSinceLastInteraction < 30;
    
    // Set user properties for segmentation
    setUserProperties({
      chatbot_engagement: chatbotEngagement,
      total_chatbot_interactions: totalInteractions,
      days_since_last_chatbot_interaction: daysSinceLastInteraction,
      is_active_chatbot_user: isActiveChatbotUser,
      chatbot_questions_asked: questionsAsked,
      chatbot_services_used: servicesUsed,
      has_given_chatbot_feedback: feedbackGiven,
      chatbot_feedback_score: feedbackScore
    });
    
    return {
      chatbotEngagement,
      isActiveChatbotUser,
      daysSinceLastInteraction
    };
  };
  
  /**
   * Segment user based on payment behavior
   * @param {Object} paymentData - Information about user's payment history
   */
  const segmentByPaymentBehavior = (paymentData = {}) => {
    const {
      onTimePayments = 0,
      latePayments = 0,
      missedPayments = 0,
      totalPayments = 0,
      averageDaysLate = 0
    } = paymentData;
    
    // Calculate payment reliability score (0-100)
    const paymentReliabilityScore = totalPayments > 0
      ? Math.round((onTimePayments / totalPayments) * 100)
      : null;
    
    // Determine payment reliability tier
    let paymentReliabilityTier = 'unknown';
    if (paymentReliabilityScore !== null) {
      if (paymentReliabilityScore >= 90) {
        paymentReliabilityTier = 'excellent';
      } else if (paymentReliabilityScore >= 75) {
        paymentReliabilityTier = 'good';
      } else if (paymentReliabilityScore >= 60) {
        paymentReliabilityTier = 'fair';
      } else {
        paymentReliabilityTier = 'poor';
      }
    }
    
    // Set user properties for segmentation
    setUserProperties({
      payment_reliability_score: paymentReliabilityScore,
      payment_reliability_tier: paymentReliabilityTier,
      on_time_payments: onTimePayments,
      late_payments: latePayments,
      missed_payments: missedPayments,
      total_payments: totalPayments,
      average_days_late: averageDaysLate
    });
    
    return {
      paymentReliabilityScore,
      paymentReliabilityTier
    };
  };
  
  return {
    segmentByLoanActivity,
    segmentByChatbotUsage,
    segmentByPaymentBehavior
  };
};

export default useUserSegmentation;
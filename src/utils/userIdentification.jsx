// src/utils/userIdentification.js
import { useAmplitude } from '../Context/AmplitudeContext';
import { useEffect, useContext } from 'react';
import { UserContext } from '../Context/UserContext';

/**
 * Hook to identify user to Amplitude when they log in
 */
export const useUserIdentification = () => {
  const { userDetails } = useContext(UserContext);
  const { setUserId, setUserProperties, resetUser } = useAmplitude();
  
  useEffect(() => {
    // When user details change (login/logout)
    if (userDetails && userDetails.id) {
      // Set the user ID in Amplitude
      setUserId(userDetails.id);
      
      // Set user properties that are useful for segmentation
      setUserProperties({
        email: userDetails.email,
        name: userDetails.name || 'Unknown',
        phone: userDetails.phone || 'Unknown',
        signup_date: userDetails.created_at || new Date().toISOString(),
        last_login: new Date().toISOString(),
        user_type: userDetails.user_type || 'customer',
        is_verified: userDetails.is_verified || false,
        loan_count: userDetails.loans?.length || 0,
        // Add any other relevant user properties from your UserContext
      });
    } else {
      // Reset the user on logout or if no user details
      resetUser();
    }
  }, [userDetails]);
  
  // Return the functions to manually identify or reset user
  return {
    identifyUser: (id, properties = {}) => {
      setUserId(id);
      setUserProperties(properties);
    },
    clearUserIdentity: () => {
      resetUser();
    }
  };
};

/**
 * HOC to wrap components that require user identification
 */
export const withUserIdentification = (Component) => {
  return (props) => {
    useUserIdentification();
    return <Component {...props} />;
  };
};

export default useUserIdentification;
import React, { useState, useEffect } from 'react';
import './ChatbotNotification.css';

const ChatbotNotification = ({ isVisible, onDismiss }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Small delay to make sure the animation works properly
      const timer = setTimeout(() => {
        setShow(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isVisible]);

  const handleDismiss = () => {
    setShow(false);
    // Small delay to allow animation to complete before fully dismissing
    setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 300);
  };

  if (!isVisible && !show) return null;

  return (
    <div className={`chatbot-notification ${show ? 'visible' : ''}`}>
      <div className="notification-content">
        <span>Need loan help? Ask our chatbot!</span>
        <button className="dismiss-button" onClick={handleDismiss}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatbotNotification;
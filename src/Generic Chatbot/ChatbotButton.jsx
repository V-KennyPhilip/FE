import React, { useState, useEffect } from 'react';
import { FloatButton, Alert, ConfigProvider, theme as antTheme } from 'antd';
import { CommentOutlined, CloseOutlined } from '@ant-design/icons';
// Import the actual ChatbotInterface component from the correct path
import ChatbotInterface from './ChatbotInterface'; // Make sure this is the correct path
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

// Define animations
const slideUp = keyframes`
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
  40% {transform: translateY(-5px);}
  60% {transform: translateY(-2px);}
`;

// Styled components
const Container = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const StyledFloatButton = styled(FloatButton)`
  width: 60px !important;
  height: 60px !important;
  opacity: ${props => props.$isLoaded ? 1 : 0};
  pointer-events: ${props => props.$isLoaded ? 'auto' : 'none'};
  transform: ${props => props.$isOpen ? 'translateX(-755px) !important' : 
    props.$isLoaded ? 'translateY(0) !important' : 'translateY(100px) !important'};
  animation: ${props => props.$isLoaded && !props.$wasLoaded ? slideUp : 'none'} 0.5s ease-in-out;
  transition: transform 0.3s ease, opacity 0.3s ease;

  .ant-float-btn-body {
    width: 100% !important;
    height: 100% !important;
  }

  .ant-float-btn-content {
    width: 100% !important;
    height: 100% !important;
  }
  bottom: 22px;
`;

const NotificationWrapper = styled.div`
  position: fixed;
  bottom: 65px;
  right: 20px;
  max-width: 250px;
  z-index: 999;
  animation: ${bounce} 2s ease 1;
`;

const StyledAlert = styled(Alert)`
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background-color: rgb(194, 207, 43) !important;
`;

const ChatbotButton = ({ initialData, isDataLoading, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [wasLoaded, setWasLoaded] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const { defaultAlgorithm } = antTheme;

  // Track when the initial data is loaded from the parent component
  useEffect(() => {
    if (initialData && !isDataLoading) {
      setIsLoaded(true);
      
      // Show notification a moment after the button appears
      const timer = setTimeout(() => {
        setShowNotification(true);
      }, 500);
      
      // Set wasLoaded after animation completes to prevent re-animation
      const animTimer = setTimeout(() => {
        setWasLoaded(true);
      }, 1000);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(animTimer);
      };
    }
  }, [initialData, isDataLoading]);

  const toggleChatbot = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    
    // Hide notification when chatbot is opened
    if (newState) {
      setShowNotification(false);
    }
    
    // Notify parent component about the state change
    if (onToggle) {
      onToggle(newState);
    }
  };

  const dismissNotification = () => {
    setShowNotification(false);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: defaultAlgorithm,
        token: {
          colorPrimary: '#0062E6',
        },
      }}
    >
      <Container>
        {isOpen && <ChatbotInterface 
          onClose={toggleChatbot} 
          initialData={initialData}
        />}
        
        {/* Notification popup */}
        {showNotification && !isOpen && (
          <NotificationWrapper>
            <StyledAlert
              message="Need loan help? Ask our chatbot!"
              type="info"
              showIcon
              closable
              onClose={dismissNotification}
            />
          </NotificationWrapper>
        )}
        
        <StyledFloatButton
          icon={isOpen ? <CloseOutlined /> : <CommentOutlined />}
          type="primary"
          onClick={toggleChatbot}
          disabled={!isLoaded}
          $isOpen={isOpen}
          $isLoaded={isLoaded}
          $wasLoaded={wasLoaded}
        />
      </Container>
    </ConfigProvider>
  );
};

export default ChatbotButton;
import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Button, Divider, Space, Spin, ConfigProvider, theme as antTheme } from 'antd';
import { RollbackOutlined, HomeOutlined, CloseOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useAmplitude } from '../Context/AmplitudeContext';

const { Title, Text } = Typography;
const { defaultAlgorithm } = antTheme;

// Define animations
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const messageAppear = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Styled components
const ChatInterface = styled(Card)`
  position: absolute;
  bottom: 2px;
  right: 0;
  width: 750px;
  height: 530px;
  border-radius: 12px !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${slideIn} 0.3s ease-out forwards;
  padding: 0 !important;

  .ant-card-body {
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

const Header = styled.div`
  background: linear-gradient(135deg, #0062E6, #33AEFF);
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: calc(100% - 120px);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f9f9f9;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccddf5;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #b3cbea;
  }
`;

const MessageBubble = styled.div`
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 18px;
  animation: ${messageAppear} 0.3s ease-out forwards;
  overflow-wrap: break-word;
  position: relative;
  align-self: ${props => props.$isBot ? 'flex-start' : 'flex-end'};
  background: ${props => props.$isBot 
    ? 'linear-gradient(135deg, #E6F4FF, #CCE5FF)'
    : 'linear-gradient(135deg, #0062E6, #33AEFF)'};
  border-bottom-left-radius: ${props => props.$isBot ? '5px' : '18px'};
  border-bottom-right-radius: ${props => props.$isBot ? '18px' : '5px'};
  color: ${props => props.$isBot ? '#0A59B8' : 'white'};
`;

const MessageText = styled.div`
  animation: ${fadeIn} 0.5s;
  line-height: 1.4;
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  justify-content: center;
  padding: 10px;
`;

const OptionsContainer = styled.div`
  padding: 10px 15px;
  border-top: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #E6F4FF, #CCE5FF);
  display: flex;
  flex-direction: column;
  gap: 0px;
  animation: ${slideIn} 0.4s ease-out;
  width: 450px;
  border-radius: 7px;
  border-bottom-left-radius: 5px;
  margin-left: 0;
  align-self: flex-start;
`;

// Fixed OptionButton with stable hover effect (no flickering)
const OptionButton = styled(Button)`
  border-radius: 18px !important;
  background: linear-gradient(135deg, #ffffff, #f0f7ff) !important;
  color: #0062E6 !important;
  border: 1px solid #d1e6ff !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  text-align: left !important;
  height: auto !important;
  padding: 8px 14px !important;
  flex-direction: column;
  width: 100%;
  /* Remove transform and only use box-shadow for hover effect */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
  transition: box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease, color 0.3s ease !important;

  &:hover {
    background: linear-gradient(135deg, #f0f7ff, #e1eeff) !important;
    box-shadow: 0 3px 10px rgba(0, 98, 230, 0.15) !important;
    border-color: #a6c8ff !important;
  }

  &:active {
    box-shadow: 0 1px 5px rgba(0, 98, 230, 0.1) !important;
  }
`;

const ChatbotInterface = ({ onClose, initialData }) => {
  // Get tracking function
  const { trackEvent } = useAmplitude();
  
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const [mainOptions, setMainOptions] = useState([]);
  const [menuHistory, setMenuHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef(null);
  const staticMessageId = useRef(uuidv4());
  const conversationId = useRef(uuidv4());
  const conversationStartTime = useRef(Date.now());
  const interactionCount = useRef(0);
  const interactionPath = useRef([]);
  const isTracked = useRef(false);

  const staticMessage = "Hello! I'm your Loans24 assistant. How can I help you today?";

  // Track chatbot interactions
  const trackChatbotInteraction = (action, details = {}) => {
    // Only track after initialization
    if (!isInitialized) return;
    
    trackEvent('Chatbot Interaction', {
      action,
      conversation_id: conversationId.current,
      interaction_count: interactionCount.current,
      interaction_path: interactionPath.current.join(' → '),
      conversation_duration_seconds: Math.floor((Date.now() - conversationStartTime.current) / 1000),
      ...details,
      timestamp: new Date().toISOString()
    });
  };

  // Handle initial data loading
  useEffect(() => {
    // Initialize local data
    setMessages([{ 
      id: staticMessageId.current, 
      text: staticMessage, 
      isBot: true 
    }]);

    // If initial data is available
    if (initialData && initialData.initialPrompts && initialData.initialPrompts.length > 0) {
      setOptions(initialData.initialPrompts);
      setMainOptions(initialData.initialPrompts);
      setIsInitialized(true);
    } else {
      // Fallback to API call if initialData not provided
      fetchInitialOptions();
    }
  }, [initialData]);

  // Track open/close only after initialization
  useEffect(() => {
    if (isInitialized && !isTracked.current) {
      // Track chatbot open after initialization is complete
      trackChatbotInteraction('open');
      isTracked.current = true;
      
      // Track options loaded
      if (options.length > 0) {
        trackChatbotInteraction('options_loaded', {
          option_count: options.length,
          from_initial_data: initialData && initialData.initialPrompts ? true : false
        });
      }
      
      // Cleanup function to track chatbot close
      return () => {
        const sessionDuration = Math.floor((Date.now() - conversationStartTime.current) / 1000);
        
        trackChatbotInteraction('close', {
          total_interactions: interactionCount.current,
          session_duration_seconds: sessionDuration,
          interaction_path_full: interactionPath.current.join(' → ')
        });
      };
    }
  }, [isInitialized, options]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, options]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchInitialOptions = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('http://localhost:8080/api/chatbot/interaction', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data.initialPrompts) {
        setOptions(data.data.initialPrompts);
        setMainOptions(data.data.initialPrompts);
        setIsInitialized(true);
      } else {
        throw new Error('No initial prompts found in API response');
      }
    } catch (error) {
      console.error('Error fetching initial options:', error);
      
      setMessages(prev => [
        ...prev,
        {
          id: uuidv4(),
          text: 'Sorry, there was an error connecting to the service. Please try again later.',
          isBot: true
        }
      ]);
      
      // Track error only if initialized
      if (isInitialized) {
        trackChatbotInteraction('error', {
          error_type: 'initial_options_error',
          error_message: error.message
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionClick = async (promptId, promptText) => {
    interactionCount.current += 1;
    interactionPath.current.push(promptText);
    
    // Track option selection
    trackChatbotInteraction('option_selected', {
      prompt_id: promptId,
      prompt_text: promptText,
      current_path: interactionPath.current.join(' → ')
    });
    
    // Add the user's message
    const userMessageId = uuidv4();
    setMessages(prev => [
      ...prev,
      { id: userMessageId, text: promptText, isBot: false }
    ]);
    
    setIsLoading(true);
    setOptions([]); // Clear options while loading new data

    try {
      // Make the API call with credentials
      const response = await fetch(`http://localhost:8080/api/chatbot/interaction?prompt_id=${promptId}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data.response) {
        const botMessageId = uuidv4();
        
        // Start with an empty text for typing effect
        setMessages(prev => [
          ...prev,
          { id: botMessageId, text: '', isBot: true }
        ]);
        
        // Simulate typing effect for better UX
        simulateTyping(data.data.response.text, botMessageId);
        
        // Track the bot's response
        trackChatbotInteraction('bot_response_received', {
          prompt_id: promptId,
          response_length: data.data.response.text.length,
          has_next_prompts: data.data.nextPrompts?.length > 0,
          next_prompts_count: data.data.nextPrompts?.length || 0
        });
        
        // If new prompts are provided, save current options to history and update
        if (data.data.nextPrompts && data.data.nextPrompts.length > 0) {
          setMenuHistory(prev => [...prev, options]);
          setOptions(data.data.nextPrompts);
        } else {
          // Even if no new prompts, display the back buttons
          setOptions([]);
        }
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Error fetching response:', error);
      
      // Track error
      trackChatbotInteraction('error', {
        error_type: 'option_selection_error',
        prompt_id: promptId,
        prompt_text: promptText,
        error_message: error.message
      });
      
      setMessages(prev => [
        ...prev,
        {
          id: uuidv4(),
          text: 'Sorry, there was an error. Please try again.',
          isBot: true
        }
      ]);
      
      // Reset options to main menu on error
      setOptions(mainOptions);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate a letter-by-letter typing effect
  const simulateTyping = (fullText, messageId) => {
    setTypingMessage(messageId);
    let currentIndex = 0;
    const typingSpeed = 1; // Milliseconds per character
    
    const interval = setInterval(() => {
      currentIndex++;
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, text: fullText.slice(0, currentIndex) } : msg
        )
      );
      if (currentIndex === fullText.length) {
        clearInterval(interval);
        setTypingMessage(null);
      }
    }, typingSpeed);
  };

  // Go back one menu level
  const handleBack = () => {
    if (menuHistory.length === 0) return;
    
    interactionCount.current += 1;
    interactionPath.current.push('← Back');
    
    // Track back navigation
    trackChatbotInteraction('back_navigation', {
      from_level: menuHistory.length,
      to_level: menuHistory.length - 1
    });
    
    setMenuHistory(prevHistory => {
      if (prevHistory.length > 0) {
        const newHistory = [...prevHistory];
        const previousOptions = newHistory.pop();
        setOptions(previousOptions);
        return newHistory;
      }
      return prevHistory;
    });
  };

  // Return to the main (initial) menu
  const handleBackToMain = () => {
    interactionCount.current += 1;
    interactionPath.current.push('Home (Main Menu)');
    
    // Track main menu navigation
    trackChatbotInteraction('main_menu_navigation', {
      from_level: menuHistory.length
    });
    
    setMenuHistory([]);
    setOptions(mainOptions);
  };

  // Handle closing the chatbot
  const handleClose = () => {
    trackChatbotInteraction('close_button_clicked', {
      total_interactions: interactionCount.current,
      session_duration_seconds: Math.floor((Date.now() - conversationStartTime.current) / 1000),
      interaction_path_full: interactionPath.current.join(' → ')
    });
    
    if (onClose) {
      onClose();
    }
  };

  // If not initialized yet, don't render anything
  if (!isInitialized && initialData === null) {
    return null;
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: defaultAlgorithm,
        token: {
          colorPrimary: '#0062E6',
        },
      }}
    >
      <ChatInterface bordered={false}>
        <Header>
          <Title level={5} style={{ margin: 0, color: '#fff' }}>Loanie</Title>
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={handleClose} 
            style={{ color: '#fff' }}
          />
        </Header>
        
        <MessagesContainer>
          {messages.map(message => (
            <MessageBubble
              key={message.id}
              $isBot={message.isBot}
              $isTyping={typingMessage === message.id}
            >
              <MessageText>
                {message.text.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i !== message.text.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </MessageText>
            </MessageBubble>
          ))}
          
          {isLoading && !typingMessage && (
            <MessageBubble $isBot={true}>
              <TypingIndicator>
                <Spin size="small" />
              </TypingIndicator>
            </MessageBubble>
          )}
          
          <div ref={messagesEndRef} />

          {/* Render the options container (if not loading and not typing) */}
          {!isLoading && !typingMessage && (
            <OptionsContainer>
              <Space direction="vertical" style={{ width: '100%' }}>
                {options.length > 0 &&
                  options.map(option => (
                    <OptionButton
                      key={option.prompt_id || uuidv4()}
                      type="default"
                      onClick={() => handleOptionClick(option.prompt_id, option.text)}
                    >
                      {option.text}
                    </OptionButton>
                  ))
                }
                
                <Divider style={{ margin: '12px 0' }} />
                
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <OptionButton 
                    icon={<RollbackOutlined />} 
                    onClick={menuHistory.length > 0 ? handleBack : undefined}
                    style={{ 
                      cursor: menuHistory.length > 0 ? 'pointer' : 'not-allowed',
                      opacity: menuHistory.length > 0 ? 1 : 0.5
                    }}
                    disabled={menuHistory.length === 0}
                  >
                    Back
                  </OptionButton>
                  <OptionButton 
                    icon={<HomeOutlined />} 
                    onClick={handleBackToMain}
                  >
                    Main Menu
                  </OptionButton>
                </Space>
              </Space>
            </OptionsContainer>
          )}
        </MessagesContainer>
      </ChatInterface>
    </ConfigProvider>
  );
};

export default ChatbotInterface;
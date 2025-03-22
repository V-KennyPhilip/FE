import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Button, Divider, Space, Spin, ConfigProvider, theme as antTheme } from 'antd';
import { RollbackOutlined, HomeOutlined, CloseOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

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

const OptionButton = styled(Button)`
  border-radius: 18px !important;
  background: linear-gradient(135deg, #ffffff, #f0f7ff) !important;
  color: #0062E6 !important;
  border: 1px solid #d1e6ff !important;
  transition: all 0.2s ease !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  text-align: left !important;
  height: auto !important;
  padding: 8px 14px !important;
  flex-direction: column;
  width: 100%;

  &:hover {
    background: linear-gradient(135deg, #f0f7ff, #e1eeff) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 3px 10px rgba(0, 98, 230, 0.1) !important;
  }

  &:active {
    transform: translateY(0) !important;
  }
`;

const ChatbotInterface = ({ onClose, initialData }) => {
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const [mainOptions, setMainOptions] = useState([]);
  const [menuHistory, setMenuHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const staticMessageId = useRef(uuidv4());

  const staticMessage = "Hello! I'm your Loans24 assistant. How can I help you today?";

  useEffect(() => {
    // Initialize with the welcome message
    setMessages([{ 
      id: staticMessageId.current, 
      text: staticMessage, 
      isBot: true 
    }]);

    // If we have preloaded initialData
    if (initialData) {
      // Check if initialPrompts are available in the initialData
      if (initialData.initialPrompts && initialData.initialPrompts.length > 0) {
        setOptions(initialData.initialPrompts);
        setMainOptions(initialData.initialPrompts);
      }
    } else {
      // Fallback to API call if initialData not provided
      fetchInitialOptions();
    }
  }, [initialData]);

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
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && data.data.initialPrompts) {
        setOptions(data.data.initialPrompts);
        setMainOptions(data.data.initialPrompts);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionClick = async (promptId, promptText) => {
    // Add the user's message
    const userMessageId = uuidv4();
    setMessages(prev => [
      ...prev,
      { id: userMessageId, text: promptText, isBot: false }
    ]);
    setIsLoading(true);
    setOptions([]); // Clear options while loading new data

    try {
      const response = await fetch(`http://localhost:8080/api/chatbot/interaction?prompt_id=${promptId}`, {
        credentials: 'include'
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
        simulateTyping(data.data.response.text, botMessageId);
        // If new prompts are provided, save current options to history and update
        if (data.data.nextPrompts && data.data.nextPrompts.length > 0) {
          setMenuHistory(prev => [...prev, options]);
          setOptions(data.data.nextPrompts);
        } else {
          // Even if no new prompts, display the back buttons
          setOptions([]);
        }
      }
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages(prev => [
        ...prev,
        {
          id: uuidv4(),
          text: 'Sorry, there was an error. Please try again.',
          isBot: true
        }
      ]);
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate a letter-by-letter typing effect
  const simulateTyping = (fullText, messageId) => {
    setTypingMessage(messageId);
    let currentIndex = 0;
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
    }, 1); // Adjust the speed (ms per character) as needed
  };

  // Go back one menu level
  const handleBack = () => {
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
    setMenuHistory([]);
    setOptions(mainOptions);
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
      <ChatInterface bordered={false}>
        <Header>
          <Title level={5} style={{ margin: 0, color: '#fff' }}>Loanie</Title>
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={onClose} 
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
                    onClick={handleBack}
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
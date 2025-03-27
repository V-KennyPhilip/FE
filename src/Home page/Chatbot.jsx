import React, { useState, useEffect, useRef, useContext } from 'react';
import { UserContext } from '../Context/UserContext';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './Chatbot.css';
import DynamicForm from './DynamicForm';
import { FaRobot, FaPaperPlane, FaTimes, FaSearch, FaPlus, FaChartBar, FaFileExcel, FaExternalLinkAlt, FaBars, FaComment } from "react-icons/fa";
const API_URL = process.env.BASE_API_URL;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [updateConfig, setUpdateConfig] = useState(null);
  const [currentPromptId, setCurrentPromptId] = useState(0);
  const [conversationId, setConversationId] = useState(uuidv4());
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [selectedBankId, setSelectedBankId] = useState(null);
  const [expandedEmiId, setExpandedEmiId] = useState(null);
  const [initialFetched, setInitialFetched] = useState(false);
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef(null);
  const { userDetails } = useContext(UserContext);
  const userId = userDetails?.id;
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [feedbackSubmitStatus, setFeedbackSubmitStatus] = useState(null);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupLink, setPopupLink] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupTitle, setPopupTitle] = useState('Action Required');

  const [botTyping, setBotTyping] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchInitialResponse = async () => {
    try {
      setLoading(true);
      setBotTyping(true);
      await fetchResponse(0);
    } catch (error) {
      console.error("Error fetching initial response:", error);
      setMessages(prev => [
        ...prev,
        { type: 'bot', text: 'Error fetching initial response.', followups: [], typing: false }
      ]);
    } finally {
      setLoading(false);
      setBotTyping(false);
    }
  };

  useEffect(() => {
    if (userDetails?.id && isOpen && !initialFetched && !isAdvancedMode) {
      fetchInitialResponse();
      setInitialFetched(true);
    }
  }, [userDetails, isOpen, initialFetched, isAdvancedMode]);

  const toggleChatbot = () => {
    if (!userDetails?.id) {
      console.error("User ID is not available");
      return;
    }

    const newIsOpen = !isOpen;

    if (newIsOpen && messages.length === 0) {
      setMessages([
        {
          type: 'bot',
          text: 'Welcome to our Chatbot! How can we help you today?',
          followups: [],
          typing: false
        }
      ]);
    }

    setIsOpen(newIsOpen);
  };

  const fetchResponse = async (promptId, requestData = null, requestType = 'GET', additional = null) => {
    try {
      setLoading(true);
      setBotTyping(true);

      const additionalParam = additional || selectedBankId || selectedLoanId;
      let url = `${API_URL}/api/userbot/query?promptId=${promptId}`;
      if (additionalParam) {
        url += `&additional=${additionalParam}`;
      }

      const config = {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      };

      let response;
      if (requestType === 'GET') {
        response = await axios.get(url, config);
      } else if (requestType === 'PUT') {
        response = await axios.put(url, requestData, config);
      } else if (requestType === 'POST') {
        response = await axios.post(url, requestData, config);
      }

      if (response.data.success) {
        const { data } = response.data;
        let botMessage;

        if (data.extraAction && (data.extraAction.overdue !== undefined ||
          data.extraAction.lastPaid !== undefined ||
          data.extraAction.pending !== undefined)) {
          botMessage = {
            type: 'bot',
            text: data.responseText || "Here's your EMI schedule:",
            emiSchedule: data.extraAction,
            followups: data.followups || [],
            typing: false
          };
        } else {
          botMessage = {
            type: 'bot',
            text: data.responseText,
            followups: data.followups || [],
            extraAction: data.extraAction || null,
            typing: false
          };
        }

        if (promptId !== 0 && currentPromptId !== promptId) {
          setHistory(prev => [...prev, currentPromptId]);
        }

        if (data.followups && data.followups.length > 0) {
          setHistory(prev => [...prev, currentPromptId]);
        }

        setMessages(prev => [...prev, botMessage]);
        setCurrentPromptId(promptId);
        return response.data;
      } else {
        throw new Error(response.data.message || "Server returned an unsuccessful response");
      }
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          text: `Error: ${error.response?.data?.message || error.message || 'Something went wrong'}`,
          followups: [],
          typing: false
        }
      ]);
      throw error;
    } finally {
      setLoading(false);
      setBotTyping(false);
    }
  };

  const handleFollowupClick = async (followup) => {
    setMessages(prev => [...prev, { type: 'user', text: followup.text }]);

    if (followup.httpRequestType === 'PUT' || followup.httpRequestType === 'POST') {
      let actionType = '';
      let pagePath = '';

      const cleanedText = followup.text.replace(/\[.*?\]/g, '').trim();

      if (followup.text.toLowerCase().includes('add bank') ||
        followup.text.toLowerCase().includes('bank account')) {
        actionType = 'adding or managing bank accounts';
        pagePath = '/profile/bank-accounts';
      } else if (followup.text.toLowerCase().includes('update profile') ||
        followup.text.toLowerCase().includes('profile')) {
        actionType = 'updating your profile';
        pagePath = '/profile';
      } else if (followup.text.toLowerCase().includes('payment') ||
        followup.text.toLowerCase().includes('pay')) {
        actionType = 'making a payment';
        pagePath = '/payments';
      } else if (followup.text.toLowerCase().includes('loan') ||
        followup.text.toLowerCase().includes('borrow')) {
        actionType = 'managing your loans';
        pagePath = '/loans';
      } else {
        actionType = cleanedText.toLowerCase();
        pagePath = '/dashboard';
      }

      setPopupTitle('Action Required');
      setPopupMessage(`The functionality for "${actionType}" is available on a different page of our application.`);
      setPopupLink(pagePath);
      setIsPopupOpen(true);

      setMessages(prev => [...prev, {
        type: 'bot',
        text: `To ${actionType}, please visit our ${actionType.split(' ')[0]} page.`,
        followups: [],
        typing: false
      }]);
    } else {
      let additionalParam = null;

      if (selectedLoanId && followup.additionalParam === selectedLoanId) {
        additionalParam = selectedLoanId;
      } else if (selectedBankId && followup.additionalParam === selectedBankId) {
        additionalParam = selectedBankId;
      }

      fetchResponse(followup.promptId, null, 'GET', additionalParam);
    }
  };

  const handleUserInput = async (e) => {
    e.preventDefault();

    if (!userInput.trim()) return;

    // setMessages(prev => [...prev, { type: 'user', text: userInput }]);

    setUserInput('');

    if (isAdvancedMode) {
      await streamResponse(userInput);
    } else {
      setLoading(true);
      setBotTyping(true);
      try {
        let promptId = 0;
        const lowercaseInput = userInput.toLowerCase();

        if (lowercaseInput.includes("loan") || lowercaseInput.includes("borrow")) {
          promptId = 1;
        } else if (lowercaseInput.includes("payment") || lowercaseInput.includes("pay")) {
          promptId = 2;
        } else if (lowercaseInput.includes("account") || lowercaseInput.includes("bank")) {
          promptId = 3;
        } else if (lowercaseInput.includes("emi") || lowercaseInput.includes("schedule")) {
          promptId = 4;
        } else if (lowercaseInput.includes("help") || lowercaseInput.includes("support")) {
          promptId = 5;
        }

        await fetchResponse(promptId);
      } catch (error) {
        console.error('Error processing user input:', error);
        setMessages(prev => [
          ...prev,
          {
            type: 'bot',
            text: "Sorry, I'm having trouble understanding. Please try again later.",
            followups: [],
            typing: false
          }
        ]);
      } finally {
        setLoading(false);
        setBotTyping(false);
      }
    }
  };

  const streamResponse = async (userQuery) => {
    setLoading(true);
    setBotTyping(true);
    let fullResponse = '';

    // Add user message first and keep it
    setMessages(prev => [...prev, { type: 'user', text: userQuery }]);

    // Add bot message after user message
    const botMessageIndex = messages.length + 1;
    setMessages(prev => [...prev, { type: 'bot', text: '', typing: true }]);

    try {
      const response = await fetch(`http://localhost:8080/api/all?userId=2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/event-stream"
        },
        body: JSON.stringify({ userQuery: userQuery })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const processedChunk = chunk
          .split('data:')
          .filter(word => word.trim() !== '')
          .map(word => word.trim())
          .join(' ');

        fullResponse += processedChunk + ' ';

        // Update only the bot message while keeping user message intact
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[botMessageIndex] = {
            type: 'bot',
            text: fullResponse.replace(/\s+/g, ' ').trim(),
            typing: true
          };
          return newMessages;
        });
      }

      // Final update to bot message after streaming is complete
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[botMessageIndex] = {
          type: 'bot',
          text: fullResponse.replace(/\s+/g, ' ').trim(),
          typing: false
        };
        return newMessages;
      });
    } catch (error) {
      console.error("Error streaming response:", error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[botMessageIndex] = {
          type: 'bot',
          text: `Error: ${error.message || "Failed to get response."}`,
          followups: [],
          typing: false
        };
        return newMessages;
      });
    } finally {
      setLoading(false);
      setBotTyping(false);
    }
  };

  const handleButtonClick = handleFollowupClick;

  const toggleEmiDetails = (emiId) => {
    setExpandedEmiId(expandedEmiId === emiId ? null : emiId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, firstChar => firstChar.toUpperCase());
  };

  const handleFormSubmit = async (formData) => {
    if (updateConfig) {
      setLoading(true);
      setBotTyping(true);
      try {
        console.log("Submitting formData:", formData);

        const transformedData = {};
        Object.keys(formData).forEach(key => {
          const camelCaseKey = key.split(' ')
            .map((word, index) =>
              index === 0 ? word.toLowerCase() :
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join('');
          transformedData[camelCaseKey] = formData[key];
        });

        const additionalParam = selectedBankId || selectedLoanId;

        await fetchResponse(
          updateConfig.promptId,
          transformedData,
          updateConfig.method,
          additionalParam
        );
      } catch (error) {
        console.error("Error while processing form submission:", error);
        setMessages(prev => [...prev, {
          type: 'bot',
          text: `Error: ${error.response?.data?.message || error.message || 'Failed to process your request'}`,
          followups: [],
          typing: false
        }]);
      } finally {
        setLoading(false);
        setBotTyping(false);
        setUpdateConfig(null);
      }
    }
  };

  const handleBackClick = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      const lastPromptId = newHistory.pop();
      setHistory(newHistory);

      setSelectedLoanId(null);
      setSelectedBankId(null);

      fetchResponse(lastPromptId);
    }
  };

  const handleMainMenuClick = () => {
    if (messages.length > 0) {
      setHistory([]);
      setSelectedLoanId(null);
      setSelectedBankId(null);
      fetchResponse(0);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim() || !userId) {
      setFeedbackSubmitStatus('Please enter feedback text');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/userbot/feedback`, {
        userId: userId,
        feedback: feedbackText,
        conversationId: conversationId
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setFeedbackText("");
      setFeedbackSubmitStatus('success');

      setTimeout(() => {
        setIsFeedbackOpen(false);
        setFeedbackSubmitStatus(null);
      }, 1500);

    } catch (error) {
      console.error("Error submitting feedback:", error);
      setFeedbackSubmitStatus('Failed to submit feedback. Please try again later.');
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const renderLoanBoxes = (loans, displayOnly = false) => {
    if (!loans || loans.length === 0) return null;

    console.log("Loan objects:", loans);

    if (displayOnly || (loans.length > 0 && loans[0].hasOwnProperty('status') &&
      !(loans[0].hasOwnProperty('loan_id') || loans[0].hasOwnProperty('id') || loans[0].hasOwnProperty('loanId')))) {
      return (
        <div className="loan-status-grid">
          {loans.map((loan, index) => (
            <div key={index} className="loan-status-box">
              <div className="loan-type">
                {loan.type.split('_').map(word => word.charAt(0) + word.substring(1).toLowerCase()).join(' ')}
              </div>
              <div className={`loan-status ${loan.status.toLowerCase()}`}>
                {loan.status.charAt(0) + loan.status.substring(1).toLowerCase()}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="loan-buttons-grid">
        {loans.map((loan, index) => {
          const loanIdValue = loan.loan_id || loan.id || loan.loanId || loan.user_id || index.toString();

          const loanId = String(loanIdValue);
          const currentSelectedId = String(selectedLoanId);

          console.log(`Loan button ${index}: ID=${loanId}, Type=${loan.type}, Selected=${loanId === currentSelectedId}`);

          const isSelected = loanId === currentSelectedId;

          return (
            <button
              key={`loan-button-${index}-${loanId}`}
              className={`loan-select-button ${isSelected ? 'selected' : ''}`}
              onClick={() => {
                console.log(`Clicking loan button: ${loanId}`);
                setSelectedLoanId(loanId);
              }}
            >
              {loan.type.split('_').map(word => word.charAt(0) + word.substring(1).toLowerCase()).join(' ')}
              {isSelected && (
                <span className="loan-selected-indicator">✓</span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const renderBankButtons = (banks) => {
    if (!banks || banks.length === 0) return null;

    return (
      <div className="loan-buttons-grid">
        {banks.map((bank, index) => {
          const bankId = String(bank.bankId);
          const isSelected = bankId === String(selectedBankId);

          return (
            <button
              key={index}
              className={`loan-select-button ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedBankId(bankId)}
            >
              {bank.bankName}: {bank.accountNumber}
              {isSelected && (
                <span className="loan-selected-indicator">✓</span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const renderFollowupButtons = (followups, isLoanContext, isBankContext) => {
    if (!followups || followups.length === 0) return null;

    if (isLoanContext && !selectedLoanId) {
      return (
        <div className="followup-instructions">
          Please select a loan to continue
        </div>
      );
    }

    if (isBankContext && !selectedBankId) {
      return (
        <div className="followup-instructions">
          Please select a bank account to continue
        </div>
      );
    }

    return (
      <div className="followup-buttons">
        {followups.map((followup, idx) => (
          <button
            key={idx}
            onClick={() => {
              const enhancedFollowup = {
                ...followup,
                additionalParam: isLoanContext
                  ? selectedLoanId
                  : isBankContext
                    ? selectedBankId
                    : null
              };

              handleFollowupClick(enhancedFollowup);
            }}
            className="followup-button"
          >
            {followup.text.replace(/\[.*?\]/g, '')}
          </button>
        ))}
      </div>
    );
  };

  const renderExtraAction = (extraAction) => {
    if (!extraAction) return null;

    if (typeof extraAction !== 'object' || extraAction === null) {
      return <span>{extraAction}</span>;
    }

    return (
      <>
        {Object.entries(extraAction).map(([key, value]) => (
          <div key={key} className="extra-action-item">
            <strong>{formatKey(key)}:</strong> {value}
          </div>
        ))}
      </>
    );
  };

  const renderEmiSchedule = (emiSchedule) => {
    if (!emiSchedule) return null;

    return (
      <div className="emi-schedule-container">
        <div className="emi-category">
          <h4>Overdue EMIs</h4>
          {emiSchedule.overdue && emiSchedule.overdue.length > 0 ? (
            <div className="emi-list">
              {emiSchedule.overdue.map((emi) => (
                <div key={emi.emiId} className="emi-item">
                  <button
                    className="emi-dropdown-button"
                    onClick={() => toggleEmiDetails(emi.emiId)}
                  >
                    Due: {formatDate(emi.dueDate)} {expandedEmiId === emi.emiId ? '▲' : '▼'}
                  </button>

                  {expandedEmiId === emi.emiId && (
                    <div className="emi-details">
                      <div className="emi-detail-item">
                        <span className="detail-label">EMI Amount:</span>
                        <span className="detail-value">₹{emi.emiAmount.toFixed(2)}</span>
                      </div>
                      <div className="emi-detail-item">
                        <span className="detail-label">Status:</span>
                        <span className="detail-value emi-status-overdue">{emi.status}</span>
                      </div>
                      {emi.lateFee > 0 && (
                        <div className="emi-detail-item">
                          <span className="detail-label">Late Fee:</span>
                          <span className="detail-value emi-late-fee">₹{emi.lateFee.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="emi-empty-state">No Overdue EMIs</div>
          )}
        </div>

        <div className="emi-category">
          <h4>Last Paid EMIs</h4>
          {emiSchedule.lastPaid && emiSchedule.lastPaid.length > 0 ? (
            <div className="emi-list">
              {emiSchedule.lastPaid.map((emi) => (
                <div key={emi.emiId} className="emi-item">
                  <button
                    className="emi-dropdown-button paid"
                    onClick={() => toggleEmiDetails(emi.emiId)}
                  >
                    Paid: {formatDate(emi.dueDate)} {expandedEmiId === emi.emiId ? '▲' : '▼'}
                  </button>

                  {expandedEmiId === emi.emiId && (
                    <div className="emi-details">
                      <div className="emi-detail-item">
                        <span className="detail-label">EMI Amount:</span>
                        <span className="detail-value">₹{emi.emiAmount.toFixed(2)}</span>
                      </div>
                      <div className="emi-detail-item">
                        <span className="detail-label">Status:</span>
                        <span className="detail-value emi-status-paid">{emi.status}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="emi-empty-state">No Last Paid EMIs</div>
          )}
        </div>

        <div className="emi-category">
          <h4>Pending EMIs</h4>
          {emiSchedule.pending && emiSchedule.pending.length > 0 ? (
            <div className="emi-list">
              {emiSchedule.pending.map((emi) => (
                <div key={emi.emiId} className="emi-item">
                  <button
                    className="emi-dropdown-button pending"
                    onClick={() => toggleEmiDetails(emi.emiId)}
                  >
                    Due: {formatDate(emi.dueDate)} {expandedEmiId === emi.emiId ? '▲' : '▼'}
                  </button>

                  {expandedEmiId === emi.emiId && (
                    <div className="emi-details">
                      <div className="emi-detail-item">
                        <span className="detail-label">EMI Amount:</span>
                        <span className="detail-value">₹{emi.emiAmount.toFixed(2)}</span>
                      </div>
                      <div className="emi-detail-item">
                        <span className="detail-label">Status:</span>
                        <span className="detail-value emi-status-pending">{emi.status}</span>
                      </div>
                      {emi.lateFee > 0 && (
                        <div className="emi-detail-item">
                          <span className="detail-label">Late Fee:</span>
                          <span className="detail-value emi-late-fee">₹{emi.lateFee.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="emi-empty-state">No Pending EMIs</div>
          )}
        </div>
      </div>
    );
  };

  const toggleAdvancedMode = () => {
    setIsAdvancedMode(!isAdvancedMode);
    setMessages([]);
    setHistory([]);
    setInitialFetched(false);
  };

  return (
    <div className="chatbot-container">
      {userDetails?.id && (
        <button
          className={`chatbot-button ${isOpen ? 'clicked' : ''}`}
          onClick={toggleChatbot}
        >
          <FaRobot size={24} />
        </button>
      )}

      {isOpen && (
        <div className={`chatbot-dialog ${isAdvancedMode ? 'advanced-mode' : ''}`}>
          <div className="chat-header">
            <div className="header-left">
              <button
                className="sidebar-toggle"
                onClick={toggleSidebar}
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                <FaBars />
              </button>
              <div className="chat-title">Loanie By Loans24</div>
            </div>
            <div className="header-right">
              <button
                onClick={toggleAdvancedMode}
                className={`toggle-button ${isAdvancedMode ? 'active' : ''}`}
              >
                {isAdvancedMode ? 'Basic Mode' : 'Advanced Mode'}
              </button>
              <button
                onClick={() => setIsFeedbackOpen(true)}
                className="feedback-button"
                aria-label="Provide feedback"
              >
                <FaComment />
              </button>
              <button
                onClick={toggleChatbot}
                className="close-button"
                aria-label="Close chat"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                <div className="message-content">
                  <div className="message-text">
                    {message.text}
                    {message.type === 'bot' && loading && index === messages.length - 1 && (
                      <div className={`typing-indicator ${botTyping ? 'typing' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    )}
                  </div>
                  {message.emiSchedule && renderEmiSchedule(message.emiSchedule)}

                  {message.extraAction && message.extraAction.bankDetails ? (
                    <>
                      {renderBankButtons(message.extraAction.bankDetails)}
                      {renderFollowupButtons(message.followups, false, true)}
                    </>
                  ) : message.extraAction && message.extraAction.loans ? (
                    <>
                      {renderLoanBoxes(
                        message.extraAction.loans,
                        message.extraAction.loans.length > 0 &&
                        message.extraAction.loans[0].hasOwnProperty('status') &&
                        !message.extraAction.loans[0].hasOwnProperty('loan_id')
                      )}
                      {renderFollowupButtons(message.followups, true, false)}
                    </>
                  ) : (
                    <>
                      {message.extraAction && !message.emiSchedule && (
                        <div className="extra-action">
                          {renderExtraAction(message.extraAction)}
                        </div>
                      )}
                      {renderFollowupButtons(message.followups, false, false)}
                    </>
                  )}
                </div>
              </div>
            ))}

            {!isAdvancedMode && (
              <div className="navigation-buttons">
                <button
                  className={`nav-button back-button ${history.length === 0 ? 'disabled' : ''}`}
                  onClick={handleBackClick}
                  disabled={history.length === 0}
                >
                  ← Back
                </button>
                <button
                  className={`nav-button main-menu-button ${messages.length === 0 ? 'disabled' : ''}`}
                  onClick={handleMainMenuClick}
                  disabled={messages.length === 0}
                >
                  Main Menu
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {isPopupOpen && (
            <div className="action-popup-overlay">
              <div className="action-popup">
                <div className="action-popup-header">
                  <h3>{popupTitle}</h3>
                  <button onClick={() => setIsPopupOpen(false)} className="close-button">
                    <FaTimes />
                  </button>
                </div>
                <div className="action-popup-body">
                  <p>{popupMessage}</p>
                  <a href={popupLink} className="action-link" target="_blank" rel="noopener noreferrer">
                    <FaExternalLinkAlt style={{ marginRight: "8px" }} />
                    Go to page
                  </a>
                </div>
                <div className="action-popup-footer">
                  <button onClick={() => setIsPopupOpen(false)} className="cancel-button">
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          <form className="chatbot-input-container" onSubmit={handleUserInput}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading || (!isAdvancedMode && initialFetched)}
              className="chatbot-input"
            />
            <button
              type="submit"
              disabled={loading || (!isAdvancedMode && initialFetched) || !userInput.trim()}
              className="chatbot-send-button"
            >
              <FaPaperPlane />
            </button>
          </form>

          {updateConfig && (
            <DynamicForm
              config={updateConfig}
              onSubmit={handleFormSubmit}
              onCancel={() => setUpdateConfig(null)}
            />
          )}

          {isFeedbackOpen && (
            <div className="feedback-modal-overlay">
              <div className="feedback-modal">
                <div className="feedback-modal-header">
                  <h3>Share Your Feedback</h3>
                  <button
                    onClick={() => {
                      setIsFeedbackOpen(false);
                      setFeedbackSubmitStatus(null);
                    }}
                    className="close-button"
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="feedback-modal-body">
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Please share your experience or suggestions..."
                    className="feedback-textarea"
                    rows={5}
                    disabled={feedbackSubmitStatus === 'success'}
                  />
                  {feedbackSubmitStatus && (
                    <div className={`feedback-status ${feedbackSubmitStatus === 'success' ? 'success' : 'error'}`}>
                      {feedbackSubmitStatus === 'success' ? 'Thank you for your feedback!' : feedbackSubmitStatus}
                    </div>
                  )}
                </div>
                <div className="feedback-modal-footer">
                  <button
                    onClick={() => {
                      setIsFeedbackOpen(false);
                      setFeedbackSubmitStatus(null);
                    }}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFeedbackSubmit}
                    className="submit-button"
                    disabled={!feedbackText.trim() || !userId || feedbackSubmitStatus === 'success'}
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
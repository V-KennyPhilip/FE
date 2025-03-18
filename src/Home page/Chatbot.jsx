import React, { useState, useEffect, useRef, useContext } from 'react';
import { UserContext } from '../Context/UserContext';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './Chatbot.css';
import DynamicForm from './DynamicForm';
const API_URL =process.env.BASE_API_URL;

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
  const messagesEndRef = useRef(null);
  const { userDetails } = useContext(UserContext);
  const userId = userDetails?.id;

  const fetchInitialResponse = async () => {
    try {
      setLoading(true);
      await fetchResponse(0);
    } catch (error) {
      console.error("Error fetching initial response:", error);
      setMessages(prev => [
        ...prev,
        { type: 'bot', text: 'Error fetching initial response.', followups: [] }
      ]);
    } finally {
      setLoading(false);
    }
  };

// Add an initialFetched flag to your state
const [initialFetched, setInitialFetched] = useState(false);

useEffect(() => {
  // When userDetails and userId become available and chatbot is open, fetch the initial response if not done already.
  if (userDetails?.id && isOpen && !initialFetched) {
    fetchInitialResponse();
    setInitialFetched(true);
  }
}, [userDetails, isOpen, initialFetched]);
  // Modify the toggleChatbot function to check for userId but not call fetchInitialResponse
  const toggleChatbot = () => {
    if (!userDetails?.id) {
      console.error("User ID is not available");
      return;
    }
    
    const newIsOpen = !isOpen;
    
    if (newIsOpen && messages.length === 0) {
      // Just add the welcome message
      setMessages([
        { 
          type: 'bot', 
          text: 'Welcome to our Chatbot! How can we help you today?',
          followups: []
        }
      ]);
      // fetchInitialResponse will be called by the useEffect when isOpen changes
    }
    
    setIsOpen(newIsOpen);
  };

  const fetchResponse = async (promptId, requestData = null, requestType = 'GET', additional = null) => {
    try {
      setLoading(true);
      
      // Determine which additional parameter to use (bankId has priority over loanId)
      const additionalParam = additional || selectedBankId || selectedLoanId;
      
      // Build URL with parameters
      let url = `${API_URL}/api/userbot/query?prompt_id=${promptId}&userId=${userId}`;
      if (additionalParam) {
        url += `&additional=${additionalParam}`;
      }
      
      // Configure request options
      const config = {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      };

      // Make the appropriate request based on request type
      let response;
      if (requestType === 'GET') {
        response = await axios.get(url, config);
      } else if (requestType === 'PUT') {
        response = await axios.put(url, requestData, config);
      } else if (requestType === 'POST') {
        response = await axios.post(url, requestData, config);
      }

      // Process successful response
      if (response.data.success) {
        const { data } = response.data;
        
        // Create message object based on response type
        let botMessage;
        
        // Check if this is an EMI schedule response
        if (data.extraAction && (data.extraAction.overdue !== undefined || 
            data.extraAction.lastPaid !== undefined || 
            data.extraAction.pending !== undefined)) {
          
          // Create a formatted message for EMI schedule
          botMessage = {
            type: 'bot',
            text: data.responseText || "Here's your EMI schedule:",
            emiSchedule: data.extraAction,
            followups: data.followups || []
          };
        } else {
          // Regular message
          botMessage = {
            type: 'bot',
            text: data.responseText,
            followups: data.followups || [],
            extraAction: data.extraAction || null
          };
        }
        
        // Save history for back navigation if followups exist
        // Only add to history if this is not a main menu (promptId = 0) request
        if (promptId !== 0 && currentPromptId !== promptId) {
          setHistory(prev => [...prev, currentPromptId]);
        }

        // Before updating the messages and history,
        // store the followups of the current message as the previous options
        // if (promptId !== 0 && currentPromptId !== promptId) {
        //   const lastMessage = messages[messages.length - 1];
        //   if (lastMessage && lastMessage.followups && lastMessage.followups.length > 0) {
        //     setPreviousOptions(lastMessage.followups);
        //   }
        //   setHistory(prev => [...prev, currentPromptId]);
        // }
        
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
          followups: [] 
        }
      ]);
      throw error;
    } finally {
      setLoading(false);
    }
  };

const handleFollowupClick = async (followup) => {
  // Add user message to show what was selected
  setMessages(prev => [...prev, { type: 'user', text: followup.text }]);
  
  // Check if this requires a form for data input
  if (followup.httpRequestType === 'PUT' || followup.httpRequestType === 'POST') {
    if (followup.fieldsToAdd) {
      // Use the fieldsToAdd directly from the API response
      setUpdateConfig({
        promptId: followup.promptId,
        method: followup.httpRequestType,
        fields: followup.fieldsToAdd
      });
    } else {
      // Fallback to regex extraction for backward compatibility
      const regex = /\[(.*?)\]/;
      const match = followup.text.match(regex);
      
      if (match && match[1]) {
        const fields = match[1].split('/').map(field => field.trim());
        setUpdateConfig({
          promptId: followup.promptId,
          method: followup.httpRequestType,
          fields: fields
        });
      } else {
        // No form needed, proceed with request
        const additionalParam = selectedBankId || selectedLoanId;
        fetchResponse(followup.promptId, null, followup.httpRequestType, additionalParam);
      }
    }
  } else {
    // Simple GET request with optional additional parameter
    const additionalParam = selectedBankId || selectedLoanId;
    fetchResponse(followup.promptId, null, 'GET', additionalParam);
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

  const handleFormSubmit = async (formData) => {
    if (updateConfig) {
      setLoading(true);
      try {
        console.log("Submitting formData:", formData);
  
        // Transform keys to camelCase if they contain spaces
        const transformedData = {};
        Object.keys(formData).forEach(key => {
          // Convert space-separated field names to camelCase (e.g. "Bank Name" to "bankName")
          const camelCaseKey = key.split(' ')
            .map((word, index) => 
              index === 0 ? word.toLowerCase() : 
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join('');
          transformedData[camelCaseKey] = formData[key];
        });
        
        // Get additional parameter (bank ID has priority over loan ID)
        const additionalParam = selectedBankId || selectedLoanId;
        
        // Make the request with transformed data
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
          followups: []
        }]);
      } finally {
        setLoading(false);
        setUpdateConfig(null);
      }
    }
  };

const handleBackClick = () => {
  if (history.length > 0) {
    const newHistory = [...history];
    const lastPromptId = newHistory.pop();
    setHistory(newHistory);
    setMessages(prevMessages => prevMessages.slice(0, -1));

    if (selectedLoanId || selectedBankId) {
      setSelectedLoanId(null);
      setSelectedBankId(null);
    }
    fetchResponse(lastPromptId);
    // setCurrentPromptId(lastPromptId);
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const renderEmiSchedule = (emiSchedule) => {
    if (!emiSchedule) return null;
    
    return (
      <div className="emi-schedule-container">
        {/* Overdue EMIs section */}
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

        {/* Last Paid EMIs section */}
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

        {/* Pending EMIs section */}
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

  // Render loan selection boxes
  const renderLoanBoxes = (loans, displayOnly = false) => {
    if (!loans || loans.length === 0) return null;
    
    // For display-only case (showing loan type and status)
    if (displayOnly || (loans.length > 0 && loans[0].hasOwnProperty('status') && !loans[0].hasOwnProperty('loan_id'))) {
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
    
    // For selectable loan buttons
    return (
      <div className="loan-buttons-grid">
        {loans.map((loan, index) => (
          <button 
            key={index} 
            className={`loan-select-button ${loan.loan_id === selectedLoanId ? 'selected' : ''}`}
            onClick={() => setSelectedLoanId(loan.loan_id)}
          >
            {loan.type.split('_').map(word => word.charAt(0) + word.substring(1).toLowerCase()).join(' ')}
            {loan.loan_id === selectedLoanId && (
              <span className="loan-selected-indicator">✓</span>
            )}
          </button>
        ))}
      </div>
    );
  };

  // Render bank selection buttons
  const renderBankButtons = (banks) => {
    if (!banks || banks.length === 0) return null;
    
    return (
      <div className="loan-buttons-grid">
        {banks.map((bank, index) => (
          <button 
            key={index} 
            className={`loan-select-button ${bank.bankId === selectedBankId ? 'selected' : ''}`}
            onClick={() => setSelectedBankId(bank.bankId)}
          >
            {bank.bankName}: {bank.accountNumber}
            {bank.bankId === selectedBankId && (
              <span className="loan-selected-indicator">✓</span>
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="chatbot-container">
      {/* Chatbot toggle button - only visible when chat is closed */}
      {/* {!isOpen && (
        <button 
          className="chatbot-button"
          onClick={toggleChatbot}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      )} */}

      {/* Chatbot toggle button with animation */}
      {userDetails?.id && (
        <button 
          className={`chatbot-button ${isOpen ? 'clicked' : ''}`}
          onClick={toggleChatbot}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      )}

      {/* Chatbot dialog - only visible when chat is open */}
      {isOpen && (
        <div className="chatbot-dialog">
          <div className="chatbot-header">
            <h3>Chat Support</h3>
            <button className="close-button" onClick={toggleChatbot}>×</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  
                  {/* EMI Schedule Display */}
                  {message.emiSchedule && renderEmiSchedule(message.emiSchedule)}
                  
                  {/* Bank selection buttons */}
                  {message.extraAction && message.extraAction.bankDetails ? (
                    <>
                      {renderBankButtons(message.extraAction.bankDetails)}
                      {message.followups && message.followups.length > 0 && (
                        <div className="followup-buttons">
                          {message.followups.map((followup, idx) => (
                            <button 
                              key={idx} 
                              onClick={() => handleFollowupClick(followup)}
                              className="followup-button"
                            >
                              {followup.text.replace(/\[.*?\]/g, '')}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : message.extraAction && message.extraAction.loans ? (
                    <>
                      {/* Loan selection buttons or display */}
                      {renderLoanBoxes(
                        message.extraAction.loans,
                        message.extraAction.loans.length > 0 && 
                        message.extraAction.loans[0].hasOwnProperty('status') && 
                        !message.extraAction.loans[0].hasOwnProperty('loan_id')
                      )}
                      {message.followups && message.followups.length > 0 && (
                        <div className="followup-buttons">
                          {message.followups.map((followup, idx) => (
                            <button 
                              key={idx} 
                              onClick={() => handleFollowupClick(followup)}
                              className="followup-button"
                            >
                              {followup.text.replace(/\[.*?\]/g, '')}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Render extraAction content for non-loan messages and non-EMI messages */}
                      {message.extraAction && !message.emiSchedule && (
                        <div className="extra-action">
                          {typeof message.extraAction === 'object'
                            ? Object.entries(message.extraAction).map(([key, value]) => (
                                <div key={key} className="extra-action-item">
                                  <strong>{key}:</strong> {value}
                                </div>
                              ))
                            : <span>{message.extraAction}</span>
                          }
                        </div>
                      )}
                      {/* Render followup buttons if available */}
                      {message.followups && message.followups.length > 0 && (
                        <div className="followup-buttons">
                          {message.followups.map((followup, idx) => (
                            <button 
                              key={idx} 
                              onClick={() => handleButtonClick(followup)}
                              className="followup-button"
                            >
                              {followup.text.replace(/\[.*?\]/g, '')}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {loading && (
              <div className="message bot">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            
            {/* Back and Main Menu buttons */}
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
            <div ref={messagesEndRef} />
          </div>
          {updateConfig && (
            <DynamicForm 
              config={updateConfig} 
              onSubmit={handleFormSubmit} 
              onCancel={() => setUpdateConfig(null)} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
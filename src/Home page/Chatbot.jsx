// Chatbot.jsx
// import React, { useState, useEffect, useRef, useContext } from 'react';
// import { UserContext } from '../Context/UserContext';
// import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';
// import './Chatbot.css';
// import DynamicForm from './DynamicForm';
// import { FaRobot, FaPaperPlane, FaTimes, FaSearch, FaPlus, FaChartBar, FaFileExcel, FaBars, FaComment } from "react-icons/fa";
// const API_URL = process.env.BASE_API_URL;

// const Chatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [history, setHistory] = useState([]);
//   const [updateConfig, setUpdateConfig] = useState(null);
//   const [currentPromptId, setCurrentPromptId] = useState(0);
//   const [conversationId, setConversationId] = useState(uuidv4());
//   const [selectedLoanId, setSelectedLoanId] = useState(null);
//   const [selectedBankId, setSelectedBankId] = useState(null);
//   const [expandedEmiId, setExpandedEmiId] = useState(null);
//   const [initialFetched, setInitialFetched] = useState(false);
//   const messagesEndRef = useRef(null);
//   const { userDetails } = useContext(UserContext);
//   const userId = userDetails?.id;
//   const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
//   const [feedbackText, setFeedbackText] = useState("");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
//   const [feedbackSubmitStatus, setFeedbackSubmitStatus] = useState(null);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const fetchInitialResponse = async () => {
//     try {
//       setLoading(true);
//       await fetchResponse(0);
//     } catch (error) {
//       console.error("Error fetching initial response:", error);
//       setMessages(prev => [
//         ...prev,
//         { type: 'bot', text: 'Error fetching initial response.', followups: [] }
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     // When userDetails and userId become available and chatbot is open, fetch the initial response if not done already.
//     if (userDetails?.id && isOpen && !initialFetched) {
//       fetchInitialResponse();
//       setInitialFetched(true);
//     }
//   }, [userDetails, isOpen, initialFetched]);

//   // Modify the toggleChatbot function to check for userId but not call fetchInitialResponse
//   const toggleChatbot = () => {
//     if (!userDetails?.id) {
//       console.error("User ID is not available");
//       return;
//     }
    
//     const newIsOpen = !isOpen;
    
//     if (newIsOpen && messages.length === 0) {
//       // Just add the welcome message
//       setMessages([
//         { 
//           type: 'bot', 
//           text: 'Welcome to our Chatbot! How can we help you today?',
//           followups: []
//         }
//       ]);
//       // fetchInitialResponse will be called by the useEffect when isOpen changes
//     }
    
//     setIsOpen(newIsOpen);
//   };

//   const fetchResponse = async (promptId, requestData = null, requestType = 'GET', additional = null) => {
//     try {
//       setLoading(true);
      
//       const additionalParam = additional || selectedBankId || selectedLoanId;
//       let url = `${API_URL}/api/userbot/query?prompt_id=${promptId}`;
//       if (additionalParam) {
//         url += `&additional=${additionalParam}`;
//       }
      
//       // Configure request options
//       const config = {
//         withCredentials: true,
//         headers: { 'Content-Type': 'application/json' }
//       };

//       // Make the appropriate request based on request type
//       let response;
//       if (requestType === 'GET') {
//         response = await axios.get(url, config);
//       } else if (requestType === 'PUT') {
//         response = await axios.put(url, requestData, config);
//       } else if (requestType === 'POST') {
//         response = await axios.post(url, requestData, config);
//       }

//       // Process successful response
//       if (response.data.success) {
//         const { data } = response.data;
//         let botMessage;
        
//         if (data.extraAction && (data.extraAction.overdue !== undefined || 
//             data.extraAction.lastPaid !== undefined || 
//             data.extraAction.pending !== undefined)) {
          
//           // Create a formatted message for EMI schedule
//           botMessage = {
//             type: 'bot',
//             text: data.responseText || "Here's your EMI schedule:",
//             emiSchedule: data.extraAction,
//             followups: data.followups || []
//           };
//         } else {
//           // Regular message
//           botMessage = {
//             type: 'bot',
//             text: data.responseText,
//             followups: data.followups || [],
//             extraAction: data.extraAction || null
//           };
//         }
        
//         // Save history for back navigation if followups exist
//         // Only add to history if this is not a main menu (promptId = 0) request
//         if (promptId !== 0 && currentPromptId !== promptId) {
//           setHistory(prev => [...prev, currentPromptId]);
//         }

//         // Only add to history if the response has follow-ups
//         if (data.followups && data.followups.length > 0) {
//           setHistory(prev => [...prev, currentPromptId]);
//         }
        
//         setMessages(prev => [...prev, botMessage]);
//         setCurrentPromptId(promptId);
//         return response.data;
//       } else {
//         throw new Error(response.data.message || "Server returned an unsuccessful response");
//       }
//     } catch (error) {
//       console.error('Error fetching response:', error);
//       setMessages(prev => [
//         ...prev,
//         { 
//           type: 'bot', 
//           text: `Error: ${error.response?.data?.message || error.message || 'Something went wrong'}`,
//           followups: [] 
//         }
//       ]);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFollowupClick = async (followup) => {
//     // Add user message to show what was selected
//     setMessages(prev => [...prev, { type: 'user', text: followup.text }]);
    
//     // Check if this requires a form for data input
//     if (followup.httpRequestType === 'PUT' || followup.httpRequestType === 'POST') {
//       if (followup.fieldsToAdd) {
//         // Use the fieldsToAdd directly from the API response
//         setUpdateConfig({
//           promptId: followup.promptId,
//           method: followup.httpRequestType,
//           fields: followup.fieldsToAdd
//         });
//       } else {
//         // Fallback to regex extraction for backward compatibility
//         // Update the code that handles the regex extraction and form configuration
//           const regex = /\[(.*?)\]/;
//           const match = followup.text.match(regex);

//           if (match && match[1]) {
//             const fieldsText = match[1];
//             const fields = [];
            
//             // Check if Bank Account Type is mentioned
//             if (fieldsText.includes("Bank Account Type")) {
//               // Add the accountType as an object with predefined options
//               fields.push({ accountType: ["SAVINGS", "CURRENT"] });
//             }
            
//             // Process other fields as simple text fields
//             fieldsText.split('/').forEach(field => {
//               field = field.trim();
//               if (field === "Bank Account Type") {
//                 // Already handled above
//               } else if (field === "Account Holder Name") {
//                 fields.push("accountHolderName");
//               } else {
//                 // For any other fields, add them as is
//                 fields.push(field);
//               }
//             });
            
//             setUpdateConfig({
//               promptId: followup.promptId,
//               method: followup.httpRequestType,
//               fields: fields
//             });
//           } else {
//             // No form needed, proceed with request
//             const additionalParam = selectedBankId || selectedLoanId;
//             fetchResponse(followup.promptId, null, followup.httpRequestType, additionalParam);
//           }
//       }
//     } else {
//       // Simple GET request with optional additional parameter
//       const additionalParam = selectedBankId || selectedLoanId;
//       fetchResponse(followup.promptId, null, 'GET', additionalParam);
//     }
//   };

//   const handleButtonClick = handleFollowupClick;

//   const toggleEmiDetails = (emiId) => {
//     setExpandedEmiId(expandedEmiId === emiId ? null : emiId);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '';
    
//     const date = new Date(dateString);
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return date.toLocaleDateString('en-US', options);
//   };

//   // Format a key from camelCase to Title Case
//   const formatKey = (key) => {
//     // Handle camelCase to Title Case conversion
//     return key
//       .replace(/([A-Z])/g, ' $1') // Insert a space before all uppercase letters
//       .replace(/^./, firstChar => firstChar.toUpperCase()); // Capitalize the first letter
//   };

//   const handleFormSubmit = async (formData) => {
//     if (updateConfig) {
//       setLoading(true);
//       try {
//         console.log("Submitting formData:", formData);
  
//         // Transform keys to camelCase if they contain spaces
//         const transformedData = {};
//         Object.keys(formData).forEach(key => {
//           // Convert space-separated field names to camelCase (e.g. "Bank Name" to "bankName")
//           const camelCaseKey = key.split(' ')
//             .map((word, index) => 
//               index === 0 ? word.toLowerCase() : 
//               word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//             )
//             .join('');
//           transformedData[camelCaseKey] = formData[key];
//         });
        
//         // Get additional parameter (bank ID has priority over loan ID)
//         const additionalParam = selectedBankId || selectedLoanId;
        
//         // Make the request with transformed data
//         await fetchResponse(
//           updateConfig.promptId,
//           transformedData,
//           updateConfig.method,
//           additionalParam
//         );
//       } catch (error) {
//         console.error("Error while processing form submission:", error);
//         setMessages(prev => [...prev, {
//           type: 'bot',
//           text: `Error: ${error.response?.data?.message || error.message || 'Failed to process your request'}`,
//           followups: []
//         }]);
//       } finally {
//         setLoading(false);
//         setUpdateConfig(null);
//       }
//     }
//   };

//   const handleBackClick = () => {
//     if (history.length > 0) {
//       const newHistory = [...history];
//       const lastPromptId = newHistory.pop();
//       setHistory(newHistory);
//       // setMessages(prevMessages => prevMessages.slice(0, -1));

//       if (selectedLoanId || selectedBankId) {
//         setSelectedLoanId(null);
//         setSelectedBankId(null);
//       }
//       fetchResponse(lastPromptId);
//     }
//   };

//   const handleMainMenuClick = () => {
//     if (messages.length > 0) {
//       setHistory([]);
//       setSelectedLoanId(null);
//       setSelectedBankId(null);
//       fetchResponse(0);
//     }
//   };


//   // FIXED FEEDBACK SUBMISSION
//   const handleFeedbackSubmit = async () => {
//     if (!feedbackText.trim() || !userId) {
//       setFeedbackSubmitStatus('Please enter feedback text');
//       return;
//     }
    
//     try {
//       // Use the same API_URL from the environment variable
//       await axios.post(`${API_URL}/api/userbot/feedback`, {
//         userId: userId,
//         feedback: feedbackText,
//         conversationId: conversationId
//       }, {
//         withCredentials: true,
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
      
//       // Reset and close form after submission
//       setFeedbackText("");
//       setFeedbackSubmitStatus('success');
      
//       // Close the feedback modal after a brief delay
//       setTimeout(() => {
//         setIsFeedbackOpen(false);
//         setFeedbackSubmitStatus(null);
//       }, 1500);
      
//     } catch (error) {
//       console.error("Error submitting feedback:", error);
//       setFeedbackSubmitStatus('Failed to submit feedback. Please try again later.');
//     }
//   };

//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages]);

//   // Render loan selection boxes
//   const renderLoanBoxes = (loans, displayOnly = false) => {
//     if (!loans || loans.length === 0) return null;
    
//     // For display-only case (showing loan type and status)
//     if (displayOnly || (loans.length > 0 && loans[0].hasOwnProperty('status') && !loans[0].hasOwnProperty('loan_id'))) {
//       return (
//         <div className="loan-status-grid">
//           {loans.map((loan, index) => (
//             <div key={index} className="loan-status-box">
//               <div className="loan-type">
//                 {loan.type.split('_').map(word => word.charAt(0) + word.substring(1).toLowerCase()).join(' ')}
//               </div>
//               <div className={`loan-status ${loan.status.toLowerCase()}`}>
//                 {loan.status.charAt(0) + loan.status.substring(1).toLowerCase()}
//               </div>
//             </div>
//           ))}
//         </div>
//       );
//     }
    
//     // For selectable loan buttons
//     return (
//       <div className="loan-buttons-grid">
//         {loans.map((loan, index) => (
//           <button 
//             key={index} 
//             className={`loan-select-button ${loan.loan_id === selectedLoanId ? 'selected' : ''}`}
//             onClick={() => setSelectedLoanId(loan.loan_id)}
//           >
//             {loan.type.split('_').map(word => word.charAt(0) + word.substring(1).toLowerCase()).join(' ')}
//             {loan.loan_id === selectedLoanId && (
//               <span className="loan-selected-indicator">✓</span>
//             )}
//           </button>
//         ))}
//       </div>
//     );
//   };

//   // Render bank selection buttons
//   const renderBankButtons = (banks) => {
//     if (!banks || banks.length === 0) return null;
    
//     return (
//       <div className="loan-buttons-grid">
//         {banks.map((bank, index) => (
//           <button 
//             key={index} 
//             className={`loan-select-button ${bank.bankId === selectedBankId ? 'selected' : ''}`}
//             onClick={() => setSelectedBankId(bank.bankId)}
//           >
//             {bank.bankName}: {bank.accountNumber}
//             {bank.bankId === selectedBankId && (
//               <span className="loan-selected-indicator">✓</span>
//             )}
//           </button>
//         ))}
//       </div>
//     );
//   };

//   // Render followup buttons only if a selection has been made
//   const renderFollowupButtons = (followups, isLoanContext, isBankContext) => {
//     if (!followups || followups.length === 0) return null;
    
//     // For loan context, only show if a loan is selected
//     if (isLoanContext && !selectedLoanId) {
//       return (
//         <div className="followup-instructions">
//           Please select a loan to continue
//         </div>
//       );
//     }
    
//     // For bank context, only show if a bank is selected
//     if (isBankContext && !selectedBankId) {
//       return (
//         <div className="followup-instructions">
//           Please select a bank account to continue
//         </div>
//       );
//     }
    
//     // Otherwise, render enabled followup buttons
//     return (
//       <div className="followup-buttons">
//         {followups.map((followup, idx) => (
//           <button 
//             key={idx} 
//             onClick={() => {
//               // Determine which handler to use based on context
//               const handler = isLoanContext || isBankContext 
//                 ? handleFollowupClick 
//                 : handleButtonClick;
              
//               // Add the relevant ID to the followup data
//               const enhancedFollowup = {
//                 ...followup,
//                 additionalParam: isLoanContext 
//                   ? selectedLoanId 
//                   : isBankContext 
//                     ? selectedBankId 
//                     : null
//               };
              
//               handler(enhancedFollowup);
//             }}
//             className="followup-button"
//           >
//             {followup.text.replace(/\[.*?\]/g, '')}
//           </button>
//         ))}
//       </div>
//     );
//   };

//   // Render extra action content
//   const renderExtraAction = (extraAction) => {
//     if (!extraAction) return null;
    
//     // If extraAction is a string or number, return it directly
//     if (typeof extraAction !== 'object' || extraAction === null) {
//       return <span>{extraAction}</span>;
//     }
    
//     // If extraAction is an object, format each key and display with its value
//     return (
//       <>
//         {Object.entries(extraAction).map(([key, value]) => (
//           <div key={key} className="extra-action-item">
//             <strong>{formatKey(key)}:</strong> {value}
//           </div>
//         ))}
//       </>
//     );
//   };

//   const renderEmiSchedule = (emiSchedule) => {
//     if (!emiSchedule) return null;
    
//     return (
//       <div className="emi-schedule-container">
//         {/* Overdue EMIs section */}
//         <div className="emi-category">
//           <h4>Overdue EMIs</h4>
//           {emiSchedule.overdue && emiSchedule.overdue.length > 0 ? (
//             <div className="emi-list">
//               {emiSchedule.overdue.map((emi) => (
//                 <div key={emi.emiId} className="emi-item">
//                   <button 
//                     className="emi-dropdown-button" 
//                     onClick={() => toggleEmiDetails(emi.emiId)}
//                   >
//                     Due: {formatDate(emi.dueDate)} {expandedEmiId === emi.emiId ? '▲' : '▼'}
//                   </button>
                  
//                   {expandedEmiId === emi.emiId && (
//                     <div className="emi-details">
//                       <div className="emi-detail-item">
//                         <span className="detail-label">EMI Amount:</span>
//                         <span className="detail-value">₹{emi.emiAmount.toFixed(2)}</span>
//                       </div>
//                       <div className="emi-detail-item">
//                         <span className="detail-label">Status:</span>
//                         <span className="detail-value emi-status-overdue">{emi.status}</span>
//                       </div>
//                       {emi.lateFee > 0 && (
//                         <div className="emi-detail-item">
//                           <span className="detail-label">Late Fee:</span>
//                           <span className="detail-value emi-late-fee">₹{emi.lateFee.toFixed(2)}</span>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="emi-empty-state">No Overdue EMIs</div>
//           )}
//         </div>

//         {/* Last Paid EMIs section */}
//         <div className="emi-category">
//           <h4>Last Paid EMIs</h4>
//           {emiSchedule.lastPaid && emiSchedule.lastPaid.length > 0 ? (
//             <div className="emi-list">
//               {emiSchedule.lastPaid.map((emi) => (
//                 <div key={emi.emiId} className="emi-item">
//                   <button 
//                     className="emi-dropdown-button paid" 
//                     onClick={() => toggleEmiDetails(emi.emiId)}
//                   >
//                     Paid: {formatDate(emi.dueDate)} {expandedEmiId === emi.emiId ? '▲' : '▼'}
//                   </button>
                  
//                   {expandedEmiId === emi.emiId && (
//                     <div className="emi-details">
//                       <div className="emi-detail-item">
//                         <span className="detail-label">EMI Amount:</span>
//                         <span className="detail-value">₹{emi.emiAmount.toFixed(2)}</span>
//                       </div>
//                       <div className="emi-detail-item">
//                         <span className="detail-label">Status:</span>
//                         <span className="detail-value emi-status-paid">{emi.status}</span>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="emi-empty-state">No Last Paid EMIs</div>
//           )}
//         </div>

//         {/* Pending EMIs section */}
//         <div className="emi-category">
//           <h4>Pending EMIs</h4>
//           {emiSchedule.pending && emiSchedule.pending.length > 0 ? (
//             <div className="emi-list">
//               {emiSchedule.pending.map((emi) => (
//                 <div key={emi.emiId} className="emi-item">
//                   <button 
//                     className="emi-dropdown-button pending" 
//                     onClick={() => toggleEmiDetails(emi.emiId)}
//                   >
//                     Due: {formatDate(emi.dueDate)} {expandedEmiId === emi.emiId ? '▲' : '▼'}
//                   </button>
                  
//                   {expandedEmiId === emi.emiId && (
//                     <div className="emi-details">
//                       <div className="emi-detail-item">
//                         <span className="detail-label">EMI Amount:</span>
//                         <span className="detail-value">₹{emi.emiAmount.toFixed(2)}</span>
//                       </div>
//                       <div className="emi-detail-item">
//                         <span className="detail-label">Status:</span>
//                         <span className="detail-value emi-status-pending">{emi.status}</span>
//                       </div>
//                       {emi.lateFee > 0 && (
//                         <div className="emi-detail-item">
//                           <span className="detail-label">Late Fee:</span>
//                           <span className="detail-value emi-late-fee">₹{emi.lateFee.toFixed(2)}</span>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="emi-empty-state">No Pending EMIs</div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="chatbot-container">
//       {/* Chatbot toggle button with animation */}
//       {userDetails?.id && (
//         <button 
//           className={`chatbot-button ${isOpen ? 'clicked' : ''}`}
//           onClick={toggleChatbot}
//         >
//           <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
//           </svg>
//         </button>
//       )}

//       {/* Chatbot dialog - only visible when chat is open */}
//       {isOpen && (
//         <div className="chatbot-dialog">
//           <div className="chat-header">
//             <div className="header-left">
//               <button 
//                 className="sidebar-toggle"
//                 onClick={toggleSidebar}
//                 aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
//               >
//                 <FaBars />
//               </button>
//               <div className="chat-title">Loanie</div>
//             </div>
//             <div className="header-right">
//               <button 
//                 onClick={() => setIsFeedbackOpen(true)} 
//                 className="feedback-button"
//                 aria-label="Provide feedback"
//               >
//                 <FaComment />
//               </button>
//               <button 
//                 onClick={() => setIsOpen(false)} 
//                 className="close-button"
//                 aria-label="Close chat"
//               >
//                 <FaTimes />
//               </button>
//             </div>
//           </div>

//           <div className="chatbot-messages">
//             {messages.map((message, index) => (
//               <div key={index} className={`message ${message.type}`}>
//                 <div className="message-content">
//                   <div className="message-text">{message.text}</div>
                  
//                   {/* EMI Schedule Display */}
//                   {message.emiSchedule && renderEmiSchedule(message.emiSchedule)}
                  
//                   {/* Bank selection buttons */}
//                   {message.extraAction && message.extraAction.bankDetails ? (
//                     <>
//                       {renderBankButtons(message.extraAction.bankDetails)}
//                       {renderFollowupButtons(message.followups, false, true)}
//                     </>
//                   ) : message.extraAction && message.extraAction.loans ? (
//                     <>
//                       {/* Loan selection buttons or display */}
//                       {renderLoanBoxes(
//                         message.extraAction.loans,
//                         message.extraAction.loans.length > 0 && 
//                         message.extraAction.loans[0].hasOwnProperty('status') && 
//                         !message.extraAction.loans[0].hasOwnProperty('loan_id')
//                       )}
//                       {renderFollowupButtons(message.followups, true, false)}
//                     </>
//                   ) : (
//                     <>
//                       {/* Render extraAction content for non-loan messages and non-EMI messages */}
//                       {message.extraAction && !message.emiSchedule && (
//                         <div className="extra-action">
//                           {renderExtraAction(message.extraAction)}
//                         </div>
//                       )}
//                       {/* Regular followup buttons for standard messages */}
//                       {renderFollowupButtons(message.followups, false, false)}
//                     </>
//                   )}
//                 </div>
//               </div>
//             ))}
            
//             {/* Back and Main Menu buttons */}
//             <div className="navigation-buttons">
//               <button 
//                 className={`nav-button back-button ${history.length === 0 ? 'disabled' : ''}`}
//                 onClick={handleBackClick}
//                 disabled={history.length === 0}
//               >
//                 ← Back
//               </button>
//               <button 
//                 className={`nav-button main-menu-button ${messages.length === 0 ? 'disabled' : ''}`}
//                 onClick={handleMainMenuClick}
//                 disabled={messages.length === 0}
//               >
//                 Main Menu
//               </button>
//             </div>
            
//             {/* Loading indicator */}
//             {loading && (
//               <div className="message bot">
//                 <div className="typing-indicator">
//                   <span></span>
//                   <span></span>
//                   <span></span>
//                 </div>
//               </div>
//             )}
            
//             <div ref={messagesEndRef} />
//           </div>
          
//           {updateConfig && (
//             <DynamicForm 
//               config={updateConfig} 
//               onSubmit={handleFormSubmit} 
//               onCancel={() => setUpdateConfig(null)} 
//             />
//           )}
          
//           {/* Feedback Modal */}
//           {isFeedbackOpen && (
//             <div className="feedback-modal-overlay">
//               <div className="feedback-modal">
//                 <div className="feedback-modal-header">
//                   <h3>Share Your Feedback</h3>
//                   <button 
//                     onClick={() => {
//                       setIsFeedbackOpen(false);
//                       setFeedbackSubmitStatus(null);
//                     }}
//                     className="close-button"
//                   >
//                     <FaTimes />
//                   </button>
//                 </div>
//                 <div className="feedback-modal-body">
//                   <textarea
//                     value={feedbackText}
//                     onChange={(e) => setFeedbackText(e.target.value)}
//                     placeholder="Please share your experience or suggestions..."
//                     className="feedback-textarea"
//                     rows={5}
//                     disabled={feedbackSubmitStatus === 'success'}
//                   />
//                   {feedbackSubmitStatus && (
//                     <div className={`feedback-status ${feedbackSubmitStatus === 'success' ? 'success' : 'error'}`}>
//                       {feedbackSubmitStatus === 'success' ? 'Thank you for your feedback!' : feedbackSubmitStatus}
//                     </div>
//                   )}
//                 </div>
//                 <div className="feedback-modal-footer">
//                   <button 
//                     onClick={() => {
//                       setIsFeedbackOpen(false);
//                       setFeedbackSubmitStatus(null);
//                     }}
//                     className="cancel-button"
//                   >
//                     Cancel
//                   </button>
//                   <button 
//                     onClick={handleFeedbackSubmit}
//                     className="submit-button"
//                     disabled={!feedbackText.trim() || !userId || feedbackSubmitStatus === 'success'}
//                   >
//                     Submit Feedback
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chatbot;


import React, { useState, useEffect, useRef, useContext } from 'react';
import { UserContext } from '../Context/UserContext';
import { useAmplitude } from '../Context/AmplitudeContext'; // Import the Amplitude hook
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './Chatbot.css';
import DynamicForm from './DynamicForm';
import { FaRobot, FaPaperPlane, FaTimes, FaSearch, FaPlus, FaChartBar, FaFileExcel, FaBars, FaComment } from "react-icons/fa";
const API_URL = process.env.BASE_API_URL;
const LLAMA_API_URL = "http://localhost:8000/api/all";

const Chatbot = () => {
  // Get Amplitude tracking functions
  const { 
    trackChatbotInteraction, 
    trackFormSubmission 
  } = useAmplitude();

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
  const [userInput, setUserInput] = useState(''); // New state for user text input
  const [chatStarted, setChatStarted] = useState(false); // Track if user has started using the chatbot
  const [insightTimerId, setInsightTimerId] = useState(null); // Timer for periodic insights
  const [suggestionTimerId, setSuggestionTimerId] = useState(null); // Timer for suggestions
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null); // Reference for the input field
  const { userDetails } = useContext(UserContext);
  const userId = userDetails?.id;
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [feedbackSubmitStatus, setFeedbackSubmitStatus] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    // Track sidebar toggle
    trackChatbotInteraction('toggle_sidebar', {
      is_open: !isSidebarOpen,
      conversation_id: conversationId
    });
  };

  const fetchInitialResponse = async () => {
    try {
      setLoading(true);
      await fetchResponse(0);
      
      // Start tracking only after initial response is shown
      setChatStarted(true);
      
      // Track initial conversation start
      trackChatbotInteraction('conversation_started', {
        conversation_id: conversationId
      });
      
      // Set up timers for insights and suggestions after chatbot is started
      setupPeriodicInsights();
      setupSuggestions();
    } catch (error) {
      console.error("Error fetching initial response:", error);
      setMessages(prev => [
        ...prev,
        { type: 'bot', text: 'Error fetching initial response.', followups: [] }
      ]);
      // Track error
      trackChatbotInteraction('error', {
        error_type: 'initial_response_error',
        error_message: error.message,
        conversation_id: conversationId
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // When userDetails and userId become available and chatbot is open, fetch the initial response if not done already.
    if (userDetails?.id && isOpen && !initialFetched) {
      fetchInitialResponse();
      setInitialFetched(true);
    }
    
    // Focus the input field when chatbot is opened
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [userDetails, isOpen, initialFetched]);

  // Clean up timers when component unmounts or chat is closed
  useEffect(() => {
    return () => {
      if (insightTimerId) clearTimeout(insightTimerId);
      if (suggestionTimerId) clearTimeout(suggestionTimerId);
    };
  }, [insightTimerId, suggestionTimerId]);

  // Set up periodic insights (e.g., every 3 minutes)
  const setupPeriodicInsights = () => {
    if (insightTimerId) clearTimeout(insightTimerId);
    
    const timer = setTimeout(() => {
      if (isOpen && chatStarted) {
        // Generate a random insight based on user profile
        generateInsight();
        // Recursively setup the next insight
        setupPeriodicInsights();
      }
    }, 180000); // 3 minutes
    
    setInsightTimerId(timer);
  };

  // Set up suggestions based on user profile (once after 1 minute)
  const setupSuggestions = () => {
    if (suggestionTimerId) clearTimeout(suggestionTimerId);
    
    const timer = setTimeout(() => {
      if (isOpen && chatStarted) {
        // Generate suggestions based on user profile
        generateSuggestion();
      }
    }, 60000); // 1 minute
    
    setSuggestionTimerId(timer);
  };

  // Generate an insight based on user data
  const generateInsight = () => {
    // Example insights - in a real app, these would be generated based on user data
    const insights = [
      "Based on your payment history, you're in the top 20% of on-time payers!",
      "Your credit utilization has improved by 15% over the last 3 months.",
      "You might save ₹5,000 annually by consolidating your loans.",
      "Your current EMI payments account for 32% of your monthly income."
    ];
    
    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
    
    // Add the insight as a bot message
    setMessages(prev => [
      ...prev,
      { 
        type: 'bot', 
        text: `📊 Insight: ${randomInsight}`,
        insightType: 'periodic',
        followups: [] 
      }
    ]);
    
    // Track insight shown
    trackChatbotInteraction('insight_shown', {
      insight_text: randomInsight,
      conversation_id: conversationId
    });
  };

  // Generate suggestions based on user profile
  const generateSuggestion = () => {
    // Example suggestions - would be personalized in a real app
    const suggestions = [
      "Based on your profile, you might be eligible for a lower interest rate on your home loan. Would you like to explore refinancing options?",
      "We noticed you have multiple small loans. Consolidating them could simplify your finances and potentially reduce your interest rates.",
      "Your credit score qualifies you for our premium credit card with 2% cashback on all purchases."
    ];
    
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    
    // Add the suggestion as a bot message with followup buttons
    setMessages(prev => [
      ...prev,
      { 
        type: 'bot', 
        text: `💡 Suggestion: ${randomSuggestion}`,
        suggestionType: 'profile-based',
        followups: [
          { 
            text: "Tell me more", 
            promptId: 20, // Use a specific promptId for suggestion follow-ups
            httpRequestType: 'GET'
          },
          {
            text: "No thanks",
            promptId: currentPromptId, // Stay on current prompt
            httpRequestType: 'GET'
          }
        ] 
      }
    ]);
    
    // Track suggestion shown
    trackChatbotInteraction('suggestion_shown', {
      suggestion_text: randomSuggestion,
      conversation_id: conversationId
    });
  };

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
    
    // If chat is being closed, clear any active timers
    if (!newIsOpen) {
      if (insightTimerId) clearTimeout(insightTimerId);
      if (suggestionTimerId) clearTimeout(suggestionTimerId);
    }
    
    // Only track if this is a real user interaction (not just mounting)
    if (userDetails?.id) {
      // Track chatbot open/close
      trackChatbotInteraction('toggle_chatbot', {
        is_open: newIsOpen,
        conversation_id: conversationId
      });
    }
  };

  const fetchResponse = async (promptId, requestData = null, requestType = 'GET', additional = null) => {
    try {
      setLoading(true);
      
      // Only track if chat has been started by the user
      if (chatStarted) {
        // Track the request being made
        trackChatbotInteraction('request', {
          prompt_id: promptId,
          request_type: requestType,
          additional_param: additional,
          conversation_id: conversationId
        });
      }
      
      const additionalParam = additional || selectedBankId || selectedLoanId;
      let url = `${API_URL}/api/userbot/query?prompt_id=${promptId}`;
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
        let botMessage;
        
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
          
          // Only track if chat has been started by the user
          if (chatStarted) {
            // Track EMI schedule view
            trackChatbotInteraction('emi_schedule_view', {
              has_overdue: data.extraAction.overdue?.length > 0,
              has_pending: data.extraAction.pending?.length > 0,
              overdue_count: data.extraAction.overdue?.length || 0,
              pending_count: data.extraAction.pending?.length || 0,
              conversation_id: conversationId
            });
          }
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

        // Only add to history if the response has follow-ups
        if (data.followups && data.followups.length > 0) {
          setHistory(prev => [...prev, currentPromptId]);
        }
        
        setMessages(prev => [...prev, botMessage]);
        setCurrentPromptId(promptId);
        
        // Only track if chat has been started by the user
        if (chatStarted) {
          // Track response received
          trackChatbotInteraction('response_received', {
            prompt_id: promptId,
            has_followups: data.followups?.length > 0,
            followup_count: data.followups?.length || 0,
            has_extra_action: !!data.extraAction,
            conversation_id: conversationId
          });
        }
        
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
      
      // Only track if chat has been started by the user
      if (chatStarted) {
        // Track error
        trackChatbotInteraction('error', {
          error_type: 'fetch_response_error',
          prompt_id: promptId,
          error_message: error.response?.data?.message || error.message || 'Something went wrong',
          conversation_id: conversationId
        });
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // New function to handle sending user queries to Llama 3
  const sendUserQueryToLlama = async (query) => {
    if (!query.trim() || !userId) return;
    
    try {
      setLoading(true);
      
      // Add the user's message to the chat
      setMessages(prev => [...prev, { type: 'user', text: query }]);
      
      // Track user query sent
      trackChatbotInteraction('user_query_sent', {
        query_length: query.length,
        conversation_id: conversationId
      });
      
      // Call the Llama 3 API
      const response = await axios.get(`${LLAMA_API_URL}&user_id=${userId}`, {
        params: {
          query: query
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        // Add the AI's response to the chat
        const botResponse = {
          type: 'bot',
          text: response.data.response || "I'm not sure how to respond to that.",
          followups: response.data.followups || [
            { text: "Return to main menu", promptId: 0, httpRequestType: 'GET' }
          ]
        };
        
        setMessages(prev => [...prev, botResponse]);
        
        // Track AI response received
        trackChatbotInteraction('llama_response_received', {
          response_length: botResponse.text.length,
          has_followups: botResponse.followups?.length > 0,
          conversation_id: conversationId
        });
      } else {
        throw new Error("Invalid response from AI service");
      }
    } catch (error) {
      console.error("Error querying Llama 3:", error);
      setMessages(prev => [
        ...prev,
        { 
          type: 'bot', 
          text: `Sorry, I couldn't process your request: ${error.message}`,
          followups: [
            { text: "Return to main menu", promptId: 0, httpRequestType: 'GET' }
          ] 
        }
      ]);
      
      // Track error
      trackChatbotInteraction('llama_query_error', {
        error_message: error.message,
        conversation_id: conversationId
      });
    } finally {
      setLoading(false);
      setUserInput(''); // Clear the input field
    }
  };

  // Handle user input submission
  const handleUserInputSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim()) {
      sendUserQueryToLlama(userInput);
      // Mark chat as started if not already
      if (!chatStarted) {
        setChatStarted(true);
        setupPeriodicInsights();
        setupSuggestions();
      }
    }
  };

  const handleFollowupClick = async (followup) => {
    // Mark chat as started when user clicks a followup
    if (!chatStarted) {
      setChatStarted(true);
      setupPeriodicInsights();
      setupSuggestions();
    }
    
    // Track followup click
    trackChatbotInteraction('followup_click', {
      prompt_id: followup.promptId,
      text: followup.text,
      http_request_type: followup.httpRequestType,
      conversation_id: conversationId
    });
    
    // Add user message to show what was selected
    setMessages(prev => [...prev, { type: 'user', text: followup.text }]);
    
    // Check if this requires a form for data input
    if (followup.httpRequestType === 'PUT' || followup.httpRequestType === 'POST') {
      if (followup.fieldsToAdd) {
        // Track form initiation
        trackChatbotInteraction('form_initiated', {
          prompt_id: followup.promptId,
          fields_count: followup.fieldsToAdd.length,
          conversation_id: conversationId
        });
        
        // Use the fieldsToAdd directly from the API response
        setUpdateConfig({
          promptId: followup.promptId,
          method: followup.httpRequestType,
          fields: followup.fieldsToAdd
        });
      } else {
        // Fallback to regex extraction for backward compatibility
        // Update the code that handles the regex extraction and form configuration
          const regex = /\[(.*?)\]/;
          const match = followup.text.match(regex);

          if (match && match[1]) {
            const fieldsText = match[1];
            const fields = [];
            
            // Check if Bank Account Type is mentioned
            if (fieldsText.includes("Bank Account Type")) {
              // Add the accountType as an object with predefined options
              fields.push({ accountType: ["SAVINGS", "CURRENT"] });
            }
            
            // Process other fields as simple text fields
            fieldsText.split('/').forEach(field => {
              field = field.trim();
              if (field === "Bank Account Type") {
                // Already handled above
              } else if (field === "Account Holder Name") {
                fields.push("accountHolderName");
              } else {
                // For any other fields, add them as is
                fields.push(field);
              }
            });
            
            // Track form initiation with regex extraction
            trackChatbotInteraction('form_initiated_regex', {
              prompt_id: followup.promptId,
              fields_count: fields.length,
              fields: fields,
              conversation_id: conversationId
            });
            
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
    const isExpanding = expandedEmiId !== emiId;
    setExpandedEmiId(expandedEmiId === emiId ? null : emiId);
    
    // Track EMI details toggle
    trackChatbotInteraction('emi_details_toggle', {
      emi_id: emiId,
      action: isExpanding ? 'expand' : 'collapse',
      conversation_id: conversationId
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Format a key from camelCase to Title Case
  const formatKey = (key) => {
    // Handle camelCase to Title Case conversion
    return key
      .replace(/([A-Z])/g, ' $1') // Insert a space before all uppercase letters
      .replace(/^./, firstChar => firstChar.toUpperCase()); // Capitalize the first letter
  };

  const handleFormSubmit = async (formData) => {
    if (updateConfig) {
      setLoading(true);
      try {
        console.log("Submitting formData:", formData);
        
        // Track form submission attempt
        trackFormSubmission('chatbot_form', true, {
          prompt_id: updateConfig.promptId,
          method: updateConfig.method,
          form_data_keys: Object.keys(formData),
          conversation_id: conversationId
        });
  
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
        
        // Track form submission error
        trackFormSubmission('chatbot_form', false, {
          prompt_id: updateConfig.promptId,
          method: updateConfig.method,
          error_message: error.response?.data?.message || error.message || 'Failed to process your request',
          conversation_id: conversationId
        });
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
      
      // Track back navigation
      trackChatbotInteraction('back_navigation', {
        from_prompt_id: currentPromptId,
        to_prompt_id: lastPromptId,
        conversation_id: conversationId
      });

      if (selectedLoanId || selectedBankId) {
        setSelectedLoanId(null);
        setSelectedBankId(null);
      }
      fetchResponse(lastPromptId);
    }
  };

  const handleMainMenuClick = () => {
    if (messages.length > 0) {
      // Track main menu navigation
      trackChatbotInteraction('main_menu_click', {
        from_prompt_id: currentPromptId,
        conversation_id: conversationId
      });
      
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
      // Track feedback submission attempt
      trackChatbotInteraction('feedback_submit', {
        feedback_length: feedbackText.length,
        conversation_id: conversationId
      });
      
      // Use the same API_URL from the environment variable
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
      
      // Reset and close form after submission
      setFeedbackText("");
      setFeedbackSubmitStatus('success');
      
      // Track successful feedback submission
      trackChatbotInteraction('feedback_success', {
        conversation_id: conversationId
      });
      
      // Close the feedback modal after a brief delay
      setTimeout(() => {
        setIsFeedbackOpen(false);
        setFeedbackSubmitStatus(null);
      }, 1500);
      
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setFeedbackSubmitStatus('Failed to submit feedback. Please try again later.');
      
      // Track feedback submission error
      trackChatbotInteraction('feedback_error', {
        error_message: error.message,
        conversation_id: conversationId
      });
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle loan selection with tracking
  const handleLoanSelection = (loanId) => {
    setSelectedLoanId(loanId);
    
    // Track loan selection
    trackChatbotInteraction('loan_selected', {
      loan_id: loanId,
      conversation_id: conversationId
    });
  };

  // Handle bank selection with tracking
  const handleBankSelection = (bankId) => {
    setSelectedBankId(bankId);
    
    // Track bank selection
    trackChatbotInteraction('bank_selected', {
      bank_id: bankId,
      conversation_id: conversationId
    });
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
            onClick={() => handleLoanSelection(loan.loan_id)}
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
            onClick={() => handleBankSelection(bank.bankId)}
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

  // Render followup buttons
  const renderFollowupButtons = (followups, needsLoanSelection = false, needsBankSelection = false) => {
    if (!followups || followups.length === 0) return null;
    
    // If selection is required but not made, disable the buttons
    const isDisabled = (needsLoanSelection && !selectedLoanId) || (needsBankSelection && !selectedBankId);
    
    return (
      <div className="followup-buttons">
        {followups.map((followup, index) => (
          <button
            key={index}
            className={`followup-button ${isDisabled ? 'disabled' : ''}`}
            onClick={() => !isDisabled && handleFollowupClick(followup)}
            disabled={isDisabled}
          >
            {followup.text}
          </button>
        ))}
      </div>
    );
  };

  // Render extra action content
  const renderExtraAction = (extraAction) => {
    if (!extraAction) return null;
    
    // Render structured data as a neat table
    return (
      <div className="extra-action-content">
        {Object.entries(extraAction).map(([key, value]) => {
          // Skip rendering loans and bankDetails which have special rendering
          if (key === 'loans' || key === 'bankDetails' || 
              key === 'overdue' || key === 'pending' || key === 'lastPaid') {
            return null;
          }
          
          return (
            <div key={key} className="extra-action-item">
              <span className="extra-action-key">{formatKey(key)}:</span>
              <span className="extra-action-value">
                {typeof value === 'object' ? JSON.stringify(value) : value}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // Render EMI schedule
  const renderEmiSchedule = (emiSchedule) => {
    if (!emiSchedule) return null;
    
    return (
      <div className="emi-schedule">
        {/* Overdue EMIs */}
        {emiSchedule.overdue && emiSchedule.overdue.length > 0 && (
          <div className="emi-section overdue">
            <h4>Overdue EMIs</h4>
            <div className="emi-list">
              {emiSchedule.overdue.map((emi, index) => (
                <div key={index} className="emi-item overdue">
                  <div className="emi-header" onClick={() => toggleEmiDetails(emi.id)}>
                    <div className="emi-date">{formatDate(emi.dueDate)}</div>
                    <div className="emi-amount">₹{emi.amount.toLocaleString()}</div>
                    <div className="emi-toggle">
                      {expandedEmiId === emi.id ? '▼' : '▶'}
                    </div>
                  </div>
                  
                  {expandedEmiId === emi.id && (
                    <div className="emi-details">
                      {Object.entries(emi).map(([key, value]) => {
                        if (key === 'id' || key === 'dueDate' || key === 'amount') return null;
                        return (
                          <div key={key} className="emi-detail-item">
                            <span className="emi-detail-key">{formatKey(key)}:</span>
                            <span className="emi-detail-value">
                              {key.includes('Date') ? formatDate(value) : value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Pending EMIs */}
        {emiSchedule.pending && emiSchedule.pending.length > 0 && (
          <div className="emi-section pending">
            <h4>Upcoming EMIs</h4>
            <div className="emi-list">
              {emiSchedule.pending.map((emi, index) => (
                <div key={index} className="emi-item pending">
                  <div className="emi-header" onClick={() => toggleEmiDetails(emi.id)}>
                    <div className="emi-date">{formatDate(emi.dueDate)}</div>
                    <div className="emi-amount">₹{emi.amount.toLocaleString()}</div>
                    <div className="emi-toggle">
                      {expandedEmiId === emi.id ? '▼' : '▶'}
                    </div>
                  </div>
                  
                  {expandedEmiId === emi.id && (
                    <div className="emi-details">
                      {Object.entries(emi).map(([key, value]) => {
                        if (key === 'id' || key === 'dueDate' || key === 'amount') return null;
                        return (
                          <div key={key} className="emi-detail-item">
                            <span className="emi-detail-key">{formatKey(key)}:</span>
                            <span className="emi-detail-value">
                              {key.includes('Date') ? formatDate(value) : value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Last Paid EMIs */}
        {emiSchedule.lastPaid && (
          <div className="emi-section last-paid">
            <h4>Last Paid EMI</h4>
            <div className="emi-item last-paid">
              <div className="emi-header" onClick={() => toggleEmiDetails('lastPaid')}>
                <div className="emi-date">{formatDate(emiSchedule.lastPaid.dueDate)}</div>
                <div className="emi-amount">₹{emiSchedule.lastPaid.amount.toLocaleString()}</div>
                <div className="emi-toggle">
                  {expandedEmiId === 'lastPaid' ? '▼' : '▶'}
                </div>
              </div>
              
              {expandedEmiId === 'lastPaid' && (
                <div className="emi-details">
                  {Object.entries(emiSchedule.lastPaid).map(([key, value]) => {
                    if (key === 'id' || key === 'dueDate' || key === 'amount') return null;
                    return (
                      <div key={key} className="emi-detail-item">
                        <span className="emi-detail-key">{formatKey(key)}:</span>
                        <span className="emi-detail-value">
                          {key.includes('Date') ? formatDate(value) : value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="chatbot-container">
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
          <div className="chat-header">
            <div className="header-left">
              <button 
                className="sidebar-toggle"
                onClick={toggleSidebar}
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                <FaBars />
              </button>
              <div className="chat-title">Loanie</div>
            </div>
            <div className="header-right">
              <button 
                onClick={() => setIsFeedbackOpen(true)} 
                className="feedback-button"
                aria-label="Provide feedback"
              >
                <FaComment />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
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
                  <div className="message-text">{message.text}</div>
                  
                  {/* EMI Schedule Display */}
                  {message.emiSchedule && renderEmiSchedule(message.emiSchedule)}
                  
                  {/* Bank selection buttons */}
                  {message.extraAction && message.extraAction.bankDetails ? (
                    <>
                      {renderBankButtons(message.extraAction.bankDetails)}
                      {renderFollowupButtons(message.followups, false, true)}
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
                      {renderFollowupButtons(message.followups, true, false)}
                    </>
                  ) : (
                    <>
                      {/* Render extraAction content for non-loan messages and non-EMI messages */}
                      {message.extraAction && !message.emiSchedule && (
                        <div className="extra-action">
                          {renderExtraAction(message.extraAction)}
                        </div>
                      )}
                      {/* Regular followup buttons for standard messages */}
                      {renderFollowupButtons(message.followups, false, false)}
                    </>
                  )}
                </div>
              </div>
            ))}
            
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
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Text input field for user queries */}
          <form onSubmit={handleUserInputSubmit} className="chatbot-input-container">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your question here..."
              className="chatbot-input"
              ref={inputRef}
              disabled={loading}
            />
            <button 
              type="submit" 
              className="send-button"
              disabled={!userInput.trim() || loading}
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
          
          {/* Feedback Modal */}
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
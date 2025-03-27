// // AuthPage.jsx - login and signup
// import React, { useState, useEffect } from 'react';
// import { Mail, Phone, User, Lock } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';

// import exampleLogo from '../assets/Loans24Logo.png';
// import partner1 from '../assets/Aditya-Birla-Finance-Ltd.png';
// import partner2 from '../assets/Poonawaala.png';
// import partner3 from '../assets/Tata_Capital_Logo.png';

// const AuthPage = () => {
//   // Feature carousel data
//   const features = [
//     {
//       title: "Watch all our benefits",
//       description: "Explore a range of benefits for complete peace of mind."
//     },
//     {
//       title: "AI-powered matching logic",
//       description: "Our AI-powered IntelliMatch will find the ideal loan partner for you."
//     },
//     {
//       title: "One stop solution",
//       description: "Compare loan details, EMIs, and interest rates all in one place."
//     }
//   ];

//   const [currentFeature, setCurrentFeature] = useState(0);
//   const [isLogin, setIsLogin] = useState(true);
//   const location = useLocation();

//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     name: '',
//     phone: ''
//   });

//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (location.state && location.state.logoutMessage) {
//       setMessage({ type: 'success', text: location.state.logoutMessage });
//     }
//   }, [location]);

//   // Auto-cycle through features every 3 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentFeature((prev) => (prev + 1) % features.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [features.length]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const [message, setMessage] = useState(null);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true); // Start buffer animation
//     const endpoint = isLogin 
//       ? 'http://localhost:8080/api/login'
//       : 'http://localhost:8080/api/signup';
  
//     try {
//       const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         credentials: 'include',
//         body: JSON.stringify(formData)
//       });
  
//       // Parse the response JSON
//       const data = await response.json();
  
//       if (!response.ok) {
//         // If error, show the error message from the backend
//         setMessage({ type: 'error', text: data.message || 'Authentication failed.' });
//         setIsLoading(false);
//         setTimeout(() => setMessage(null), 3000);
//         return;
//       }

//       // localStorage.setItem('token', data.token);
  
//       // On success, show a success message from the backend
//       // setMessage({ type: 'success', text: data.message || (isLogin ? 'Login successful!' : 'Signup successful!') });
      
//       if (isLogin) {
//         setMessage({ type: 'success', text: data.message || 'Login successful!' });
//         setIsLoading(false);
//         setTimeout(() => {
//           navigate('/home');
//         }, 1000);
//       } else {
//       // Signup branch: show message and switch to login view
//         setMessage({ type: 'success', text: data.message || 'Signup successful! Please log in.' });
//         setFormData({ email: '', password: '', name: '', phone: '' });
//         setIsLoading(false);
//         setTimeout(() => setMessage(null), 3000);
//         // Switch to login layout
//         setIsLogin(true);
//     }

//   } catch (error) {
//       console.error('Error sending request:', error);
//       setMessage({ type: 'error', text: 'An unexpected error occurred.' });
//       setIsLoading(false);
//       setTimeout(() => setMessage(null), 3000);
//     }
//   };
  

//   return (
//     <div className="page-container">
//       {/* Message Box: appears when a message is set */}
//         {message && (
//           <div className={`message-box ${message.type}`}>
//             <span>{message.text}</span>
//             <button onClick={() => setMessage(null)} className="dismiss-button">
//                 Dismiss
//             </button>
//           </div>
//         )}
//         {/* Loading Spinner */}
//         {isLoading && (
//           <div className="spinner-container">
//             <div className="spinner"></div>
//           </div>
//         )}
//       {/* LEFT CONTENT */}
//       <div className="left-content">
//         {/* Top Info Section */}
//         <header className="info-header">
//           <img src={exampleLogo} alt="Company Logo" className="company-logo" />
//           <h1 className="company-name">Loans24</h1>
//         </header>

//         {/* Feature Carousel */}
//         <div className="feature-carousel">
//           <div className="feature-card">
//             <h2>{features[currentFeature].title}</h2>
//             <p>{features[currentFeature].description}</p>
//           </div>    
//         </div>

//         {/* IntelliMatch & Partners Section */}
//         <section className="intellimatch-section">
//           <p className="intellimatch-text">
//             Our AI-powered IntelliMatch will find the perfect loan partner, tailored to your needs.
//           </p>
//           <p className="partners-title">10+ LOANS24 partners</p>
//           <div className="partners-logos">
//             <img src={partner1} alt="Partner 1" />
//             <img src={partner2} alt="Partner 2" />
//             <img src={partner3} alt="Partner 3" />
//           </div>
//         </section>
//       </div>

//       {/* RIGHT CONTENT */}
//       <div className="right-content">
//         <div className="auth-container">
//           {/* Auth Toggle */}
//           <div className="auth-toggle">
//             <button
//               className={`auth-toggle-button ${isLogin ? 'active' : 'inactive'}`}
//               onClick={() => setIsLogin(true)}
//             >
//               Login
//             </button>
//             <button
//               className={`auth-toggle-button ${!isLogin ? 'active' : 'inactive'}`}
//               onClick={() => setIsLogin(false)}
//             >
//               Sign Up
//             </button>
//           </div>

//           {/* Auth Form */}
//           <form onSubmit={handleSubmit} className="auth-form">
//             <div className="input-wrapper">
//               <Mail className="icon" size={20} />
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 placeholder="Email Address"
//                 required
//                 className="input-field"
//               />
//             </div>

//             {!isLogin && (
//               <>
//                 <div className="input-wrapper">
//                   <User className="icon" size={20} />
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     placeholder="Full Name"
//                     required
//                     className="input-field"
//                   />
//                 </div>
//                 <div className="input-wrapper">
//                   <Phone className="icon" size={20} />
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     placeholder="Phone Number"
//                     required
//                     className="input-field"
//                   />
//                 </div>
//               </>
//             )}

//             <div className="input-wrapper">
//               <Lock className="icon" size={20} />
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 placeholder="Password"
//                 required
//                 className="input-field"
//               />
//             </div>

//             <button type="submit" className="submit-button">
//               {isLogin ? 'Login' : 'Create Account'}
//             </button>

//             <div className="switch-text">
//               <p>
//                 {isLogin ? "Don't have an account? " : 'Already have an account? '}
//                 <button
//                   type="button"
//                   onClick={() => setIsLogin(!isLogin)}
//                   className="switch-button"
//                 >
//                   {isLogin ? 'Sign Up' : 'Login'}
//                 </button>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Custom CSS */}
//       <style>{`
//         /* PAGE CONTAINER */
//         .page-container {
//           min-height: 100vh;
//           width: 100%;
//           background: linear-gradient(to bottom right, #1e3a8a, #312e81);
//           overflow: hidden;
//           padding: 2rem 1rem;
//           box-sizing: border-box;
//           display: flex;
//           flex-direction: column;
//         }
//         @media (min-width: 768px) {
//           .page-container {
//             flex-direction: row;
//             align-items: stretch;
//             justify-content: space-between;
//           }
//         }
//           .message-box {
//             position: fixed;
//             top: 20px;
//             left: 50%;
//             transform: translateX(-50%);
//             padding: 1rem 2rem;
//             border-radius: 8px;
//             z-index: 1100;
//             animation: slideDown 0.5s ease-out;
//             font-size: 1rem;
//             display: flex;
//             align-items: center;
//             gap: 1rem;
//           }

//           /* Success style */
//           .message-box.success {
//             background-color: #d1fae5;
//             color: #065f46;
//           }

//           /* Error style */
//           .message-box.error {
//             background-color: #fee2e2;
//             color: #991b1b;
//           }
//             .dismiss-button {
//           background: transparent;
//           border: none;
//           color: inherit;
//           font-size: 0.9rem;
//           cursor: pointer;
//           padding: 0.2rem 0.5rem;
//         }

//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translate(-50%, -20px);
//           }
//           to {
//             opacity: 1;
//             transform: translate(-50%, 0);
//           }
//         }
//         /* Spinner CSS for buffer animation */
//         .spinner-container {
//           position: fixed;
//           top: 50%;
//           left: 50%;
//           transform: translate(-50%, -50%);
//           z-index: 1200;
//         }
//         .spinner {
//           border: 4px solid rgba(255, 255, 255, 0.3);
//           border-top: 4px solid #ffffff;
//           border-radius: 50%;
//           width: 40px;
//           height: 40px;
//           animation: spin 1s linear infinite;
//         }
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//           @keyframes slideDown {
//             from {
//               opacity: 0;
//               transform: translate(-50%, -20px);
//             }
//             to {
//               opacity: 1;
//               transform: translate(-50%, 0);
//             }
//           }


//         /* LEFT CONTENT */
//         .left-content {
//           width: 100%;
//           margin-bottom: 2rem;
//         }
//         @media (min-width: 768px) {
//           .left-content {
//             width: 45%;
//             margin-bottom: 0;
//           }
//         }
//         .info-header {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           margin-bottom: 2rem;
//         }
//         .company-logo {
//           width: 80px;
//           height: auto;
//           margin-bottom: 1rem;
//         }
//         .company-name {
//           font-size: 2rem;
//           color: #fff;
//           margin: 0;
//         }

//         /* FEATURE CAROUSEL */
//         .feature-carousel {
//           position: relative;
//           width: 100%;
//           height: 150px; /* Adjust height as needed */
//           margin-bottom: 2rem;
//           overflow: hidden;
//         }
//         .feature-card {
//           width: 100%;
//           height: 100%;
//           background: rgba(255, 255, 255, 0.1);
//           border-radius: 12px;
//           padding: 1rem;
//           box-sizing: border-box;
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           text-align: center;
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//           align-items: center;
//           transition: opacity 0.5s ease-in-out;
//         }
//         .feature-card h2 {
//           color: #fff;
//           margin-bottom: 0.5rem;
//         }
//         .feature-card p {
//           color: #d1d5db;
//         }

//         /* INTELLIMATCH & PARTNERS */
//         .intellimatch-section {
//           text-align: center;
//           margin-bottom: 2rem;
//         }
//         .intellimatch-text {
//           color: #fff;
//           margin-bottom: 1rem;
//           font-size: 1.1rem;
//         }
//         .partners-title {
//           color: #93c5fd;
//           margin-bottom: 1rem;
//           font-weight: bold;
//         }
//         .partners-logos {
//           display: flex;
//           gap: 1rem;
//           justify-content: center;
//           flex-wrap: wrap;
//         }
//         .partners-logos img {
//           height: 40px;
//           width: auto;
//           filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));
//           background: #fff;
//           border-radius: 4px;
//           padding: 0.25rem;
//         }

//         /* RIGHT CONTENT */
//         .right-content {
//           width: 100%;
//         }
//         @media (min-width: 768px) {
//           .right-content {
//             width: 55%;
//             display: flex;
//             flex-direction: column;
//             justify-content: center;
//             align-items: center;
//           }
//         }

//         /* AUTH CONTAINER (Increased size) */
//         .auth-container {
//           width: 100%;
//           max-width: 600px; /* Increased width */
//           background: rgba(255, 255, 255, 0.1);
//           backdrop-filter: blur(10px);
//           border-radius: 12px;
//           box-shadow: 0 10px 15px rgba(0, 0, 0, 0.25);
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           padding: 2.5rem 2rem; /* Increased padding for extra height */
//           margin: 0 auto 2rem;
//         }
//         @media (min-width: 768px) {
//           .auth-container {
//             margin: 0;
//           }
//         }
//         .auth-toggle {
//           display: flex;
//           margin-bottom: 1.5rem;
//           background: rgba(255, 255, 255, 0.1);
//           border-radius: 9999px;
//           padding: 0.25rem;
//         }
//         .auth-toggle-button {
//           flex: 1;
//           padding: 0.5rem;
//           border: none;
//           border-radius: 9999px;
//           cursor: pointer;
//           transition: all 0.3s;
//         }
//         .auth-toggle-button.active {
//           background-color: #2563eb;
//           color: #ffffff;
//         }
//         .auth-toggle-button.inactive {
//           color: #bfdbfe;
//           background: transparent;
//         }
//         .auth-toggle-button.inactive:hover {
//           background-color: rgba(255, 255, 255, 0.1);
//         }
//         .auth-form {
//           display: flex;
//           flex-direction: column;
//           gap: 1rem;
//         }
//         .input-wrapper {
//           position: relative;
//         }
//         .icon {
//           position: absolute;
//           left: 0.75rem;
//           top: 50%;
//           transform: translateY(-50%);
//           color: #60a5fa;
//         }
//         .input-field {
//           width: 100%;
//           padding: 0.5rem 1rem 0.5rem 2.5rem;
//           background: rgba(255, 255, 255, 0.1);
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           border-radius: 8px;
//           color: #ffffff;
//           font-size: 1rem;
//         }
//         .input-field::placeholder {
//           color: #bfdbfe;
//         }
//         .input-field:focus {
//           outline: none;
//           box-shadow: 0 0 0 2px #3b82f6;
//         }
//         .submit-button {
//           width: 100%;
//           padding: 0.75rem;
//           background: linear-gradient(to right, #2563eb, #4f46e5);
//           color: #ffffff;
//           border: none;
//           border-radius: 8px;
//           cursor: pointer;
//           transition: background 0.3s;
//         }
//         .submit-button:hover {
//           background: linear-gradient(to right, #1d4ed8, #3730a3);
//         }
//         .switch-text p {
//           color: #bfdbfe;
//           text-align: center;
//         }
//         .switch-button {
//           background: none;
//           border: none;
//           color: #60a5fa;
//           text-decoration: underline;
//           cursor: pointer;
//         }
//         .switch-button:hover {
//           color: #93c5fd;
//         }
//       `}</style>
//           {/* <Chatbot/> */}
//     </div>
//   );
// };

// export default AuthPage;

// AuthPage.jsx - login and signup with Amplitude tracking
// import React, { useState, useEffect } from 'react';
// import { Mail, Phone, User, Lock } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
// import { useAmplitude } from '../Context/AmplitudeContext'; // Import Amplitude hook

// import exampleLogo from '../assets/Loans24Logo.png';
// import partner1 from '../assets/Aditya-Birla-Finance-Ltd.png';
// import partner2 from '../assets/Poonawaala.png';
// import partner3 from '../assets/Tata_Capital_Logo.png';

// const AuthPage = () => {
//   // Get Amplitude tracking functions
//   const { 
//     trackPageView, 
//     trackEvent, 
//     setUserId, 
//     setUserProperties 
//   } = useAmplitude();
  
//   // Feature carousel data
//   const features = [
//     {
//       title: "Watch all our benefits",
//       description: "Explore a range of benefits for complete peace of mind."
//     },
//     {
//       title: "AI-powered matching logic",
//       description: "Our AI-powered IntelliMatch will find the ideal loan partner for you."
//     },
//     {
//       title: "One stop solution",
//       description: "Compare loan details, EMIs, and interest rates all in one place."
//     }
//   ];

//   const [currentFeature, setCurrentFeature] = useState(0);
//   const [isLogin, setIsLogin] = useState(true);
//   const location = useLocation();

//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     name: '',
//     phone: ''
//   });

//   const [isLoading, setIsLoading] = useState(false);

//   // Track page view when component mounts
//   useEffect(() => {
//     trackPageView('Auth Page', { 
//       auth_mode: isLogin ? 'login' : 'signup',
//       referrer: document.referrer
//     });
//   }, []);

//   // Track auth mode changes
//   useEffect(() => {
//     trackEvent('Auth Mode Changed', {
//       auth_mode: isLogin ? 'login' : 'signup'
//     });
//   }, [isLogin]);

//   useEffect(() => {
//     if (location.state && location.state.logoutMessage) {
//       setMessage({ type: 'success', text: location.state.logoutMessage });
//       trackEvent('Logout Success');
//     }
//   }, [location]);

//   // Track feature carousel changes
//   useEffect(() => {
//     // Track when the user sees a new feature
//     trackEvent('Feature Carousel Changed', {
//       feature_index: currentFeature,
//       feature_title: features[currentFeature].title
//     });
//   }, [currentFeature]);

//   // Auto-cycle through features every 3 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentFeature((prev) => (prev + 1) % features.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [features.length]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Track form field interaction (without capturing sensitive data)
//     if (name !== 'password') {
//       trackEvent('Auth Form Field Interaction', {
//         field_name: name,
//         has_value: value.length > 0,
//         auth_mode: isLogin ? 'login' : 'signup'
//       });
//     }
//   };

//   const [message, setMessage] = useState(null);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
    
//     // Track form submission attempt
//     trackEvent(`${isLogin ? 'Login' : 'Signup'} Attempted`, {
//       has_email: !!formData.email,
//       has_phone: !!formData.phone && formData.phone.length > 0,
//       auth_mode: isLogin ? 'login' : 'signup'
//     });
    
//     const endpoint = isLogin 
//       ? 'http://localhost:8080/api/login'
//       : 'http://localhost:8080/api/signup';
  
//     try {
//       const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         credentials: 'include',
//         body: JSON.stringify(formData)
//       });
  
//       // Parse the response JSON
//       const data = await response.json();
  
//       if (!response.ok) {
//         // If error, show the error message from the backend
//         setMessage({ type: 'error', text: data.message || 'Authentication failed.' });
//         setIsLoading(false);
        
//         // Track authentication failure
//         trackEvent(`${isLogin ? 'Login' : 'Signup'} Failed`, {
//           error_message: data.message || 'Authentication failed.',
//           auth_mode: isLogin ? 'login' : 'signup'
//         });
        
//         setTimeout(() => setMessage(null), 3000);
//         return;
//       }
  
//       if (isLogin) {
//         // Set user ID and properties in Amplitude
//         if (data.user && data.user.id) {
//           setUserId(data.user.id);
          
//           // Set user properties (avoiding sensitive information)
//           setUserProperties({
//             email: formData.email,
//             name: data.user.name || 'Unknown',
//             signup_date: data.user.created_at || new Date().toISOString(),
//             last_login: new Date().toISOString()
//           });
//         }
        
//         setMessage({ type: 'success', text: data.message || 'Login successful!' });
//         setIsLoading(false);
        
//         // Track successful login
//         trackEvent('Login Success', {
//           user_id: data.user?.id
//         });
        
//         setTimeout(() => {
//           navigate('/home');
//         }, 1000);
//       } else {
//         // Signup branch: show message and switch to login view
//         setMessage({ type: 'success', text: data.message || 'Signup successful! Please log in.' });
//         setFormData({ email: '', password: '', name: '', phone: '' });
//         setIsLoading(false);
        
//         // Track successful signup
//         trackEvent('Signup Success', {
//           user_email_domain: formData.email.split('@')[1]
//         });
        
//         setTimeout(() => setMessage(null), 3000);
//         // Switch to login layout
//         setIsLogin(true);
//       }

//     } catch (error) {
//       console.error('Error sending request:', error);
//       setMessage({ type: 'error', text: 'An unexpected error occurred.' });
//       setIsLoading(false);
      
//       // Track error
//       trackEvent(`${isLogin ? 'Login' : 'Signup'} Error`, {
//         error_message: error.message,
//         auth_mode: isLogin ? 'login' : 'signup'
//       });
      
//       setTimeout(() => setMessage(null), 3000);
//     }
//   };
  
//   // Track when user switches between login and signup
//   const handleAuthToggle = () => {
//     trackEvent('Auth Toggle Clicked', {
//       from: isLogin ? 'login' : 'signup',
//       to: isLogin ? 'signup' : 'login'
//     });
    
//     setIsLogin(!isLogin);
//   };

//   return (
//     <div className="page-container">
//       {/* Message Box: appears when a message is set */}
//         {message && (
//           <div className={`message-box ${message.type}`}>
//             <span>{message.text}</span>
//             <button onClick={() => setMessage(null)} className="dismiss-button">
//                 Dismiss
//             </button>
//           </div>
//         )}
//         {/* Loading Spinner */}
//         {isLoading && (
//           <div className="spinner-container">
//             <div className="spinner"></div>
//           </div>
//         )}
//       {/* LEFT CONTENT */}
//       <div className="left-content">
//         {/* Top Info Section */}
//         <header className="info-header">
//           <img src={exampleLogo} alt="Company Logo" className="company-logo" />
//           <h1 className="company-name">Loans24</h1>
//         </header>

//         {/* Feature Carousel */}
//         <div className="feature-carousel">
//           <div className="feature-card">
//             <h2>{features[currentFeature].title}</h2>
//             <p>{features[currentFeature].description}</p>
//           </div>    
//         </div>

//         {/* IntelliMatch & Partners Section */}
//         <section className="intellimatch-section">
//           <p className="intellimatch-text">
//             Our AI-powered IntelliMatch will find the perfect loan partner, tailored to your needs.
//           </p>
//           <p className="partners-title">10+ LOANS24 partners</p>
//           <div className="partners-logos">
//             <img src={partner1} alt="Partner 1" />
//             <img src={partner2} alt="Partner 2" />
//             <img src={partner3} alt="Partner 3" />
//           </div>
//         </section>
//       </div>

//       {/* RIGHT CONTENT */}
//       <div className="right-content">
//         <div className="auth-container">
//           {/* Auth Toggle */}
//           <div className="auth-toggle">
//             <button
//               className={`auth-toggle-button ${isLogin ? 'active' : 'inactive'}`}
//               onClick={() => handleAuthToggle()}
//             >
//               Login
//             </button>
//             <button
//               className={`auth-toggle-button ${!isLogin ? 'active' : 'inactive'}`}
//               onClick={() => handleAuthToggle()}
//             >
//               Sign Up
//             </button>
//           </div>

//           {/* Auth Form */}
//           <form onSubmit={handleSubmit} className="auth-form">
//             <div className="input-wrapper">
//               <Mail className="icon" size={20} />
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 placeholder="Email Address"
//                 required
//                 className="input-field"
//               />
//             </div>

//             {!isLogin && (
//               <>
//                 <div className="input-wrapper">
//                   <User className="icon" size={20} />
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     placeholder="Full Name"
//                     required
//                     className="input-field"
//                   />
//                 </div>
//                 <div className="input-wrapper">
//                   <Phone className="icon" size={20} />
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     placeholder="Phone Number"
//                     required
//                     className="input-field"
//                   />
//                 </div>
//               </>
//             )}

//             <div className="input-wrapper">
//               <Lock className="icon" size={20} />
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 placeholder="Password"
//                 required
//                 className="input-field"
//               />
//             </div>

//             <button 
//               type="submit" 
//               className="submit-button"
//               onClick={() => trackEvent('Submit Button Clicked', {
//                 auth_mode: isLogin ? 'login' : 'signup'
//               })}
//             >
//               {isLogin ? 'Login' : 'Create Account'}
//             </button>

//             <div className="switch-text">
//               <p>
//                 {isLogin ? "Don't have an account? " : 'Already have an account? '}
//                 <button
//                   type="button"
//                   onClick={() => handleAuthToggle()}
//                   className="switch-button"
//                 >
//                   {isLogin ? 'Sign Up' : 'Login'}
//                 </button>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//       {/* Custom CSS */}
// <style>{`
//   /* PAGE CONTAINER */
//   .page-container {
//     min-height: 100vh;
//     width: 100%;
//     background: linear-gradient(to bottom right, #1e3a8a, #312e81);
//     overflow: hidden;
//     padding: 2rem 1rem;
//     box-sizing: border-box;
//     display: flex;
//     flex-direction: column;
//   }
//   @media (min-width: 768px) {
//     .page-container {
//       flex-direction: row;
//       align-items: stretch;
//       justify-content: space-between;
//     }
//   }
//     .message-box {
//       position: fixed;
//       top: 20px;
//       left: 50%;
//       transform: translateX(-50%);
//       padding: 1rem 2rem;
//       border-radius: 8px;
//       z-index: 1100;
//       animation: slideDown 0.5s ease-out;
//       font-size: 1rem;
//       display: flex;
//       align-items: center;
//       gap: 1rem;
//     }

//     /* Success style */
//     .message-box.success {
//       background-color: #d1fae5;
//       color: #065f46;
//     }

//     /* Error style */
//     .message-box.error {
//       background-color: #fee2e2;
//       color: #991b1b;
//     }
//       .dismiss-button {
//     background: transparent;
//     border: none;
//     color: inherit;
//     font-size: 0.9rem;
//     cursor: pointer;
//     padding: 0.2rem 0.5rem;
//   }

//   @keyframes slideDown {
//     from {
//       opacity: 0;
//       transform: translate(-50%, -20px);
//     }
//     to {
//       opacity: 1;
//       transform: translate(-50%, 0);
//     }
//   }
//   /* Spinner CSS for buffer animation */
//   .spinner-container {
//     position: fixed;
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//     z-index: 1200;
//   }
//   .spinner {
//     border: 4px solid rgba(255, 255, 255, 0.3);
//     border-top: 4px solid #ffffff;
//     border-radius: 50%;
//     width: 40px;
//     height: 40px;
//     animation: spin 1s linear infinite;
//   }
//   @keyframes spin {
//     0% { transform: rotate(0deg); }
//     100% { transform: rotate(360deg); }
//   }

//     @keyframes slideDown {
//       from {
//         opacity: 0;
//         transform: translate(-50%, -20px);
//       }
//       to {
//         opacity: 1;
//         transform: translate(-50%, 0);
//       }
//     }


//   /* LEFT CONTENT */
//   .left-content {
//     width: 100%;
//     margin-bottom: 2rem;
//   }
//   @media (min-width: 768px) {
//     .left-content {
//       width: 45%;
//       margin-bottom: 0;
//     }
//   }
//   .info-header {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     margin-bottom: 2rem;
//   }
//   .company-logo {
//     width: 80px;
//     height: auto;
//     margin-bottom: 1rem;
//   }
//   .company-name {
//     font-size: 2rem;
//     color: #fff;
//     margin: 0;
//   }

//   /* FEATURE CAROUSEL */
//   .feature-carousel {
//     position: relative;
//     width: 100%;
//     height: 150px; /* Adjust height as needed */
//     margin-bottom: 2rem;
//     overflow: hidden;
//   }
//   .feature-card {
//     width: 100%;
//     height: 100%;
//     background: rgba(255, 255, 255, 0.1);
//     border-radius: 12px;
//     padding: 1rem;
//     box-sizing: border-box;
//     border: 1px solid rgba(255, 255, 255, 0.2);
//     text-align: center;
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;
//     transition: opacity 0.5s ease-in-out;
//   }
//   .feature-card h2 {
//     color: #fff;
//     margin-bottom: 0.5rem;
//   }
//   .feature-card p {
//     color: #d1d5db;
//   }

//   /* INTELLIMATCH & PARTNERS */
//   .intellimatch-section {
//     text-align: center;
//     margin-bottom: 2rem;
//   }
//   .intellimatch-text {
//     color: #fff;
//     margin-bottom: 1rem;
//     font-size: 1.1rem;
//   }
//   .partners-title {
//     color: #93c5fd;
//     margin-bottom: 1rem;
//     font-weight: bold;
//   }
//   .partners-logos {
//     display: flex;
//     gap: 1rem;
//     justify-content: center;
//     flex-wrap: wrap;
//   }
//   .partners-logos img {
//     height: 40px;
//     width: auto;
//     filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));
//     background: #fff;
//     border-radius: 4px;
//     padding: 0.25rem;
//   }

//   /* RIGHT CONTENT */
//   .right-content {
//     width: 100%;
//   }
//   @media (min-width: 768px) {
//     .right-content {
//       width: 55%;
//       display: flex;
//       flex-direction: column;
//       justify-content: center;
//       align-items: center;
//     }
//   }

//   /* AUTH CONTAINER (Increased size) */
//   .auth-container {
//     width: 100%;
//     max-width: 600px; /* Increased width */
//     background: rgba(255, 255, 255, 0.1);
//     backdrop-filter: blur(10px);
//     border-radius: 12px;
//     box-shadow: 0 10px 15px rgba(0, 0, 0, 0.25);
//     border: 1px solid rgba(255, 255, 255, 0.2);
//     padding: 2.5rem 2rem; /* Increased padding for extra height */
//     margin: 0 auto 2rem;
//   }
//   @media (min-width: 768px) {
//     .auth-container {
//       margin: 0;
//     }
//   }
//   .auth-toggle {
//     display: flex;
//     margin-bottom: 1.5rem;
//     background: rgba(255, 255, 255, 0.1);
//     border-radius: 9999px;
//     padding: 0.25rem;
//   }
//   .auth-toggle-button {
//     flex: 1;
//     padding: 0.5rem;
//     border: none;
//     border-radius: 9999px;
//     cursor: pointer;
//     transition: all 0.3s;
//   }
//   .auth-toggle-button.active {
//     background-color: #2563eb;
//     color: #ffffff;
//   }
//   .auth-toggle-button.inactive {
//     color: #bfdbfe;
//     background: transparent;
//   }
//   .auth-toggle-button.inactive:hover {
//     background-color: rgba(255, 255, 255, 0.1);
//   }
//   .auth-form {
//     display: flex;
//     flex-direction: column;
//     gap: 1rem;
//   }
//   .input-wrapper {
//     position: relative;
//   }
//   .icon {
//     position: absolute;
//     left: 0.75rem;
//     top: 50%;
//     transform: translateY(-50%);
//     color: #60a5fa;
//   }
//   .input-field {
//     width: 100%;
//     padding: 0.5rem 1rem 0.5rem 2.5rem;
//     background: rgba(255, 255, 255, 0.1);
//     border: 1px solid rgba(255, 255, 255, 0.2);
//     border-radius: 8px;
//     color: #ffffff;
//     font-size: 1rem;
//   }
//   .input-field::placeholder {
//     color: #bfdbfe;
//   }
//   .input-field:focus {
//     outline: none;
//     box-shadow: 0 0 0 2px #3b82f6;
//   }
//   .submit-button {
//     width: 100%;
//     padding: 0.75rem;
//     background: linear-gradient(to right, #2563eb, #4f46e5);
//     color: #ffffff;
//     border: none;
//     border-radius: 8px;
//     cursor: pointer;
//     transition: background 0.3s;
//   }
//   .submit-button:hover {
//     background: linear-gradient(to right, #1d4ed8, #3730a3);
//   }
//   .switch-text p {
//     color: #bfdbfe;
//     text-align: center;
//   }
//   .switch-button {
//     background: none;
//     border: none;
//     color: #60a5fa;
//     text-decoration: underline;
//     cursor: pointer;
//   }
//   .switch-button:hover {
//     color: #93c5fd;
//   }
// `}</style>
//     </div>
//   );
// };

// export default AuthPage;



// AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAmplitude } from '../Context/AmplitudeContext';
import { setLoginTimestamp, clearAbandonedAuth } from '../utils/authTracking';

import { 
  Row, 
  Col, 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Carousel, 
  Divider, 
  message, 
  Space, 
  Image,
  Alert
} from 'antd';
import { MailOutlined, PhoneOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';

// Import your images
import exampleLogo from '../assets/Loans24Logo.png';
import partner1 from '../assets/Aditya-Birla-Finance-Ltd.png';
import partner2 from '../assets/Poonawaala.png';
import partner3 from '../assets/Tata_Capital_Logo.png';

const { Title, Paragraph, Text } = Typography;

const AuthPage = () => {
  // Get Amplitude tracking functions
  const { trackPageView, trackEvent, setUserId, setUserProperties } = useAmplitude();
  
  // Form and UI state
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [formStarted, setFormStarted] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState({});
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showSwitchToLogin, setShowSwitchToLogin] = useState(false);
  const [showSwitchToSignup, setShowSwitchToSignup] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [cooldownTimer, setCooldownTimer] = useState(0);

  // Feature carousel data
  const features = [
    {
      title: "Watch all our benefits",
      description: "Explore a range of benefits for complete peace of mind."
    },
    {
      title: "AI-powered matching logic",
      description: "Our AI-powered IntelliMatch will find the ideal loan partner for you."
    },
    {
      title: "One stop solution",
      description: "Compare loan details, EMIs, and interest rates all in one place."
    }
  ];

  // Track page view when component mounts
  useEffect(() => {
    trackPageView('Auth Page', { 
      auth_mode: isLogin ? 'login' : 'signup',
      referrer: document.referrer
    });
    
    // Check for success message from redirect
    if (location.state && location.state.logoutMessage) {
      message.success(location.state.logoutMessage);
      trackEvent('Logout Success');
    }
  }, []);

  

  // Track when user switches between login and signup
  const handleAuthToggle = () => {
    const newMode = !isLogin;
    setIsLogin(newMode);
    
    trackEvent('Auth Mode Changed', {
      auth_mode: newMode ? 'login' : 'signup'
    });
    
    // Reset form when toggling
    form.resetFields();
  };

  // Track when user starts filling the form
  const handleFormInteraction = () => {
    if (!formStarted) {
      setFormStarted(true);
      
      // Track form start
      trackEvent('Auth Form Started', {
        auth_mode: isLogin ? 'login' : 'signup'
      });
      
      // Store info about the incomplete form in localStorage
      localStorage.setItem('auth_form_started', JSON.stringify({
        timestamp: new Date().toISOString(),
        auth_mode: isLogin ? 'login' : 'signup'
      }));
    }
  };

  const startCooldownTimer = (seconds) => {
    setCooldownTimer(seconds);
    const interval = setInterval(() => {
      setCooldownTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setRateLimited(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const handleResetPassword = () => {
    navigate('/reset-password', { state: { email: form.getFieldValue('email') } });
  };
  
  const renderPasswordRequirements = () => {
    return (
      <div style={{ marginBottom: '1rem', color: '#bfdbfe' }}>
        <Text style={{ color: '#bfdbfe', fontSize: '0.9rem' }}>Password must contain:</Text>
        <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
          <li>At least one uppercase letter</li>
          <li>At least one lowercase letter</li>
          <li>At least one special character</li>
        </ul>
      </div>
    );
  };
  
  const showPasswordRequirements = !isLogin && form.getFieldValue('password');

  // Handle form submission
  const handleSubmit = async (values) => {
    setIsLoading(true);
    setFormErrors({}); // Clear previous form errors
    
    // Track form submission attempt
    trackEvent(`${isLogin ? 'Login' : 'Signup'} Attempted`, {
      has_email: !!values.email,
      has_phone: isLogin ? undefined : !!values.phone,
      auth_mode: isLogin ? 'login' : 'signup'
    });
    
    const endpoint = isLogin 
      ? 'http://localhost:8080/api/login'
      : 'http://localhost:8080/api/signup';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(values)
      });

      const data = await response.json();

      // Handle different error scenarios based on status codes
      if (!response.ok) {
        // Track authentication failure
        trackEvent(`${isLogin ? 'Login' : 'Signup'} Failed`, {
          error_message: data.message || 'Authentication failed.',
          error_code: response.status,
          service: data.service || 'unknown',
          auth_mode: isLogin ? 'login' : 'signup'
        });
        
        // Handle specific HTTP status codes and messages
        switch (response.status) {
          case 400: // Bad request - validation errors
            // Check for specific error messages from the backend
            if (data.message === "Invalid Password") {
              message.error('Incorrect password. Please try again.');
              setLoginAttempts(prev => prev + 1);
            } else if (data.message === "User doesn't exist. Please SignUp") {
              message.error('No account found with this email. Please sign up first.');
              setShowSwitchToSignup(true);
            } else if (data.message === "ERROR: INVALID DATA!" && data.data) {
              // Handle field-specific validation errors
              setFormErrors(data.data);
              message.error('Please check your information and try again.');
            } else {
              // Generic validation error
              message.error(data.message || 'Invalid information provided.');
            }
            break;
            
          case 401: // Unauthorized - wrong credentials
            if (isLogin) {
              message.error('Incorrect email or password. Please try again.');
              // Increment failed login attempt counter
              setLoginAttempts(prev => prev + 1);
            } else {
              message.error(data.message || 'Authentication failed.');
            }
            break;
            
          case 409: // Conflict - user already exists during signup
            if (!isLogin && data.message === "User Already Exists!!") {
              message.error('An account with this email already exists. Please log in instead.');
              // Option to switch to login
              setShowSwitchToLogin(true);
            } else {
              message.error(data.message || 'Authentication failed.');
            }
            break;
            
          case 429: // Too many requests
            message.error('Too many attempts. Please try again later.');
            setRateLimited(true);
            // Start cooldown timer
            startCooldownTimer(data.retryAfter || 60);
            break;
            
          default:
            message.error(data.message || 'Authentication failed. Please try again.');
        }
        
        setIsLoading(false);
        return;
      }

      // Success handling (login or signup)
      if (isLogin) {
        // Set user ID and properties in Amplitude
        if (data.user && data.user.id) {
          setUserId(data.user.id);
          
          // Store login timestamp using the utility function
          setLoginTimestamp(data.user.id);
          
          // Set user properties (avoiding sensitive information)
          setUserProperties({
            email: values.email,
            name: data.user.name || 'Unknown',
            signup_date: data.user.created_at || new Date().toISOString(),
            last_login: new Date().toISOString()
          });
        }
        
        // Clear the form started flag
        clearAbandonedAuth();
        
        message.success(data.message || 'Login successful!');
        
        // Track successful login
        trackEvent('Login Success', {
          user_id: data.user?.id,
          login_timestamp: new Date().toISOString()
        });
        
        // Navigate to home page after a short delay
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      } else {
        // Signup success
        message.success(data.message || 'Signup successful! Please log in.');
        form.resetFields();
        
        // Clear the form started flag from localStorage
        localStorage.removeItem('auth_form_started');
        
        // Track successful signup
        trackEvent('Signup Success', {
          user_email_domain: values.email.split('@')[1]
        });
        
        // Switch to login view
        setIsLogin(true);
      }

    } catch (error) {
      console.error('Error sending request:', error);
      
      // Handle network errors
      if (!navigator.onLine) {
        message.error('You appear to be offline. Please check your internet connection and try again.');
      } else if (error.name === 'AbortError') {
        message.error('Request timed out. Please try again.');
      } else {
        message.error('An unexpected error occurred. Please try again later.');
      }
      
      // Track error
      trackEvent(`${isLogin ? 'Login' : 'Signup'} Error`, {
        error_message: error.message,
        error_type: error.name,
        auth_mode: isLogin ? 'login' : 'signup'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle navigate away/unmount - track abandoned form
  useEffect(() => {
    return () => {
      // If form was started but component is unmounting, track as abandoned
      if (formStarted) {
        trackEvent('Auth Form Abandoned', {
          auth_mode: isLogin ? 'login' : 'signup'
        });
      }
    };
  }, [formStarted, isLogin]);

  // Custom input styles - making placeholders more visible
  const inputStyle = {
    background: 'rgba(255, 255, 255, 0.15)', // Slightly lighter background
    border: '1px solid rgba(255, 255, 255, 0.3)', // More visible border
    borderRadius: 8,
    color: '#ffffff'
  };
  <Form
    form={form}
    name="auth_form"
    onFinish={handleSubmit}
    layout="vertical"
    requiredMark={false}
    onValuesChange={handleFormInteraction}
  >
    {showSwitchToSignup && isLogin && (
      <Alert
        message="Account Not Found"
        description="No account found with this email."
        type="info"
        showIcon
        action={
          <Button size="small" type="primary" onClick={() => { setIsLogin(false); setShowSwitchToSignup(false); }}>
            Create Account
          </Button>
        }
        style={{ marginBottom: '1rem' }}
      />
    )}
    
    {showSwitchToLogin && !isLogin && (
      <Alert
        message="Account Already Exists"
        description="An account with this email already exists."
        type="info"
        showIcon
        action={
          <Button size="small" type="primary" onClick={() => { setIsLogin(true); setShowSwitchToLogin(false); }}>
            Switch to Login
          </Button>
        }
        style={{ marginBottom: '1rem' }}
      />
    )}
    
    {rateLimited && cooldownTimer > 0 && (
      <Alert
        message="Too Many Attempts"
        description={`Please wait ${cooldownTimer} seconds before trying again.`}
        type="warning"
        showIcon
        style={{ marginBottom: '1rem' }}
      />
    )}
    
    <Form.Item
      name="email"
      rules={[
        { required: true, message: 'Please input your email!' },
        { type: 'email', message: 'Please enter a valid email!' }
      ]}
      validateStatus={formErrors.email ? 'error' : undefined}
      help={formErrors.email}
    >
      <Input 
        prefix={<MailOutlined style={{ color: '#60a5fa' }} />} 
        placeholder="Email Address"
        style={inputStyle}
        className="auth-input"
      />
    </Form.Item>

    {!isLogin && (
      <>
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
          validateStatus={formErrors.name ? 'error' : undefined}
          help={formErrors.name}
        >
          <Input 
            prefix={<UserOutlined style={{ color: '#60a5fa' }} />} 
            placeholder="Full Name"
            style={inputStyle}
            className="auth-input"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          rules={[
            { required: true, message: 'Please input your phone number!' },
            { 
              pattern: /^[6-9]\d{9}$/,
              message: 'Phone number must be 10 digits and start with 6, 7, 8, or 9!'
            }
          ]}
          validateStatus={formErrors.phone ? 'error' : undefined}
          help={formErrors.phone}
        >
          <Input 
            prefix={<PhoneOutlined style={{ color: '#60a5fa' }} />} 
            placeholder="Phone Number"
            style={inputStyle}
            className="auth-input"
          />
        </Form.Item>
      </>
    )}

    <Form.Item
      name="password"
      rules={[
        { required: true, message: 'Please input your password!' },
        { 
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/,
          message: 'Password must contain at least one uppercase letter, one lowercase letter, and one special character!'
        }
      ]}
      validateStatus={formErrors.password ? 'error' : undefined}
      help={formErrors.password}
    >
      <Input.Password 
        prefix={<LockOutlined style={{ color: '#60a5fa' }} />} 
        placeholder="Password"
        style={inputStyle}
        className="auth-input"
      />
    </Form.Item>
    
    {!isLogin && showPasswordRequirements && renderPasswordRequirements()}

    <Form.Item>
      <Button 
        type="primary" 
        htmlType="submit" 
        style={{ 
          width: '100%',
          height: '2.5rem',
          background: 'linear-gradient(to right, #2563eb, #4f46e5)',
          borderRadius: 8
        }}
        loading={isLoading}
      >
        {isLogin ? 'Login' : 'Create Account'}
      </Button>
    </Form.Item>

    <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

    <div style={{ textAlign: 'center' }}>
      <Text style={{ color: '#bfdbfe' }}>
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <Button 
          type="link" 
          onClick={handleAuthToggle}
          style={{ color: '#60a5fa', padding: 0 }}
        >
          {isLogin ? 'Sign Up' : 'Login'}
        </Button>
      </Text>
    </div>
  </Form>

  // More visible placeholder style
  const placeholderStyle = {
    // This will be injected via global style to make placeholders more visible
    '::placeholder': {
      color: 'rgba(255, 255, 255, 0.7) !important', // More visible placeholder text
      opacity: 1
    }
  };

  return (
    <Row
      style={{
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(to bottom right, #1e3a8a, #312e81)',
      }}
    >
      {/* Left content with branding and features */}
      <Col xs={24} md={12} lg={10} 
        style={{ 
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Space direction="vertical" size="large" align="center" style={{ width: '100%' }}>
          {/* Logo and Name */}
          <Space direction="vertical" align="center">
            <Image
              src={exampleLogo}
              alt="Loans24 Logo"
              preview={false}
              width={80}
            />
            <Title level={2} style={{ color: '#ffffff', margin: 0 }}>Loans24</Title>
          </Space>

          {/* Feature Carousel */}
          <Card 
            style={{ 
              width: '100%', 
              maxWidth: 400,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 12,
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            bodyStyle={{ padding: '1.5rem' }}
          >
            <Carousel autoplay>
              {features.map((feature, index) => (
                <div key={index}>
                  <div style={{ textAlign: 'center', padding: '0.5rem' }}>
                    <Title level={4} style={{ color: '#ffffff' }}>{feature.title}</Title>
                    <Paragraph style={{ color: '#d1d5db' }}>{feature.description}</Paragraph>
                  </div>
                </div>
              ))}
            </Carousel>
          </Card>

          {/* Partners Section */}
          <Space direction="vertical" align="center">
            <Paragraph style={{ color: '#ffffff', fontSize: '1.1rem', textAlign: 'center' }}>
              Our AI-powered IntelliMatch will find the perfect loan partner, tailored to your needs.
            </Paragraph>
            <Text style={{ color: '#93c5fd', fontWeight: 'bold' }}>10+ LOANS24 PARTNERS</Text>
            <Space size="middle" style={{ marginTop: '1rem' }}>
              {[partner1, partner2, partner3].map((partner, index) => (
                <Image
                  key={index}
                  src={partner}
                  alt={`Partner ${index+1}`}
                  preview={false}
                  height={40}
                  style={{ 
                    background: '#fff', 
                    borderRadius: 4, 
                    padding: '0.25rem' 
                  }}
                />
              ))}
            </Space>
          </Space>
        </Space>
      </Col>

      {/* Right content with auth form */}
      <Col xs={24} md={12} lg={14} 
        style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}
      >
        <Card
          style={{ 
            width: '100%', 
            maxWidth: 500,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
            boxShadow: '0 10px 15px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
          bodyStyle={{ padding: '2rem' }}
        >
          {/* Auth toggle buttons - CENTERED */}
          <div 
            style={{ 
              marginBottom: '1.5rem', 
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <div 
              style={{ 
                display: 'flex', 
                width: '100%',
                maxWidth: '300px', 
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '999px',
                padding: '4px'
              }}
            >
              <Button 
                type={isLogin ? "primary" : "text"} 
                onClick={() => isLogin ? null : handleAuthToggle()}
                style={{ 
                  flex: 1, 
                  width: '50%',
                  color: isLogin ? '#ffffff' : '#bfdbfe',
                  backgroundColor: isLogin ? undefined : 'transparent',
                  borderRadius: '999px'
                }}
              >
                Login
              </Button>
              <Button 
                type={!isLogin ? "primary" : "text"} 
                onClick={() => !isLogin ? null : handleAuthToggle()}
                style={{ 
                  flex: 1, 
                  width: '50%',
                  color: !isLogin ? '#ffffff' : '#bfdbfe',
                  backgroundColor: !isLogin ? undefined : 'transparent',
                  borderRadius: '999px'
                }}
              >
                Sign Up
              </Button>
            </div>
          </div>

          {/* Auth form */}
          <Form
            form={form}
            name="auth_form"
            onFinish={handleSubmit}
            layout="vertical"
            requiredMark={false}
            onValuesChange={handleFormInteraction}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined style={{ color: '#60a5fa' }} />} 
                placeholder="Email Address"
                style={inputStyle}
                className="auth-input" // For global styles
              />
            </Form.Item>

            {!isLogin && (
              <>
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: 'Please input your name!' }]}
                >
                  <Input 
                    prefix={<UserOutlined style={{ color: '#60a5fa' }} />} 
                    placeholder="Full Name"
                    style={inputStyle}
                    className="auth-input"
                  />
                </Form.Item>

                <Form.Item
                  name="phone"
                  rules={[{ required: true, message: 'Please input your phone number!' }]}
                >
                  <Input 
                    prefix={<PhoneOutlined style={{ color: '#60a5fa' }} />} 
                    placeholder="Phone Number"
                    style={inputStyle}
                    className="auth-input"
                  />
                </Form.Item>
              </>
            )}

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password 
                prefix={<LockOutlined style={{ color: '#60a5fa' }} />} 
                placeholder="Password"
                style={inputStyle}
                className="auth-input"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                style={{ 
                  width: '100%',
                  height: '2.5rem',
                  background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                  borderRadius: 8
                }}
                loading={isLoading}
              >
                {isLogin ? 'Login' : 'Create Account'}
              </Button>
            </Form.Item>

            <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: '#bfdbfe' }}>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <Button 
                  type="link" 
                  onClick={handleAuthToggle}
                  style={{ color: '#60a5fa', padding: 0 }}
                >
                  {isLogin ? 'Sign Up' : 'Login'}
                </Button>
              </Text>
            </div>
          </Form>
        </Card>
      </Col>

      {/* Global styles for more visible placeholders */}
      <style jsx="true">{`
        .auth-input::placeholder,
        .auth-input .ant-input::placeholder {
          color: rgba(255, 255, 255, 0.7) !important;
          opacity: 1;
        }
        
        .ant-input-affix-wrapper-focused,
        .ant-input-affix-wrapper:focus {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5) !important;
        }
      `}</style>
    </Row>
  );
};

export default AuthPage;
// App.jsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { UserProvider } from './Context/UserContext';
// import LandingPage from './landing page/LandingPage';
// import AuthPage from './Auth/AuthPage';
// import HomePage from './Home page/HomePage';
// import ThemeProvider from './GlobalTheme';

// function App() {
//   return (
//     <ThemeProvider>
//       <UserProvider>
//         <Router>
//           <Routes>
//             <Route path="/" element={<LandingPage />} />
//             <Route path="/auth" element={<AuthPage />} />
//             <Route path="/home" element={<HomePage />} />
//           </Routes>
//         </Router>
//       </UserProvider>
//     </ThemeProvider>
//   );
// }

// export default App;

// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './Context/UserContext';
import { AmplitudeProvider } from './Context/AmplitudeContext';
import LandingPage from './landing page/LandingPage';
import AuthPage from './Auth/AuthPage';
import HomePage from './Home page/HomePage';
import ThemeProvider from './GlobalTheme';

// Your Amplitude API key
const AMPLITUDE_API_KEY = '6f88b12b38a0d29041f01e7e9e7bd0b8'; // Replace with your actual API key from Amplitude

function App() {
  return (
    <ThemeProvider>
      <AmplitudeProvider 
        apiKey={AMPLITUDE_API_KEY} 
        options={{
          // More verbose logging in development
          logLevel: process.env.NODE_ENV === 'development' ? 4 : 0,
          debug: process.env.NODE_ENV === 'development',
          // Add environment as a property to all events
          defaultEventProperties: {
            environment: process.env.NODE_ENV || 'development'
          }
        }}
      >
        <UserProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/home" element={<HomePage />} />
            </Routes>
          </Router>
        </UserProvider>
      </AmplitudeProvider>
    </ThemeProvider>
  );
}

export default App;
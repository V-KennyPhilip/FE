// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './Context/UserContext';
import LandingPage from './landing page/LandingPage';
import AuthPage from './Auth/AuthPage';
import HomePage from './Home page/HomePage';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
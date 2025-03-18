import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import CompanyLogo from '../assets/Loans24Logo.png'; // Adjust path as needed
import Chatbot from './Chatbot';

const HomePage = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating API call to fetch portfolio data
    // Replace this with actual API call when ready
    const fetchPortfolioData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // const response = await fetch('api/portfolio');
        // const data = await response.json();
        // setPortfolioData(data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Logout handler for HttpOnly cookie-based sessions
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/logout', {
        method: 'POST',
        credentials: 'include', // Ensures cookies are sent with the request
      });
      
      if (response.ok) {
        // If logout is successful, redirect the user to the login page
        navigate('/auth', { state: { logoutMessage: 'Logout successful.' } });
      } else {
        console.error('Logout failed.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="home-page">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <img src={CompanyLogo} alt="Loans24 Logo" className="company-logo" />
          <h1 className="company-name">Loans24</h1>
        </div>
        
        <div className="header-right">
          <div className="user-dropdown">
            <button className="dropdown-button" onClick={toggleDropdown}>
              <span className="user-icon">👤</span>
              <span className="dropdown-arrow">▼</span>
            </button>
            
            {dropdownOpen && (
              <div className="dropdown-menu">
                <a href="#profile">My Profile</a>
                <a href="#settings">Account Settings</a>
                <a href="#about">About Us</a>
                <a href="#contact">Contact Us</a>
                <a href="#logout" onClick={handleLogout}>Logout</a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <section className="portfolio-section">
          <h2>Your Financial Portfolio</h2>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading your financial data...</p>
            </div>
          ) : (
            <div className="portfolio-data">
              {/* This will be populated with actual data from API */}
              <p>Portfolio data will appear here</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <h3>About Loans24</h3>
            <a href="#" className="footer-link">Our Story</a>
            <a href="#" className="footer-link">Leadership Team</a>
            <a href="#" className="footer-link">Careers</a>
            <a href="#" className="footer-link">Press Releases</a>
          </div>
          <div className="footer-column">
            <h3>Products</h3>
            <a href="#" className="footer-link">Personal Loans</a>
            <a href="#" className="footer-link">Home Loans</a>
            <a href="#" className="footer-link">Business Loans</a>
            <a href="#" className="footer-link">Education Loans</a>
          </div>
          <div className="footer-column">
            <h3>Resources</h3>
            <a href="#" className="footer-link">Blog</a>
            <a href="#" className="footer-link">Guides</a>
            <a href="#" className="footer-link">FAQ</a>
            <a href="#" className="footer-link">Help Center</a>
          </div>
          <div className="footer-column">
            <h3>Legal</h3>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Cookie Policy</a>
            <a href="#" className="footer-link">Security</a>
          </div>
        </div>
        <div className="copyright">
          <p>© 2025 Loans24. All rights reserved.</p>
        </div>
      </footer>
      {/* Add the Chatbot component */}
      <Chatbot />
    </div>
  );
};

export default HomePage;
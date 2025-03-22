import React from 'react';
import { ConfigProvider } from 'antd';
import { theme } from 'antd';

const { defaultAlgorithm } = theme;

// Global Loans24 theme
const loans24Theme = {
  algorithm: defaultAlgorithm,
  token: {
    // Color palette
    colorPrimary: '#0062E6',
    colorLink: '#0062E6',
    colorInfo: '#0062E6',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorTextBase: '#2d3748',
    
    // Typography
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    
    // Border radius
    borderRadius: 8,
    
    // Sizing
    controlHeightLG: 48,
    
    // Shadows
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    boxShadowSecondary: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
  components: {
    Button: {
      colorPrimary: '#0062E6',
      colorPrimaryHover: '#0052cc',
      borderRadius: 20,
    },
    FloatButton: {
      boxShadow: '0 6px 16px rgba(0, 98, 230, 0.3)',
      width: 60,
      height: 60,
    },
    Card: {
      borderRadius: 12,
    },
    Alert: {
      borderRadius: 8,
    },
  },
};

const ThemeProvider = ({ children }) => {
  return (
    <ConfigProvider theme={loans24Theme}>
      {children}
    </ConfigProvider>
  );
};

export default ThemeProvider;
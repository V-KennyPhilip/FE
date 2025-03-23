import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Menu, 
  Button, 
  Dropdown, 
  Card, 
  Statistic, 
  Row, 
  Col, 
  Typography, 
  Badge, 
  Skeleton, 
  Space, 
  Divider, 
  Avatar, 
  ConfigProvider,
  Spin
} from 'antd';
import { 
  UserOutlined, 
  DownOutlined, 
  LogoutOutlined, 
  SettingOutlined, 
  InfoCircleOutlined, 
  PhoneOutlined, 
  RiseOutlined, 
  FallOutlined, 
  BellOutlined
} from '@ant-design/icons';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import Chatbot from './Chatbot';
import CompanyLogo from '../assets/Loans24Logo.png';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

// Define animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

const scrollAnimation = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
`;

const shimmerAnimation = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

// Styled components
const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  background: linear-gradient(135deg, #1a365d, #2a4a7f);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  
  img {
    height: 40px;
    margin-right: 10px;
  }
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  margin-left: 40px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NotificationBell = styled.div`
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const MainContent = styled(Content)`
  background: #f7fafc;
  padding: 24px;
`;

const AnimatedCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
  }
`;

const FloatingCard = styled(AnimatedCard)`
  animation: ${floatAnimation} 6s ease-in-out infinite;
  animation-delay: ${props => props.$delay || '0s'};
`;

const PulsingCard = styled(AnimatedCard)`
  animation: ${pulseAnimation} 4s ease-in-out infinite;
  animation-delay: ${props => props.$delay || '0s'};
`;

const ScrollingContainer = styled.div`
  width: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, #1a365d, #2a4a7f);
  padding: 15px 0;
  margin: 30px 0;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1), 0 -5px 15px rgba(0, 0, 0, 0.1);
  
  &::before, &::after {
    content: '';
    position: absolute;
    top: 0;
    width: 100px;
    height: 100%;
    z-index: 2;
  }
  
  &::before {
    left: 0;
    background: linear-gradient(to right, #1a365d, transparent);
  }
  
  &::after {
    right: 0;
    background: linear-gradient(to left, #1a365d, transparent);
  }
`;

const ScrollingContent = styled.div`
  display: flex;
  white-space: nowrap;
  animation: ${scrollAnimation} 30s linear infinite;
  gap: 40px;
  padding: 0 20px;
  
  &:hover {
    animation-play-state: paused;
  }
`;

const NewsItem = styled.div`
  display: inline-flex;
  align-items: center;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 50px;
  margin-right: 20px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  span {
    margin-left: 8px;
  }
`;

const StyledFooter = styled(Footer)`
  background: linear-gradient(135deg, #1a365d, #2a4a7f);
  color: white;
  padding: 40px 20px 20px;
`;

const LogoutButton = styled(Button)`
  width: 100%;
  text-align: left;
  border: none;
  padding: 10px 12px;
  height: auto;
  display: flex;
  align-items: center;
  
  span {
    margin-left: 8px;
  }
  
  &.logging-out {
    position: relative;
    overflow: hidden;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, 
        rgba(255, 255, 255, 0), 
        rgba(255, 255, 255, 0.3), 
        rgba(255, 255, 255, 0));
      background-size: 200% 100%;
      animation: ${shimmerAnimation} 1.5s infinite;
    }
  }
`;

const StatisticLabel = styled.div`
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 6px;
  }
`;

const ActivityItem = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const HomePage = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();
  
  // Simulated data for mock Dashboard
  const [accountSummary, setAccountSummary] = useState({
    totalBalance: 457500.82,
    pendingPayments: 1250.00,
    availableCredit: 250000.00,
    nextPayment: '2025-04-15',
    interestRate: 8.25,
    paymentsMade: 12,
    paymentsRemaining: 48
  });
  
  const [recentActivity, setRecentActivity] = useState([
    { 
      id: 1, 
      date: '2025-03-15', 
      description: 'Monthly Payment', 
      amount: 1250.00, 
      type: 'payment' 
    },
    { 
      id: 2, 
      date: '2025-03-10', 
      description: 'Interest Credit', 
      amount: 50.75, 
      type: 'credit' 
    },
    { 
      id: 3, 
      date: '2025-03-01', 
      description: 'Late Fee Waiver', 
      amount: 35.00, 
      type: 'credit' 
    },
    { 
      id: 4, 
      date: '2025-02-15', 
      description: 'Monthly Payment', 
      amount: 1250.00, 
      type: 'payment' 
    }
  ]);
  
  const newsItems = [
    { id: 1, icon: <RiseOutlined />, text: 'Mortgage rates drop to 5.2% - Refinance opportunities available' },
    { id: 2, icon: <InfoCircleOutlined />, text: 'New personalized loan options launching next month' },
    { id: 3, icon: <RiseOutlined />, text: 'Home equity values increased by 8.5% over the last quarter' },
    { id: 4, icon: <FallOutlined />, text: 'Auto loan interest rates expected to decrease in Q2' },
    { id: 5, icon: <InfoCircleOutlined />, text: 'New mobile app features coming soon - easier payment management' },
    { id: 6, icon: <RiseOutlined />, text: 'Student loan forgiveness programs expanded - check eligibility' }
  ];
  
  // Navigation menu items
  const navItems = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'loans', label: 'My Loans' },
    { key: 'payments', label: 'Payments' },
    { key: 'statements', label: 'Statements' },
    { key: 'apply', label: 'Apply for Loan' }
  ];
  
  // Logout handler with animation
  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      const response = await fetch('http://localhost:8080/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      // Regardless of response, show animation for at least 1.5 seconds
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (response.ok) {
        navigate('/auth', { state: { logoutMessage: 'Logout successful.' } });
      } else {
        console.error('Logout failed.');
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error('Error during logout:', error);
      setIsLoggingOut(false);
    }
  };
  
  // Dropdown menu items - MOVED AFTER handleLogout is defined
  const menuItems = [
    {
      key: 'profile',
      label: 'My Profile',
      icon: <UserOutlined />
    },
    {
      key: 'settings',
      label: 'Account Settings',
      icon: <SettingOutlined />
    },
    {
      key: 'about',
      label: 'About Us',
      icon: <InfoCircleOutlined />
    },
    {
      key: 'contact',
      label: 'Contact Us',
      icon: <PhoneOutlined />
    },
    {
      key: 'divider',
      type: 'divider'
    },
    {
      key: 'logout',
      label: (
        <LogoutButton 
          type="text" 
          className={isLoggingOut ? 'logging-out' : ''}
          onClick={handleLogout}
          loading={isLoggingOut}
          icon={<LogoutOutlined />}
        >
          Logout
        </LogoutButton>
      )
    }
  ];

  useEffect(() => {
    // Simulating API call to fetch portfolio data
    const fetchPortfolioData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Placeholder for real API call:
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

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0062E6',
          borderRadius: 8,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        },
      }}
    >
      <StyledLayout>
        <StyledHeader>
          <Logo onClick={() => navigate('/')}>
            <img src={CompanyLogo} alt="Loans24 Logo" />
          </Logo>
          
          <NavMenu>
            <Menu
              mode="horizontal"
              defaultSelectedKeys={['dashboard']}
              items={navItems}
              style={{ background: 'transparent', borderBottom: 'none', color: 'white', flex: 1 }}
            />
          </NavMenu>
          
          <UserActions>
            <NotificationBell>
              <Badge count={notifications} overflowCount={9}>
                <BellOutlined style={{ fontSize: 20, color: 'white' }} />
              </Badge>
            </NotificationBell>
            
            <Dropdown
              menu={{ items: menuItems }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button type="text" style={{ color: 'white' }}>
                <Space>
                  <Avatar icon={<UserOutlined />} />
                  <span>John Doe</span>
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </UserActions>
        </StyledHeader>
        
        <MainContent>
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <Title level={2}>Dashboard</Title>
              <Paragraph>Welcome back, John. Here's an overview of your finances.</Paragraph>
            </Col>
          </Row>
          
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={6}>
              <FloatingCard $delay="0s">
                <Statistic
                  title={<StatisticLabel>Total Loan Balance</StatisticLabel>}
                  value={accountSummary.totalBalance}
                  precision={2}
                  prefix="₹"
                  valueStyle={{ color: '#0062E6' }}
                />
                <Divider />
                <Text type="secondary">Next payment due: {formatDate(accountSummary.nextPayment)}</Text>
              </FloatingCard>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <FloatingCard $delay="0.2s">
                <Statistic
                  title={<StatisticLabel>Pending Payment</StatisticLabel>}
                  value={accountSummary.pendingPayments}
                  precision={2}
                  prefix="₹"
                  valueStyle={{ color: '#fa8c16' }}
                />
                <Button type="primary" size="small" style={{ marginTop: 16 }}>
                  Make Payment
                </Button>
              </FloatingCard>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <FloatingCard $delay="0.4s">
                <Statistic
                  title={<StatisticLabel>Available Credit</StatisticLabel>}
                  value={accountSummary.availableCredit}
                  precision={2}
                  prefix="₹"
                  valueStyle={{ color: '#52c41a' }}
                />
                <Button type="default" size="small" style={{ marginTop: 16 }}>
                  Request Increase
                </Button>
              </FloatingCard>
            </Col>
            
            <Col xs={24} lg={6}>
              <FloatingCard $delay="0.6s">
                <Statistic
                  title={<StatisticLabel><RiseOutlined /> Interest Rate</StatisticLabel>}
                  value={accountSummary.interestRate}
                  precision={2}
                  suffix="%"
                  valueStyle={{ color: '#0062E6' }}
                />
                <Divider />
                <Row>
                  <Col span={12}>
                    <Statistic 
                      title="Payments Made" 
                      value={accountSummary.paymentsMade} 
                      valueStyle={{ fontSize: '16px' }} 
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic 
                      title="Remaining" 
                      value={accountSummary.paymentsRemaining} 
                      valueStyle={{ fontSize: '16px' }} 
                    />
                  </Col>
                </Row>
              </FloatingCard>
            </Col>
          </Row>
          
          {/* Scrolling News Ticker */}
          <ScrollingContainer>
            <ScrollingContent>
              {[...newsItems, ...newsItems].map((item, index) => (
                <NewsItem key={`${item.id}-${index}`}>
                  {item.icon}
                  <span>{item.text}</span>
                </NewsItem>
              ))}
            </ScrollingContent>
          </ScrollingContainer>
          
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <PulsingCard title="Loan Progress">
                {loading ? (
                  <Skeleton active paragraph={{ rows: 6 }} />
                ) : (
                  <div>
                    <div style={{ marginBottom: 24 }}>
                      <Text>Personal Loan - $50,000</Text>
                      <div style={{ height: 20, background: '#f0f0f0', borderRadius: 10, marginTop: 8, overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            height: '100%', 
                            width: '24%', 
                            background: 'linear-gradient(90deg, #0062E6, #33AEFF)',
                            borderRadius: 10
                          }} 
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        <Text type="secondary">24% Complete</Text>
                        <Text type="secondary">$38,750.82 Remaining</Text>
                      </div>
                    </div>
                    
                    <Title level={5}>Payment Schedule</Title>
                    <div style={{ overflowX: 'auto' }}>
                      <div style={{ display: 'flex', gap: 12, padding: '12px 0' }}>
                        {Array.from({ length: 12 }).map((_, i) => (
                          <div 
                            key={i} 
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: i < 3 ? '#52c41a' : (i === 3 ? '#1890ff' : '#f0f0f0'),
                              color: i < 4 ? 'white' : '#999',
                              flexShrink: 0
                            }}
                          >
                            {i + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </PulsingCard>
            </Col>
            
            <Col xs={24} lg={8}>
              <PulsingCard 
                title="Recent Activity" 
                extra={<Button type="link">View All</Button>}
              >
                {loading ? (
                  <Skeleton active paragraph={{ rows: 8 }} />
                ) : (
                  <div style={{ overflow: 'auto', maxHeight: 300 }}>
                    {recentActivity.map(activity => (
                      <ActivityItem key={activity.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <Text strong>{activity.description}</Text>
                          <Text 
                            style={{ 
                              color: activity.type === 'credit' ? '#52c41a' : '#595959'
                            }}
                          >
                            {activity.type === 'credit' ? '+' : ''}{formatCurrency(activity.amount)}
                          </Text>
                        </div>
                        <Text type="secondary">{formatDate(activity.date)}</Text>
                      </ActivityItem>
                    ))}
                  </div>
                )}
              </PulsingCard>
            </Col>
          </Row>
          
          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24}>
              <PulsingCard title="Recommended For You">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={8}>
                    <Card>
                      <Title level={5}>Refinance Your Loan</Title>
                      <Paragraph>Rates as low as 5.25% APR</Paragraph>
                      <Button type="primary">Learn More</Button>
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card>
                      <Title level={5}>Debt Consolidation</Title>
                      <Paragraph>Simplify your payments</Paragraph>
                      <Button type="primary">Learn More</Button>
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card>
                      <Title level={5}>Home Equity Line</Title>
                      <Paragraph>Access your home's value</Paragraph>
                      <Button type="primary">Learn More</Button>
                    </Card>
                  </Col>
                </Row>
              </PulsingCard>
            </Col>
          </Row>
        </MainContent>
        
        <StyledFooter style={{ padding: '20px' }}>
          <Row gutter={24}>
            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ color: 'white' }}>About Loans24</Title>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><a href="#" style={{ color: '#e2e8f0' }}>Our Story</a></li>
                <li><a href="#" style={{ color: '#e2e8f0' }}>Leadership Team</a></li>
              </ul>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ color: 'white' }}>Products</Title>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><a href="#" style={{ color: '#e2e8f0' }}>Personal Loans</a></li>
                <li><a href="#" style={{ color: '#e2e8f0' }}>Home Loans</a></li>
              </ul>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ color: 'white' }}>Resources</Title>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><a href="#" style={{ color: '#e2e8f0' }}>Blog</a></li>
                <li><a href="#" style={{ color: '#e2e8f0' }}>FAQ</a></li>
              </ul>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ color: 'white' }}>Legal</Title>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><a href="#" style={{ color: '#e2e8f0' }}>Privacy Policy</a></li>
                <li><a href="#" style={{ color: '#e2e8f0' }}>Terms of Service</a></li>
              </ul>
            </Col>
          </Row>
          <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '16px 0' }} />
          <Text style={{ color: '#e2e8f0', display: 'block', textAlign: 'center' }}>
            © 2025 Loans24. All rights reserved.
          </Text>
        </StyledFooter>
        
        {/* Add the Chatbot component */}
        <Chatbot />
      </StyledLayout>
    </ConfigProvider>
  );
};

export default HomePage;
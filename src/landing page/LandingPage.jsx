import React, { useEffect, useState, useMemo } from 'react';
import { 
  Layout, 
  Menu, 
  Button, 
  Typography, 
  Card, 
  Statistic, 
  Row, 
  Col, 
  Carousel, 
  Dropdown, 
  Space, 
  Divider, 
  ConfigProvider 
} from 'antd';
import { 
  HomeOutlined, 
  AppstoreOutlined, 
  BulbOutlined, 
  PhoneOutlined,
  ArrowRightOutlined, 
  ArrowLeftOutlined,
  RiseOutlined,
  DownOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import ChatbotButton from '../Generic Chatbot/ChatbotButton';

// Images
import l24logo from '../assets/Loans24Logo.png';
import education from '../assets/Educ.png';
import home from '../assets/Home.png';
import pers from '../assets/pers.png';
import prof from '../assets/prof.png';

// Destructure components
const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

// Define animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

const counterAnimation = keyframes`
  from { opacity: 0.3; }
  to { opacity: 1; }
`;

// Styled components
const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: #f7fafc;
`;

const StyledHeader = styled(Header)`
  background: linear-gradient(135deg, #1a365d, #2a4a7f);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 0 50px;
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 0 20px;
    flex-direction: column;
    height: auto;
    line-height: 1.5;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  min-width: 120px;
  
  img {
    height: 40px;
    margin-right: 10px;
  }
`;

const StyledMenu = styled(Menu)`
  background: transparent;
  border-bottom: none;
  flex: 1;
  justify-content: center;
  
  .ant-menu-item, .ant-menu-submenu {
    color: white !important;
    font-weight: 500;
  }
  
  .ant-menu-item-selected {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }
`;

const HeroSection = styled.div`
  padding: 70px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #f7fafc, #edf2f7);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(66, 153, 225, 0.1) 0%, transparent 200px),
      radial-gradient(circle at 80% 70%, rgba(26, 54, 93, 0.1) 0%, transparent 200px);
  }
`;

const FloatingCard = styled(Card)`
  animation: ${floatAnimation} 6s ease-in-out infinite;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 30px rgba(0, 0, 0, 0.15);
  }
`;

const CardImage = styled.div`
  height: 180px;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.1);
  }
  
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(26, 54, 93, 0.2), rgba(26, 54, 93, 0.7));
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover .overlay {
    opacity: 1;
  }
`;

const ViewButton = styled(Button)`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  backdrop-filter: blur(5px);
  font-weight: bold;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    color: white;
  }
`;

const CardDetail = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const StatCard = styled(Card)`
  text-align: center;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #ffffff, #f0f7ff);
  box-shadow: 0 4px 12px rgba(0, 98, 230, 0.1);
  animation: ${pulseAnimation} 4s ease-in-out infinite;
  
  .ant-statistic-title {
    color: #4a5568;
  }
  
  .ant-statistic-content {
    color: #0062E6;
  }
`;

const BlurOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(3px);
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 998;
  opacity: ${props => props.$isOpen ? 1 : 0};
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
  transition: opacity 0.3s ease;
`;

const LandingPage = () => {
  const [chatbotInitialData, setChatbotInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [loanStats, setLoanStats] = useState({
    approved: 0,
    avgInterest: 0,
    customers: 0,
    satisfaction: 0
  });
  
  // Mock loan statistics with animation
  useEffect(() => {
    const targetStats = {
      approved: 95,
      avgInterest: 8.5,
      customers: 25000,
      satisfaction: 98
    };
    
    const interval = setInterval(() => {
      setLoanStats(prev => ({
        approved: prev.approved < targetStats.approved ? prev.approved + 1 : targetStats.approved,
        avgInterest: prev.avgInterest < targetStats.avgInterest ? parseFloat((prev.avgInterest + 0.1).toFixed(1)) : targetStats.avgInterest,
        customers: prev.customers < targetStats.customers ? prev.customers + 500 : targetStats.customers,
        satisfaction: prev.satisfaction < targetStats.satisfaction ? prev.satisfaction + 1 : targetStats.satisfaction,
      }));
    }, 80);
    
    return () => clearInterval(interval);
  }, []);

  // Fetch chatbot data
  useEffect(() => {
    const fetchChatbotData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8080/api/chatbot/interaction', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.success) {
          setChatbotInitialData(data.data);
        }
      } catch (error) {
        console.error('Error fetching chatbot data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatbotData();
  }, []);

  // Track chatbot open state
  const onChatbotToggle = (isOpen) => {
    setIsChatbotOpen(isOpen);
  };

  // Loan cards data
  const loanCards = [
    {
      title: "Personal Loan",
      description: "Quick funds for your personal needs with minimal documentation and flexible repayment options.",
      interest: "8.99% - 14.99%",
      amount: "$1,000 - $50,000",
      tenure: "1 - 5 Years",
      image: pers
    },
    {
      title: "Home Loan",
      description: "Make your dream home a reality with our affordable and transparent home loan offerings.",
      interest: "4.50% - 6.75%",
      amount: "Up to $1,000,000",
      tenure: "5 - 30 Years",
      image: home
    },
    {
      title: "Professional Loan",
      description: "Fuel your business growth with our hassle-free business financing solutions.",
      interest: "7.50% - 16.00%",
      amount: "$10,000 - $500,000",
      tenure: "1 - 7 Years",
      image: prof
    },
    {
      title: "Education Loan",
      description: "Invest in your future with our affordable education loans for higher studies.",
      interest: "5.50% - 8.75%",
      amount: "$5,000 - $150,000",
      tenure: "5 - 15 Years",
      image: education
    }
  ];

  // Navigation menu items
  const menuItems = useMemo(() => [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Home'
    },
    {
      key: 'products',
      icon: <AppstoreOutlined />,
      label: 'Products',
      children: [
        { key: 'personal', label: 'Personal Loans' },
        { key: 'home', label: 'Home Loans' },
        { key: 'business', label: 'Business Loans' },
        { key: 'education', label: 'Education Loans' }
      ]
    },
    {
      key: 'resources',
      icon: <BulbOutlined />,
      label: 'Resources',
      children: [
        { key: 'calculator', label: 'Loan Calculator' },
        { key: 'guides', label: 'Guides' },
        { key: 'faq', label: 'FAQ' }
      ]
    },
    {
      key: 'contact',
      icon: <PhoneOutlined />,
      label: 'Contact Us'
    }
  ], []);

  const footerLinks = {
    about: ['Our Story', 'Leadership Team', 'Careers', 'Press Releases'],
    products: ['Personal Loans', 'Home Loans', 'Business Loans', 'Education Loans'],
    resources: ['Blog', 'Guides', 'FAQ', 'Help Center'],
    legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security']
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
        {/* Background blur overlay when chatbot is open */}
        <BlurOverlay $isOpen={isChatbotOpen} />
        
        {/* Header */}
        <StyledHeader>
          <Logo>
            <img src={l24logo} alt="Loans24 Logo" />
          </Logo>
          
          <StyledMenu
            mode="horizontal"
            defaultSelectedKeys={['home']}
            items={menuItems}
            theme="dark"
            style={{ background: 'transparent' }}
          />
          
          <Space>
            <Link to="/auth">
              <Button ghost>Login</Button>
            </Link>
            <Link to="/auth">
              <Button type="primary">Sign Up</Button>
            </Link>
          </Space>
        </StyledHeader>
        
        <Content>
          {/* Hero Section */}
          <HeroSection>
            <Row gutter={[24, 24]} justify="center">
              <Col xs={24} sm={24} md={16} lg={12}>
                <Title 
                  level={1} 
                  style={{ 
                    marginBottom: 24, 
                    background: 'linear-gradient(90deg, #1a365d, #4299e1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent' 
                  }}
                >
                  Find the Perfect Loan for Your Future
                </Title>
                
                <Paragraph style={{ fontSize: 18, marginBottom: 40, color: '#4a5568' }}>
                  Loans24 offers tailored financial solutions designed for your unique needs.
                  Experience instant approvals with competitive rates.
                </Paragraph>
                
                <Button type="primary" size="large" icon={<ArrowRightOutlined />} style={{ marginBottom: 40 }}>
                  Get Started Today
                </Button>
              </Col>
            </Row>
            
            {/* Live Statistics */}
            <Row gutter={[24, 24]} justify="center" style={{ marginTop: 40 }}>
              <Col xs={12} sm={12} md={6} lg={5}>
                <StatCard>
                  <Statistic 
                    title="Approval Rate" 
                    value={loanStats.approved}
                    suffix="%" 
                    precision={0}
                    valueStyle={{ animation: `${counterAnimation} 0.5s ease-out` }}
                  />
                </StatCard>
              </Col>
              <Col xs={12} sm={12} md={6} lg={5}>
                <StatCard>
                  <Statistic 
                    title="Avg. Interest Rate" 
                    value={loanStats.avgInterest}
                    suffix="%" 
                    precision={1}
                    valueStyle={{ animation: `${counterAnimation} 0.5s ease-out` }}
                  />
                </StatCard>
              </Col>
              <Col xs={12} sm={12} md={6} lg={5}>
                <StatCard>
                  <Statistic 
                    title="Happy Customers" 
                    value={loanStats.customers.toLocaleString()}
                    prefix={<RiseOutlined />}
                    valueStyle={{ animation: `${counterAnimation} 0.5s ease-out` }}
                  />
                </StatCard>
              </Col>
              <Col xs={12} sm={12} md={6} lg={5}>
                <StatCard>
                  <Statistic 
                    title="Satisfaction Rate" 
                    value={loanStats.satisfaction}
                    suffix="%" 
                    precision={0}
                    valueStyle={{ animation: `${counterAnimation} 0.5s ease-out` }}
                  />
                </StatCard>
              </Col>
            </Row>
          </HeroSection>
          
          {/* Loan Products Carousel */}
          <div style={{ maxWidth: 1200, margin: '60px auto 80px', padding: '0 20px' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
              Our Loan Products
            </Title>
            
            <Carousel
              autoplay
              dots={true}
              afterChange={(current) => setActiveSlideIndex(current)}
              arrows
              prevArrow={<ArrowLeftOutlined />}
              nextArrow={<ArrowRightOutlined />}
            >
              <div>
                <Row gutter={[24, 24]} justify="center">
                  {loanCards.slice(0, 3).map((loan, index) => (
                    <Col key={index} xs={24} sm={24} md={8}>
                      <FloatingCard 
                        hoverable
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        <CardImage>
                          <img src={loan.image} alt={loan.title} />
                          <div className="overlay">
                            <ViewButton>View Details</ViewButton>
                          </div>
                        </CardImage>
                        <Card.Meta 
                          title={loan.title} 
                          description={loan.description}
                          style={{ marginBottom: 16 }}
                        />
                        <Divider style={{ margin: '12px 0' }} />
                        <CardDetail>
                          <Text type="secondary">Interest Rate</Text>
                          <Text strong>{loan.interest}</Text>
                        </CardDetail>
                        <CardDetail>
                          <Text type="secondary">Loan Amount</Text>
                          <Text strong>{loan.amount}</Text>
                        </CardDetail>
                        <CardDetail>
                          <Text type="secondary">Tenure</Text>
                          <Text strong>{loan.tenure}</Text>
                        </CardDetail>
                      </FloatingCard>
                    </Col>
                  ))}
                </Row>
              </div>
              <div>
                <Row gutter={[24, 24]} justify="center">
                  {loanCards.slice(1, 4).map((loan, index) => (
                    <Col key={index} xs={24} sm={24} md={8}>
                      <FloatingCard 
                        hoverable
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        <CardImage>
                          <img src={loan.image} alt={loan.title} />
                          <div className="overlay">
                            <ViewButton>View Details</ViewButton>
                          </div>
                        </CardImage>
                        <Card.Meta 
                          title={loan.title} 
                          description={loan.description}
                          style={{ marginBottom: 16 }}
                        />
                        <Divider style={{ margin: '12px 0' }} />
                        <CardDetail>
                          <Text type="secondary">Interest Rate</Text>
                          <Text strong>{loan.interest}</Text>
                        </CardDetail>
                        <CardDetail>
                          <Text type="secondary">Loan Amount</Text>
                          <Text strong>{loan.amount}</Text>
                        </CardDetail>
                        <CardDetail>
                          <Text type="secondary">Tenure</Text>
                          <Text strong>{loan.tenure}</Text>
                        </CardDetail>
                      </FloatingCard>
                    </Col>
                  ))}
                </Row>
              </div>
            </Carousel>
          </div>
          
          {/* Features Section */}
          <div style={{ background: '#EBF4FE', padding: '80px 20px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <Title level={2} style={{ textAlign: 'center', marginBottom: 60 }}>
                Why Choose Loans24?
              </Title>
              
              <Row gutter={[48, 48]} justify="center">
                <Col xs={24} sm={12} md={8}>
                  <Card bordered={false} style={{ height: '100%', textAlign: 'center', background: 'transparent', boxShadow: 'none' }}>
                    <CheckCircleOutlined style={{ fontSize: 48, color: '#0062E6', marginBottom: 16 }} />
                    <Title level={4}>Fast Approvals</Title>
                    <Text>Get loan approvals within 24 hours with our streamlined application process</Text>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card bordered={false} style={{ height: '100%', textAlign: 'center', background: 'transparent', boxShadow: 'none' }}>
                    <CheckCircleOutlined style={{ fontSize: 48, color: '#0062E6', marginBottom: 16 }} />
                    <Title level={4}>Competitive Rates</Title>
                    <Text>We offer some of the most competitive interest rates in the market</Text>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card bordered={false} style={{ height: '100%', textAlign: 'center', background: 'transparent', boxShadow: 'none' }}>
                    <CheckCircleOutlined style={{ fontSize: 48, color: '#0062E6', marginBottom: 16 }} />
                    <Title level={4}>Flexible Terms</Title>
                    <Text>Customize your loan terms to fit your financial situation and goals</Text>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        </Content>
        
        {/* Footer */}
        <Footer style={{ background: 'linear-gradient(135deg, #1a365d, #2a4a7f)', padding: '40px 20px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Row gutter={[24, 40]}>
              <Col xs={24} sm={12} md={6}>
                <Title level={5} style={{ color: 'white', marginBottom: 20 }}>About Loans24</Title>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {footerLinks.about.map((link, index) => (
                    <li key={index} style={{ marginBottom: 10 }}>
                      <a href="#" style={{ color: '#e2e8f0', textDecoration: 'none' }}>{link}</a>
                    </li>
                  ))}
                </ul>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Title level={5} style={{ color: 'white', marginBottom: 20 }}>Products</Title>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {footerLinks.products.map((link, index) => (
                    <li key={index} style={{ marginBottom: 10 }}>
                      <a href="#" style={{ color: '#e2e8f0', textDecoration: 'none' }}>{link}</a>
                    </li>
                  ))}
                </ul>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Title level={5} style={{ color: 'white', marginBottom: 20 }}>Resources</Title>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {footerLinks.resources.map((link, index) => (
                    <li key={index} style={{ marginBottom: 10 }}>
                      <a href="#" style={{ color: '#e2e8f0', textDecoration: 'none' }}>{link}</a>
                    </li>
                  ))}
                </ul>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Title level={5} style={{ color: 'white', marginBottom: 20 }}>Legal</Title>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {footerLinks.legal.map((link, index) => (
                    <li key={index} style={{ marginBottom: 10 }}>
                      <a href="#" style={{ color: '#e2e8f0', textDecoration: 'none' }}>{link}</a>
                    </li>
                  ))}
                </ul>
              </Col>
            </Row>
            <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '20px 0' }} />
            <div style={{ textAlign: 'center', color: '#e2e8f0' }}>
              <Text style={{ color: '#e2e8f0' }}>&copy; 2025 Loans24. All rights reserved.</Text>
            </div>
          </div>
        </Footer>
        
        {/* Chatbot */}
        <ChatbotButton 
          initialData={chatbotInitialData} 
          isDataLoading={isLoading}
          onToggle={onChatbotToggle}
        />
      </StyledLayout>
    </ConfigProvider>
  );
};

export default LandingPage;
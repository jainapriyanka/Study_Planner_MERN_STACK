import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../../assets/styles/LandingPage.css'; 
import studyImage from '../../assets/images/study-illustration.jpeg'; // Replace with your image

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Main Section */}
      <Container fluid className="main-section">
        <Row>
          <Col md={6} className="text-section">
            <h1>Create a <span>Study Plan</span></h1>
            <p>Achieve your academic goals with a well-organized study plan. Our tool helps you create personalized schedules, track your progress, and stay on top of deadlines. Whether preparing for exams or managing daily tasks, we have you covered.</p>
            <p>Start by defining your goals, scheduling study sessions, and setting reminders. Our app helps you stay focused, manage your time better, and achieve better results.</p>
            <Button variant="primary" size="lg" className="cta-btn">Get More</Button>
          </Col>
          <Col md={6} className="image-section">
            <img src={studyImage} alt="Study Illustration" className="illustration" />
          </Col>
        </Row>
      </Container>
      {/* About */}
      <Container id="about" className="about-section">
        <Row>
          <Col>
            <h2>About Us</h2>
            <p>We are a dedicated team focused on making study planning easier for students. Our platform offers a simple, effective, and intuitive tool to help students plan their study time, stay on track with deadlines, and make the most out of their study efforts.</p>
            <p>Our mission is to empower students by providing them with the best tools to plan their study time, reduce procrastination, and achieve better academic results. With our study planner, you can create flexible study schedules tailored to your unique learning needs.</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LandingPage;

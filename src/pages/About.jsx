import React from 'react';
import '../style/About.css';

function About() {
  const teamMembers = [
    { id: 1, name: 'Sarah Johnson', role: 'Founder & CEO', bio: '15+ years in fashion industry', initial: 'S' },
    { id: 2, name: 'Michael Chen', role: 'Creative Director', bio: 'Award-winning designer', initial: 'M' },
    { id: 3, name: 'Emma Wilson', role: 'Head of Operations', bio: 'Supply chain expert', initial: 'E' },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <h1>About FashionHub</h1>
        <p>Where Style Meets Elegance</p>
      </div>
      
      <div className="about-content">
        {/* Story Section */}
        <div className="about-section">
          <h2>Our Story</h2>
          <p>
            Founded in 2023, FashionHub began with a simple mission: to bring 
            high-quality, elegant fashion to everyone. We believe that everyone 
            deserves to look and feel their best, regardless of the occasion.
            Our journey started in a small studio with big dreams, and today we're 
            proud to serve thousands of customers worldwide with our unique blend 
            of traditional craftsmanship and modern design.
          </p>
        </div>
        
        {/* Stats Section */}
        <div className="about-stats">
          <div className="stat-item">
            <div className="stat-number" data-count="10000">10,000+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number" data-count="500">500+</div>
            <div className="stat-label">Unique Designs</div>
          </div>
          <div className="stat-item">
            <div className="stat-number" data-count="50">50+</div>
            <div className="stat-label">Countries Served</div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="about-features">
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>Premium Quality</h3>
            <p>Only the finest fabrics and craftsmanship from certified artisans</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Fast Delivery</h3>
            <p>Nationwide shipping within 3-5 days with real-time tracking</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💖</div>
            <h3>Customer First</h3>
            <p>24/7 support and 30-day hassle-free return policy</p>
          </div>
        </div>
        
        {/* Team Section */}
        <div className="about-team">
          <h2 className="team-title">Meet Our Team</h2>
          <div className="team-grid">
            {teamMembers.map(member => (
              <div key={member.id} className="team-member">
                <div className="member-avatar">{member.initial}</div>
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="about-cta">
          <h2>Ready to Experience Luxury Fashion?</h2>
          <p>Join thousands of satisfied customers and elevate your style today</p>
          <button className="cta-button">
            Start Shopping Now
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default About;
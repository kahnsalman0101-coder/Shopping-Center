import React from 'react';
import '../style/Contact.css';

function Contact() {
  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        <h1>📞 Get In Touch</h1>
        <p>We'd love to hear from you. Contact us for any queries or support.</p>
      </div>
      
      <div className="contact-container">
        {/* Contact Info */}
        <div className="contact-info">
          <div className="info-card">
            <div className="info-icon">📍</div>
            <h3>Our Location</h3>
            <p>123 Fashion Street, Style City</p>
            <p>Lahore, Pakistan</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">📧</div>
            <h3>Email Address</h3>
            <p>support@fashionhub.com</p>
            <p>sales@fashionhub.com</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">📞</div>
            <h3>Phone Number</h3>
            <p>+92 300 1234567</p>
            <p>+92 42 1234567</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">⏰</div>
            <h3>Working Hours</h3>
            <p>Monday - Friday: 9AM - 8PM</p>
            <p>Saturday - Sunday: 10AM - 6PM</p>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          <form className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input type="text" id="name" placeholder="Enter your name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input type="email" id="email" placeholder="Enter your email" required />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input type="text" id="subject" placeholder="What is this regarding?" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea 
                id="message" 
                rows="6" 
                placeholder="Type your message here..."
                required
              ></textarea>
            </div>
            
            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="faq-section">
        <h2>❓ Frequently Asked Questions</h2>
        <div className="faq-list">
          <div className="faq-item">
            <h3>What are your delivery times?</h3>
            <p>We deliver within 3-5 business days nationwide. Express delivery (1-2 days) is available for an additional charge.</p>
          </div>
          
          <div className="faq-item">
            <h3>What is your return policy?</h3>
            <p>We offer a 30-day return policy. Items must be unworn, with tags attached, and in original packaging.</p>
          </div>
          
          <div className="faq-item">
            <h3>Do you ship internationally?</h3>
            <p>Yes, we ship to over 50 countries worldwide. International delivery takes 7-14 business days.</p>
          </div>
          
          <div className="faq-item">
            <h3>What payment methods do you accept?</h3>
            <p>We accept credit/debit cards, bank transfers, JazzCash, EasyPaisa, and cash on delivery.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
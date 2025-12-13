import { useState } from 'react';
import '../style/SingUpModal.css';

const SignUpModal = ({ isOpen, onClose, onSignUpSuccess }) => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null,
    profileImageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error on input change
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPEG, PNG, GIF, WEBP)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setUserInfo(prev => ({
        ...prev,
        profileImage: file,
        profileImageUrl: imageUrl
      }));
      setError(''); // Clear any previous errors
    }
  };

  // Remove uploaded image
  const removeImage = () => {
    if (userInfo.profileImageUrl) {
      URL.revokeObjectURL(userInfo.profileImageUrl);
    }
    setUserInfo(prev => ({
      ...prev,
      profileImage: null,
      profileImageUrl: ''
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!userInfo.name || !userInfo.email || !userInfo.password || !userInfo.confirmPassword) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (userInfo.password !== userInfo.confirmPassword) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    if (userInfo.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInfo.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create user data object
      const userData = {
        name: userInfo.name,
        email: userInfo.email,
        profileImage: userInfo.profileImageUrl,
        joinedDate: new Date().toISOString(),
        id: Date.now() // Generate unique ID
      };

      // Save to localStorage
      localStorage.setItem('asimJofaUser', JSON.stringify(userData));
      
      // Call success callback
      if (onSignUpSuccess) {
        onSignUpSuccess(userData);
      }
      
      // Reset form
      setUserInfo({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      
      onClose(); // Close modal
      
    } catch (err) {
      setError('Sign up failed. Please try again.');
      console.error('Sign up error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Close modal and clean up
  const handleClose = () => {
    if (userInfo.profileImageUrl) {
      URL.revokeObjectURL(userInfo.profileImageUrl);
    }
    setError('');
    setUserInfo({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      profileImage: null,
      profileImageUrl: ''
    });
    onClose();
  };

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Account</h2>
          <button className="close-btn" onClick={handleClose} aria-label="Close">
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="signup-form">
          
         
          
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userInfo.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userInfo.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={userInfo.password}
              onChange={handleInputChange}
              placeholder="Create a password (min. 6 characters)"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={userInfo.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
          
          <div className="form-footer">
            <p>Already have an account? 
              <button 
                type="button" 
                className="text-link"
                onClick={handleClose}
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpModal;
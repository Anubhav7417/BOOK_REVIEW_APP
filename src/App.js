import React, { Component } from 'react';
import './App.css';
import logo from './logo.png';

class BookHubApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // User Management
      users: JSON.parse(localStorage.getItem('bookhub_users')) || [],
      currentUser: JSON.parse(localStorage.getItem('bookhub_current_user')) || null,
      userLibrary: JSON.parse(localStorage.getItem('user_library')) || [],
      
      // UI States
      showLoginModal: false,
      showBookModal: false,
      activeBook: null,
      activeGenre: 'all',
      searchTerm: '',
      
      // Form Data
      registerData: {
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      loginData: {
        username: '',
        password: ''
      },
      
      // Sample Books Data
      sampleBooks: [
        {
          id: '1',
          title: 'The Ramayana',
          author: 'Valmiki',
          cover: 'https://m.media-amazon.com/images/I/71FREGXGA1L._UF1000,1000_QL80_.jpg',
          pages: 500,
          genre: 'indian',
          description: 'The Ramayana is an ancient Indian epic which narrates the struggle of the divine prince Rama to rescue his wife Sita from the demon king Ravana.',
          contentPreview: 'In the beginning, there was the kingdom of Ayodhya, ruled by the wise King Dasharatha...',
          rating: 4.8,
          reviews: 245,
          trending: true,
          publishedYear: '500 BCE',
          language: 'Sanskrit'
        },
        {
          id: '2',
          title: 'The Mahabharata',
          author: 'Vyasa',
          cover: 'https://m.media-amazon.com/images/I/81gxiU-w93L.jpg',
          pages: 1200,
          genre: 'indian',
          description: 'The Mahabharata is one of the two major Sanskrit epics of ancient India, detailing the legendary Kurukshetra War fought between the Pandavas and the Kauravas.',
          contentPreview: 'The epic begins with King Shantanu of Hastinapura...',
          rating: 4.8,
          reviews: 76,
          trending: true,
          publishedYear: '400 BCE',
          language: 'Sanskrit'
        },
        {
          id: '3',
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          cover: 'https://i0.wp.com/www.printmag.com/wp-content/uploads/2017/07/2a34d8_a02f7a38d21c4666badc51e0e4973bd7mv2.jpg?resize=698%2C960&quality=89&ssl=1',
          pages: 281,
          genre: 'fiction',
          description: 'A gripping, heart-wrenching tale of race and identity in the American South during the 1930s.',
          contentPreview: 'When he was nearly thirteen, my brother Jem got his arm badly broken at the elbow...',
          rating: 4.7,
          reviews: 189,
          trending: false,
          publishedYear: '1960',
          language: 'English'
        },
        {
          id: '4',
          title: 'The God of Small Things',
          author: 'Arundhati Roy',
          cover: 'https://via.placeholder.com/150x200/ec4899/ffffff?text=Small+Things',
          pages: 340,
          genre: 'indian',
          description: 'A story about the childhood experiences of fraternal twins whose lives are destroyed by the "Love Laws".',
          contentPreview: 'May in Ayemenem is a hot, brooding month. The days are long and humid...',
          rating: 4.3,
          reviews: 156,
          trending: false,
          publishedYear: '1997',
          language: 'English'
        }
      ],

      // Sample Reviews
      sampleReviews: [
        {
          id: '1',
          bookId: '1',
          userId: 'user123',
          userName: 'BookwormRavi',
          userAvatar: 'https://ui-avatars.com/api/?name=Ravi&background=2563eb&color=fff',
          rating: 5,
          title: 'Timeless Epic! 🙏',
          content: 'The Ramayana is not just a story, it\'s a way of life. The characters, the values, the teachings - everything about this epic is profound. Must read for every Indian!',
          date: '2024-01-15',
          likes: 45
        },
        {
          id: '2',
          bookId: '2',
          userId: 'user456',
          userName: 'MythologyLover',
          userAvatar: 'https://ui-avatars.com/api/?name=Priya&background=06b6d4&color=fff',
          rating: 5,
          title: 'Epic of Epics! 🔥',
          content: 'The Mahabharata is everything - philosophy, politics, war, relationships. The Bhagavad Gita alone is worth reading this massive epic for. Life-changing!',
          date: '2024-02-20',
          likes: 67
        }
      ]
    };

    this.encryptionKey = this.generateEncryptionKey();
  }

  // Security & Authentication Methods
  generateEncryptionKey = () => {
    const existingKey = localStorage.getItem('encryption_key');
    if (existingKey) return existingKey;
    
    const newKey = 'bookhub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('encryption_key', newKey);
    return newKey;
  }

  hashPassword = (password) => {
    const salt = 'bookhub_salt_2024_secure';
    const stringToHash = password + salt + this.encryptionKey;
    return btoa(stringToHash.split('').reverse().join(''));
  }

  verifyPassword = (password, hashedPassword) => {
    return this.hashPassword(password) === hashedPassword;
  }

  // Input Sanitization
  sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }

  // User Authentication
  loginUser = (identifier, password) => {
    const { users } = this.state;
    const sanitizedIdentifier = this.sanitizeInput(identifier);
    const user = users.find(u => 
      u.username === sanitizedIdentifier || u.email === sanitizedIdentifier
    );

    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }

    if (!this.verifyPassword(password, user.password)) {
      return { success: false, message: 'Invalid credentials' };
    }

    user.lastLogin = new Date().toISOString();
    
    const currentUser = { 
      ...user, 
      isAdmin: false
    };
    
    this.setState({ 
      currentUser,
      showLoginModal: false,
      loginData: { username: '', password: '' }
    });
    
    localStorage.setItem('bookhub_current_user', JSON.stringify(currentUser));
    return { success: true, user: currentUser };
  }

  registerUser = (userData) => {
    const { users } = this.state;
    
    // Check if username already exists
    if (users.find(u => u.username === userData.username)) {
      return { success: false, message: 'Username already taken' };
    }

    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: 'Email already registered' };
    }

    if (userData.password !== userData.confirmPassword) {
      return { success: false, message: 'Passwords do not match' };
    }

    const newUser = {
      id: 'user_' + Date.now(),
      name: this.sanitizeInput(userData.name),
      username: this.sanitizeInput(userData.username),
      email: this.sanitizeInput(userData.email),
      password: this.hashPassword(userData.password),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=2563eb&color=fff`,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true,
      readingStats: {
        booksRead: 0,
        pagesRead: 0,
        readingTime: 0,
        favoriteGenres: []
      }
    };

    const newUsers = [...users, newUser];
    this.setState({ 
      users: newUsers,
      currentUser: { ...newUser, isAdmin: false },
      showLoginModal: false,
      registerData: { name: '', username: '', email: '', password: '', confirmPassword: '' }
    });
    
    localStorage.setItem('bookhub_users', JSON.stringify(newUsers));
    localStorage.setItem('bookhub_current_user', JSON.stringify({ ...newUser, isAdmin: false }));

    return { success: true, user: newUser };
  }

  // Book Management
  addBookToLibrary = (book) => {
    const { currentUser, userLibrary } = this.state;
    
    if (!currentUser) {
      this.showToast('Please login to add books to your library', 'warning');
      this.showLoginModal();
      return;
    }
    
    if (!userLibrary.find(b => b.id === book.id)) {
      const bookToAdd = {
        ...book,
        currentPage: 0,
        status: 'to-read',
        addedDate: new Date().toISOString()
      };
      
      const newLibrary = [...userLibrary, bookToAdd];
      this.setState({ userLibrary: newLibrary });
      localStorage.setItem('user_library', JSON.stringify(newLibrary));
      this.showToast(`Added "${book.title}" to your library! 📚`, 'success');
    } else {
      this.showToast('Book is already in your library', 'warning');
    }
  }

  // Modal Management
  showLoginModal = () => {
    this.setState({ 
      showLoginModal: true
    });
  }

  hideLoginModal = () => {
    this.setState({ 
      showLoginModal: false
    });
  }

  showBookDetails = (bookId) => {
    const bookData = this.state.sampleBooks.find(b => b.id === bookId) || 
                    this.state.userLibrary.find(b => b.id === bookId);
    
    if (bookData) {
      this.setState({ 
        showBookModal: true, 
        activeBook: bookData 
      });
    }
  }

  hideBookModal = () => {
    this.setState({ 
      showBookModal: false, 
      activeBook: null 
    });
  }

  // Input Handlers
  handleInputChange = (form, field, value) => {
    const sanitizedValue = this.sanitizeInput(value);
    this.setState(prevState => ({
      [form]: {
        ...prevState[form],
        [field]: sanitizedValue
      }
    }));
  }

  // Event Handlers
  handleUserLogin = (e) => {
    e.preventDefault();
    const { loginData } = this.state;
    
    if (!loginData.username || !loginData.password) {
      this.showToast('Please fill all fields', 'error');
      return;
    }
    
    const result = this.loginUser(loginData.username, loginData.password);
    
    if (result.success) {
      this.showToast('Welcome back! 🎉', 'success');
    } else {
      this.showToast(result.message, 'error');
    }
  }

  handleRegistration = (e) => {
    e.preventDefault();
    const { registerData } = this.state;
    
    if (!registerData.name || !registerData.username || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      this.showToast('Please fill all fields', 'error');
      return;
    }
    
    const result = this.registerUser(registerData);
    
    if (result.success) {
      this.showToast('Account created successfully! 🎉', 'success');
    } else {
      this.showToast(result.message, 'error');
    }
  }

  handleLogout = () => {
    this.setState({ currentUser: null });
    localStorage.removeItem('bookhub_current_user');
    this.showToast('Logged out successfully! 👋', 'success');
  }

  handleSearch = (e) => {
    if (e.key === 'Enter') {
      const searchTerm = e.target.value.trim();
      if (!searchTerm) return;
      
      const filteredBooks = this.state.sampleBooks.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (filteredBooks.length > 0) {
        this.showToast(`Found ${filteredBooks.length} books matching "${searchTerm}"`, 'success');
      } else {
        this.showToast(`No books found for "${searchTerm}"`, 'error');
      }
    }
  }

  handleGenreFilter = (genre) => {
    this.setState({ activeGenre: genre });
  }

  // Utility Methods
  showToast = (message, type = 'success') => {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span>${message}</span>
        <button class="toast-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    // Add to container
    const container = document.getElementById('toast-container');
    if (container) {
      container.appendChild(toast);
      
      // Animate in
      setTimeout(() => toast.classList.add('show'), 100);
      
      // Close button
      toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      });
      
      // Auto remove
      setTimeout(() => {
        if (toast.parentNode) {
          toast.classList.remove('show');
          setTimeout(() => toast.remove(), 300);
        }
      }, 5000);
    }
  }

  renderStars = (rating) => {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars += '<i class="fas fa-star"></i>';
      } else if (i - 0.5 <= rating) {
        stars += '<i class="fas fa-star-half-alt"></i>';
      } else {
        stars += '<i class="far fa-star"></i>';
      }
    }
    return stars;
  }

  // Render Methods
  renderLoginModal = () => {
    const { showLoginModal, registerData, loginData } = this.state;

    if (!showLoginModal) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button 
            onClick={this.hideLoginModal}
            className="modal-close"
          >
            <i className="fas fa-times"></i>
          </button>

          <h3 className="modal-title">Join BookHub 📚</h3>
          
          {/* Login Form */}
          <form onSubmit={this.handleUserLogin} className="auth-form">
            <div className="form-group">
              <label className="form-label">Username or Email</label>
              <input 
                type="text" 
                value={loginData.username}
                onChange={(e) => this.handleInputChange('loginData', 'username', e.target.value)}
                required 
                className="form-input" 
                placeholder="Enter username or email" 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                value={loginData.password}
                onChange={(e) => this.handleInputChange('loginData', 'password', e.target.value)}
                required 
                className="form-input" 
                placeholder="Enter password" 
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full">
              Let's Go! 🚀
            </button>
            
            <div className="auth-divider">
              <span>Or continue with</span>
            </div>
            
            <div className="auth-buttons">
              <button type="button" className="btn btn-google">
                <i className="fab fa-google"></i>
                Google
              </button>
            </div>
            
            <div className="auth-switch">
              Don't have an account? <button type="button" onClick={() => this.setState({ activeForm: 'register' })} className="auth-link">Sign up now! ✨</button>
            </div>
          </form>

          {/* Registration Form */}
          <form onSubmit={this.handleRegistration} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name 👤</label>
              <input 
                type="text" 
                value={registerData.name}
                onChange={(e) => this.handleInputChange('registerData', 'name', e.target.value)}
                required 
                className="form-input" 
                placeholder="Enter your full name" 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Username 🆔</label>
              <input 
                type="text" 
                value={registerData.username}
                onChange={(e) => this.handleInputChange('registerData', 'username', e.target.value)}
                required 
                className="form-input" 
                placeholder="Choose a cool username" 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email 📧</label>
              <input 
                type="email" 
                value={registerData.email}
                onChange={(e) => this.handleInputChange('registerData', 'email', e.target.value)}
                required 
                className="form-input" 
                placeholder="Enter your email" 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password 🔒</label>
              <input 
                type="password" 
                value={registerData.password}
                onChange={(e) => this.handleInputChange('registerData', 'password', e.target.value)}
                required 
                className="form-input" 
                placeholder="Create a strong password" 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password 🔒</label>
              <input 
                type="password" 
                value={registerData.confirmPassword}
                onChange={(e) => this.handleInputChange('registerData', 'confirmPassword', e.target.value)}
                required 
                className="form-input" 
                placeholder="Confirm your password" 
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full">
              Create Account 🎉
            </button>
          </form>
        </div>
      </div>
    );
  }

  renderBookDetailsModal = () => {
    const { activeBook } = this.state;
    
    if (!activeBook) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content book-modal">
          <button onClick={this.hideBookModal} className="modal-close">
            <i className="fas fa-times"></i>
          </button>
          
          <div className="book-modal-grid">
            <div className="book-modal-cover">
              <img src={activeBook.cover} alt={activeBook.title} className="book-cover-large" />
            </div>
            
            <div className="book-modal-details">
              <h2 className="book-modal-title">{activeBook.title}</h2>
              <p className="book-modal-author">by {activeBook.author}</p>
              
              <div className="book-modal-rating">
                <div className="star-rating" dangerouslySetInnerHTML={{ __html: this.renderStars(activeBook.rating) }} />
                <span className="rating-text">{activeBook.rating}/5 ({activeBook.reviews} reviews)</span>
              </div>
              
              <div className="book-modal-meta">
                <div className="meta-item">
                  <span className="meta-label">Pages</span>
                  <span className="meta-value">{activeBook.pages}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Genre</span>
                  <span className="meta-value">{activeBook.genre}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Published</span>
                  <span className="meta-value">{activeBook.publishedYear}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Language</span>
                  <span className="meta-value">{activeBook.language}</span>
                </div>
              </div>
              
              <div className="book-modal-description">
                <h3>About this book</h3>
                <p>{activeBook.description}</p>
              </div>
              
              <div className="book-modal-actions">
                <button 
                  onClick={() => this.addBookToLibrary(activeBook)}
                  className="btn btn-primary"
                >
                  <i className="fas fa-plus"></i>
                  Add to Library
                </button>
                <button className="btn btn-outline">
                  <i className="fas fa-share"></i>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderBooksGrid = () => {
    const { activeGenre, sampleBooks } = this.state;
    const filteredBooks = activeGenre === 'all' 
      ? sampleBooks 
      : sampleBooks.filter(book => book.genre === activeGenre);

    return filteredBooks.map(book => (
      <div key={book.id} className="book-card">
        <img 
          src={book.cover} 
          alt={book.title}
          className="book-cover"
        />
        <div className="book-info">
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">by {book.author}</p>
          <div className="book-meta">
            <span className="book-genre">{book.genre}</span>
            <div className="book-rating">
              <div dangerouslySetInnerHTML={{ __html: this.renderStars(book.rating) }} />
              <span>{book.rating}</span>
            </div>
          </div>
          <p className="book-description">{book.description}</p>
        </div>
        <div className="book-actions">
          <button 
            onClick={() => this.addBookToLibrary(book)}
            className="book-btn book-btn-primary"
          >
            Add to Library
          </button>
          <button 
            onClick={() => this.showBookDetails(book.id)}
            className="book-btn book-btn-outline"
          >
            Details
          </button>
        </div>
      </div>
    ));
  }

  renderReviews = () => {
    return this.state.sampleReviews.map(review => {
      const book = this.state.sampleBooks.find(b => b.id === review.bookId);
      return (
        <div key={review.id} className="review-card">
          <div className="review-header">
            <img src={review.userAvatar} alt={review.userName} className="review-avatar" />
            <div className="review-user">
              <h4 className="review-username">{review.userName}</h4>
              <p className="review-book">Reviewed "{book.title}"</p>
            </div>
            <div className="review-date">{review.date}</div>
          </div>
          <div className="review-rating">
            <div dangerouslySetInnerHTML={{ __html: this.renderStars(review.rating) }} />
          </div>
          <h5 className="review-title">{review.title}</h5>
          <p className="review-content">{review.content}</p>
          <div className="review-actions">
            <button className="review-btn">
              <i className="fas fa-thumbs-up"></i> {review.likes}
            </button>
            <button className="review-btn">
              <i className="fas fa-comment"></i> Reply
            </button>
            <button className="review-btn">
              <i className="fas fa-share"></i>
            </button>
          </div>
        </div>
      );
    });
  }

  render() {
    const { currentUser, showBookModal, activeGenre } = this.state;

    return (
      <div className="app">
        {/* Toast Container */}
        <div id="toast-container" className="toast-container"></div>

        {/* Book Details Modal */}
        {showBookModal && this.renderBookDetailsModal()}

        {/* Login Modal */}
        {this.renderLoginModal()}

        {/* Navigation */}
        <nav className="navbar">
          <div className="nav-content">
            <a href="#" className="logo">
              <div className="logo-icon">
                <img src={logo} alt="BookHub Logo" className="logo-image" />
              </div>
              BookHub
            </a>
            
            <div className="nav-links">
              <a href="#discover" className="nav-link">Discover</a>
              <a href="#reviews" className="nav-link">Reviews</a>
              {currentUser && (
                <a href="#library" className="nav-link">My Library</a>
              )}
            </div>
            
            <div className="user-actions">
              {currentUser ? (
                <div className="user-menu">
                  <img src={currentUser.avatar} alt={currentUser.name} className="user-avatar" />
                  <span className="user-name">{currentUser.name}</span>
                  <button onClick={this.handleLogout} className="btn btn-outline btn-small">
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </div>
              ) : (
                <button onClick={this.showLoginModal} className="btn btn-primary">
                  <i className="fas fa-user"></i> Login
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Read, Review, <span className="hero-title-accent">Vibe</span> 📚✨
            </h1>
            <p className="hero-subtitle">
              Join the lit reading community! Track your books, drop fire reviews, and connect with fellow bookworms. No cap, it's the best reading app out there! 🔥
            </p>
            
            <div className="search-container">
              <input 
                type="text" 
                className="search-bar"
                placeholder="Search for books, authors, or vibes..."
                onKeyPress={this.handleSearch}
              />
              <i className="fas fa-search search-icon"></i>
            </div>
            
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">1.2K+</span>
                <span className="stat-label">Lit Reviews</span>
              </div>
              <div className="stat">
                <span className="stat-number">567</span>
                <span className="stat-label">Active Readers</span>
              </div>
              <div className="stat">
                <span className="stat-number">89</span>
                <span className="stat-label">New This Week</span>
              </div>
            </div>
          </div>
        </section>

        {/* Discover Section */}
        <section id="discover" className="section discover-section">
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">Discover New Reads 🔍</h2>
              <p className="section-subtitle">
                Find your next obsession! Explore books across genres and vibes.
              </p>
            </div>

            <div className="genre-filters">
              {['all', 'indian', 'fiction'].map(genre => (
                <button
                  key={genre}
                  onClick={() => this.handleGenreFilter(genre)}
                  className={`genre-filter ${activeGenre === genre ? 'active' : ''}`}
                >
                  {genre === 'all' ? 'All Genres' : genre.charAt(0).toUpperCase() + genre.slice(1)}
                </button>
              ))}
            </div>

            <div className="books-grid">
              {this.renderBooksGrid()}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="section reviews-section">
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">Community Reviews 💬</h2>
              <p className="section-subtitle">
                See what the community is saying about their latest reads! Spill the tea ☕
              </p>
            </div>

            <div className="reviews-grid">
              {this.renderReviews()}
            </div>
          </div>
        </section>

        {/* My Library Section (only for logged in users) */}
        {currentUser && (
          <section id="library" className="section library-section">
            <div className="section-container">
              <div className="section-header">
                <h2 className="section-title">My Library 📚</h2>
                <p className="section-subtitle">
                  Your personal book collection - organized and lit! 🔥
                </p>
              </div>

              {this.state.userLibrary.length === 0 ? (
                <div className="empty-library">
                  <i className="fas fa-book-open empty-icon"></i>
                  <h3>Your library is empty</h3>
                  <p>Add some books to get started!</p>
                </div>
              ) : (
                <div className="books-grid">
                  {this.state.userLibrary.map(book => (
                    <div key={book.id} className="book-card">
                      <img src={book.cover} alt={book.title} className="book-cover" />
                      <div className="book-info">
                        <h3 className="book-title">{book.title}</h3>
                        <p className="book-author">by {book.author}</p>
                        <div className="book-progress">
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: '0%' }}></div>
                          </div>
                          <span className="progress-text">0% read</span>
                        </div>
                      </div>
                      <div className="book-actions">
                        <button className="book-btn book-btn-primary">
                          Update Progress
                        </button>
                        <button 
                          onClick={() => this.showBookDetails(book.id)}
                          className="book-btn book-btn-outline"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3 className="footer-heading">BookHub</h3>
              <p className="footer-text">
                Your digital library for discovering, tracking, and reviewing books. Join our community of passionate readers!
              </p>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 BookHub. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }
}

export default BookHubApp;

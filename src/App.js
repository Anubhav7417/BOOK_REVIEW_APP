import React, { Component } from 'react';
import './App.css';
import logo from './logo.png';

class BookHubApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // We'll add state in Part 2
    };
  }

  render() {
    return (
      <div className="app">
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
              <a href="#Reviews" className="nav-link">Reviews</a>
            </div>
            
            <div className="user-actions">
              <button className="btn btn-primary">
                <i className="fas fa-user"></i> Login
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Review, <span className="hero-title-accent">Vibe</span>
            </h1>
            <p className="hero-subtitle">
              Join the reading community! Track your books, drop fire reviews, and connect with fellow bookworms. No cap, it's the best reading app out there! 
            </p>
            
            <div className="search-container">
              <input 
                type="text" 
                className="search-bar"
                placeholder="Search for books, authors, or vibes..."
              />
              <i className="fas fa-search search-icon"></i>
            </div>
            
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">56</span>
                <span className="stat-label">Lit Reviews</span>
              </div>
              <div className="stat">
                <span className="stat-number">45</span>
                <span className="stat-label">Active Readers</span>
              </div>
              <div className="stat">
                <span className="stat-number">47</span>
                <span className="stat-label">New This Week</span>
              </div>
            </div>
          </div>
        </section>

        {/* Discover Section */}
        <section id="discover" className="section discover-section">
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">Discover New Reads</h2>
              <p className="section-subtitle">
                Find your next obsession! Explore books across genres and vibes.
              </p>
            </div>

            <div className="genre-filters">
              <button className="genre-filter">All Genres</button>
              <button className="genre-filter">Fiction</button>
              <button className="genre-filter">Indian Literature</button>
              <button className="genre-filter">Non-Fiction</button>
            </div>

            <div className="books-grid">
              {/* Book Card 1 - The Ramayana */}
              <div className="book-card">
                <img 
                  src="https://m.media-amazon.com/images/I/71FREGXGA1L._UF1000,1000_QL80_.jpg" 
                  alt="The Ramayana"
                  className="book-cover"
                />
                <div className="book-info">
                  <h3 className="book-title">The Ramayana</h3>
                  <p className="book-author">by Valmiki</p>
                  <div className="book-meta">
                    <span className="book-genre">Indian</span>
                    <div className="book-rating">
                      <i className="fas fa-star"></i>
                      <span>4.8</span>
                    </div>
                  </div>
                  <p className="book-description">
                    The Ramayana is an ancient Indian epic which narrates the struggle of the divine prince Rama to rescue his wife Sita from the demon king Ravana.
                  </p>
                </div>
                <div className="book-actions">
                  <button className="book-btn book-btn-primary">
                    Add to Library
                  </button>
                  <button className="book-btn book-btn-outline">
                    Details
                  </button>
                </div>
              </div>

              {/* Book Card 2 - The Mahabharata */}
              <div className="book-card">
                <img 
                  src="https://m.media-amazon.com/images/I/81gxiU-w93L.jpg" 
                  alt="The Mahabharata"
                  className="book-cover"
                />
                <div className="book-info">
                  <h3 className="book-title">The Mahabharata</h3>
                  <p className="book-author">by Vyasa</p>
                  <div className="book-meta">
                    <span className="book-genre">Indian</span>
                    <div className="book-rating">
                      <i className="fas fa-star"></i>
                      <span>4.8</span>
                    </div>
                  </div>
                  <p className="book-description">
                    The Mahabharata is one of the two major Sanskrit epics of ancient India, detailing the legendary Kurukshetra War fought between the Pandavas and the Kauravas.
                  </p>
                </div>
                <div className="book-actions">
                  <button className="book-btn book-btn-primary">
                    Add to Library
                  </button>
                  <button className="book-btn book-btn-outline">
                    Details
                  </button>
                </div>
              </div>

              {/* Book Card 3 - To Kill a Mockingbird */}
              <div className="book-card">
                <img 
                  src="https://i0.wp.com/www.printmag.com/wp-content/uploads/2017/07/2a34d8_a02f7a38d21c4666badc51e0e4973bd7mv2.jpg?resize=698%2C960&quality=89&ssl=1" 
                  alt="To Kill a Mockingbird"
                  className="book-cover"
                />
                <div className="book-info">
                  <h3 className="book-title">To Kill a Mockingbird</h3>
                  <p className="book-author">by Harper Lee</p>
                  <div className="book-meta">
                    <span className="book-genre">Fiction</span>
                    <div className="book-rating">
                      <i className="fas fa-star"></i>
                      <span>4.7</span>
                    </div>
                  </div>
                  <p className="book-description">
                    A gripping, heart-wrenching tale of race and identity in the American South during the 1930s.
                  </p>
                </div>
                <div className="book-actions">
                  <button className="book-btn book-btn-primary">
                    Add to Library
                  </button>
                  <button className="book-btn book-btn-outline">
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

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

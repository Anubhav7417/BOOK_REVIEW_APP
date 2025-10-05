import React, { Component } from 'react';

class BookHubApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // We'll add state in Part 2
    };
  }

  render() {
    // CSS styles for our component
    const styles = {
      // Main container styles
      app: {
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        minHeight: '100vh',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
      },

      // Navigation styles
      navbar: {
        position: 'fixed',
        top: 0,
        width: '100%',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 1000,
        padding: '1rem 0'
      },
      navContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
      logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#f8fafc',
        textDecoration: 'none'
      },
      logoIcon: {
        width: '40px',
        height: '40px',
        background: '#2563eb',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      navLinks: {
        display: 'flex',
        gap: '2rem'
      },
      navLink: {
        color: '#64748b',
        textDecoration: 'none',
        fontWeight: '500',
        transition: 'color 0.3s'
      },
      userActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      },

      // Button styles
      btn: {
        padding: '0.75rem 1.5rem',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem'
      },
      btnPrimary: {
        background: '#2563eb',
        color: 'white'
      },

      // Hero section styles
      hero: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      },
      heroContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        position: 'relative',
        zIndex: 2,
        maxWidth: '600px'
      },
      heroTitle: {
        fontSize: '3.5rem',
        fontWeight: '800',
        lineHeight: '1.1',
        marginBottom: '1.5rem',
        background: 'linear-gradient(135deg, #2563eb 0%, #ec4899 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent'
      },
      heroSubtitle: {
        fontSize: '1.25rem',
        color: '#64748b',
        marginBottom: '2rem',
        lineHeight: '1.6'
      },
      searchContainer: {
        maxWidth: '500px',
        marginBottom: '3rem',
        position: 'relative'
      },
      searchBar: {
        width: '100%',
        padding: '1rem 1.5rem',
        background: '#1e293b',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '50px',
        color: '#f8fafc',
        fontSize: '1rem',
        transition: 'all 0.3s'
      },
      searchIcon: {
        position: 'absolute',
        right: '1.5rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#64748b'
      },
      heroStats: {
        display: 'flex',
        gap: '2rem',
        marginTop: '2rem'
      },
      stat: {
        textAlign: 'center'
      },
      statNumber: {
        fontSize: '2rem',
        fontWeight: '700',
        color: '#2563eb',
        display: 'block'
      },
      statLabel: {
        fontSize: '0.875rem',
        color: '#64748b'
      },

      // Section styles
      section: {
        padding: '5rem 0'
      },
      sectionHeader: {
        textAlign: 'center',
        marginBottom: '3rem'
      },
      sectionTitle: {
        fontSize: '2.5rem',
        fontWeight: '700',
        marginBottom: '1rem',
        color: '#f8fafc'
      },
      sectionSubtitle: {
        fontSize: '1.125rem',
        color: '#64748b',
        maxWidth: '600px',
        margin: '0 auto'
      },

      // Book grid styles
      booksGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '2rem',
        margin: '3rem 0'
      },

      // Book card styles
      bookCard: {
        background: '#1e293b',
        borderRadius: '16px',
        padding: '1.5rem',
        transition: 'all 0.3s',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      },
      bookCover: {
        width: '100%',
        height: '200px',
        borderRadius: '12px',
        marginBottom: '1rem',
        objectFit: 'cover'
      },
      bookInfo: {
        marginBottom: '1.5rem'
      },
      bookTitle: {
        fontSize: '1.25rem',
        fontWeight: '700',
        marginBottom: '0.5rem',
        color: '#f8fafc'
      },
      bookAuthor: {
        color: '#64748b',
        fontSize: '0.9rem',
        marginBottom: '0.5rem'
      },
      bookMeta: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem'
      },
      bookGenre: {
        background: 'rgba(37, 99, 235, 0.2)',
        color: '#2563eb',
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600'
      },
      bookRating: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        color: '#f59e0b',
        fontSize: '0.9rem'
      },
      bookDescription: {
        color: '#64748b',
        fontSize: '0.9rem',
        lineHeight: '1.5',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      },
      bookActions: {
        display: 'flex',
        gap: '0.75rem'
      },
      bookBtn: {
        flex: 1,
        padding: '0.75rem',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '0.85rem',
        cursor: 'pointer',
        transition: 'all 0.3s',
        textAlign: 'center'
      },
      bookBtnPrimary: {
        background: '#2563eb',
        color: 'white'
      },
      bookBtnOutline: {
        background: 'transparent',
        color: '#64748b',
        border: '1px solid #64748b'
      },

      // Genre filters
      genreFilters: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '3rem'
      },
      genreFilter: {
        padding: '0.5rem 1.25rem',
        background: '#1e293b',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '50px',
        color: '#64748b',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.3s'
      },

      // Footer styles
      footer: {
        background: '#1e293b',
        padding: '3rem 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      },
      footerContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '3rem'
      },
      footerSection: {
        marginBottom: '2rem'
      },
      footerHeading: {
        color: '#f8fafc',
        marginBottom: '1rem',
        fontSize: '1.125rem'
      },
      footerBottom: {
        textAlign: 'center',
        paddingTop: '2rem',
        marginTop: '2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#64748b'
      }
    };

    return (
      <div style={styles.app}>
        {/* Navigation */}
        <nav style={styles.navbar}>
          <div style={styles.navContent}>
            <a href="#" style={styles.logo}>
              <div style={styles.logoIcon}>
                <i className="fas fa-book"></i>
              </div>
              BookHub
            </a>
            
            <div style={styles.navLinks}>
              <a href="#discover" style={styles.navLink}>Discover</a>
            </div>
            
            <div style={styles.userActions}>
              <button style={{...styles.btn, ...styles.btnPrimary}}>
                <i className="fas fa-user"></i> Login
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              Read, Review, <span style={{color: '#2563eb'}}>Vibe</span> 📚✨
            </h1>
            <p style={styles.heroSubtitle}>
              Join the lit reading community! Track your books, drop fire reviews, and connect with fellow bookworms. No cap, it's the best reading app out there! 🔥
            </p>
            
            <div style={styles.searchContainer}>
              <input 
                type="text" 
                style={styles.searchBar}
                placeholder="Search for books, authors, or vibes..."
              />
              <i className="fas fa-search" style={styles.searchIcon}></i>
            </div>
            
            <div style={styles.heroStats}>
              <div style={styles.stat}>
                <span style={styles.statNumber}>1.2K+</span>
                <span style={styles.statLabel}>Lit Reviews</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNumber}>567</span>
                <span style={styles.statLabel}>Active Readers</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNumber}>89</span>
                <span style={styles.statLabel}>New This Week</span>
              </div>
            </div>
          </div>
        </section>

        {/* Discover Section */}
        <section id="discover" style={{...styles.section, backgroundColor: '#0f172a'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 1rem'}}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Discover New Reads 🔍</h2>
              <p style={styles.sectionSubtitle}>
                Find your next obsession! Explore books across genres and vibes.
              </p>
            </div>

            <div style={styles.genreFilters}>
              <button style={styles.genreFilter}>All Genres</button>
              <button style={styles.genreFilter}>Fiction</button>
              <button style={styles.genreFilter}>Indian Literature</button>
              <button style={styles.genreFilter}>Non-Fiction</button>
            </div>

            <div style={styles.booksGrid}>
              {/* Book Card 1 - The Ramayana */}
              <div style={styles.bookCard}>
                <img 
                  src="https://m.media-amazon.com/images/I/71FREGXGA1L._UF1000,1000_QL80_.jpg" 
                  alt="The Ramayana"
                  style={styles.bookCover}
                />
                <div style={styles.bookInfo}>
                  <h3 style={styles.bookTitle}>The Ramayana</h3>
                  <p style={styles.bookAuthor}>by Valmiki</p>
                  <div style={styles.bookMeta}>
                    <span style={styles.bookGenre}>Indian</span>
                    <div style={styles.bookRating}>
                      <i className="fas fa-star"></i>
                      <span>4.8</span>
                    </div>
                  </div>
                  <p style={styles.bookDescription}>
                    The Ramayana is an ancient Indian epic which narrates the struggle of the divine prince Rama to rescue his wife Sita from the demon king Ravana.
                  </p>
                </div>
                <div style={styles.bookActions}>
                  <button style={{...styles.bookBtn, ...styles.bookBtnPrimary}}>
                    Add to Library
                  </button>
                  <button style={{...styles.bookBtn, ...styles.bookBtnOutline}}>
                    Details
                  </button>
                </div>
              </div>

              {/* Book Card 2 - The Mahabharata */}
              <div style={styles.bookCard}>
                <img 
                  src="https://m.media-amazon.com/images/I/81gxiU-w93L.jpg" 
                  alt="The Mahabharata"
                  style={styles.bookCover}
                />
                <div style={styles.bookInfo}>
                  <h3 style={styles.bookTitle}>The Mahabharata</h3>
                  <p style={styles.bookAuthor}>by Vyasa</p>
                  <div style={styles.bookMeta}>
                    <span style={styles.bookGenre}>Indian</span>
                    <div style={styles.bookRating}>
                      <i className="fas fa-star"></i>
                      <span>4.8</span>
                    </div>
                  </div>
                  <p style={styles.bookDescription}>
                    The Mahabharata is one of the two major Sanskrit epics of ancient India, detailing the legendary Kurukshetra War fought between the Pandavas and the Kauravas.
                  </p>
                </div>
                <div style={styles.bookActions}>
                  <button style={{...styles.bookBtn, ...styles.bookBtnPrimary}}>
                    Add to Library
                  </button>
                  <button style={{...styles.bookBtn, ...styles.bookBtnOutline}}>
                    Details
                  </button>
                </div>
              </div>

              {/* Book Card 3 - To Kill a Mockingbird */}
              <div style={styles.bookCard}>
                <img 
                  src="https://i0.wp.com/www.printmag.com/wp-content/uploads/2017/07/2a34d8_a02f7a38d21c4666badc51e0e4973bd7mv2.jpg?resize=698%2C960&quality=89&ssl=1" 
                  alt="To Kill a Mockingbird"
                  style={styles.bookCover}
                />
                <div style={styles.bookInfo}>
                  <h3 style={styles.bookTitle}>To Kill a Mockingbird</h3>
                  <p style={styles.bookAuthor}>by Harper Lee</p>
                  <div style={styles.bookMeta}>
                    <span style={styles.bookGenre}>Fiction</span>
                    <div style={styles.bookRating}>
                      <i className="fas fa-star"></i>
                      <span>4.7</span>
                    </div>
                  </div>
                  <p style={styles.bookDescription}>
                    A gripping, heart-wrenching tale of race and identity in the American South during the 1930s.
                  </p>
                </div>
                <div style={styles.bookActions}>
                  <button style={{...styles.bookBtn, ...styles.bookBtnPrimary}}>
                    Add to Library
                  </button>
                  <button style={{...styles.bookBtn, ...styles.bookBtnOutline}}>
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={styles.footerContent}>
            <div style={styles.footerSection}>
              <h3 style={styles.footerHeading}>BookHub 📚</h3>
              <p style={{color: '#64748b'}}>
                Your digital library for discovering, tracking, and reviewing books. Join our community of passionate readers!
              </p>
            </div>
          </div>
          
          <div style={styles.footerBottom}>
            <p>&copy; 2024 BookHub. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }
}

export default BookHubApp;

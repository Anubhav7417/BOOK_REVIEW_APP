import React, { useState, useEffect } from "react";
import "./index.css";

// Storage Keys
const STORAGE = {
  USERS: "whitebook_users",
  CURRENT_USER: "whitebook_current_user",
  LIBRARY: "whitebook_library",
  REVIEWS: "whitebook_reviews"
};

// Helper Functions
const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
};

const generateCaptcha = () => {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { question: `${a} + ${b} = ?`, answer: a + b };
};

// Initialize Admin
const initAdmin = async () => {
  const users = JSON.parse(localStorage.getItem(STORAGE.USERS) || "[]");
  if (users.length === 0) {
    const adminHash = await hashPassword("QWERTY@123");
    const adminUser = {
      id: generateId(),
      username: "Anonymous@",
      email: "anonymous@bookhub.com",
      passwordHash: adminHash,
      role: "admin",
      avatar: "A",
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE.USERS, JSON.stringify([adminUser]));
  }
};

// Demo Books
const DEMO_BOOKS = [
  {
    id: "demo1",
    title: "The Great Gatsby",
    authors: ["F. Scott Fitzgerald"],
    thumbnail: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    description: "A classic novel of the Jazz Age, exploring themes of idealism, resistance to change, social upheaval, and excess.",
    rating: 4.5,
    pages: 218,
    genre: ["Classic", "Fiction"],
    published: "1925",
    color: "#3b82f6"
  },
  {
    id: "demo2",
    title: "To Kill a Mockingbird",
    authors: ["Harper Lee"],
    thumbnail: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop",
    description: "A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by prejudice.",
    rating: 4.8,
    pages: 324,
    genre: ["Classic", "Fiction"],
    published: "1960",
    color: "#10b981"
  },
  {
    id: "demo3",
    title: "1984",
    authors: ["George Orwell"],
    thumbnail: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    description: "A dystopian social science fiction novel that examines the consequences of totalitarianism.",
    rating: 4.7,
    pages: 328,
    genre: ["Dystopian", "Fiction"],
    published: "1949",
    color: "#8b5cf6"
  },
  {
    id: "demo4",
    title: "Pride and Prejudice",
    authors: ["Jane Austen"],
    thumbnail: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
    description: "A romantic novel of manners that depicts the emotional development of protagonist Elizabeth Bennet.",
    rating: 4.6,
    pages: 432,
    genre: ["Romance", "Classic"],
    published: "1813",
    color: "#f97316"
  }
];

function App() {
  // State
  const [currentUser, setCurrentUser] = useState(null);
  const [library, setLibrary] = useState([]);
  const [reviews, setReviews] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("discover");
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState({});
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [newReview, setNewReview] = useState({ text: "", rating: 5 });

  // Initialize
  useEffect(() => {
    initAdmin();
    
    // Load saved data
    const savedUser = localStorage.getItem(STORAGE.CURRENT_USER);
    const savedLibrary = localStorage.getItem(STORAGE.LIBRARY);
    const savedReviews = localStorage.getItem(STORAGE.REVIEWS);
    
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedLibrary) setLibrary(JSON.parse(savedLibrary));
    if (savedReviews) setReviews(JSON.parse(savedReviews));
  }, []);

  // Save data
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE.CURRENT_USER, JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE.LIBRARY, JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    localStorage.setItem(STORAGE.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  // Search Books
  const searchBooks = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=12`
      );
      const data = await response.json();
      
      const books = (data.items || []).map(item => ({
        id: item.id,
        title: item.volumeInfo?.title || "Untitled Book",
        authors: item.volumeInfo?.authors || ["Unknown Author"],
        thumbnail: item.volumeInfo?.imageLinks?.thumbnail?.replace("http://", "https://") || 
                  `https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop&q=80`,
        description: item.volumeInfo?.description || "No description available for this book.",
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        pages: item.volumeInfo?.pageCount || Math.floor(Math.random() * 400) + 200,
        genre: item.volumeInfo?.categories || ["Fiction"],
        published: item.volumeInfo?.publishedDate?.split("-")[0] || "2023",
        color: ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f97316"][Math.floor(Math.random() * 5)]
      }));
      
      setSearchResults(books);
    } catch (error) {
      console.error("Search error:", error);
      alert("Failed to search books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadDemoBooks = () => {
    setSearchResults(DEMO_BOOKS);
  };

  // Library Operations
  const addToLibrary = (book) => {
    if (library.some(b => b.id === book.id)) {
      alert("This book is already in your library!");
      return;
    }
    
    const enhancedBook = {
      ...book,
      addedDate: new Date().toISOString(),
      favorite: false,
      readProgress: 0
    };
    
    setLibrary(prev => [...prev, enhancedBook]);
    alert(`"${book.title}" has been added to your library!`);
  };

  const removeFromLibrary = (bookId) => {
    const book = library.find(b => b.id === bookId);
    if (book && window.confirm(`Remove "${book.title}" from your library?`)) {
      setLibrary(prev => prev.filter(b => b.id !== bookId));
    }
  };

  const addCustomBook = (bookData) => {
    const newBook = {
      id: generateId(),
      ...bookData,
      source: "custom",
      owner: currentUser?.username || "anonymous",
      addedDate: new Date().toISOString(),
      rating: 0,
      pages: 250,
      color: "#3b82f6"
    };
    
    setLibrary(prev => [...prev, newBook]);
    setActiveModal(null);
    alert("Your custom book has been added to the library!");
  };

  // Review Functions - FIXED AND WORKING
  const submitReview = (bookId) => {
    if (!currentUser) {
      alert("Please login to submit a review");
      setActiveModal("login");
      return;
    }
    
    if (!newReview.text.trim()) {
      alert("Please write your review before submitting");
      return;
    }
    
    const review = {
      id: generateId(),
      bookId,
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar || currentUser.username.charAt(0).toUpperCase(),
      text: newReview.text,
      rating: newReview.rating,
      date: new Date().toISOString()
    };
    
    setReviews(prev => {
      const bookReviews = prev[bookId] || [];
      return { ...prev, [bookId]: [...bookReviews, review] };
    });
    
    setNewReview({ text: "", rating: 5 });
    alert("Thank you for your review!");
  };

  const quickAddReview = (bookId) => {
    if (!currentUser) {
      alert("Please login to add a review");
      setActiveModal("login");
      return;
    }
    
    const reviewText = prompt("Write your review:");
    if (reviewText && reviewText.trim()) {
      const rating = prompt("Rating (1-5):", "5");
      const review = {
        id: generateId(),
        bookId,
        userId: currentUser.id,
        username: currentUser.username,
        avatar: currentUser.avatar || currentUser.username.charAt(0).toUpperCase(),
        text: reviewText,
        rating: parseInt(rating) || 5,
        date: new Date().toISOString()
      };
      
      setReviews(prev => {
        const bookReviews = prev[bookId] || [];
        return { ...prev, [bookId]: [...bookReviews, review] };
      });
      
      alert("Review added!");
    }
  };

  // Authentication
  const handleLogin = async (email, password, captchaAnswer) => {
    try {
      if (Number(captchaAnswer) !== captcha.answer) {
        throw new Error("Incorrect captcha answer. Please try again.");
      }
      
      const users = JSON.parse(localStorage.getItem(STORAGE.USERS) || "[]");
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) throw new Error("No account found with this email.");
      
      const passwordHash = await hashPassword(password);
      if (user.passwordHash !== passwordHash) throw new Error("Incorrect password.");
      
      setCurrentUser({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      });
      
      setActiveModal(null);
      alert(`Welcome back, ${user.username}!`);
      setCaptcha(generateCaptcha());
    } catch (error) {
      alert(error.message);
      setCaptcha(generateCaptcha());
    }
  };

  const handleRegister = async (userData) => {
    try {
      if (Number(userData.captchaAnswer) !== captcha.answer) {
        throw new Error("Incorrect captcha answer.");
      }
      
      const users = JSON.parse(localStorage.getItem(STORAGE.USERS) || "[]");
      if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        throw new Error("This email is already registered.");
      }
      
      const passwordHash = await hashPassword(userData.password);
      const newUser = {
        id: generateId(),
        username: userData.username || userData.email.split("@")[0],
        email: userData.email,
        passwordHash,
        role: "user",
        avatar: userData.username?.charAt(0).toUpperCase() || userData.email.charAt(0).toUpperCase(),
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem(STORAGE.USERS, JSON.stringify([...users, newUser]));
      setCurrentUser({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar
      });
      
      setActiveModal(null);
      alert("Account created successfully! Welcome to BookHub!");
      setCaptcha(generateCaptcha());
    } catch (error) {
      alert(error.message);
      setCaptcha(generateCaptcha());
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    alert("You have been logged out successfully.");
  };

  // Admin Functions
  const exportData = () => {
    const data = {
      library,
      reviews,
      users: JSON.parse(localStorage.getItem(STORAGE.USERS) || "[]"),
      exportedAt: new Date().toISOString(),
      app: "BookHub White Theme"
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookhub_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert("Data exported successfully!");
  };

  const clearReviews = () => {
    if (window.confirm("Clear all reviews? This action cannot be undone.")) {
      setReviews({});
      alert("All reviews have been cleared.");
    }
  };

  // Stats
  const stats = {
    totalBooks: library.length,
    totalReviews: Object.values(reviews).reduce((sum, bookReviews) => sum + bookReviews.length, 0),
    totalPages: library.reduce((sum, book) => sum + (book.pages || 0), 0),
    readingTime: Math.ceil(library.reduce((sum, book) => sum + (book.pages || 0), 0) / 250)
  };

  // Modal Components
  const LoginModal = () => (
    <div className="modal">
      <div className="modal-header">
        <h2 className="modal-title">Welcome Back</h2>
        <button className="close-btn" onClick={() => setActiveModal(null)}>×</button>
      </div>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        handleLogin(
          formData.get("email"),
          formData.get("password"),
          formData.get("captcha")
        );
      }}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input type="email" name="email" className="form-input" placeholder="you@example.com" required />
        </div>
        
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" name="password" className="form-input" placeholder="••••••••" required />
        </div>
        
        <div className="form-group">
          <label className="form-label">Security Check: {captcha.question}</label>
          <input type="number" name="captcha" className="form-input" placeholder="Enter the answer" required />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Sign In</button>
          <button type="button" className="btn btn-secondary" onClick={() => setActiveModal("register")}>
            Create Account
          </button>
        </div>
      </form>
    </div>
  );

  const RegisterModal = () => (
    <div className="modal">
      <div className="modal-header">
        <h2 className="modal-title">Join BookHub</h2>
        <button className="close-btn" onClick={() => setActiveModal(null)}>×</button>
      </div>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        handleRegister({
          username: formData.get("username"),
          email: formData.get("email"),
          password: formData.get("password"),
          captchaAnswer: formData.get("captcha")
        });
      }}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input type="text" name="username" className="form-input" placeholder="John Doe" required />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input type="email" name="email" className="form-input" placeholder="you@example.com" required />
        </div>
        
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" name="password" className="form-input" placeholder="••••••••" required />
        </div>
        
        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input type="password" name="confirmPassword" className="form-input" placeholder="••••••••" required />
        </div>
        
        <div className="form-group">
          <label className="form-label">Security Check: {captcha.question}</label>
          <input type="number" name="captcha" className="form-input" placeholder="Enter the answer" required />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Create Account</button>
          <button type="button" className="btn btn-secondary" onClick={() => setActiveModal("login")}>
            Already have an account?
          </button>
        </div>
      </form>
    </div>
  );

  const AddBookModal = () => (
    <div className="modal">
      <div className="modal-header">
        <h2 className="modal-title">Add a New Book</h2>
        <button className="close-btn" onClick={() => setActiveModal(null)}>×</button>
      </div>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        addCustomBook({
          title: formData.get("title"),
          authors: formData.get("authors").split(",").map(a => a.trim()),
          description: formData.get("description"),
          thumbnail: formData.get("thumbnail") || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop"
        });
      }}>
        <div className="form-group">
          <label className="form-label">Book Title *</label>
          <input type="text" name="title" className="form-input" placeholder="Enter book title" required />
        </div>
        
        <div className="form-group">
          <label className="form-label">Authors *</label>
          <input type="text" name="authors" className="form-input" placeholder="Comma separated names" required />
        </div>
        
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea name="description" className="form-input" rows="4" placeholder="Describe the book..." />
        </div>
        
        <div className="form-group">
          <label className="form-label">Cover Image URL</label>
          <input type="url" name="thumbnail" className="form-input" placeholder="https://example.com/cover.jpg" />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Add to Library</button>
          <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const BookModal = ({ book }) => {
    const bookReviews = reviews[book.id] || [];
    
    return (
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{book.title}</h2>
            <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
              by {book.authors.join(", ")}
            </p>
          </div>
          <button className="close-btn" onClick={() => setActiveModal(null)}>×</button>
        </div>
        
        <div style={{ marginBottom: "32px" }}>
          <img 
            src={book.thumbnail} 
            alt={book.title} 
            style={{ 
              width: "100%", 
              height: "300px", 
              objectFit: "cover", 
              borderRadius: "var(--radius-lg)",
              marginBottom: "24px"
            }} 
          />
          
          <div style={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="star">★</span>
              <span style={{ fontWeight: "600" }}>{book.rating || "4.0"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>📖</span>
              <span>{book.pages || 250} pages</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>📅</span>
              <span>{book.published || "2023"}</span>
            </div>
          </div>
          
          <p style={{ fontSize: "16px", lineHeight: "1.7", color: "var(--text-secondary)" }}>
            {book.description}
          </p>
        </div>
        
        {/* Reviews Section - WORKING */}
        <div className="reviews-section">
          <h3 className="section-title">
            <span>💬</span>
            Reviews ({bookReviews.length})
          </h3>
          
          {bookReviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h4 className="empty-title">No Reviews Yet</h4>
              <p className="empty-description">Be the first to share your thoughts about this book!</p>
            </div>
          ) : (
            <div>
              {bookReviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div className="review-user">
                      <div className="user-avatar" style={{ background: book.color }}>
                        {review.avatar}
                      </div>
                      <div className="user-info">
                        <h4>{review.username}</h4>
                        <span>Reviewed on {new Date(review.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="star" style={{ color: i < review.rating ? "#fbbf24" : "#e2e8f0" }}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="review-text">{review.text}</p>
                </div>
              ))}
            </div>
          )}
          
          {/* Add Review Form - WORKING */}
          <div className="add-review-form">
            <h4>Share Your Thoughts</h4>
            <textarea
              className="review-input"
              placeholder="What did you think of this book? Share your review..."
              value={newReview.text}
              onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
            />
            
            <div className="review-actions">
              <div className="rating-selector">
                <span>Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="star"
                    style={{ 
                      background: "none", 
                      border: "none", 
                      fontSize: "24px", 
                      cursor: "pointer",
                      color: star <= newReview.rating ? "#fbbf24" : "#e2e8f0"
                    }}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                  >
                    ★
                  </button>
                ))}
              </div>
              
              <button
                className="btn btn-primary"
                onClick={() => submitReview(book.id)}
                disabled={!newReview.text.trim()}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
        
        <div className="form-actions" style={{ marginTop: "32px" }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => addToLibrary(book)}
          >
            Add to Library
          </button>
          <button 
            className="btn btn-outline" 
            onClick={() => {
              navigator.clipboard.writeText(book.title);
              alert("Book title copied to clipboard!");
            }}
          >
            Copy Title
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="site-header">
        <div className="brand">
          <div className="logo">📚</div>
          <div>
            <div className="logo-text">BookHub</div>
            <div className="tagline">Discover, Read, Review</div>
          </div>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {currentUser ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div 
                  className="user-avatar" 
                  style={{ 
                    background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
                    width: "36px",
                    height: "36px"
                  }}
                >
                  {currentUser.avatar}
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "600" }}>{currentUser.username}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {currentUser.role === "admin" ? "Administrator" : "Member"}
                  </div>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveModal("login")}>
                Sign In
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => setActiveModal("register")}>
                Join Free
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <h1>Discover Your Next Favorite Book</h1>
        <p>
          Explore millions of books, build your personal library, and share your thoughts 
          with a community of passionate readers. All in a beautiful, clean interface.
        </p>
        <div className="hero-actions">
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => document.querySelector(".search-input")?.focus()}
          >
            <span>🔍</span>
            Start Exploring
          </button>
          <button className="btn btn-secondary btn-lg" onClick={loadDemoBooks}>
            <span>✨</span>
            View Demo Books
          </button>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalBooks}</div>
          <div className="stat-label">Books in Library</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalReviews}</div>
          <div className="stat-label">Reviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalPages}</div>
          <div className="stat-label">Total Pages</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.readingTime}h</div>
          <div className="stat-label">Reading Time</div>
        </div>
      </div>

      {/* Main Content */}
      <main className="main-content">
        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === "discover" ? "active" : ""}`}
            onClick={() => setActiveTab("discover")}
          >
            🔍 Discover
          </button>
          <button 
            className={`tab ${activeTab === "library" ? "active" : ""}`}
            onClick={() => setActiveTab("library")}
          >
            📚 My Library ({library.length})
          </button>
          <button 
            className={`tab ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            💬 Reviews ({stats.totalReviews})
          </button>
        </div>

        {/* Search Section */}
        {activeTab === "discover" && (
          <div className="search-section">
            <div className="search-container">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search for books by title, author, or genre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchBooks(searchQuery)}
                />
              </div>
              <div className="search-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => searchBooks(searchQuery)}
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Search"}
                </button>
                <button className="btn btn-secondary" onClick={() => setActiveModal("addBook")}>
                  + Add Book
                </button>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 ? (
              <div>
                <h3 className="section-title" style={{ marginBottom: "24px" }}>
                  📚 Search Results ({searchResults.length})
                </h3>
                <div className="cards-grid">
                  {searchResults.map(book => (
                    <div key={book.id} className="book-card">
                      <img src={book.thumbnail} alt={book.title} className="book-cover" />
                      
                      <h3 className="book-title">{book.title}</h3>
                      <p className="book-author">
                        <span>✍️</span>
                        {book.authors.join(", ")}
                      </p>
                      <p className="book-description">{book.description}</p>
                      
                      <div className="book-meta">
                        <div className="book-rating">
                          <span className="star">★</span>
                          <span>{book.rating}</span>
                        </div>
                        <div className="book-pages">
                          <span>📄</span>
                          <span>{book.pages} pages</span>
                        </div>
                      </div>
                      
                      <div className="book-actions">
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => addToLibrary(book)}
                        >
                          Add to Library
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setModalData({ book });
                            setActiveModal("book");
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h4 className="empty-title">Start Your Search</h4>
                <p className="empty-description">
                  Search for books by title, author, or genre. You can also load demo books to get started.
                </p>
                <button className="btn btn-primary" onClick={loadDemoBooks}>
                  Load Demo Books
                </button>
              </div>
            )}
          </div>
        )}

        {/* Library Section */}
        {activeTab === "library" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <div>
                <h3 className="section-title">📚 My Personal Library</h3>
                <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>
                  {library.length} books • {stats.totalPages} total pages
                </p>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button className="btn btn-secondary btn-sm" onClick={exportData}>
                  📥 Export Data
                </button>
                {currentUser?.role === "admin" && (
                  <button className="btn btn-secondary btn-sm" onClick={clearReviews}>
                    🗑️ Clear Reviews
                  </button>
                )}
              </div>
            </div>

            {library.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h4 className="empty-title">Your Library is Empty</h4>
                <p className="empty-description">
                  Add books from search results or create your own custom books to start building your library.
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setActiveTab("discover");
                    loadDemoBooks();
                  }}
                >
                  Browse Demo Books
                </button>
              </div>
            ) : (
              <div className="cards-grid">
                {library.map(book => {
                  const bookReviews = reviews[book.id] || [];
                  
                  return (
                    <div key={book.id} className="book-card">
                      <img src={book.thumbnail} alt={book.title} className="book-cover" />
                      
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                        <div>
                          <h3 className="book-title">{book.title}</h3>
                          <p className="book-author">
                            <span>✍️</span>
                            {book.authors.join(", ")}
                          </p>
                        </div>
                        {book.source === "custom" && (
                          <span style={{
                            fontSize: "12px",
                            background: "rgba(59, 130, 246, 0.1)",
                            color: "var(--accent-blue)",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontWeight: "600"
                          }}>
                            ✨ Custom
                          </span>
                        )}
                      </div>
                      
                      <p className="book-description">{book.description}</p>
                      
                      {/* Reviews Preview */}
                      {bookReviews.length > 0 && (
                        <div style={{ marginTop: "16px", padding: "16px", background: "var(--bg-secondary)", borderRadius: "var(--radius-md)" }}>
                          <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", color: "var(--text-primary)" }}>
                            💬 Recent Reviews ({bookReviews.length})
                          </div>
                          {bookReviews.slice(0, 2).map((review, index) => (
                            <div key={index} style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: index < 1 ? "1px solid var(--border-color)" : "none" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                                <div className="user-avatar" style={{ width: "28px", height: "28px", fontSize: "12px" }}>
                                  {review.avatar}
                                </div>
                                <span style={{ fontWeight: "600", fontSize: "13px" }}>{review.username}</span>
                                <span style={{ color: "#fbbf24", fontSize: "12px" }}>
                                  {"★".repeat(review.rating)}
                                </span>
                              </div>
                              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                                {review.text.length > 80 ? `${review.text.substring(0, 80)}...` : review.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="book-actions" style={{ marginTop: "20px" }}>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setModalData({ book });
                            setActiveModal("book");
                          }}
                        >
                          Read & Review
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => quickAddReview(book.id)}
                        >
                          Quick Review
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => removeFromLibrary(book.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* All Reviews Section */}
        {activeTab === "reviews" && (
          <div>
            <h3 className="section-title">💬 All Reviews ({stats.totalReviews})</h3>
            
            {stats.totalReviews === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <h4 className="empty-title">No Reviews Yet</h4>
                <p className="empty-description">
                  Start reviewing books in your library to see them appear here.
                </p>
              </div>
            ) : (
              <div>
                {library.filter(book => reviews[book.id]?.length > 0).map(book => (
                  <div key={book.id} style={{ marginBottom: "32px" }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "12px", 
                      marginBottom: "20px",
                      paddingBottom: "12px",
                      borderBottom: "1px solid var(--border-color)"
                    }}>
                      <img 
                        src={book.thumbnail} 
                        alt={book.title} 
                        style={{ 
                          width: "60px", 
                          height: "80px", 
                          objectFit: "cover", 
                          borderRadius: "var(--radius-sm)"
                        }} 
                      />
                      <div>
                        <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>{book.title}</h4>
                        <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                          by {book.authors.join(", ")}
                        </p>
                      </div>
                    </div>
                    
                    <div className="cards-grid" style={{ gridTemplateColumns: "1fr" }}>
                      {reviews[book.id].map(review => (
                        <div key={review.id} className="review-item">
                          <div className="review-header">
                            <div className="review-user">
                              <div className="user-avatar" style={{ background: book.color }}>
                                {review.avatar}
                              </div>
                              <div className="user-info">
                                <h4>{review.username}</h4>
                                <span>{new Date(review.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="review-rating">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className="star" style={{ color: i < review.rating ? "#fbbf24" : "#e2e8f0" }}>
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="review-text">{review.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="logo-text" style={{ fontSize: "28px", marginBottom: "8px" }}>BookHub</div>
          <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>
            A beautiful, clean interface for book lovers to discover, organize, and review their favorite reads.
          </p>
          
          <div className="footer-links">
            <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); setActiveTab("discover"); }}>Discover</a>
            <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); setActiveTab("library"); }}>Library</a>
            <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); setActiveModal("addBook"); }}>Add Book</a>
            <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); setActiveModal("login"); }}>Sign In</a>
          </div>
          
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "24px" }}>
           BookHub • Crafted with ❤️ by the Team Neurix
          </p>
        </div>
      </footer>

      {/* Modals */}
      {activeModal === "login" && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div onClick={e => e.stopPropagation()}>
            <LoginModal />
          </div>
        </div>
      )}

      {activeModal === "register" && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div onClick={e => e.stopPropagation()}>
            <RegisterModal />
          </div>
        </div>
      )}

      {activeModal === "addBook" && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div onClick={e => e.stopPropagation()}>
            <AddBookModal />
          </div>
        </div>
      )}

      {activeModal === "book" && modalData.book && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div onClick={e => e.stopPropagation()}>
            <BookModal book={modalData.book} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

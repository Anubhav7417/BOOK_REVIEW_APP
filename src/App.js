import React, { useState, useEffect } from "react";
import "./index.css";
// Mera storage keys - simple rakha hai
const STORE = {
  users: "bookhub_users_v2",  // v2 add kiya jab pehla version break ho gaya
  currentUser: "bookhub_current_reader",
  myBooks: "bookhub_my_library",
  myReviews: "bookhub_all_reviews"
};

// Yeh mera ID generator hai - perfect nahi hai par abhi chal jayega
function createBookId() {
  const timestamp = Date.now(); // Current time
  const randomPart = Math.random().toString(36).substring(2, 11); // Random string
  return `book_${timestamp}_${randomPart}`; // Unique ID banao
}

// Password hash karne ka function - maine padha yeh safe way hai
async function hashThePassword(password) {
  try {
    const encoder = new TextEncoder(); // Text ko bytes mein convert
    // Security ke liye thoda salt add kiya
    const data = encoder.encode(password + "bookhub_salt_2023");
    const hashBuffer = await crypto.subtle.digest("SHA-256", data); // Hash karo
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // Buffer ko array mein
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join(""); // Hex string banao
  } catch (err) {
    console.warn("Password hash fail ho gaya, fallback use kar raha hoon");
    // Development ke liye fallback
    return "hash_fallback_" + password.length;
  }
}

// Simple math captcha - basic bots ko rokne ke liye
function makeCaptcha() {
  const num1 = Math.floor(Math.random() * 9) + 1;  // 1-9
  const num2 = Math.floor(Math.random() * 9) + 1;
  return {
    question: `What's ${num1} + ${num2}?`, // Sawal
    answer: num1 + num2 // Jawab
  };
}

// Admin user setup karo agar pehli baar ho
async function setupFirstUser() {
  const existingUsers = JSON.parse(localStorage.getItem(STORE.users) || "[]"); // Pehle se users dekho
  
  // Sirf tab create karo jab koi user nahi hai
  if (existingUsers.length === 0) {
    console.log("Pehli baar admin user setup kar raha hoon...");
    
    const adminPassHash = await hashThePassword("ADMIN123!"); // Default password
    const adminUser = {
      id: "admin_" + Date.now(), // Unique ID
      username: "BookMaster", // Username
      email: "admin@bookhub.com", // Email
      passwordHash: adminPassHash, // Hashed password
      role: "admin", // Admin role
      avatar: "👑",  // Admin ke liye crown
      created: new Date().toISOString(), // Creation time
      isFirstUser: true // Pehla user hai
    };
    
    localStorage.setItem(STORE.users, JSON.stringify([adminUser])); // Save karo
    console.log("Admin user ban gaya. Default password: ADMIN123!");
  }
}

// Kuch sample books - meri favorite books
const SAMPLE_BOOKS = [
  {
    id: "demo_book_1",
    title: "The Great Gatsby",
    authors: ["F. Scott Fitzgerald"],
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    description: "Classic novel about the Jazz Age. Honestly took me two reads to really get it.",
    rating: 4.3,
    pages: 218,
    genres: ["Classic", "Fiction"],
    year: "1925",
    color: "#3b82f6"
  },
  {
    id: "demo_book_2",
    title: "To Kill a Mockingbird",
    authors: ["Harper Lee"],
    cover: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop",
    description: "Heartbreaking story about racism and justice. Still relevant today.",
    rating: 4.7,
    pages: 324,
    genres: ["Classic", "Fiction"],
    year: "1960",
    color: "#10b981"
  },
  {
    id: "demo_book_3",
    title: "1984",
    authors: ["George Orwell"],
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    description: "Scary how accurate some parts feel now. Big Brother is watching...",
    rating: 4.5,
    pages: 328,
    genres: ["Dystopian", "Fiction"],
    year: "1949",
    color: "#8b5cf6"
  },
  {
    id: "demo_book_4",
    title: "Pride and Prejudice",
    authors: ["Jane Austen"],
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
    description: "Elizabeth Bennet is one of my favorite characters. Mr. Darcy grows on you.",
    rating: 4.4,
    pages: 432,
    genres: ["Romance", "Classic"],
    year: "1813",
    color: "#f97316"
  }
];

function App() {
  // State variables - organized rakha hai
  const [currentUser, setCurrentUser] = useState(null); // Current logged in user
  const [myLibrary, setMyLibrary] = useState([]); // Meri books ki library
  const [allReviews, setAllReviews] = useState({}); // Saare reviews
  const [searchResults, setSearchResults] = useState([]); // Search results
  const [searchText, setSearchText] = useState(""); // Search box ka text
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [activeTab, setActiveTab] = useState("discover"); // Active tab
  const [openModal, setOpenModal] = useState(null); // Konsa modal open hai
  const [modalData, setModalData] = useState({}); // Modal ke liye data
  const [captcha, setCaptcha] = useState(makeCaptcha()); // Captcha state
  const [newReview, setNewReview] = useState({ text: "", rating: 5 }); // New review form

  // App start hote hi initialize karo sab
  useEffect(() => {
    console.log("App starting up...");
    
    setupFirstUser(); // Admin setup karo
    
    // localStorage se saved data load karo
    try {
      const savedUser = localStorage.getItem(STORE.currentUser); // Saved user
      const savedBooks = localStorage.getItem(STORE.myBooks); // Saved books
      const savedReviews = localStorage.getItem(STORE.myReviews); // Saved reviews
      
      if (savedUser) {
        const userData = JSON.parse(savedUser); // Parse karo
        setCurrentUser(userData); // State mein set karo
        console.log(`Loaded user: ${userData.username}`);
      }
      
      if (savedBooks) {
        const books = JSON.parse(savedBooks); // Parse karo
        setMyLibrary(books); // State mein set karo
        console.log(`Loaded ${books.length} books from library`);
      }
      
      if (savedReviews) {
        const reviews = JSON.parse(savedReviews); // Parse karo
        setAllReviews(reviews); // State mein set karo
        console.log(`Loaded reviews for ${Object.keys(reviews).length} books`);
      }
    } catch (error) {
      console.error("Error loading saved data:", error); // Error log karo
      // Agar load fail ho to fresh start karo
      setMyLibrary([]);
      setAllReviews({});
    }
  }, []); // Empty dependency array means run only once

  // Jab currentUser change ho tab save karo
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORE.currentUser, JSON.stringify(currentUser)); // Save karo
      console.log("Saved user to localStorage");
    }
  }, [currentUser]); // currentUser change hone par run karo

  // Jab library change ho tab save karo
  useEffect(() => {
    localStorage.setItem(STORE.myBooks, JSON.stringify(myLibrary)); // Save karo
    console.log("Saved library to localStorage");
  }, [myLibrary]); // myLibrary change hone par run karo

  // Jab reviews change hon tab save karo
  useEffect(() => {
    localStorage.setItem(STORE.myReviews, JSON.stringify(allReviews)); // Save karo
    console.log("Saved reviews to localStorage");
  }, [allReviews]); // allReviews change hone par run karo

  // Google Books API use karke books search karo
  const searchForBooks = async (query) => {
    if (!query || query.trim().length < 2) { // Kam se kam 2 characters hon
      setSearchResults([]); // Empty results
      return;
    }
    
    console.log(`Searching for: "${query}"`); // Log search
    setIsLoading(true); // Loading start karo
    
    try {
      // Kabhi kabhi API slow hota hai, isliye timeout add kiya
      const controller = new AbortController(); // Abort controller for timeout
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=12`,
        { signal: controller.signal } // Signal pass karo for abort
      );
      
      clearTimeout(timeoutId); // Timeout clear karo
      
      if (!response.ok) { // Agar response error ho
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json(); // JSON mein convert karo
      console.log(`Found ${data.items?.length || 0} results`); // Log results count
      
      // API data ko humare book format mein map karo
      const foundBooks = (data.items || []).map(item => {
        const bookInfo = item.volumeInfo || {}; // Book info
        console.log("Processing book:", bookInfo.title); // Debugging
        
        // Kuch books mein images nahi hoti, isliye fallback use karo
        let coverImage = bookInfo.imageLinks?.thumbnail?.replace("http://", "https://");
        if (!coverImage) {
          // Title ke basis pe random placeholder
          const placeholders = [
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop"
          ];
          coverImage = placeholders[Math.floor(Math.random() * placeholders.length)];
        }
        
        // Realistic rating generate karo
        const baseRating = 3.5;
        const randomAdjustment = Math.random() * 1.5;
        const finalRating = (baseRating + randomAdjustment).toFixed(1);
        
        // Book card ke liye random color pick karo
        const colors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f97316"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        return {
          id: item.id,
          title: bookInfo.title || "Unknown Title",
          authors: bookInfo.authors || ["Unknown Author"],
          cover: coverImage,
          description: bookInfo.description || "No description available. Might be worth checking out anyway!",
          rating: parseFloat(finalRating),
          pages: bookInfo.pageCount || Math.floor(Math.random() * 300) + 150,
          genres: bookInfo.categories || ["General"],
          year: bookInfo.publishedDate?.split("-")[0] || "Unknown",
          color: randomColor
        };
      });
      
      setSearchResults(foundBooks); // State update karo
      
    } catch (error) {
      console.error("Search failed:", error); // Error log karo
      
      // User ko error dikhao
      if (error.name === 'AbortError') {
        alert("Search took too long. Try a different search or check your connection.");
      } else {
        alert("Couldn't search books right now. Try again in a moment.");
      }
      
      // Error mein results empty rakho
      setSearchResults([]);
    } finally {
      setIsLoading(false); // Loading stop karo
    }
  };

  // Sample books load karo
  const loadSampleBooks = () => {
    console.log("Loading sample books...");
    setSearchResults(SAMPLE_BOOKS);
    setSearchText("sample books");
  };

  // Book ko library mein add karo
  const addBookToLibrary = (book) => {
    // Check karo pehle se library mein hai ya nahi
    const alreadyHave = myLibrary.some(b => b.id === book.id);
    if (alreadyHave) {
      alert(`"${book.title}" is already in your library!`);
      return; // Agar hai to return
    }
    
    // Extra info add karo
    const bookWithDetails = {
      ...book, // Existing book data
      addedOn: new Date().toISOString(), // Add date
      isFavorite: false, // Favorite nahi hai
      readStatus: "unread", // unread, reading, finished
      progress: 0, // Progress percentage
      notes: "" // Notes ke liye
    };
    
    setMyLibrary(prev => [...prev, bookWithDetails]); // Library mein add karo
    console.log(`Added "${book.title}" to library`); // Log karo
    alert(`Added "${book.title}" to your library! 📚`); // Alert dikhao
  };

  // Book ko library se remove karo
  const removeBookFromLibrary = (bookId) => {
    const bookToRemove = myLibrary.find(b => b.id === bookId); // Book dhoondo
    if (!bookToRemove) return; // Agar nahi mila to return
    
    const confirmRemove = window.confirm(`Remove "${bookToRemove.title}" from your library?`);
    if (confirmRemove) {
      setMyLibrary(prev => prev.filter(b => b.id !== bookId)); // Filter karo
      console.log(`Removed "${bookToRemove.title}" from library`); // Log karo
    }
  };

  // Custom book add karo (search se nahi)
  const addCustomBook = (bookInfo) => {
    const newBookId = createBookId(); // New ID generate karo
    
    const customBook = {
      id: newBookId,
      title: bookInfo.title,
      authors: bookInfo.authors.split(",").map(name => name.trim()), // Authors array mein
      cover: bookInfo.cover || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
      description: bookInfo.description || "No description yet.",
      rating: 0, // New book hai, abhi rating nahi hai
      pages: bookInfo.pages || 250,
      genres: bookInfo.genres || ["Custom"],
      year: bookInfo.year || new Date().getFullYear().toString(),
      color: "#3b82f6", // Default blue
      isCustom: true, // Custom book hai
      addedBy: currentUser?.username || "anonymous", // Kisne add kiya
      addedOn: new Date().toISOString() // Kab add kiya
    };
    
    setMyLibrary(prev => [...prev, customBook]); // Library mein add karo
    setOpenModal(null); // Modal band karo
    console.log(`Added custom book: "${customBook.title}"`); // Log karo
    alert(`"${customBook.title}" added to your library!`); // Alert dikhao
  };

  // Book ke liye review submit karo
  const submitReviewForBook = (bookId) => {
    if (!currentUser) { // Agar user logged in nahi hai
      alert("Please log in to leave a review");
      setOpenModal("login"); // Login modal kholo
      return;
    }
    
    if (!newReview.text.trim()) { // Agar review text empty hai
      alert("Please write something in your review!");
      return;
    }
    
    console.log(`Submitting review for book ${bookId}`); // Log karo
    
    const review = {
      id: `review_${Date.now()}`, // Unique review ID
      bookId: bookId, // Konsi book ka review hai
      userId: currentUser.id, // User ka ID
      userName: currentUser.username, // User ka name
      userAvatar: currentUser.avatar || currentUser.username.charAt(0).toUpperCase(), // User avatar
      text: newReview.text.trim(), // Review text
      rating: newReview.rating, // Rating
      date: new Date().toISOString(), // Review date
      helpful: 0 // Helpful count
    };
    
    // Reviews state update karo
    setAllReviews(prev => {
      const existingReviews = prev[bookId] || []; // Pehle se reviews
      return {
        ...prev, // Existing reviews
        [bookId]: [...existingReviews, review] // New review add karo
      };
    });
    
    // Form reset karo
    setNewReview({ text: "", rating: 5 }); // Empty karo
    console.log("Review submitted successfully"); // Log karo
    alert("Thanks for your review! 📝"); // Alert dikhao
  };

  // Quick review add karo (simple prompt version)
  const quickAddReview = (bookId) => {
    if (!currentUser) { // Agar user logged in nahi hai
      alert("Please log in first");
      setOpenModal("login"); // Login modal kholo
      return;
    }
    
    const reviewText = prompt("What did you think of this book?"); // Text input
    if (!reviewText || !reviewText.trim()) return; // Agar empty hai to return
    
    const ratingText = prompt("Rate it from 1 to 5 stars:", "5"); // Rating input
    const rating = parseInt(ratingText) || 5; // Number mein convert karo
    
    const review = {
      id: `quick_review_${Date.now()}`, // Quick review ID
      bookId: bookId,
      userId: currentUser.id,
      userName: currentUser.username,
      userAvatar: currentUser.avatar || currentUser.username.charAt(0).toUpperCase(),
      text: reviewText,
      rating: Math.min(5, Math.max(1, rating)), // 1-5 ke beech clamp karo
      date: new Date().toISOString(),
      helpful: 0
    };
    
    setAllReviews(prev => {
      const existingReviews = prev[bookId] || []; // Pehle se reviews
      return {
        ...prev, // Existing reviews
        [bookId]: [...existingReviews, review] // New review add karo
      };
    });
    
    alert("Review added! ✨"); // Alert dikhao
  };

  // User login handle karo
  const handleUserLogin = async (email, password, captchaAnswer) => {
    console.log("Attempting login..."); // Log karo
    
    try {
      // Pehle captcha check karo
      if (Number(captchaAnswer) !== captcha.answer) {
        throw new Error("Wrong answer to the security question. Try again!");
      }
      
      // Saare users get karo
      const allUsers = JSON.parse(localStorage.getItem(STORE.users) || "[]");
      const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase()); // User dhoondo
      
      if (!user) { // Agar user nahi mila
        throw new Error("No account found with that email.");
      }
      
      // Password verify karo
      const enteredPasswordHash = await hashThePassword(password);
      if (user.passwordHash !== enteredPasswordHash) { // Agar password match nahi karta
        throw new Error("Incorrect password.");
      }
      
      // Login successful
      const userToSet = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role || "user",
        avatar: user.avatar || user.username.charAt(0).toUpperCase()
      };
      
      setCurrentUser(userToSet); // Current user set karo
      setOpenModal(null); // Modal band karo
      console.log(`User logged in: ${user.username}`); // Log karo
      alert(`Welcome back, ${user.username}! 👋`); // Alert dikhao
      
      // Captcha refresh karo
      setCaptcha(makeCaptcha());
      
    } catch (error) {
      console.error("Login error:", error.message); // Error log karo
      alert(error.message); // Error alert dikhao
      setCaptcha(makeCaptcha()); // Captcha refresh karo
    }
  };

  // New user registration handle karo
  const handleUserRegister = async (userData) => {
    console.log("Registering new user..."); // Log karo
    
    try {
      // Captcha check karo
      if (Number(userData.captchaAnswer) !== captcha.answer) {
        throw new Error("Security check failed. Please try the math problem again.");
      }
      
      // Check karo passwords match karte hai ya nahi
      if (userData.password !== userData.confirmPassword) {
        throw new Error("Passwords don't match!");
      }
      
      // Existing users get karo
      const allUsers = JSON.parse(localStorage.getItem(STORE.users) || "[]");
      
      // Check karo email pehle se exists karta hai ya nahi
      const emailExists = allUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
      if (emailExists) { // Agar exists karta hai
        throw new Error("This email is already registered. Try logging in instead.");
      }
      
      // Password hash karo
      const passwordHash = await hashThePassword(userData.password);
      
      // New user create karo
      const newUser = {
        id: `user_${Date.now()}`, // User ID
        username: userData.username || userData.email.split("@")[0], // Username ya email ka first part
        email: userData.email, // Email
        passwordHash: passwordHash, // Hashed password
        role: "user", // Default role
        avatar: (userData.username?.charAt(0) || userData.email.charAt(0)).toUpperCase(), // Avatar
        created: new Date().toISOString() // Creation time
      };
      
      // localStorage mein save karo
      localStorage.setItem(STORE.users, JSON.stringify([...allUsers, newUser]));
      
      // User ko login karo
      setCurrentUser({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar
      });
      
      setOpenModal(null); // Modal band karo
      console.log(`New user registered: ${newUser.username}`); // Log karo
      alert(`Welcome to BookHub, ${newUser.username}! Start adding books! 📚`); // Alert dikhao
      
      // Captcha refresh karo
      setCaptcha(makeCaptcha());
      
    } catch (error) {
      console.error("Registration error:", error.message); // Error log karo
      alert(error.message); // Error alert dikhao
      setCaptcha(makeCaptcha()); // Captcha refresh karo
    }
  };

  // Logout handle karo
  const handleLogout = () => {
    console.log("User logging out"); // Log karo
    setCurrentUser(null); // Current user null set karo
    alert("Logged out successfully. See you soon!"); // Alert dikhao
  };

  // Saara data export karo (admin feature)
  const exportAllData = () => {
    console.log("Exporting data..."); // Log karo
    
    const exportData = {
      library: myLibrary, // Library data
      reviews: allReviews, // Reviews data
      users: JSON.parse(localStorage.getItem(STORE.users) || "[]"), // Users data
      exportedAt: new Date().toISOString(), // Export time
      app: "BookHub Personal Library", // App name
      version: "1.2.0" // Version
    };
    
    const dataStr = JSON.stringify(exportData, null, 2); // JSON string banao
    const dataBlob = new Blob([dataStr], { type: "application/json" }); // Blob create karo
    const dataUrl = URL.createObjectURL(dataBlob); // URL create karo
    
    const downloadLink = document.createElement("a"); // Download link create karo
    downloadLink.href = dataUrl; // URL set karo
    downloadLink.download = `bookhub_backup_${new Date().toISOString().slice(0, 10)}.json`; // Filename
    document.body.appendChild(downloadLink); // DOM mein add karo
    downloadLink.click(); // Click simulate karo
    document.body.removeChild(downloadLink); // DOM se remove karo
    
    URL.revokeObjectURL(dataUrl); // URL revoke karo
    alert("Data exported! Save this file somewhere safe."); // Alert dikhao
  };

  // Saare reviews clear karo (admin feature)
  const clearAllReviews = () => {
    const confirmClear = window.confirm("Are you sure? This will delete ALL reviews and cannot be undone.");
    if (confirmClear) { // Agar confirm kiya
      setAllReviews({}); // Empty object set karo
      console.log("All reviews cleared"); // Log karo
      alert("All reviews have been cleared."); // Alert dikhao
    }
  };

  // Stats calculate karo
  const calculateStats = () => {
    const totalBooks = myLibrary.length; // Total books
    
    let totalReviews = 0; // Total reviews count
    Object.keys(allReviews).forEach(bookId => { // Har book ke liye
      totalReviews += allReviews[bookId].length; // Reviews count add karo
    });
    
    const totalPages = myLibrary.reduce((sum, book) => sum + (book.pages || 0), 0); // Total pages
    
    // Rough reading time estimate (250 pages per hour fast reader hai)
    const estimatedReadingTime = Math.ceil(totalPages / 250);
    
    return {
      totalBooks,
      totalReviews,
      totalPages,
      estimatedReadingTime
    };
  };

  const stats = calculateStats(); // Stats calculate karo

  // ---------- MODAL COMPONENTS ----------

  const LoginModal = () => (
    <div className="modal">
      <div className="modal-header">
        <h2 className="modal-title">Login to BookHub</h2>
        <button className="close-btn" onClick={() => setOpenModal(null)}>×</button>
      </div>
      
      <form onSubmit={(e) => {
        e.preventDefault(); // Default form submit rok do
        const formData = new FormData(e.target); // Form data get karo
        handleUserLogin(
          formData.get("email"), // Email
          formData.get("password"), // Password
          formData.get("captcha") // Captcha answer
        );
      }}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input 
            type="email" 
            name="email" 
            className="form-input" 
            placeholder="your.email@example.com" 
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            name="password" 
            className="form-input" 
            placeholder="••••••••" 
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Quick security check: {captcha.question}</label>
          <input 
            type="number" 
            name="captcha" 
            className="form-input" 
            placeholder="Enter the answer" 
            required 
          />
          <small style={{ color: "#6b7280", marginTop: "4px", display: "block" }}>
            Just making sure you're human! // Bas check kar raha hoon tum human ho ya nahi
          </small>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Log In</button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => setOpenModal("register")} // Register modal kholo
          >
            Need an account? // Account chahiye?
          </button>
        </div>
      </form>
    </div>
  );

  const RegisterModal = () => (
    <div className="modal">
      <div className="modal-header">
        <h2 className="modal-title">Join BookHub</h2>
        <button className="close-btn" onClick={() => setOpenModal(null)}>×</button>
      </div>
      
      <form onSubmit={(e) => {
        e.preventDefault(); // Default form submit rok do
        const formData = new FormData(e.target); // Form data get karo
        handleUserRegister({
          username: formData.get("username"),
          email: formData.get("email"),
          password: formData.get("password"),
          confirmPassword: formData.get("confirmPassword"),
          captchaAnswer: formData.get("captcha")
        });
      }}>
        <div className="form-group">
          <label className="form-label">Your Name</label>
          <input 
            type="text" 
            name="username" 
            className="form-input" 
            placeholder="What should we call you?" 
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input 
            type="email" 
            name="email" 
            className="form-input" 
            placeholder="you@example.com" 
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Create Password</label>
          <input 
            type="password" 
            name="password" 
            className="form-input" 
            placeholder="At least 6 characters" 
            required 
            minLength="6"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input 
            type="password" 
            name="confirmPassword" 
            className="form-input" 
            placeholder="Type it again" 
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Quick math: {captcha.question}</label>
          <input 
            type="number" 
            name="captcha" 
            className="form-input" 
            placeholder="Just a simple math problem" 
            required 
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Create Account</button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => setOpenModal("login")} // Login modal kholo
          >
            Already have an account? // Pehle se account hai?
          </button>
        </div>
      </form>
    </div>
  );

  const AddBookModal = () => (
    <div className="modal">
      <div className="modal-header">
        <h2 className="modal-title">Add Your Own Book</h2>
        <button className="close-btn" onClick={() => setOpenModal(null)}>×</button>
      </div>
      
      <form onSubmit={(e) => {
        e.preventDefault(); // Default form submit rok do
        const formData = new FormData(e.target); // Form data get karo
        addCustomBook({
          title: formData.get("title"),
          authors: formData.get("authors"),
          cover: formData.get("cover"),
          description: formData.get("description"),
          pages: formData.get("pages"),
          year: formData.get("year"),
          genres: formData.get("genres")
        });
      }}>
        <div className="form-group">
          <label className="form-label">Book Title *</label>
          <input 
            type="text" 
            name="title" 
            className="form-input" 
            placeholder="Enter the book title" 
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Author(s) *</label>
          <input 
            type="text" 
            name="authors" 
            className="form-input" 
            placeholder="Separate multiple authors with commas" 
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Description (optional)</label>
          <textarea 
            name="description" 
            className="form-input" 
            rows="3" 
            placeholder="What's the book about?" 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Cover Image URL (optional)</label>
          <input 
            type="url" 
            name="cover" 
            className="form-input" 
            placeholder="https://example.com/book-cover.jpg" 
          />
          <small style={{ color: "#6b7280", marginTop: "4px", display: "block" }}>
            Leave blank for a default book cover // Blank chod do to default cover use hoga
          </small>
        </div>
        
        <div className="form-group">
          <label className="form-label">Number of Pages (optional)</label>
          <input 
            type="number" 
            name="pages" 
            className="form-input" 
            placeholder="e.g., 300" 
            min="1"
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Add to My Library</button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => setOpenModal(null)} // Modal band karo
          >
            Cancel // Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const BookDetailModal = ({ book }) => {
    const bookReviews = allReviews[book.id] || []; // Is book ke reviews
    
    return (
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{book.title}</h2>
            <p style={{ color: "#6b7280", marginTop: "4px" }}>
              by {book.authors.join(", ")} // Author(s)
            </p>
          </div>
          <button className="close-btn" onClick={() => setOpenModal(null)}>×</button>
        </div>
        
        <div style={{ marginBottom: "32px" }}>
          <img 
            src={book.cover} 
            alt={book.title} 
            style={{ 
              width: "100%", 
              height: "300px", 
              objectFit: "cover", 
              borderRadius: "12px",
              marginBottom: "24px"
            }} 
          />
          
          <div style={{ display: "flex", gap: "24px", marginBottom: "24px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="star">★</span>
              <span style={{ fontWeight: "600" }}>{book.rating || "No rating yet"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#6b7280" }}>📖</span>
              <span>{book.pages || "Unknown"} pages</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#6b7280" }}>📅</span>
              <span>{book.year || "Unknown year"}</span>
            </div>
          </div>
          
          <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#4b5563" }}>
            {book.description}
          </p>
        </div>
        
        {/* Reviews section */}
        <div className="reviews-section">
          <h3 className="section-title">
            <span>💬</span>
            Reviews ({bookReviews.length}) // Kitne reviews hai
          </h3>
          
          {bookReviews.length === 0 ? ( // Agar koi review nahi hai
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h4 className="empty-title">No Reviews Yet</h4>
              <p className="empty-description">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div>
              {bookReviews.map((review) => ( // Har review ke liye
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div className="review-user">
                      <div className="user-avatar" style={{ background: book.color }}>
                        {review.userAvatar}
                      </div>
                      <div className="user-info">
                        <h4>{review.userName}</h4>
                        <span>{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => ( // 5 stars ke liye
                        <span 
                          key={i} 
                          className="star" 
                          style={{ color: i < review.rating ? "#fbbf24" : "#e5e7eb" }}
                        >
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
          
          {/* Add review form */}
          <div className="add-review-form">
            <h4>Write a Review</h4>
            <textarea
              className="review-input"
              placeholder="What did you like or not like about this book?"
              value={newReview.text}
              onChange={(e) => setNewReview({ ...newReview, text: e.target.value })} // Text update karo
            />
            
            <div className="review-actions">
              <div className="rating-selector">
                <span>Your rating:</span>
                {[1, 2, 3, 4, 5].map((star) => ( // 5 stars ke buttons
                  <button
                    key={star}
                    type="button"
                    className="star-btn"
                    style={{ 
                      background: "none", 
                      border: "none", 
                      fontSize: "24px", 
                      cursor: "pointer",
                      color: star <= newReview.rating ? "#fbbf24" : "#e5e7eb"
                    }}
                    onClick={() => setNewReview({ ...newReview, rating: star })} // Rating select karo
                  >
                    ★
                  </button>
                ))}
              </div>
              
              <button
                className="btn btn-primary"
                onClick={() => submitReviewForBook(book.id)} // Review submit karo
                disabled={!newReview.text.trim()} // Agar text empty hai to disabled
              >
                Post Review
              </button>
            </div>
          </div>
        </div>
        
        <div className="form-actions" style={{ marginTop: "32px" }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => addBookToLibrary(book)} // Library mein add karo
          >
            Add to My Library
          </button>
          <button 
            className="btn btn-outline" 
            onClick={() => {
              navigator.clipboard.writeText(book.title); // Clipboard mein copy karo
              alert("Title copied!"); // Alert dikhao
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
            <div className="tagline">Track, Read, Review</div>
          </div>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {currentUser ? ( // Agar user logged in hai
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div 
                  className="user-avatar" 
                  style={{ 
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", // Gradient background
                    width: "36px",
                    height: "36px"
                  }}
                >
                  {currentUser.avatar} {/* User avatar */}
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "600" }}>{currentUser.username}</div>
                  <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                    {currentUser.role === "admin" ? "Admin" : "Reader"}
                  </div>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Log Out
              </button>
            </>
          ) : ( // Agar user logged in nahi hai
            <>
              <button className="btn btn-secondary btn-sm" onClick={() => setOpenModal("login")}>
                Sign In
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => setOpenModal("register")}>
                Join Free
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero section */}
      <section className="hero">
        <h1>Find Your Next Favorite Read</h1>
        <p>
          Search millions of books, build your personal collection, and share your thoughts 
          with fellow book lovers. All in one clean, simple interface.
        </p>
        <div className="hero-actions">
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => {
              const searchInput = document.querySelector(".search-input");
              if (searchInput) {
                searchInput.focus(); // Search input ko focus karo
                searchInput.scrollIntoView({ behavior: "smooth" }); // Smooth scroll karo
              }
            }}
          >
            <span>🔍</span>
            Search Books
          </button>
          <button className="btn btn-secondary btn-lg" onClick={loadSampleBooks}>
            <span>📚</span>
            See Example Books
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
          <div className="stat-label">Total Reviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalPages}</div>
          <div className="stat-label">Pages to Read</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.estimatedReadingTime}h</div>
          <div className="stat-label">Estimated Reading Time</div>
        </div>
      </div>

      {/* Main content area */}
      <main className="main-content">
        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === "discover" ? "active" : ""}`} // Active tab highlight
            onClick={() => setActiveTab("discover")} // Tab change karo
          >
            🔍 Discover
          </button>
          <button 
            className={`tab ${activeTab === "library" ? "active" : ""}`}
            onClick={() => setActiveTab("library")}
          >
            📚 My Library ({myLibrary.length})
          </button>
          <button 
            className={`tab ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            💬 All Reviews ({stats.totalReviews})
          </button>
        </div>

        {/* Discover tab */}
        {activeTab === "discover" && ( // Agar discover tab active hai
          <div className="search-section">
            <div className="search-container">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by title, author, or topic..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)} // Text update karo
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !isLoading) { // Enter key press
                      searchForBooks(searchText); // Search karo
                    }
                  }}
                />
              </div>
              <div className="search-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => searchForBooks(searchText)} // Search button click
                  disabled={isLoading || !searchText.trim()} // Loading ya empty text mein disabled
                >
                  {isLoading ? "Searching..." : "Search Books"}
                </button>
                <button className="btn btn-secondary" onClick={() => setOpenModal("addBook")}>
                  + Add Custom Book
                </button>
              </div>
            </div>

            {/* Search results */}
            {searchResults.length > 0 ? ( // Agar results hai
              <div>
                <h3 className="section-title" style={{ marginBottom: "24px" }}>
                  📚 Found {searchResults.length} books
                </h3>
                <div className="cards-grid">
                  {searchResults.map(book => ( // Har book ke liye card
                    <div key={book.id} className="book-card">
                      <img src={book.cover} alt={book.title} className="book-cover" />
                      
                      <h3 className="book-title">{book.title}</h3>
                      <p className="book-author">
                        <span>✍️</span>
                        {book.authors.join(", ")}
                      </p>
                      <p className="book-description">
                        {book.description.length > 120 
                          ? `${book.description.substring(0, 120)}...` // Short description
                          : book.description}
                      </p>
                      
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
                          onClick={() => addBookToLibrary(book)} // Library mein add karo
                        >
                          Add to Library
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setModalData({ book }); // Modal ke liye data set karo
                            setOpenModal("book"); // Book modal kholo
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : ( // Agar koi results nahi hai
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h4 className="empty-title">Ready to Discover Books?</h4>
                <p className="empty-description">
                  Search for books by title, author, or genre. Or check out some example books to get started.
                </p>
                <button className="btn btn-primary" onClick={loadSampleBooks}>
                  Load Example Books
                </button>
              </div>
            )}
          </div>
        )}

        {/* Library tab */}
        {activeTab === "library" && ( // Agar library tab active hai
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <div>
                <h3 className="section-title">📚 My Personal Library</h3>
                <p style={{ color: "#6b7280", marginTop: "8px" }}>
                  {myLibrary.length} books • {stats.totalPages} total pages
                </p>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button className="btn btn-secondary btn-sm" onClick={exportAllData}>
                  📥 Export Data
                </button>
                {currentUser?.role === "admin" && ( // Agar admin hai to
                  <button className="btn btn-secondary btn-sm" onClick={clearAllReviews}>
                    🗑️ Clear All Reviews
                  </button>
                )}
              </div>
            </div>

            {myLibrary.length === 0 ? ( // Agar library empty hai
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h4 className="empty-title">Your Library is Empty</h4>
                <p className="empty-description">
                  Add books from search results or create your own custom books to start building your collection.
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setActiveTab("discover"); // Discover tab par jao
                    loadSampleBooks(); // Sample books load karo
                  }}
                >
                  Browse Example Books
                </button>
              </div>
            ) : ( // Agar library mein books hai
              <div className="cards-grid">
                {myLibrary.map(book => {
                  const bookReviews = allReviews[book.id] || []; // Is book ke reviews
                  
                  return (
                    <div key={book.id} className="book-card">
                      <img src={book.cover} alt={book.title} className="book-cover" />
                      
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                        <div>
                          <h3 className="book-title">{book.title}</h3>
                          <p className="book-author">
                            <span>✍️</span>
                            {book.authors.join(", ")}
                          </p>
                        </div>
                        {book.isCustom && ( // Agar custom book hai to badge dikhao
                          <span style={{
                            fontSize: "12px",
                            background: "rgba(59, 130, 246, 0.1)",
                            color: "#3b82f6",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontWeight: "600"
                          }}>
                            ✨ Custom
                          </span>
                        )}
                      </div>
                      
                      <p className="book-description">
                        {book.description.length > 100 
                          ? `${book.description.substring(0, 100)}...` // Short description
                          : book.description}
                      </p>
                      
                      {/* Show reviews if any */}
                      {bookReviews.length > 0 && ( // Agar reviews hai to dikhao
                        <div style={{ marginTop: "16px", padding: "16px", background: "#f9fafb", borderRadius: "8px" }}>
                          <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", color: "#1f2937" }}>
                            💬 Recent Reviews ({bookReviews.length})
                          </div>
                          {bookReviews.slice(0, 2).map((review, index) => ( // Max 2 reviews
                            <div key={index} style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: index < 1 ? "1px solid #e5e7eb" : "none" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                                <div className="user-avatar" style={{ width: "28px", height: "28px", fontSize: "12px" }}>
                                  {review.userAvatar}
                                </div>
                                <span style={{ fontWeight: "600", fontSize: "13px" }}>{review.userName}</span>
                                <span style={{ color: "#fbbf24", fontSize: "12px" }}>
                                  {"★".repeat(review.rating)} {/* Stars dikhao */}
                                </span>
                              </div>
                              <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: "1.5" }}>
                                {review.text.length > 80 ? `${review.text.substring(0, 80)}...` : review.text} {/* Short text */}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="book-actions" style={{ marginTop: "20px" }}>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setModalData({ book }); // Modal data set karo
                            setOpenModal("book"); // Book modal kholo
                          }}
                        >
                          Read & Review
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => quickAddReview(book.id)} // Quick review add karo
                        >
                          Quick Review
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => removeBookFromLibrary(book.id)} // Book remove karo
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

        {/* Reviews tab */}
        {activeTab === "reviews" && ( // Agar reviews tab active hai
          <div>
            <h3 className="section-title">💬 All Reviews ({stats.totalReviews})</h3>
            
            {stats.totalReviews === 0 ? ( // Agar koi review nahi hai
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <h4 className="empty-title">No Reviews Yet</h4>
                <p className="empty-description">
                  Start reviewing books in your library to see them appear here.
                </p>
              </div>
            ) : ( // Agar reviews hai
              <div>
                {myLibrary
                  .filter(book => allReviews[book.id]?.length > 0) // Sirf un books ko lo jinke reviews hai
                  .map(book => (
                  <div key={book.id} style={{ marginBottom: "32px" }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "12px", 
                      marginBottom: "20px",
                      paddingBottom: "12px",
                      borderBottom: "1px solid #e5e7eb"
                    }}>
                      <img 
                        src={book.cover} 
                        alt={book.title} 
                        style={{ 
                          width: "60px", 
                          height: "80px", 
                          objectFit: "cover", 
                          borderRadius: "6px"
                        }} 
                      />
                      <div>
                        <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>{book.title}</h4>
                        <p style={{ fontSize: "14px", color: "#6b7280" }}>
                          by {book.authors.join(", ")}
                        </p>
                      </div>
                    </div>
                    
                    <div className="cards-grid" style={{ gridTemplateColumns: "1fr" }}>
                      {allReviews[book.id].map(review => ( // Har review ke liye
                        <div key={review.id} className="review-item">
                          <div className="review-header">
                            <div className="review-user">
                              <div className="user-avatar" style={{ background: book.color }}>
                                {review.userAvatar}
                              </div>
                              <div className="user-info">
                                <h4>{review.userName}</h4>
                                <span>{new Date(review.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="review-rating">
                              {[...Array(5)].map((_, i) => ( // Stars dikhao
                                <span 
                                  key={i} 
                                  className="star" 
                                  style={{ color: i < review.rating ? "#fbbf24" : "#e5e7eb" }}
                                >
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
          <p style={{ color: "#6b7280", marginBottom: "20px" }}>
            A personal project to track my reading journey. Built with React and a lot of coffee.
          </p>
          
          <div className="footer-links">
            <a 
              href="#" 
              className="footer-link" 
              onClick={(e) => { e.preventDefault(); setActiveTab("discover"); }} // Discover tab kholo
            >
              Discover Books
            </a>
            <a 
              href="#" 
              className="footer-link" 
              onClick={(e) => { e.preventDefault(); setActiveTab("library"); }} // Library tab kholo
            >
              My Library
            </a>
            <a 
              href="#" 
              className="footer-link" 
              onClick={(e) => { e.preventDefault(); setOpenModal("addBook"); }} // Add book modal kholo
            >
              Add Your Book
            </a>
            <a 
              href="#" 
              className="footer-link" 
              onClick={(e) => { e.preventDefault(); setOpenModal("login"); }} // Login modal kholo
            >
              Sign In
            </a>
          </div>
          
          <p style={{ fontSize: "14px", color: "#9ca3af", marginTop: "24px" }}>
            BookHub • Made with ❤️ by a book lover learning React
          </p>
        </div>
      </footer>

      {/* Modals */}
      {openModal === "login" && ( // Agar login modal open hai
        <div className="modal-overlay" onClick={() => setOpenModal(null)}> {/* Overlay click par band karo */}
          <div onClick={e => e.stopPropagation()}> {/* Modal ke andar click par band na ho */}
            <LoginModal />
          </div>
        </div>
      )}

      {openModal === "register" && ( // Agar register modal open hai
        <div className="modal-overlay" onClick={() => setOpenModal(null)}>
          <div onClick={e => e.stopPropagation()}>
            <RegisterModal />
          </div>
        </div>
      )}

      {openModal === "addBook" && ( // Agar add book modal open hai
        <div className="modal-overlay" onClick={() => setOpenModal(null)}>
          <div onClick={e => e.stopPropagation()}>
            <AddBookModal />
          </div>
        </div>
      )}

      {openModal === "book" && modalData.book && ( // Agar book modal open hai aur book data hai
        <div className="modal-overlay" onClick={() => setOpenModal(null)}>
          <div onClick={e => e.stopPropagation()}>
            <BookDetailModal book={modalData.book} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App; // App component export karo

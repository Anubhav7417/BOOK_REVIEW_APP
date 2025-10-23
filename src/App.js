import React, { Component } from 'react';
import './App.css';

class BookHubApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: JSON.parse(localStorage.getItem('bookhub_users')) || [],
      admins: JSON.parse(localStorage.getItem('bookhub_admins')) || [],
      currentUser: JSON.parse(localStorage.getItem('bookhub_current_user')) || null,
      userLibrary: JSON.parse(localStorage.getItem('user_library')) || [],
      userReviews: JSON.parse(localStorage.getItem('user_reviews')) || [],
      otpData: JSON.parse(localStorage.getItem('otp_data')) || {},
      showLoginModal: false,
      showBookModal: false,
      activeBook: null,
      activeTab: 'user',
      activeForm: 'user-login',
      otpTimer: null,
      searchTerm: '',
      activeGenre: 'all',
      phoneData: {
        countryCode: '+91',
        phoneNumber: '',
        otpCode: '',
        otpSent: false
      },
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
      adminData: {
        username: '',
        password: '',
        securityCode: ''
      },
      failedAttempts: JSON.parse(localStorage.getItem('failed_attempts')) || {},
      isLocked: false,
      lockUntil: JSON.parse(localStorage.getItem('lock_until')) || 0
    };

    this.encryptionKey = this.generateEncryptionKey();
    this.sessionTimeout = 30 * 60 * 1000;
    
    this.API_CONFIG = {
      GOOGLE_BOOKS: {
        BASE_URL: 'https://www.googleapis.com/books/v1/volumes',
        API_KEY: 'AIzaSyCpqKevtXzm-SuF62BqwQztTvFRB2g3Cd4'
      }
    };

    this.sampleBooks = [
      {
        id: '1',
        title: 'The Ramayana',
        author: 'Valmiki',
        cover: 'https://via.placeholder.com/150x200/2563eb/ffffff?text=Ramayana',
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
        cover: 'https://via.placeholder.com/150x200/06b6d4/ffffff?text=Mahabharata',
        pages: 1200,
        genre: 'indian',
        description: 'The Mahabharata is one of the two major Sanskrit epics of ancient India, detailing the legendary Kurukshetra War fought between the Pandavas and the Kauravas—cousins from the Kuru dynasty. Beyond the war, the epic explores profound themes of duty (dharma), justice, family loyalty, and the consequences of human actions, making it a cornerstone of Indian literature and philosophy.',
        contentPreview: 'The epic begins with King Shantanu of Hastinapura, who falls in love with the river goddess Ganga. Their union leads to the birth of Bhishma, a key figure in the unfolding saga. As generations pass, rivalries grow between Shantanu’s descendants—the Pandavas and the Kauravas—eventually culminating in a great war that tests the values of truth, honor, and destiny.',
        rating: 4.8,
        reviews: 76,
        trending: true,
        publishedYear: '400 BCE',
        language: 'Sanskrit, Hindi'
      },
      {
        id: '3',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        cover: 'https://via.placeholder.com/150x200/10b981/ffffff?text=Mockingbird',
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
        title: '1984',
        author: 'George Orwell',
        cover: 'https://via.placeholder.com/150x200/f59e0b/ffffff?text=1984',
        pages: 328,
        genre: 'fiction',
        description: 'A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.',
        contentPreview: 'It was a bright cold day in April, and the clocks were striking thirteen...',
        rating: 4.6,
        reviews: 267,
        trending: true,
        publishedYear: '1949',
        language: 'English'
      },
      {
        id: '5',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        cover: 'https://via.placeholder.com/150x200/ef4444/ffffff?text=P%26P',
        pages: 432,
        genre: 'classics',
        description: 'A romantic novel of manners that depicts the emotional development of protagonist Elizabeth Bennet.',
        contentPreview: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife...',
        rating: 4.5,
        reviews: 198,
        trending: false,
        publishedYear: '1813',
        language: 'English'
      },
      {
        id: '6',
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        cover: 'https://via.placeholder.com/150x200/8b5cf6/ffffff?text=Alchemist',
        pages: 208,
        genre: 'fiction',
        description: 'A philosophical book that follows a young Andalusian shepherd in his journey to the pyramids of Egypt.',
        contentPreview: 'The boy\'s name was Santiago. Dusk was falling as the boy arrived with his herd at an abandoned church...',
        rating: 4.4,
        reviews: 223,
        trending: true,
        publishedYear: '1988',
        language: 'Portuguese'
      },
      {
        id: '7',
        title: 'The God of Small Things',
        author: 'Arundhati Roy',
        cover: 'https://via.placeholder.com/150x200/ec4899/ffffff?text=Small+Things',
        pages: 340,
        genre: 'indian',
        description: 'A story about the childhood experiences of fraternal twins whose lives are destroyed by the "Love Laws" that lay down "who should be loved, and how."',
        contentPreview: 'May in Ayemenem is a hot, brooding month. The days are long and humid...',
        rating: 4.3,
        reviews: 156,
        trending: false,
        publishedYear: '1997',
        language: 'English'
      },
      {
        id: '8',
        title: 'Harry Potter and the Philosopher\'s Stone',
        author: 'J.K. Rowling',
        cover: 'https://via.placeholder.com/150x200/14b8a6/ffffff?text=Harry+Potter',
        pages: 320,
        genre: 'fantasy',
        description: 'The first novel in the Harry Potter series, following Harry Potter, a young wizard who discovers his magical heritage.',
        contentPreview: 'Mr. and Mrs. Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal, thank you very much...',
        rating: 4.8,
        reviews: 478,
        trending: true,
        publishedYear: '1997',
        language: 'English'
      },
      {
        id: '9',
        title: 'The Kite Runner',
        author: 'Khaled Hosseini',
        cover: 'https://via.placeholder.com/150x200/84cc16/ffffff?text=Kite+Runner',
        pages: 371,
        genre: 'fiction',
        description: 'A powerful story of friendship, betrayal, and redemption set against the backdrop of Afghanistan\'s turbulent history.',
        contentPreview: 'I became what I am today at the age of twelve, on a frigid overcast day in the winter of 1975...',
        rating: 4.7,
        reviews: 289,
        trending: true,
        publishedYear: '2003',
        language: 'English'
      },
      {
        id: '10',
        title: 'The White Tiger',
        author: 'Aravind Adiga',
        cover: 'https://via.placeholder.com/150x200/f97316/ffffff?text=White+Tiger',
        pages: 321,
        genre: 'indian',
        description: 'A darkly comic novel about class struggle and social inequality in modern India.',
        contentPreview: 'Neither you nor I speak English, but there are some things that can be said only in English...',
        rating: 4.2,
        reviews: 167,
        trending: false,
        publishedYear: '2008',
        language: 'English'
      }
    ];

    this.sampleReviews = [
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
        likes: 45,
        memeReview: 'When you realize Ramayana has more plot twists than your favorite Netflix show 😂'
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
        likes: 67,
        memeReview: 'When someone says they finished Mahabharata in a week 👀 #Cap'
      }
    ];
  }

  componentDidMount() {
    this.initializeDefaultAdmin();
    this.initializeTheme();
    this.initializeParticles();
    this.loadSampleData();
    this.setupEventListeners();
    this.checkAccountLock();
    this.setupSessionTimer();
  }

  componentWillUnmount() {
    this.clearSessionTimer();
    this.clearOTPTimer();
  }

  // Enhanced Security Methods
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

  // Account Lock Security
  checkAccountLock = () => {
    const { lockUntil } = this.state;
    const now = Date.now();
    
    if (lockUntil > now) {
      this.setState({ isLocked: true });
      setTimeout(() => {
        this.setState({ isLocked: false, lockUntil: 0 });
        localStorage.removeItem('lock_until');
      }, lockUntil - now);
    }
  }

  recordFailedAttempt = (identifier) => {
    const { failedAttempts } = this.state;
    const attempts = (failedAttempts[identifier] || 0) + 1;
    const newFailedAttempts = { ...failedAttempts, [identifier]: attempts };
    
    this.setState({ failedAttempts: newFailedAttempts });
    localStorage.setItem('failed_attempts', JSON.stringify(newFailedAttempts));

    if (attempts >= 5) {
      const lockUntil = Date.now() + (15 * 60 * 1000);
      this.setState({ isLocked: true, lockUntil });
      localStorage.setItem('lock_until', JSON.stringify(lockUntil));
      
      setTimeout(() => {
        this.setState({ 
          isLocked: false, 
          lockUntil: 0,
          failedAttempts: { ...newFailedAttempts, [identifier]: 0 }
        });
        localStorage.removeItem('lock_until');
        localStorage.setItem('failed_attempts', JSON.stringify({ ...newFailedAttempts, [identifier]: 0 }));
      }, 15 * 60 * 1000);
      
      return true;
    }
    return false;
  }

  resetFailedAttempts = (identifier) => {
    const { failedAttempts } = this.state;
    const newFailedAttempts = { ...failedAttempts, [identifier]: 0 };
    this.setState({ failedAttempts: newFailedAttempts });
    localStorage.setItem('failed_attempts', JSON.stringify(newFailedAttempts));
  }

  // Session Management
  setupSessionTimer = () => {
    this.sessionTimer = setTimeout(() => {
      if (this.state.currentUser) {
        this.handleLogout();
        this.showToast('Session expired. Please login again.', 'warning');
      }
    }, this.sessionTimeout);
  }

  clearSessionTimer = () => {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
  }

  resetSessionTimer = () => {
    this.clearSessionTimer();
    this.setupSessionTimer();
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

  validateEmail = (email) => {
    const { users } = this.state;
    const sanitizedEmail = this.sanitizeInput(email);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return { valid: false, message: 'Please enter a valid email' };
    }
    
    const disposableDomains = ['tempmail.com', 'throwaway.com', 'guerrillamail.com'];
    const domain = sanitizedEmail.split('@')[1];
    if (disposableDomains.includes(domain)) {
      return { valid: false, message: 'Disposable email addresses are not allowed' };
    }
    
    if (users.find(u => u.email === sanitizedEmail)) {
      return { valid: false, message: 'Email already registered' };
    }
    
    return { valid: true, message: 'Email looks perfect! ✨' };
  }

  validateUsername = (username) => {
    const { users } = this.state;
    const sanitizedUsername = this.sanitizeInput(username);
    
    if (sanitizedUsername.length < 3) {
      return { valid: false, message: 'Username too short (min 3 chars)' };
    }
    if (sanitizedUsername.length > 20) {
      return { valid: false, message: 'Username too long (max 20 chars)' };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(sanitizedUsername)) {
      return { valid: false, message: 'Only letters, numbers, and underscores' };
    }
    if (users.find(u => u.username === sanitizedUsername)) {
      return { valid: false, message: 'Username already taken' };
    }
    
    const reservedUsernames = ['admin', 'administrator', 'root', 'system', 'support'];
    if (reservedUsernames.includes(sanitizedUsername.toLowerCase())) {
      return { valid: false, message: 'This username is reserved' };
    }
    
    return { valid: true, message: 'Looking good! 👍' };
  }

  checkPasswordStrength = (password) => {
    let strength = 0;
    let hints = [];

    if (password.length >= 8) strength++;
    else hints.push('at least 8 characters');

    if (/[A-Z]/.test(password)) strength++;
    else hints.push('one uppercase letter');

    if (/[a-z]/.test(password)) strength++;
    else hints.push('one lowercase letter');

    if (/[0-9]/.test(password)) strength++;
    else hints.push('one number');

    if (/[^A-Za-z0-9]/.test(password)) strength++;
    else hints.push('one special character');

    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
    if (commonPasswords.includes(password.toLowerCase())) {
      strength = 0;
      hints = ['This password is too common'];
    }

    return { strength, hints };
  }

  // Enhanced Authentication Methods
  initializeDefaultAdmin = () => {
    const { admins } = this.state;
    if (admins.length === 0) {
      const newAdmins = [...admins, {
        id: 1,
        username: 'admin',
        password: this.hashPassword('Admin@123Secure'),
        securityCode: 'ADMIN2024SECURE',
        createdAt: new Date().toISOString(),
        lastLogin: null,
        isActive: true,
        role: 'super_admin'
      }];
      this.setState({ admins: newAdmins });
      localStorage.setItem('bookhub_admins', JSON.stringify(newAdmins));
    }
  }

  loginUser = (identifier, password, isAdmin = false) => {
    if (this.state.isLocked) {
      const remainingTime = Math.ceil((this.state.lockUntil - Date.now()) / 60000);
      return { 
        success: false, 
        message: `Account temporarily locked. Try again in ${remainingTime} minutes.` 
      };
    }

    const users = isAdmin ? this.state.admins : this.state.users;
    const sanitizedIdentifier = this.sanitizeInput(identifier);
    const user = users.find(u => 
      u.username === sanitizedIdentifier || u.email === sanitizedIdentifier
    );

    if (!user) {
      this.recordFailedAttempt(sanitizedIdentifier);
      return { success: false, message: 'Invalid credentials' };
    }

    if (!user.isActive) {
      return { success: false, message: 'Account is deactivated' };
    }

    if (!this.verifyPassword(password, user.password)) {
      const shouldLock = this.recordFailedAttempt(sanitizedIdentifier);
      if (shouldLock) {
        return { success: false, message: 'Too many failed attempts. Account locked for 15 minutes.' };
      }
      return { success: false, message: 'Invalid credentials' };
    }

    this.resetFailedAttempts(sanitizedIdentifier);
    
    user.lastLogin = new Date().toISOString();
    
    if (isAdmin) {
      const newAdmins = this.state.admins.map(a => a.id === user.id ? user : a);
      this.setState({ admins: newAdmins });
      localStorage.setItem('bookhub_admins', JSON.stringify(newAdmins));
    } else {
      const newUsers = this.state.users.map(u => u.id === user.id ? user : u);
      this.setState({ users: newUsers });
      localStorage.setItem('bookhub_users', JSON.stringify(newUsers));
    }

    const currentUser = { 
      ...user, 
      isAdmin,
      sessionStart: Date.now()
    };
    
    this.setState({ 
      currentUser,
      showLoginModal: false,
      loginData: { username: '', password: '' }
    });
    
    localStorage.setItem('bookhub_current_user', JSON.stringify(currentUser));
    this.resetSessionTimer();

    return { success: true, user: currentUser };
  }

  loginAdmin = (username, password, securityCode) => {
    if (this.state.isLocked) {
      const remainingTime = Math.ceil((this.state.lockUntil - Date.now()) / 60000);
      return { 
        success: false, 
        message: `Account temporarily locked. Try again in ${remainingTime} minutes.` 
      };
    }

    const sanitizedUsername = this.sanitizeInput(username);
    const admin = this.state.admins.find(a => a.username === sanitizedUsername);

    if (!admin) {
      this.recordFailedAttempt(sanitizedUsername);
      return { success: false, message: 'Invalid admin credentials' };
    }

    if (!this.verifyPassword(password, admin.password)) {
      const shouldLock = this.recordFailedAttempt(sanitizedUsername);
      if (shouldLock) {
        return { success: false, message: 'Too many failed attempts. Account locked for 15 minutes.' };
      }
      return { success: false, message: 'Invalid admin credentials' };
    }

    if (admin.securityCode !== securityCode) {
      this.recordFailedAttempt(sanitizedUsername);
      return { success: false, message: 'Invalid security code' };
    }

    this.resetFailedAttempts(sanitizedUsername);
    
    admin.lastLogin = new Date().toISOString();
    
    const currentUser = { 
      ...admin, 
      isAdmin: true,
      sessionStart: Date.now()
    };
    
    this.setState({ 
      currentUser,
      showLoginModal: false,
      adminData: { username: '', password: '', securityCode: '' }
    });
    
    localStorage.setItem('bookhub_current_user', JSON.stringify(currentUser));
    this.resetSessionTimer();

    return { success: true, user: currentUser };
  }

  // Enhanced Phone Authentication
  generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
  }

  sendOTP = (phoneNumber) => {
    if (!this.validatePhoneNumber(phoneNumber)) {
      return { success: false, message: 'Invalid phone number format' };
    }

    const otpRequests = JSON.parse(localStorage.getItem('otp_requests') || '{}');
    const now = Date.now();
    const userRequests = otpRequests[phoneNumber] || [];
    const recentRequests = userRequests.filter(time => now - time < 3600000);
    
    if (recentRequests.length >= 5) {
      return { success: false, message: 'Too many OTP requests. Please try again later.' };
    }

    const otp = this.generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    const newOtpData = {
      ...this.state.otpData,
      [phoneNumber]: {
        otp: otp,
        expiresAt: expiresAt,
        attempts: 0,
        created: now
      }
    };

    otpRequests[phoneNumber] = [...recentRequests, now];
    localStorage.setItem('otp_requests', JSON.stringify(otpRequests));

    this.setState({ otpData: newOtpData });
    localStorage.setItem('otp_data', JSON.stringify(newOtpData));

    console.log(`SECURE OTP for ${phoneNumber}: ${otp}`);
    
    this.startOTPTimer();

    return { success: true, message: `📱 Verification code sent to ${phoneNumber}` };
  }

  verifyOTP = (phoneNumber, enteredOTP) => {
    const storedData = this.state.otpData[phoneNumber];
    
    if (!storedData) {
      return { success: false, message: 'No OTP request found' };
    }

    if (Date.now() > storedData.expiresAt) {
      const newOtpData = { ...this.state.otpData };
      delete newOtpData[phoneNumber];
      this.setState({ otpData: newOtpData });
      localStorage.setItem('otp_data', JSON.stringify(newOtpData));
      return { success: false, message: 'OTP expired. Please request a new one.' };
    }

    if (storedData.attempts >= 3) {
      return { success: false, message: 'Too many attempts. Please request a new OTP.' };
    }

    if (storedData.otp === enteredOTP) {
      const newOtpData = { ...this.state.otpData };
      delete newOtpData[phoneNumber];
      this.setState({ otpData: newOtpData });
      localStorage.setItem('otp_data', JSON.stringify(newOtpData));
      this.clearOTPTimer();
      return { success: true, message: 'Phone verified successfully! ✅' };
    } else {
      const newOtpData = {
        ...this.state.otpData,
        [phoneNumber]: {
          ...storedData,
          attempts: storedData.attempts + 1
        }
      };
      this.setState({ otpData: newOtpData });
      localStorage.setItem('otp_data', JSON.stringify(newOtpData));
      const remainingAttempts = 3 - (storedData.attempts + 1);
      return { 
        success: false, 
        message: `Invalid OTP. ${remainingAttempts} attempts remaining.` 
      };
    }
  }

  startOTPTimer = () => {
    let timeLeft = 300;
    this.updateOTPTimerDisplay(timeLeft);

    const otpTimer = setInterval(() => {
      timeLeft--;
      this.updateOTPTimerDisplay(timeLeft);

      if (timeLeft <= 0) {
        this.clearOTPTimer();
        this.showToast('OTP expired. Please request a new one.', 'warning');
      }
    }, 1000);

    this.setState({ otpTimer });
  }

  updateOTPTimerDisplay = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
      countdownElement.textContent = display;
    }
  }

  clearOTPTimer = () => {
    const { otpTimer } = this.state;
    if (otpTimer) {
      clearInterval(otpTimer);
      this.setState({ otpTimer: null });
    }
  }

  handlePhoneLogin = async () => {
    const { phoneData } = this.state;
    const fullPhoneNumber = phoneData.countryCode + phoneData.phoneNumber;

    if (!phoneData.otpSent) {
      const result = this.sendOTP(fullPhoneNumber);
      if (result.success) {
        this.showToast(result.message, 'success');
        this.setState({
          phoneData: {
            ...phoneData,
            otpSent: true
          }
        });
      } else {
        this.showToast(result.message, 'error');
      }
    } else {
      const result = this.verifyOTP(fullPhoneNumber, phoneData.otpCode);
      if (result.success) {
        this.showToast(result.message, 'success');
        this.handlePhoneUserLogin(fullPhoneNumber);
      } else {
        this.showToast(result.message, 'error');
      }
    }
  }

  handlePhoneUserLogin = (phoneNumber) => {
    let user = this.state.users.find(u => u.phone === phoneNumber);

    if (!user) {
      user = {
        id: 'phone_' + Date.now(),
        name: `User_${phoneNumber.substring(phoneNumber.length - 4)}`,
        username: `user_${Date.now()}`,
        phone: phoneNumber,
        password: null,
        avatar: `https://ui-avatars.com/api/?name=User&background=2563eb&color=fff`,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isActive: true,
        isSocial: true,
        readingStats: {
          booksRead: 0,
          pagesRead: 0,
          readingTime: 0,
          favoriteGenres: []
        }
      };
      const newUsers = [...this.state.users, user];
      this.setState({ 
        users: newUsers,
        currentUser: { ...user, isAdmin: false },
        showLoginModal: false,
        phoneData: { countryCode: '+91', phoneNumber: '', otpCode: '', otpSent: false }
      });
      localStorage.setItem('bookhub_users', JSON.stringify(newUsers));
    } else {
      this.setState({ 
        currentUser: { ...user, isAdmin: false },
        showLoginModal: false,
        phoneData: { countryCode: '+91', phoneNumber: '', otpCode: '', otpSent: false }
      });
    }

    localStorage.setItem('bookhub_current_user', JSON.stringify({ ...user, isAdmin: false }));
    this.showToast('Phone verification successful! 📱', 'success');
  }

  // Enhanced User Registration
  registerUser = (userData) => {
    const { users } = this.state;
    
    const usernameValidation = this.validateUsername(userData.username);
    if (!usernameValidation.valid) {
      return { success: false, message: usernameValidation.message };
    }

    const emailValidation = this.validateEmail(userData.email);
    if (!emailValidation.valid) {
      return { success: false, message: emailValidation.message };
    }

    if (userData.password !== userData.confirmPassword) {
      return { success: false, message: 'Passwords do not match' };
    }

    const passwordStrength = this.checkPasswordStrength(userData.password);
    if (passwordStrength.strength < 3) {
      return { 
        success: false, 
        message: `Password too weak. ${passwordStrength.hints.join(', ')}` 
      };
    }

    const newUser = {
      id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: this.sanitizeInput(userData.name),
      username: this.sanitizeInput(userData.username),
      email: this.sanitizeInput(userData.email),
      password: this.hashPassword(userData.password),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=2563eb&color=fff`,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true,
      emailVerified: false,
      role: 'user',
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

  // UI Management
  showLoginModal = () => {
    this.setState({ 
      showLoginModal: true,
      activeTab: 'user',
      activeForm: 'user-login'
    });
  }

  hideLoginModal = () => {
    this.setState({ 
      showLoginModal: false,
      phoneData: { countryCode: '+91', phoneNumber: '', otpCode: '', otpSent: false }
    });
    this.clearOTPTimer();
  }

  switchLoginTab = (tab) => {
    this.setState({ 
      activeTab: tab,
      activeForm: tab === 'user' ? 'user-login' : 'admin-login'
    });
  }

  showPhoneLogin = () => {
    this.setState({ activeForm: 'phone-login' });
  }

  showRegistration = () => {
    this.setState({ activeForm: 'register' });
  }

  showUserLogin = () => {
    this.setState({ 
      activeTab: 'user',
      activeForm: 'user-login'
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

  // Toast Notifications
  showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="flex items-center justify-between">
        <span>${message}</span>
        <button class="ml-4 text-white hover:text-gray-200">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    const container = document.getElementById('toast-container');
    if (container) {
      container.appendChild(toast);
      
      setTimeout(() => toast.classList.add('show'), 100);
      
      toast.querySelector('button').addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      });
      
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 5000);
    }
  }

  // Book Management
  loadSampleData = () => {
    const { userLibrary } = this.state;
    if (userLibrary.length === 0) {
      const sampleLibrary = [{
        id: '1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        cover: 'https://via.placeholder.com/150x200/2563eb/ffffff?text=Gatsby',
        pages: 180,
        currentPage: 0,
        genre: 'Fiction',
        status: 'to-read',
        addedDate: new Date().toISOString()
      }];
      
      this.setState({ userLibrary: sampleLibrary });
      localStorage.setItem('user_library', JSON.stringify(sampleLibrary));
    }
  }

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

  // Book Details Modal
  showBookDetails = async (bookId) => {
    try {
      this.setState({ showBookModal: true, activeBook: null });
      
      let bookData;
      
      if (bookId.startsWith('google_')) {
        bookData = await this.fetchBookFromGoogleAPI(bookId.replace('google_', ''));
      } else {
        bookData = this.sampleBooks.find(b => b.id === bookId) || 
                  this.state.userLibrary.find(b => b.id === bookId);
      }
      
      if (bookData) {
        this.setState({ activeBook: bookData });
      } else {
        throw new Error('Book not found');
      }
    } catch (error) {
      console.error('Error loading book details:', error);
      this.showToast('Could not load book details', 'error');
      this.hideBookModal();
    }
  }

  fetchBookFromGoogleAPI = async (bookId) => {
    const response = await fetch(
      `${this.API_CONFIG.GOOGLE_BOOKS.BASE_URL}/${bookId}?key=${this.API_CONFIG.GOOGLE_BOOKS.API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch book details');
    }
    
    const data = await response.json();
    const bookInfo = data.volumeInfo;
    
    return {
      id: 'google_' + data.id,
      title: bookInfo.title,
      author: bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown Author',
      cover: bookInfo.imageLinks?.thumbnail || bookInfo.imageLinks?.smallThumbnail || 'https://via.placeholder.com/150x200',
      pages: bookInfo.pageCount || 0,
      genre: bookInfo.categories ? bookInfo.categories[0] : 'Unknown Genre',
      description: bookInfo.description || 'No description available',
      contentPreview: bookInfo.previewLink ? 'Preview available' : 'No preview available',
      rating: bookInfo.averageRating || 0,
      reviews: bookInfo.ratingsCount || 0,
      publishedDate: bookInfo.publishedDate,
      publisher: bookInfo.publisher,
      isbn: bookInfo.industryIdentifiers?.[0]?.identifier || 'N/A',
      language: bookInfo.language || 'en'
    };
  }

  hideBookModal = () => {
    this.setState({ showBookModal: false, activeBook: null });
  }

  // Theme Management
  initializeTheme = () => {
    const savedTheme = localStorage.getItem('bookhub_theme') || 'dark';
    this.applyTheme(savedTheme);
  }

  applyTheme = (theme) => {
    if (theme === 'system') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    document.body.className = theme === 'dark' ? 
      'bg-dark text-light min-h-screen relative overflow-x-hidden dark' : 
      'bg-light text-dark min-h-screen relative overflow-x-hidden light';
    
    localStorage.setItem('bookhub_theme', theme);
  }

  toggleTheme = () => {
    const currentTheme = localStorage.getItem('bookhub_theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  // Render Methods
  renderStars = (rating) => {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars += '<i class="fas fa-star text-yellow-400"></i>';
      } else if (i - 0.5 <= rating) {
        stars += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
      } else {
        stars += '<i class="far fa-star text-yellow-400"></i>';
      }
    }
    return stars;
  }

  renderBookDetailsModal = () => {
    const { activeBook } = this.state;
    
    if (!activeBook) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex justify-center">
          <img src={activeBook.cover} alt={activeBook.title} className="book-cover w-full max-w-xs" />
        </div>
        
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-primary-400 mb-2">{activeBook.title}</h2>
          <p className="text-xl text-secondary mb-4">by {activeBook.author}</p>
          
          <div className="flex items-center mb-6">
            <div className="star-rating text-2xl" dangerouslySetInnerHTML={{ __html: this.renderStars(activeBook.rating) }} />
            <span className="ml-3 text-lg font-semibold">{activeBook.rating}/5</span>
            <span className="ml-2 text-secondary">({activeBook.reviews} reviews)</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-card rounded-lg p-4">
              <div className="text-sm text-secondary">Pages</div>
              <div className="font-semibold">{activeBook.pages}</div>
            </div>
            <div className="bg-card rounded-lg p-4">
              <div className="text-sm text-secondary">Genre</div>
              <div className="font-semibold">{activeBook.genre}</div>
            </div>
            {activeBook.publishedYear && (
              <div className="bg-card rounded-lg p-4">
                <div className="text-sm text-secondary">Published</div>
                <div className="font-semibold">{activeBook.publishedYear}</div>
              </div>
            )}
            {activeBook.language && (
              <div className="bg-card rounded-lg p-4">
                <div className="text-sm text-secondary">Language</div>
                <div className="font-semibold">{activeBook.language}</div>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">About this book</h3>
            <p className="text-secondary leading-relaxed">{activeBook.description}</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => this.addBookToLibrary(activeBook)}
              className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-300 flex items-center gap-2"
            >
              <i className="fas fa-plus"></i>
              Add to Library
            </button>
            <button className="px-6 py-3 border border-accent text-accent font-semibold rounded-lg hover:bg-accent hover:text-white transition-all duration-300 flex items-center gap-2">
              <i className="fas fa-share"></i>
              Share
            </button>
            {activeBook.contentPreview && activeBook.contentPreview !== 'No preview available' && (
              <button className="px-6 py-3 border border-success text-success font-semibold rounded-lg hover:bg-success hover:text-white transition-all duration-300 flex items-center gap-2">
                <i className="fas fa-eye"></i>
                Preview
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  renderDiscoverBooks = () => {
    const { activeGenre } = this.state;
    const filteredBooks = activeGenre === 'all' 
      ? this.sampleBooks 
      : this.sampleBooks.filter(book => book.genre === activeGenre);

    return filteredBooks.map(book => (
      <div key={book.id} className="bg-dark rounded-2xl p-6 card-hover">
        <div className="flex flex-col items-center text-center">
          <img src={book.cover} alt={book.title} className="book-cover mb-4" />
          <h3 className="text-xl font-semibold text-primary-400 mb-1">{book.title}</h3>
          <p className="text-secondary mb-2">by {book.author}</p>
          <div className="flex items-center mb-3">
            <span className="px-2 py-1 bg-card text-xs rounded-full text-secondary">{book.genre}</span>
          </div>
          <div className="flex items-center mb-3">
            <div className="star-rating" dangerouslySetInnerHTML={{ __html: this.renderStars(book.rating) }} />
            <span className="ml-2 text-sm text-secondary">{book.rating}</span>
          </div>
          <p className="text-sm text-secondary mb-4 line-clamp-3">{book.description}</p>
          <div className="flex space-x-2 w-full">
            <button 
              onClick={() => this.addBookToLibrary(book)}
              className="add-to-library-btn flex-1 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors duration-300"
            >
              Add to Library
            </button>
            <button 
              onClick={() => this.showBookDetails(book.id)}
              className="view-details-btn flex-1 py-2 border border-accent text-accent text-sm rounded-lg hover:bg-accent hover:text-white transition-all duration-300"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    ));
  }

  renderTrendingBooks = () => {
    const trendingBooks = this.sampleBooks.filter(book => book.trending);
    
    return trendingBooks.map(book => (
      <div key={book.id} className="bg-dark rounded-2xl p-6 card-hover relative">
        <div className="absolute top-4 right-4 trending-badge">
          Trending 🔥
        </div>
        <div className="flex flex-col items-center text-center">
          <img src={book.cover} alt={book.title} className="book-cover mb-4" />
          <h3 className="text-xl font-semibold text-primary-400 mb-1">{book.title}</h3>
          <p className="text-secondary mb-2">by {book.author}</p>
          <div className="flex items-center mb-3">
            <div className="star-rating" dangerouslySetInnerHTML={{ __html: this.renderStars(book.rating) }} />
            <span className="ml-2 text-sm text-secondary">{book.rating} ({book.reviews} reviews)</span>
          </div>
          <p className="text-sm text-secondary mb-4 line-clamp-2">{book.description}</p>
          <div className="flex space-x-2 w-full">
            <button 
              onClick={() => this.addBookToLibrary(book)}
              className="add-to-library-btn flex-1 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors duration-300"
            >
              Add to Library
            </button>
            <button 
              onClick={() => this.showBookDetails(book.id)}
              className="view-details-btn flex-1 py-2 border border-accent text-accent text-sm rounded-lg hover:bg-accent hover:text-white transition-all duration-300"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    ));
  }

  renderReviews = () => {
    return this.sampleReviews.map(review => {
      const book = this.sampleBooks.find(b => b.id === review.bookId);
      return (
        <div key={review.id} className="bg-dark rounded-2xl p-6 card-hover">
          <div className="flex items-start space-x-4 mb-4">
            <img src={review.userAvatar} alt={review.userName} className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-primary-400">{review.userName}</h4>
                  <p className="text-sm text-secondary">Reviewed "{book.title}"</p>
                </div>
                <div className="text-sm text-secondary">{review.date}</div>
              </div>
              <div className="flex items-center mt-2">
                <div className="star-rating" dangerouslySetInnerHTML={{ __html: this.renderStars(review.rating) }} />
              </div>
            </div>
          </div>
          <h5 className="font-semibold text-lg mb-2">{review.title}</h5>
          <p className="text-secondary mb-4">{review.content}</p>
          <div className="meme-review">
            <p className="text-sm font-medium">💡 Vibe Check:</p>
            <p className="text-sm">{review.memeReview}</p>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-4">
              <button className="reaction-btn text-secondary hover:text-primary-400 transition-colors duration-300">
                <i className="fas fa-thumbs-up"></i> {review.likes}
              </button>
              <button className="reaction-btn text-secondary hover:text-primary-400 transition-colors duration-300">
                <i className="fas fa-comment"></i> Reply
              </button>
            </div>
            <button className="text-secondary hover:text-primary-400 transition-colors duration-300">
              <i className="fas fa-share"></i>
            </button>
          </div>
        </div>
      );
    });
  }

  renderUserLibrary = () => {
    const { currentUser, userLibrary } = this.state;
    
    if (!currentUser) {
      return (
        <div className="col-span-full text-center py-12">
          <i className="fas fa-lock text-6xl text-secondary mb-4"></i>
          <h3 className="text-xl font-semibold text-secondary mb-2">Login to access your library</h3>
          <p className="text-secondary">Sign in to view and manage your book collection</p>
        </div>
      );
    }

    if (userLibrary.length === 0) {
      return (
        <div className="col-span-full text-center py-12">
          <i className="fas fa-book-open text-6xl text-secondary mb-4"></i>
          <h3 className="text-xl font-semibold text-secondary mb-2">Your library is empty</h3>
          <p className="text-secondary">Add some books to get started!</p>
        </div>
      );
    }

    return userLibrary.map(book => (
      <div key={book.id} className="bg-dark rounded-2xl p-6 card-hover">
        <div className="flex items-start space-x-4">
          <img src={book.cover} alt={book.title} className="book-cover" />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-primary-400 mb-1">{book.title}</h3>
            <p className="text-secondary mb-2">by {book.author}</p>
            <div className="flex items-center mb-4">
              <span className="px-2 py-1 bg-card text-xs rounded-full text-secondary">{book.genre}</span>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-secondary">Progress</span>
                <span className="text-sm font-semibold text-primary-400">0%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '0%' }}></div>
              </div>
              <p className="text-xs text-secondary mt-1">0/{book.pages} pages</p>
            </div>
            <div className="flex space-x-2">
              <button className="update-progress-btn flex-1 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors duration-300">
                Update Progress
              </button>
              <button 
                onClick={() => this.showBookDetails(book.id)}
                className="view-details-btn flex-1 py-2 border border-accent text-accent text-sm rounded-lg hover:bg-accent hover:text-white transition-all duration-300"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    ));
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

  handleAdminLogin = (e) => {
    e.preventDefault();
    const { adminData } = this.state;
    
    if (!adminData.username || !adminData.password || !adminData.securityCode) {
      this.showToast('Please fill all fields', 'error');
      return;
    }
    
    const result = this.loginAdmin(adminData.username, adminData.password, adminData.securityCode);
    
    if (result.success) {
      this.showToast('Admin access granted! 🔐', 'success');
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

  handlePhoneSubmit = (e) => {
    e.preventDefault();
    this.handlePhoneLogin();
  }

  handleLogout = () => {
    this.setState({ currentUser: null });
    localStorage.removeItem('bookhub_current_user');
    this.clearSessionTimer();
    this.showToast('Logged out successfully! 👋', 'success');
  }

  handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) return;
    
    this.showToast(`Searching for "${searchTerm}"...`, 'warning');
    
    const filteredBooks = this.sampleBooks.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filteredBooks.length > 0) {
      this.showToast(`Found ${filteredBooks.length} books matching "${searchTerm}"`, 'success');
    } else {
      this.showToast(`No books found for "${searchTerm}"`, 'error');
    }
  }

  handleGenreFilter = (genre) => {
    this.setState({ activeGenre: genre });
  }

  // Utility Methods
  initializeParticles = () => {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle animate-particle-float';
      
      const size = Math.random() * 4 + 1;
      const tx = (Math.random() - 0.5) * 200;
      const ty = (Math.random() - 0.5) * 200;
      const colors = [
        'rgba(37, 99, 235, 0.3)',
        'rgba(6, 182, 212, 0.3)',
        'rgba(16, 185, 129, 0.3)',
        'rgba(245, 158, 11, 0.3)'
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        --tx: ${tx}vw;
        --ty: ${ty}vh;
        animation-duration: ${Math.random() * 15 + 10}s;
        animation-delay: ${Math.random() * 5}s;
      `;
      
      container.appendChild(particle);
    }
  }

  setupEventListeners = () => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.state.showLoginModal) this.hideLoginModal();
        if (this.state.showBookModal) this.hideBookModal();
      }
    });
  }

  renderLoginModal = () => {
    const { showLoginModal, activeTab, activeForm, phoneData, registerData, loginData, adminData } = this.state;

    if (!showLoginModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-up">
        <div className="bg-card rounded-2xl p-8 max-w-md w-full mx-4 card-hover relative">
          <button 
            onClick={this.hideLoginModal}
            className="absolute top-4 right-4 text-secondary hover:text-primary-400 transition-colors duration-300 text-xl"
          >
            <i className="fas fa-times"></i>
          </button>

          <h3 className="text-2xl font-semibold mb-6 text-center gradient-text">Join BookHub 📚</h3>
          
          {(activeForm === 'user-login' || activeForm === 'admin-login') && (
            <div className="flex border-b border-gray-600 mb-6">
              <button 
                onClick={() => this.switchLoginTab('user')}
                className={`login-tab flex-1 py-2 font-medium transition-all duration-300 ${
                  activeTab === 'user' 
                    ? 'text-primary-400 border-b-2 border-primary-400' 
                    : 'text-secondary hover:text-primary-300'
                }`}
              >
                User Login
              </button>
              <button 
                onClick={() => this.switchLoginTab('admin')}
                className={`login-tab flex-1 py-2 font-medium transition-all duration-300 ${
                  activeTab === 'admin' 
                    ? 'text-primary-400 border-b-2 border-primary-400' 
                    : 'text-secondary hover:text-primary-300'
                }`}
              >
                Admin Login
              </button>
            </div>
          )}
          
          {(activeForm === 'phone-login' || activeForm === 'register') && (
            <button 
              onClick={this.showUserLogin}
              className="flex items-center text-secondary hover:text-primary-400 transition-colors duration-300 mb-4 text-sm"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Login
            </button>
          )}
          
          {activeForm === 'user-login' && (
            <form onSubmit={this.handleUserLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Username or Email</label>
                <input 
                  type="text" 
                  value={loginData.username}
                  onChange={(e) => this.handleInputChange('loginData', 'username', e.target.value)}
                  required 
                  className="w-full px-4 py-3 bg-dark border border-card rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300" 
                  placeholder="Enter username or email" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <input 
                  type="password" 
                  value={loginData.password}
                  onChange={(e) => this.handleInputChange('loginData', 'password', e.target.value)}
                  required 
                  className="w-full px-4 py-3 bg-dark border border-card rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300" 
                  placeholder="Enter password" 
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span className="ml-2 text-sm">Remember me</span>
                </label>
                <a href="#" className="text-sm text-primary-400 hover:underline">Forgot password?</a>
              </div>
              <button type="submit" className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-105">
                Let's Go! 🚀
              </button>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button type="button" className="flex items-center justify-center gap-2 py-3 border border-gray-600 rounded-lg hover:bg-gray-800 transition-all duration-300 hover:border-primary-400">
                  <i className="fab fa-google text-red-500"></i>
                  <span>Google</span>
                </button>
                <button 
                  type="button" 
                  onClick={this.showPhoneLogin}
                  className="flex items-center justify-center gap-2 py-3 border border-gray-600 rounded-lg hover:bg-gray-800 transition-all duration-300 hover:border-primary-400"
                >
                  <i className="fas fa-phone text-green-500"></i>
                  <span>Phone</span>
                </button>
              </div>
              
              <div className="text-center text-sm">
                Don't have an account? <button type="button" onClick={this.showRegistration} className="text-primary-400 hover:underline font-semibold">Sign up now! ✨</button>
              </div>
            </form>
          )}
          
          {activeForm === 'admin-login' && (
            <form onSubmit={this.handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Admin Username</label>
                <input 
                  type="text" 
                  value={adminData.username}
                  onChange={(e) => this.handleInputChange('adminData', 'username', e.target.value)}
                  required 
                  className="w-full px-4 py-3 bg-dark border border-card rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300" 
                  placeholder="Enter admin username" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Admin Password</label>
                <input 
                  type="password" 
                  value={adminData.password}
                  onChange={(e) => this.handleInputChange('adminData', 'password', e.target.value)}
                  required 
                  className="w-full px-4 py-3 bg-dark border border-card rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300" 
                  placeholder="Enter admin password" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Security Code</label>
                <input 
                  type="text" 
                  value={adminData.securityCode}
                  onChange={(e) => this.handleInputChange('adminData', 'securityCode', e.target.value)}
                  required 
                  className="w-full px-4 py-3 bg-dark border border-card rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300" 
                  placeholder="Enter security code" 
                />
              </div>
              <button type="submit" className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-105">
                Admin Login 🔐
              </button>
            </form>
          )}
          
          {activeForm === 'phone-login' && (
            <form onSubmit={this.handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Phone Number 📱</label>
                <div className="phone-input flex">
                  <select 
                    value={phoneData.countryCode}
                    onChange={(e) => this.handleInputChange('phoneData', 'countryCode', e.target.value)}
                    className="px-3 py-3 bg-dark border border-card rounded-l-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  >
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+61">🇦🇺 +61</option>
                  </select>
                  <input 
                    type="tel" 
                    value={phoneData.phoneNumber}
                    onChange={(e) => this.handleInputChange('phoneData', 'phoneNumber', e.target.value)}
                    required 
                    className="flex-1 px-4 py-3 bg-dark border border-card rounded-r-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300" 
                    placeholder="Enter phone number" 
                  />
                </div>
              </div>
              
              {phoneData.otpSent && (
                <div className="animate-fade-in-up">
                  <label className="block text-sm font-semibold mb-2">Verification Code 🔢</label>
                  <input 
                    type="text" 
                    value={phoneData.otpCode}
                    onChange={(e) => this.handleInputChange('phoneData', 'otpCode', e.target.value)}
                    required 
                    className="w-full px-4 py-3 bg-dark border border-card rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300" 
                    placeholder="Enter 6-digit code" 
                  />
                  <p className="text-xs text-secondary mt-1" id="otp-timer">
                    Code expires in: <span id="countdown">05:00</span>
                  </p>
                </div>
              )}
              
              <button 
                type="submit" 
                className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-105"
              >
                {phoneData.otpSent ? 'Verify Code ✅' : 'Send Verification Code 📲'}
              </button>
            </form>
          )}
          
          {activeForm === 'register' && (
            <form onSubmit={this.handleRegistration} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name 👤</label>
                <input 
                  type="text" 
                  value={registerData.name}
                  onChange={(e) => this.handleInputChange('registerData', 'name', e.target.value)}
                  required 
                  className="w-full px-4 py-3 bg-dark border border-card rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300" 
                  placeholder="Enter your full name" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Username 🆔</label>
                <input 
                  type="text" 
                  value={registerData.username}
                  onChange={(e) => this.handleInputChange('registerData', 'username', e.target.value)}
                  required 
                  className="w-full px-4 py-3 bg-dark border border-card rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300" 
                  placeholder="Choose a cool username" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Email 📧</label>
                <input 
                  type="email" 
                  value={registerData.email}
                  onChange={(e) => this.handleInputChange('registerData', 'email', e.target.value)}
                  required 
                  className="w-full px-4 py-3 bg-dark border border-card rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300" 
                  placeholder="Enter your email" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Password 🔒</label>
                <input 
                  type="password" 
                  value={registerData.password}
                  onChange={(e) => this.handleInputChange('registerData', 'password', e.target.value)}
                  required 
                  className="w-full px-4 py-3 bg-dark border border-card rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300" 
                  placeholder="Create a strong password" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Confirm Password 🔒</label>
                <input 
                  type="password" 
                  value={registerData.confirmPassword}
                  onChange={(e) => this.handleInputChange('registerData', 'confirmPassword', e.target.value)}
                  required 
                  className="w-full px-4 py-3 bg-dark border border-card rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300" 
                  placeholder="Confirm your password" 
                />
              </div>
              <button type="submit" className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-105">
                Create Account 🎉
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  render() {
    const { currentUser, showBookModal, activeBook, activeGenre } = this.state;

    return (
      <div className="App">
        <div id="toast-container"></div>

        {showBookModal && (
          <div className="book-modal active">
            <div className="book-modal-content">
              <button onClick={this.hideBookModal} className="book-modal-close">
                <i className="fas fa-times"></i>
              </button>
              <div className="p-8">
                {activeBook ? this.renderBookDetailsModal() : (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="fixed inset-0 z-0 grid-bg"></div>
        <div id="particles-container" className="fixed inset-0 z-0"></div>

        <nav className="fixed top-0 w-full bg-dark/90 backdrop-blur-sm z-50 border-b border-card">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <a href="#home" className="flex items-center">
                <div className="h-10 w-10 rounded-full mr-2 bg-primary-600 flex items-center justify-center">
                  <i className="fas fa-book text-white"></i>
                </div>
                <span className="text-xl font-bold gradient-text">BookHub 📚</span>
              </a>
              
              <div className="hidden md:flex space-x-8">
                <a href="#home" className="nav-link text-secondary hover:text-primary-400 transition-colors duration-300 font-medium">Home 🏠</a>
                <a href="#library" className="nav-link text-secondary hover:text-primary-400 transition-colors duration-300 font-medium">My Library 📖</a>
                <a href="#discover" className="nav-link text-secondary hover:text-primary-400 transition-colors duration-300 font-medium">Discover 🔍</a>
                <a href="#reviews" className="nav-link text-secondary hover:text-primary-400 transition-colors duration-300 font-medium">Reviews 💬</a>
                <a href="#stats" className="nav-link text-secondary hover:text-primary-400 transition-colors duration-300 font-medium">Stats 📊</a>
                <a href="#trending" className="nav-link text-secondary hover:text-primary-400 transition-colors duration-300 font-medium">Trending 🔥</a>
              </div>

              <div className="flex items-center space-x-4">
                {currentUser && (
                  <div className="flex items-center space-x-2">
                    <img src={currentUser.avatar} alt="User" className="h-8 w-8 rounded-full" />
                    <span className="text-sm font-medium">{currentUser.name}</span>
                    <button onClick={this.handleLogout} className="text-secondary hover:text-primary-400 transition-colors duration-300">
                      <i className="fas fa-sign-out-alt"></i>
                    </button>
                  </div>
                )}

                <button onClick={this.toggleTheme} className="text-secondary hover:text-primary-400 transition-colors duration-300">
                  <i className="fas fa-moon"></i>
                </button>

                {!currentUser && (
                  <button onClick={this.showLoginModal} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-300 flex items-center gap-2">
                    <i className="fas fa-user"></i>
                    Login
                  </button>
                )}

                <button className="md:hidden text-secondary">
                  <i className="fas fa-bars text-xl"></i>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <section id="home" className="min-h-screen flex items-center pt-20 relative z-10">
          <div className="container mx-auto px-6 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-fade-in-up">
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                    Read, Review, <span className="gradient-text">Vibe</span> 📚✨
                  </h1>
                  <p className="text-lg text-secondary leading-relaxed max-w-2xl">
                    Join the lit reading community! Track your books, drop fire reviews, and connect with fellow bookworms. No cap, it's the best reading app out there! 🔥
                  </p>
                </div>

                <div className="relative max-w-xl">
                  <input 
                    type="text" 
                    placeholder="Search for books, authors, or vibes..." 
                    className="w-full px-6 py-4 bg-card border border-card rounded-2xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 pr-12"
                    onKeyPress={(e) => e.key === 'Enter' && this.handleSearch(e.target.value)}
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary hover:text-primary-400 transition-colors duration-300">
                    <i className="fas fa-search text-xl"></i>
                  </button>
                </div>

                <div className="flex space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-400">1.2K+</div>
                    <div className="text-sm text-secondary">Lit Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">567</div>
                    <div className="text-sm text-secondary">Active Readers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">89</div>
                    <div className="text-sm text-secondary">New This Week</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="library" className="py-20 bg-card relative z-10">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 gradient-text">My Library 📚</h2>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                Your personal book collection - organized and lit! 🔥
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mb-8 justify-center">
              <button className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-300 flex items-center gap-2">
                <i className="fas fa-plus"></i>
                Add Book
              </button>
              <button className="px-6 py-3 border border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-600 hover:text-white transition-all duration-300 flex items-center gap-2">
                <i className="fas fa-filter"></i>
                Filter
              </button>
              <button className="px-6 py-3 border border-accent text-accent font-semibold rounded-lg hover:bg-accent hover:text-white transition-all duration-300 flex items-center gap-2">
                <i className="fas fa-sort"></i>
                Sort
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {this.renderUserLibrary()}
            </div>
          </div>
        </section>

        <section id="discover" className="py-20 relative z-10">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 gradient-text">Discover New Reads 🔍</h2>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                Find your next obsession! Explore books across genres and vibes.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mb-8 justify-center">
              {['all', 'fiction', 'non-fiction', 'fantasy', 'mystery', 'classics', 'indian'].map(genre => (
                <button
                  key={genre}
                  onClick={() => this.handleGenreFilter(genre)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    activeGenre === genre 
                      ? 'bg-primary-600 text-white shadow-lg transform scale-105' 
                      : 'bg-card text-secondary hover:bg-primary-600 hover:text-white hover:transform hover:scale-105'
                  }`}
                >
                  {genre === 'all' ? 'All Genres' : genre.charAt(0).toUpperCase() + genre.slice(1)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {this.renderDiscoverBooks()}
            </div>
          </div>
        </section>

        <section id="reviews" className="py-20 bg-card relative z-10">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 gradient-text">Community Reviews 💬</h2>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                See what the community is saying about their latest reads! Spill the tea ☕
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {this.renderReviews()}
            </div>
          </div>
        </section>

        <section id="stats" className="py-20 relative z-10">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 gradient-text">Reading Stats 📊</h2>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                Track your reading journey and flex your stats! 💪
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-dark rounded-2xl p-6 text-center card-hover">
                <div className="text-4xl font-bold text-primary-400 mb-2">12</div>
                <div className="text-secondary">Books Read</div>
              </div>
              <div className="bg-dark rounded-2xl p-6 text-center card-hover">
                <div className="text-4xl font-bold text-accent mb-2">3,456</div>
                <div className="text-secondary">Pages Read</div>
              </div>
              <div className="bg-dark rounded-2xl p-6 text-center card-hover">
                <div className="text-4xl font-bold text-success mb-2">42</div>
                <div className="text-secondary">Reading Hours</div>
              </div>
              <div className="bg-dark rounded-2xl p-6 text-center card-hover">
                <div className="text-4xl font-bold text-warning mb-2">7</div>
                <div className="text-secondary">Genres Explored</div>
              </div>
            </div>

            <div className="bg-dark rounded-2xl p-8 card-hover max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold mb-6 text-center gradient-text">2024 Reading Goals 🎯</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Books to Read</span>
                    <span className="text-primary-400">8/20</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Pages to Read</span>
                    <span className="text-accent">1,234/5,000</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">New Genres</span>
                    <span className="text-success">3/5</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="trending" className="py-20 bg-card relative z-10">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 gradient-text">Trending Now 🔥</h2>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                The books everyone's talking about right now! Don't miss out on the hype.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {this.renderTrendingBooks()}
            </div>
          </div>
        </section>

        <div className="fab">
          <i className="fas fa-plus text-xl"></i>
        </div>

        {this.renderLoginModal()}
      </div>
    );
  }
}

export default BookHubApp;

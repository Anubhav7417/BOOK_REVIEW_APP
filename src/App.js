<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BookHub App</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background-color: #0f172a;
            color: #f8fafc;
            min-height: 100vh;
        }
        
        /* Navigation */
        .navbar {
            position: fixed;
            top: 0;
            width: 100%;
            background-color: rgba(15, 23, 42, 0.95);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 1000;
            padding: 1rem 0;
        }
        
        .nav-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.5rem;
            font-weight: 700;
            color: #f8fafc;
            text-decoration: none;
        }
        
        .logo-icon {
            width: 40px;
            height: 40px;
            background: #2563eb;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .nav-links {
            display: flex;
            gap: 2rem;
        }
        
        .nav-link {
            color: #64748b;
            text-decoration: none;
            font-weight: 500;
        }
        
        .user-actions {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        /* Buttons */
        .btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .btn-primary {
            background: #2563eb;
            color: white;
        }
        
        /* Hero Section */
        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            padding-top: 80px;
        }
        
        .hero-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
            max-width: 600px;
        }
        
        .hero-title {
            font-size: 3.5rem;
            font-weight: 800;
            line-height: 1.1;
            margin-bottom: 1.5rem;
            color: #f8fafc;
        }
        
        .hero-subtitle {
            font-size: 1.25rem;
            color: #64748b;
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        
        .search-container {
            max-width: 500px;
            margin-bottom: 3rem;
            position: relative;
        }
        
        .search-bar {
            width: 100%;
            padding: 1rem 1.5rem;
            background: #1e293b;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 50px;
            color: #f8fafc;
            font-size: 1rem;
        }
        
        .search-icon {
            position: absolute;
            right: 1.5rem;
            top: 50%;
            transform: translateY(-50%);
            color: #64748b;
        }
        
        .hero-stats {
            display: flex;
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .stat {
            text-align: center;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: #2563eb;
            display: block;
        }
        
        .stat-label {
            font-size: 0.875rem;
            color: #64748b;
        }
        
        /* Section */
        .section {
            padding: 5rem 0;
        }
        
        .section-header {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .section-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #f8fafc;
        }
        
        .section-subtitle {
            font-size: 1.125rem;
            color: #64748b;
            max-width: 600px;
            margin: 0 auto;
        }
        
        /* Book Grid */
        .books-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
        }
        
        /* Book Card */
        .book-card {
            background: #1e293b;
            border-radius: 16px;
            padding: 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .book-cover {
            width: 100%;
            height: 200px;
            border-radius: 12px;
            margin-bottom: 1rem;
            object-fit: cover;
        }
        
        .book-info {
            margin-bottom: 1.5rem;
        }
        
        .book-title {
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: #f8fafc;
        }
        
        .book-author {
            color: #64748b;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }
        
        .book-meta {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .book-genre {
            background: rgba(37, 99, 235, 0.2);
            color: #2563eb;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
        }
        
        .book-rating {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            color: #f59e0b;
            font-size: 0.9rem;
        }
        
        .book-description {
            color: #64748b;
            font-size: 0.9rem;
            line-height: 1.5;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
        
        .book-actions {
            display: flex;
            gap: 0.75rem;
        }
        
        .book-btn {
            flex: 1;
            padding: 0.75rem;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.85rem;
            cursor: pointer;
            text-align: center;
        }
        
        .book-btn-primary {
            background: #2563eb;
            color: white;
        }
        
        .book-btn-outline {
            background: transparent;
            color: #64748b;
            border: 1px solid #64748b;
        }
        
        /* Genre Filters */
        .genre-filters {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 0.75rem;
            margin-bottom: 3rem;
        }
        
        .genre-filter {
            padding: 0.5rem 1.25rem;
            background: #1e293b;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 50px;
            color: #64748b;
            font-weight: 500;
            cursor: pointer;
        }
        
        /* Footer */
        .footer {
            background: #1e293b;
            padding: 3rem 0;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 3rem;
        }
        
        .footer-section {
            margin-bottom: 2rem;
        }
        
        .footer-heading {
            color: #f8fafc;
            margin-bottom: 1rem;
            font-size: 1.125rem;
        }
        
        .footer-bottom {
            text-align: center;
            padding-top: 2rem;
            margin-top: 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            color: #64748b;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
        }
    </style>
</head>
<body>
    <div id="root">
        <!-- Navigation -->
        <nav class="navbar">
            <div class="nav-content">
                <a href="#" class="logo">
                    <div class="logo-icon">
                        <i class="fas fa-book"></i>
                    </div>
                    BookHub
                </a>
                
                <div class="nav-links">
                    <a href="#discover" class="nav-link">Discover</a>
                </div>
                
                <div class="user-actions">
                    <button class="btn btn-primary">
                        <i class="fas fa-user"></i> Login
                    </button>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="hero">
            <div class="hero-content">
                <h1 class="hero-title">
                    Review, <span style="color: #2563eb;"> And Vibe</span>
                </h1>
                <p class="hero-subtitle">
                    Join the reading community! Track your books, drop fire reviews, and connect with fellow bookworms. No cap, it's the best reading app out there! 🔥
                </p>
                
                <div class="search-container">
                    <input 
                        type="text" 
                        class="search-bar"
                        placeholder="Search for books, authors, or vibes..."
                    />
                    <i class="fas fa-search search-icon"></i>
                </div>
                
                <div class="hero-stats">
                    <div class="stat">
                        <span class="stat-number">0</span>
                        <span class="stat-label">Books Reviews</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">0</span>
                        <span class="stat-label">Active Readers</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">0</span>
                        <!--<span class="stat-label">New This Week</span>-->
                    </div>
                </div>
            </div>
        </section>

        <!-- Discover Section -->
        <section id="discover" class="section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Discover New Reads</h2>
                    <p class="section-subtitle">
                        Find your next obsession! Explore books across genres and vibes.
                    </p>
                </div>

                <div class="genre-filters">
                    <button class="genre-filter">All Genres</button>
                    <button class="genre-filter">Fiction</button>
                    <button class="genre-filter">Indian Literature</button>
                    <button class="genre-filter">Non-Fiction</button>
                </div>

                <div class="books-grid">
                    <!-- Book Card 1 - The Ramayana -->
                    <div class="book-card">
                        <img 
                            src="https://m.media-amazon.com/images/I/71FREGXGA1L._UF1000,1000_QL80_.jpg" 
                            alt="The Ramayana"
                            class="book-cover"
                        />
                        <div class="book-info">
                            <h3 class="book-title">The Ramayana</h3>
                            <p class="book-author">by Valmiki</p>
                            <div class="book-meta">
                                <span class="book-genre">Indian</span>
                                <div class="book-rating">
                                    <i class="fas fa-star"></i>
                                    <span>4.8</span>
                                </div>
                            </div>
                            <p class="book-description">
                                The Ramayana is an ancient Indian epic which narrates the struggle of the divine prince Rama to rescue his wife Sita from the demon king Ravana.
                            </p>
                        </div>
                        <div class="book-actions">
                            <button class="book-btn book-btn-primary">
                                Add to Library
                            </button>
                            <button class="book-btn book-btn-outline">
                                Details
                            </button>
                        </div>
                    </div>

                    <!-- Book Card 2 - The Mahabharata -->
                    <div class="book-card">
                        <img 
                            src="https://m.media-amazon.com/images/I/81gxiU-w93L.jpg" 
                            alt="The Mahabharata"
                            class="book-cover"
                        />
                        <div class="book-info">
                            <h3 class="book-title">The Mahabharata</h3>
                            <p class="book-author">by Vyasa</p>
                            <div class="book-meta">
                                <span class="book-genre">Indian</span>
                                <div class="book-rating">
                                    <i class="fas fa-star"></i>
                                    <span>4.8</span>
                                </div>
                            </div>
                            <p class="book-description">
                                The Mahabharata is one of the two major Sanskrit epics of ancient India, detailing the legendary Kurukshetra War fought between the Pandavas and the Kauravas.
                            </p>
                        </div>
                        <div class="book-actions">
                            <button class="book-btn book-btn-primary">
                                Add to Library
                            </button>
                            <button class="book-btn book-btn-outline">
                                Details
                            </button>
                        </div>
                    </div>

                    <!-- Book Card 3 - To Kill a Mockingbird -->
                    <div class="book-card">
                        <img 
                            src="https://i0.wp.com/www.printmag.com/wp-content/uploads/2017/07/2a34d8_a02f7a38d21c4666badc51e0e4973bd7mv2.jpg?resize=698%2C960&quality=89&ssl=1" 
                            alt="To Kill a Mockingbird"
                            class="book-cover"
                        />
                        <div class="book-info">
                            <h3 class="book-title">To Kill a Mockingbird</h3>
                            <p class="book-author">by Harper Lee</p>
                            <div class="book-meta">
                                <span class="book-genre">Fiction</span>
                                <div class="book-rating">
                                    <i class="fas fa-star"></i>
                                    <span>4.7</span>
                                </div>
                            </div>
                            <p class="book-description">
                                A gripping, heart-wrenching tale of race and identity in the American South during the 1930s.
                            </p>
                        </div>
                        <div class="book-actions">
                            <button class="book-btn book-btn-primary">
                                Add to Library
                            </button>
                            <button class="book-btn book-btn-outline">
                                Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="footer">
            <div class="footer-content">
                <div class="footer-section">
                    <h3 class="footer-heading">BookHub 📚</h3>
                    <p style="color: #64748b;">
                        Your digital library for discovering, tracking, and reviewing books. Join our community of passionate readers!
                    </p>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p></p>
            </div>
        </footer>
    </div>
</body>
</html>

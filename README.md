---

# 📚 **BookHub – Digital Library & Reading Platform**

A modern, feature-rich **Digital Library & Social Reading Platform** built with **React**, designed for smooth book discovery, personal tracking, reviews, and an interactive reading community.

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge"/>
</p>

---

## ✨ **Features Overview**

### 🎯 **Core Features**

* 📖 **Book Discovery** – Search & browse millions of books
* 📚 **Digital Library** – Personal bookshelf + progress tracking
* ⭐ **Smart Reviews** – Ratings + detailed review system

---

## 🔧 **Technical Features**

* 🔍 **Google Books API Search**
* 📱 **Fully Responsive UI**

---

## 🛡️ **Security Features**

* 🔐 **Encrypted password hashing**
* 🔒 **Encrypted local storage**

---

## 🚀 **Quick Start Guide**

### ✔️ **Prerequisites**

* Node.js 14+
* npm or yarn

### ✔️ **Installation**

```bash
# Clone the repository
git clone https://github.com/yourusername/bookhub.git

# Go to directory
cd bookhub

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### ✔️ **Environment Setup**

Create `.env` in the root:

```
REACT_APP_GOOGLE_BOOKS_API_KEY=your_api_key
REACT_APP_NAME=BookHub
```

---

## 📖 **How to Use**

### 👤 **For Readers**

* Create your account
* Discover trending & recommended books
* Add books to your library
* Track reading progress (with percentage)
* Submit reviews, ratings, and vibe checks

### 🛠️ **For Administrators**

**Default Admin Login**

```
Username: Neurix
Password: Neurix@7217secure
Security Code: PasswordHighzacked
```

Admin capabilities:

* User management
* Review & content moderation
* System analytics dashboard

---

### 📚 **Book Management**

* One-click **Add to Library**
* Progress tracking with progress bars
* Multiple reading formats

### ⭐ **Review System**

* 1–5 star rating slider

### 🔍 **Search & Discovery**

* Google Books API
* Genre filters (Indian classics, fiction, etc.)
* Real-time search suggestions

---

## 🎯 **Google Books API Integration**

```javascript
const searchBooks = async (query) => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}&key=API_KEY`
  );
  return response.json();
};
```

---

## 🔒 **Security Implementations**

### Authentication
* 30-minute session timeout
* Lock account after 5 wrong login attempts

### Data Protection

* Encrypted local storage
* Sanitized user inputs
* Brute-force detection

---

## 📱 **Responsive Design**

Built mobile-first with:

* Flexible grid layout
* Touch-friendly UI
* Works on all devices (mobile/tablet/desktop)

---

## 🛠️ **Development Scripts**

| Command         | Description      |
| --------------- | ---------------- |
| `npm start`     | Start dev server |
| `npm run build` | Production build |
| `npm test`      | Run tests        |
| `npm run eject` | Eject CRA        |

---

## 🧹 **Code Style**

* Component-based structure
* Clean naming & reusable components

---

## 🤝 **Contributing**

1. Fork the repository
2. Create a branch
3. Commit with meaningful messages
4. Push changes
5. Open a Pull Request

### Contribution Rules

* Follow code style
* Comment complex logic
* Add tests if needed
* Update docs for major changes

---

## 🐛 **Troubleshooting**

### ⚠️ Common Issues

* **API Errors** → Check your Google Books API key
* **Build Errors** → Delete `node_modules` and reinstall
* **Slow Performance** → Inspect browser console

### 🧪 **Debug Mode**

```
localStorage.setItem('debug', 'true');
```

---

## 📄 **License**

Licensed under the **MIT License**.

---

## 🙏 **Acknowledgments**

* Google Books API
* React Community
* Font Awesome
* Tailwind CSS

---

## 📞 **Support**
* 📧 Email: **[jonsnower07@gmail.com](mailto:jonsnower07@gmail.com)**

---

<div align="center">

### Made with ❤️ by Anubhav singh

**Happy Reading! 📚**

</div>

---

import React, { useState } from "react";
import "./App.css";

export default function BookHubApp() {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [library, setLibrary] = useState([]);
  const [results, setResults] = useState([]);

  const API = "https://www.googleapis.com/books/v1/volumes?q=";

  const handleLogin = () => {
    const name = prompt("Enter username:");
    if (name) setUser(name);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    const res = await fetch(API + encodeURIComponent(search));
    const data = await res.json();
    setResults(
      (data.items || []).map((b) => ({
        id: b.id,
        title: b.volumeInfo.title,
        author: (b.volumeInfo.authors || ["Unknown"]).join(", "),
        cover:
          b.volumeInfo.imageLinks?.thumbnail ||
          "https://via.placeholder.com/120x180",
      }))
    );
  };

  const addToLibrary = (book) => {
    if (!user) return alert("Login first!");
    if (library.find((b) => b.id === book.id))
      return alert("Already in library!");
    setLibrary([...library, book]);
  };

  return (
    <div className="app">
      <header>
        <h1>📚 BookHub</h1>
        {user ? (
          <span>Welcome, {user}!</span>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )}
      </header>

      <form onSubmit={handleSearch}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search books..."
        />
        <button type="submit">Search</button>
      </form>

      <h2>Results</h2>
      <div className="grid">
        {results.map((b) => (
          <div key={b.id} className="card">
            <img src={b.cover} alt={b.title} />
            <h4>{b.title}</h4>
            <p>{b.author}</p>
            <button onClick={() => addToLibrary(b)}>Add</button>
          </div>
        ))}
      </div>

      <h2>My Library</h2>
      <div className="grid">
        {library.map((b) => (
          <div key={b.id} className="card">
            <img src={b.cover} alt={b.title} />
            <h4>{b.title}</h4>
            <p>{b.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

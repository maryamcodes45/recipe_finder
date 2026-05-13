import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };
  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 520, margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 999,
          padding: '0.35rem 0.35rem 0.35rem 1.15rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '1px solid rgba(255,255,255,0.5)',
        }}
      >
        <input
          type="search"
          placeholder="Search Pakistani dishes — biryani, karahi, keema…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search recipes"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '1rem',
            padding: '0.6rem 0',
            fontFamily: 'inherit',
            background: 'transparent',
            color: '#0f172a',
          }}
        />
        <button type="submit" className="btn-primary" style={{ borderRadius: '50%', width: 44, height: 44, padding: 0, minWidth: 44 }} aria-label="Submit search">
          <FaSearch />
        </button>
      </div>
    </form>
  );
};
export default SearchBar;

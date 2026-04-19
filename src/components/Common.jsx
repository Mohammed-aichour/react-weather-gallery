import React from 'react';

export function SearchBar({ value, onChange, onSearch, loading, placeholder }) {
  return (
    <div className="search-wrap">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onSearch()}
      />
      <button type="button" className="btn" onClick={onSearch} disabled={loading || !value.trim()}>
        {loading ? '...' : 'Rechercher'}
      </button>
    </div>
  );
}

export function Pagination({ page, totalPages, onPage }) {
  const pages = [];
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  for (let i = start; i <= Math.min(start + 4, totalPages); i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      {pages.map(p => (
        <button
          key={p}
          type="button"
          className={`pagination__btn${p === page ? ' is-current' : ''}`}
          onClick={() => onPage(p)}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
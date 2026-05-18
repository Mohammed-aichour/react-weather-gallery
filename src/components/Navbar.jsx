import React from 'react';

const TABS = [
  { id: 'home', label: 'Accueil' },
  { id: 'gallery', label: 'Galerie' },
  { id: 'weather', label: 'Météo' },
  { id: 'culture', label: 'Culture' },
];

export default function Navbar({ page, setPage }) {
  return (
    <nav>
      <div className="logo">
        Maroc<span>Culture</span>
      </div>
      <div
        className="nav-segmented"
        role="tablist"
        aria-label="Navigation principale"
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={page === tab.id}
            id={`tab-${tab.id}`}
            className={`nav-segmented__btn${page === tab.id ? ' is-active' : ''}`}
            onClick={() => setPage(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

import React from 'react';

export default function Navbar({ page, setPage }) {
  return (
    <nav>
      <div className="logo">Pixa<span>Weather</span></div>
      <div
        className="nav-segmented"
        role="tablist"
        aria-label="Navigation principale"
      >
        <button
          type="button"
          role="tab"
          aria-selected={page === 'gallery'}
          id="tab-gallery"
          className={`nav-segmented__btn${page === 'gallery' ? ' is-active' : ''}`}
          onClick={() => setPage('gallery')}
        >
          Galerie
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={page === 'weather'}
          id="tab-weather"
          className={`nav-segmented__btn${page === 'weather' ? ' is-active' : ''}`}
          onClick={() => setPage('weather')}
        >
          Météo
        </button>
      </div>
    </nav>
  );
}

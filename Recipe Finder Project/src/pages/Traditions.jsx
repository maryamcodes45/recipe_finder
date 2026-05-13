import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TRADITIONS, TRADITIONS_EXTRA } from '../data/pakistaniFood';
const Traditions = () => {
  const { mealRhythm, tableEtiquette } = TRADITIONS_EXTRA;
  return (
    <div className="page-wrap pk-page">
      <header className="pk-page-banner">
        <p className="pk-page-banner__urdu">روایات</p>
        <h1 className="pk-page-banner__title">Traditions — table, tea & time</h1>
        <p className="pk-page-banner__lead">
          Pakistani food is not only recipes: it is how we host, when we eat, and how we share chai. This page is for your supervisor to see cultural depth alongside your app.
        </p>
      </header>

      <ul className="pk-traditions">
        {TRADITIONS.map((t, i) => (
          <Motion.li
            key={t.title}
            className="pk-traditions__item glass"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <span className="pk-traditions__num">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h2 className="pk-traditions__title">{t.title}</h2>
              <p className="pk-traditions__body">{t.body}</p>
            </div>
          </Motion.li>
        ))}
      </ul>

      <section className="pk-traditions-extra glass-strong" style={{ padding: '2rem', marginBottom: '2rem', borderRadius: 'var(--radius-xl)' }}>
        <h2 className="section-title" style={{ marginBottom: '1.25rem' }}>{mealRhythm.title}</h2>
        <div className="pk-meal-grid">
          {mealRhythm.items.map((row) => (
            <div key={row.k} className="pk-meal-card">
              <span className="pk-meal-card__k">{row.k}</span>
              <p className="pk-meal-card__v">{row.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pk-traditions-etiquette glass" style={{ padding: '2rem', marginBottom: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
        <h2 className="section-title" style={{ marginBottom: '1rem' }}>{tableEtiquette.title}</h2>
        <ul className="pk-etiquette-list">
          {tableEtiquette.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="pk-page-cta glass-strong">
        <h2 className="section-title">Traditions + technology</h2>
        <p className="pk-page-cta__text">
          Your project pairs this cultural layer with a full recipe library: descriptions, amounts, photos, and detail pages — ready to demo end-to-end.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/cuisine" className="btn-ghost" style={{ textDecoration: 'none' }}>
            Cuisine overview
          </Link>
          <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            Open recipe library
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Traditions;

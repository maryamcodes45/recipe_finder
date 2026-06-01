import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { REGIONS } from '../data/pakistaniFood';

const Regions = () => {
  return (
    <div className="page-wrap pk-page">
      <header className="pk-page-banner">
        <p className="pk-page-banner__urdu">صوبے</p>
        <h1 className="pk-page-banner__title">Regional flavors across Pakistan</h1>
        <p className="pk-page-banner__lead">
          Each province brings different terrain, ingredients, and techniques — together they form the national table.
        </p>
      </header>

      <div className="pk-regions-detail">
        {REGIONS.map((r, idx) => (
          <Motion.article
            key={r.id}
            className="pk-region-detail"
            initial={{ opacity: 0, x: idx % 2 === 0 ? -12 : 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="pk-region-detail__accent" style={{ background: r.color }} />
            <div className="pk-region-detail__body glass">
              <span className="pk-region-detail__urdu">{r.urdu}</span>
              <h2 className="pk-region-detail__name">{r.name}</h2>
              <p className="pk-region-detail__cap">{r.capital}</p>
              <p className="pk-region-detail__txt">{r.dishes}</p>
            </div>
          </Motion.article>
        ))}
      </div>

      <div className="pk-page-cta glass-strong">
        <h2 className="section-title">Taste the map</h2>
        <p className="pk-page-cta__text">
          Use quick chips on the home page to pull dishes associated with these regions’ cooking styles.
        </p>
        <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
          Explore recipes
        </Link>
      </div>
    </div>
  );
};

export default Regions;

import React from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { REGIONS } from '../data/pakistaniFood';
const RegionalShowcase = () => {
  return (
    <section className="pk-section" aria-labelledby="regions-heading">
      <div className="pk-section__head">
        <h2 id="regions-heading" className="section-title pk-section__title">
          Four provinces, endless flavor
        </h2>
        <p className="pk-section__sub">
          Pakistan’s geography shapes its plate — tap a card, then read more on our Regions page.
        </p>
        <Link to="/regions" className="pk-inline-link">
          Full regional guide →
        </Link>
      </div>
      <div className="pk-region-grid">
        {REGIONS.map((r, idx) => (
          <Motion.article
            key={r.id}
            className="pk-region-card"
            style={{ background: r.color }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: idx * 0.06, duration: 0.4 }}
          >
            <span className="pk-region-card__urdu">{r.urdu}</span>
            <h3 className="pk-region-card__name">{r.name}</h3>
            <p className="pk-region-card__cap">{r.capital}</p>
            <p className="pk-region-card__txt">{r.dishes}</p>
          </Motion.article>
        ))}
      </div>
    </section>
  );
};

export default RegionalShowcase;

import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CUISINE_SECTIONS, BRAND } from '../data/pakistaniFood';

const Cuisine = () => {
  return (
    <div className="page-wrap pk-page">
      <Motion.header
        className="pk-page-banner"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="pk-page-banner__urdu">{BRAND.urduAccent}</p>
        <h1 className="pk-page-banner__title">Pakistani cuisine & heritage</h1>
        <p className="pk-page-banner__lead">
          This project celebrates the diversity of Pakistan’s kitchen. Recipe data is pulled from a global database using
          searches that match classic dishes — perfect for demos, coursework, and storytelling.
        </p>
      </Motion.header>

      <div className="pk-page-grid">
        {CUISINE_SECTIONS.map((block, i) => (
          <Motion.article
            key={block.title}
            className="glass pk-page-card"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <h2 className="pk-page-card__title">{block.title}</h2>
            <p className="pk-page-card__text">{block.text}</p>
          </Motion.article>
        ))}
      </div>

      <section className="pk-page-cta glass-strong">
        <h2 className="section-title">See it in action</h2>
        <p className="pk-page-cta__text">
          Jump to the home page to search biryani, karahi, nihari, and more — save favorites after you sign up.
        </p>
        <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
          Open recipe explorer
        </Link>
      </section>
    </div>
  );
};

export default Cuisine;

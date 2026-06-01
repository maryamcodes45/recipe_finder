import React from 'react';
import { motion as Motion } from 'framer-motion';
import { BRAND } from '../data/pakistaniFood';

const PakistanHero = ({ onExploreClick }) => {
  return (
    <section className="pk-hero">
      <div className="pk-hero__content">
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="pk-hero__title">Delicious Pakistani Recipes</h1>
          <p className="hero-sub">
            Explore the best home-made dishes from across the country. Simple, tasty, and easy to follow.
          </p>
          <div className="pk-hero__actions">
            <button type="button" className="btn-primary" onClick={onExploreClick}>
              Explore Recipes
            </button>
            <button type="button" className="btn-ghost" onClick={onExploreClick}>
              View Categories
            </button>
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default PakistanHero;

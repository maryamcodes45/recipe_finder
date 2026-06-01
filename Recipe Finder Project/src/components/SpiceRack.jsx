import React from 'react';
import { Link } from 'react-router-dom';
import { SPICE_STAPLES } from '../data/pakistaniFood';
const SpiceRack = () => {
  return (
    <section className="pk-spice" aria-labelledby="spice-heading">
      <div className="pk-spice__inner glass-strong">
        <div className="pk-spice__text">
          <h2 id="spice-heading" className="section-title">
            Spice rack essentials
          </h2>
          <p className="pk-spice__lead">
            Pakistani kitchens layer whole spices, ground blends, and fresh herbs — the same words you’ll see on our recipe cards.
          </p>
          <Link to="/traditions" className="pk-inline-link">
            Traditions & chai culture →
          </Link>
        </div>
        <ul className="pk-spice__list">
          {SPICE_STAPLES.map((s) => (
            <li key={s.name} className="pk-spice__item">
              <span className="pk-spice__dot" aria-hidden />
              <div>
                <strong>{s.name}</strong>
                <span className="pk-spice__note">{s.note}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
export default SpiceRack;

import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../data/pakistaniFood';
import { FaHeart } from 'react-icons/fa';

const Footer = () => {
  const y = new Date().getFullYear();
  return (
    <footer className="pk-footer">
      <div className="pk-footer__grid">
        <div>
          <p className="pk-footer__brand">{BRAND.name}</p>
          <p className="pk-footer__tag">{BRAND.tagline}</p>
        </div>
        <nav aria-label="Footer">
          <p className="pk-footer__nav-title">Explore</p>
          <ul className="pk-footer__links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/cuisine">Cuisine</Link></li>
            <li><Link to="/regions">Regions</Link></li>
            <li><Link to="/traditions">Traditions</Link></li>
            <li><Link to="/favorites">Favorites</Link></li>
          </ul>
        </nav>
        <div>
          <p className="pk-footer__nav-title">Account</p>
          <ul className="pk-footer__links">
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign up</Link></li>
          </ul>
        </div>
      </div>
      <div className="pk-footer__bottom">
        <span>© {y} {BRAND.name}. Student project — recipes via TheMealDB.</span>
        <span className="pk-footer__made">
          Crafted with <FaHeart className="pk-footer__heart" aria-hidden /> for Pakistani food lovers
        </span>
      </div>
    </footer>
  );
};

export default Footer;

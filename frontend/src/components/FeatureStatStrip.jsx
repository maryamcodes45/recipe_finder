import React from 'react';
import { LOCAL_RECIPE_COUNT } from '../services/localPakistaniRecipes';
const FeatureStatStrip = () => {
  const stats = [
    { value: String(LOCAL_RECIPE_COUNT), label: 'Pakistani recipes' },
    { value: '4', label: 'Provinces' },
    { value: '16+', label: 'Quick filters' },
  ];
  return (
    <div className="pk-stats" role="presentation">
      {stats.map((s) => (
        <div key={s.label} className="pk-stats__item">
          <span className="pk-stats__value">{s.value}</span>
          <span className="pk-stats__label">{s.label}</span>
        </div>
      ))}
    </div>
  );
};
export default FeatureStatStrip;

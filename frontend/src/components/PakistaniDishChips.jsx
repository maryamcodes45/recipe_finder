import React from 'react';
import { PAKISTANI_QUICK_CHIPS } from '../data/pakistaniFood';
const PakistaniDishChips = ({ selectedId, onSelect }) => {
  return (
    <div className="pk-chips">
      <p className="pk-chips__label">Popular Pakistani-style searches</p>
      <div className="pk-chips__row">
        {PAKISTANI_QUICK_CHIPS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            className={`pk-chip ${selectedId === chip.id ? 'pk-chip--active' : ''}`}
            onClick={() => onSelect(chip)}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
};
export default PakistaniDishChips;

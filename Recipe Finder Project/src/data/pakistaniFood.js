/**
 * Curated content for Pakistani cuisine UX.
 * Main recipes live in pakistaniRecipesFull.js (local curated database).
 */

export const BRAND = {
  name: 'Zaiqa Pakistan',
  tagline: 'Discover the taste of Pakistan',
  urduAccent: 'پاکستانی ذائقہ',
};

/** Search terms used to build discovery feeds (TheMealDB has no Pakistan area filter). */
export const PAKISTANI_DISCOVERY_TERMS = [
  'Biryani',
  'Karahi',
  'Korma',
  'Tikka',
  'Keema',
  'Haleem',
  'Nihari',
  'Chapli',
  'Seekh',
  'Daal',
  'Paratha',
  'Pulao',
];

/** Quick-filter chips — `tag` matches recipe.tags in local Pakistani database */
export const PAKISTANI_QUICK_CHIPS = [
  { id: 'biryani', label: 'Biryani', tag: 'biryani' },
  { id: 'karahi', label: 'Karahi', tag: 'karahi' },
  { id: 'nihari', label: 'Nihari', tag: 'nihari' },
  { id: 'haleem', label: 'Haleem', tag: 'haleem' },
  { id: 'korma', label: 'Korma', tag: 'korma' },
  { id: 'tikka', label: 'Tikka', tag: 'tikka' },
  { id: 'keema', label: 'Keema', tag: 'keema' },
  { id: 'pulao', label: 'Pulao', tag: 'pulao' },
  { id: 'paratha', label: 'Paratha', tag: 'paratha' },
  { id: 'daal', label: 'Daal', tag: 'daal' },
  { id: 'chapli', label: 'Chapli', tag: 'chapli' },
  { id: 'seekh', label: 'Seekh', tag: 'seekh' },
  { id: 'chaat', label: 'Chaat', tag: 'chaat' },
  { id: 'sweet', label: 'Mithai & sweet', tag: 'sweet' },
  { id: 'saag', label: 'Saag', tag: 'saag' },
  { id: 'chai', label: 'Chai', tag: 'chai' },
];

export const REGIONS = [
  {
    id: 'punjab',
    name: 'Punjab',
    urdu: 'پنجاب',
    capital: 'Lahore heartland',
    dishes: 'Sarson da saag, tandoori roti, rich dairy gravies, winter feasts.',
    color: 'linear-gradient(135deg, #fef08a 0%, #eab308 100%)',
  },
  {
    id: 'sindh',
    name: 'Sindh',
    urdu: 'سندھ',
    capital: 'Indus delta',
    dishes: 'Biryani culture, fresh fish, tangy chutneys, date-sweet notes.',
    color: 'linear-gradient(135deg, #fde68a 0%, #d97706 100%)',
  },
  {
    id: 'kpk',
    name: 'Khyber Pakhtunkhwa',
    urdu: 'خیبر پختونخوا',
    capital: 'Frontier grills',
    dishes: 'Chapli kebab, lamb karahi, charred skewers, robust spices.',
    color: 'linear-gradient(135deg, #fde047 0%, #ca8a04 100%)',
  },
  {
    id: 'balochistan',
    name: 'Balochistan',
    urdu: 'بلوچستان',
    capital: 'Desert & coast',
    dishes: 'Slow lamb, sajji-style roasts, earthy heat, minimal fuss.',
    color: 'linear-gradient(135deg, #fef9c3 0%, #f59e0b 100%)',
  },
];

export const CUISINE_SECTIONS = [
  {
    title: 'The Spice Palette',
    text: 'Pakistani cuisine is defined by its bold use of whole and ground spices. From the heat of red chilli to the warmth of cinnamon and the aroma of green cardamom, every dish is a symphony of flavors.',
  },
  {
    title: 'Bread & Grains',
    text: 'Wheat is the staple, served as Tandoori Naan, Chapati, or flaky Parathas. Long-grain Basmati rice is the star of Biryanis and Pulaos, celebrated for its fragrance.',
  },
  {
    title: 'The Grill Culture',
    text: 'Outdoor street food and char-grilling are essential. Seekh Kebabs, Tikkas, and Chappal Kebabs showcase the mastery of fire and marinade.',
  },
];

export const TRADITIONS = [
  {
    title: 'Dastarkhwan',
    body: 'The traditional floor-spread where families gather to share meals from communal platters, emphasizing unity and hospitality.',
  },
  {
    title: 'Tea Culture (Chai)',
    body: 'Chai is more than a drink; it is a social glue. Whether it is Doodh Pati or Pink Kashmiri Chai, no guest leaves without a cup.',
  },
  {
    title: 'Festive Feasts',
    body: 'Eid-ul-Fitr and Eid-ul-Adha are marked by special dishes like Sheer Khurma and slow-cooked meat delicacies shared with neighbors.',
  },
];

export const TRADITIONS_EXTRA = {
  mealRhythm: {
    title: 'The Daily Rhythm',
    items: [
      { k: 'Nashta (Breakfast)', v: 'Nihari, Halwa Puri, or Paratha with Egg and Chai.' },
      { k: 'Lunch', v: 'Lighter seasonal Salans (curries) with Roti or Daal Chawal.' },
      { k: 'Shaam ki Chai', v: 'Evening tea with samosas, biscuits, or pakoras.' },
      { k: 'Dinner', v: 'The main meal—Karahi, Biryani, or BBQ with family.' },
    ],
  },
  tableEtiquette: {
    title: 'Table Manners',
    lines: [
      'Always wash hands before eating.',
      'Eating with the right hand is traditional.',
      'Guests are served first and most generously.',
      'Bread is broken with one hand if possible.',
    ],
  },
};

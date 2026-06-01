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

export const REGIONS = [{
        id: 'punjab',
        name: 'Punjab',
        urdu: 'پنجاب',
        capital: 'Lahore heartland',
        dishes: 'Sarson da saag, tandoori roti, rich dairy gravies, winter feasts.',
        color: 'linear-gradient(145deg, #166534 0%, #14532d 100%)',
    },
    {
        id: 'sindh',
        name: 'Sindh',
        urdu: 'سندھ',
        capital: 'Indus delta',
        dishes: 'Biryani culture, fresh fish, tangy chutneys, date-sweet notes.',
        color: 'linear-gradient(145deg, #0e7490 0%, #155e75 100%)',
    },
    {
        id: 'kpk',
        name: 'Khyber Pakhtunkhwa',
        urdu: 'خیبر پختونخوا',
        capital: 'Frontier grills',
        dishes: 'Chapli kebab, lamb karahi, charred skewers, robust spices.',
        color: 'linear-gradient(145deg, #9a3412 0%, #7c2d12 100%)',
    },
    {
        id: 'balochistan',
        name: 'Balochistan',
        urdu: 'بلوچستان',
        capital: 'Desert & coast',
        dishes: 'Slow lamb, sajji-style roasts, earthy heat, minimal fuss.',
        color: 'linear-gradient(145deg, #713f12 0%, #422006 100%)',
    },
];

export const SPICE_STAPLES = [
    { name: 'Garam masala', note: 'Warm finishing blend' },
    { name: 'Cumin (Zeera)', note: 'Earthy base for daals & rice' },
    { name: 'Coriander', note: 'Citrus lift in karahi' },
    { name: 'Kashmiri chilli', note: 'Color without harsh heat' },
    { name: 'Black cardamom', note: 'Smoky depth in nihari' },
    { name: 'Fenugreek (Methi)', note: 'Bitter balance in sabzi' },
];

export const TRADITIONS = [{
        title: 'Dastarkhwan & mehmaan nawazi',
        body: 'The dastarkhwan (spread) is laid on the floor or table with respect. Guests are urged to eat more—“thora aur lein”—because generosity is measured by how full your plate gets.',
    },
    {
        title: 'Right hand, shared bread',
        body: 'Eating with the right hand is the norm; roti is torn in small pieces and used to scoop salan. Passing naan with both hands to elders shows adab (manners).',
    },
    {
        title: 'Doodh pati & chai breaks',
        body: 'Strong milk tea pulls the day together—from factory gates to university lawns. “Kadak” tea is boiled longer; “kam pati” is lighter. Biscuits and rusks complete the pause.',
    },
    {
        title: 'Iftar & sehri rhythm',
        body: 'Ramadan tables open with dates, rooh afza or fruit chaat, pakoras, and dahi baray. Sehri favors paratha, eggs, and lassi in many Punjabi homes.',
    },
    {
        title: 'Eid & mithai',
        body: 'Sheer khurma on Eid ul-Fitr and meaty feasts on Eid ul-Adha: sweets are exchanged in boxes—barfi, gulab jamun, and regional specialties.',
    },
    {
        title: 'Winter saag season',
        body: 'When mustard greens arrive, Punjab shifts to slow-cooked sarson da saag with makai di roti and cubes of white butter—a ritual as much as a meal.',
    },
];

/** Extra blocks for the Traditions page */
export const TRADITIONS_EXTRA = {
    mealRhythm: {
        title: 'A day around the plate',
        items: [
            { k: 'Nashta', v: 'Paratha, halwa puri, nihari, or anda—often hearty before work or school.' },
            { k: 'Dopahar', v: 'Daal, sabzi, roti, sometimes rice; pickles (achar) and chutney on the side.' },
            { k: 'Shaam', v: 'Chai with snacks; samosa, pakora, or fruit chaat before dinner.' },
            { k: 'Raat', v: 'Lighter dinner or leftover salan; kheer or doodh before sleep in many homes.' },
        ],
    },
    tableEtiquette: {
        title: 'Small gestures that matter',
        lines: [
            'Water is offered as soon as guests sit; refusing everything at once can seem distant.',
            'Older relatives are served first; children learn by watching portioning and passing dishes.',
            'Saying “bismillah” before eating and appreciating the cook strengthens family bonds.',
        ],
    },
};

export const CUISINE_SECTIONS = [{
        title: 'A melting pot on ancient trade routes',
        text: 'Pakistani food blends Persian finesse, Central Asian grills, Mughal richness, and regional agriculture—from Himalayan foothills to the Arabian Sea.',
    },
    {
        title: 'Rice & wheat heartlands',
        text: 'Basmati belts feed biryani and pulao; whole wheat drives roti culture. Meals balance starch, protein, pickle, and raita.',
    },
    {
        title: 'Bold, layered spice',
        text: 'Unlike single-note heat, Pakistani cooking builds flavor in stages: bhunofying onions, blooming whole spices, finishing with garam masala.',
    },
];
import type { Reel, ReelId } from './types'

const HINTS = ['does it suit oily skin?', 'cheaper option?', 'is this vegan?']

export const REELS: Record<ReelId, Reel> = {
  beauty: {
    id: 'beauty',
    type: 'shop',
    ha: 'Found ',
    hi: '5 things',
    hb: ' in your reel',
    sub: '5 products identified',
    msg: 'Swipe for swaps, or ask me anything about these.',
    chips: [
      { icon: 'tag', t: 'cheaper picks' },
      { icon: 'drop', t: 'for oily skin' },
    ],
    hints: HINTS,
    groups: [
      {
        title: 'Lipstick',
        detail: 'Shade: Rich Ruby',
        hint: true,
        cards: [
          { id: 'maybelline-ultimatte', tag: 'In reel' },
          { id: 'lakme-9to5-lip', tag: 'Cheaper' },
          { id: 'sugar-matte-crayon', tag: 'Popular' },
        ],
      },
      {
        title: 'Face serum',
        detail: 'Niacinamide 10%',
        hint: true,
        cards: [
          { id: 'minimalist-niacinamide', tag: 'In reel' },
          { id: 'dermaco-niacinamide', tag: 'Cheaper' },
        ],
      },
      { title: 'Kajal', detail: 'Black', hint: false, cards: [{ id: 'lakme-eyeconic-kajal', tag: 'In reel' }] },
      {
        title: 'Moisturiser',
        detail: '100 g',
        hint: true,
        cards: [
          { id: 'reequil-moisturiser', tag: 'In reel' },
          { id: 'minimalist-b5', tag: 'Cheaper' },
        ],
      },
      { title: 'Lip oil', detail: '', hint: false, cards: [{ id: 'lip-oil', tag: 'In reel' }] },
    ],
  },
  one: {
    id: 'one',
    type: 'shop',
    ha: 'Found ',
    hi: '1 thing',
    hb: ' in your reel',
    sub: '1 product identified',
    msg: 'Swipe for a swap, or ask me anything about it.',
    chips: [
      { icon: 'tag', t: 'cheaper picks' },
      { icon: 'drop', t: 'for oily skin' },
    ],
    hints: ['cheaper option?', 'does it suit oily skin?', 'is this vegan?'],
    groups: [
      {
        title: 'Moisturiser',
        detail: '100 g',
        hint: true,
        cards: [
          { id: 'reequil-moisturiser', tag: 'In reel' },
          { id: 'minimalist-b5', tag: 'Cheaper' },
        ],
      },
    ],
  },
  recipe: {
    id: 'recipe',
    type: 'recipe',
    ha: 'Your pav bhaji ',
    hi: 'list',
    hb: ' is ready',
    sub: '',
    msg: 'All picked for pav bhaji. Tap a pack to switch, or ask me to tweak it.',
    chips: [
      { icon: 'flame', t: 'less spicy' },
      { icon: 'tag', t: 'cheaper picks' },
    ],
    hints: ['is this vegan?', 'cheaper option?', 'does it suit oily skin?'],
    hideStore: true,
    groups: [
      {
        title: 'Pav bhaji masala',
        detail: '2 tbsp',
        hint: true,
        cards: [
          { id: 'mdh-pav-bhaji', tag: 'In reel', picked: true },
          { id: 'everest-pav-bhaji', tag: 'Your usual' },
          { id: 'catch-pav-bhaji', tag: 'Cheaper' },
        ],
      },
      {
        title: 'Kashmiri chilli',
        detail: '1 tbsp',
        hint: true,
        cards: [
          { id: 'everest-kashmiri', tag: 'Your usual', picked: true },
          { id: 'mdh-kashmiri', tag: 'Popular' },
          { id: 'catch-kashmiri', tag: 'Cheaper' },
        ],
      },
      {
        title: 'Butter',
        detail: '4 tbsp',
        hint: true,
        cards: [
          { id: 'amul-butter-100', tag: 'In reel', picked: true },
          { id: 'mother-dairy-butter', tag: 'Cheaper' },
          { id: 'amul-butter-500', tag: 'Bigger pack' },
        ],
      },
      {
        title: 'Pav',
        detail: '8 pcs',
        hint: true,
        cards: [
          { id: 'ladi-pav-8', tag: 'In reel', picked: true },
          { id: 'ladi-pav-12', tag: 'Bigger pack' },
        ],
      },
      {
        title: 'Fresh vegetables',
        detail: '3 potatoes, 4 tomatoes, 1 capsicum',
        hint: false,
        multi: true,
        cards: [
          { id: 'potato', tag: '', picked: true },
          { id: 'tomato', tag: '', picked: true },
          { id: 'capsicum', tag: '', picked: true },
        ],
      },
    ],
    kitchen: ['Onion', 'Ginger garlic', 'Haldi', 'Salt', 'Oil'],
    steps: [
      'Boil and mash 3 potatoes, 4 tomatoes and 1 capsicum.',
      'Melt 2 tbsp butter. Add 1 tbsp Kashmiri chilli and 2 tbsp masala.',
      'Add the mash and simmer till thick.',
      'Toast 8 pav in the remaining butter and serve.',
    ],
  },
  none: {
    id: 'none',
    type: 'none',
    ha: "We couldn't find products in this ",
    hi: 'reel',
    hb: '',
    sub: "Try another reel or tell me what you're looking for.",
    msg: '',
    chips: [
      { icon: 'sun', t: 'sunscreen' },
      { icon: 'sparkle', t: 'glow serum' },
      { icon: 'heart', t: 'lip care' },
    ],
    hints: ['Ask Zynn anything'],
    groups: [],
  },
}

export const isReelId = (v: string | undefined): v is ReelId => !!v && v in REELS

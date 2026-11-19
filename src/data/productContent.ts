import type { Fallback, Product } from './types'

/**
 * Demo copy for the product sheet: Zynn's take, relevance, e-commerce listings,
 * customer reviews and description. Reviews and prices are placeholder data for the
 * prototype and must be replaced with real, sourced data before launch.
 */
type Content = Partial<Pick<Product, 'zynnSays' | 'relevance' | 'reviews' | 'description'>> & {
  online?: Fallback[]
}

export const CONTENT: Record<string, Content> = {
  'maybelline-ultimatte': {
    zynnSays:
      '**Ultra-matte finish** in a single swipe with **lightweight wear** that stays put through meals and long days',
    relevance: 94,
    online: [
      { store: 'Nykaa', price: 279, logo: 'N' },
      { store: 'Amazon', price: 312, logo: 'A' },
      { store: 'Myntra', price: 339, logo: 'M' },
    ],
    reviews: [
      {
        author: 'Priya S.',
        date: '12/9/2025',
        rating: 5,
        source: 'Nykaa',
        title: 'Rich colour, feels like nothing',
        body: 'Rich Ruby is the perfect deep red for my skin tone. One swipe gives full coverage and it does not feel heavy at all. It lasted through lunch with only a little fading in the centre.',
      },
      {
        author: 'Ananya R.',
        date: '28/8/2025',
        rating: 4,
        source: 'Amazon',
        title: 'Great matte, slightly drying',
        body: 'Love the colour payoff and how quickly it sets. It gets a little dry after five or six hours, so I use a lip balm underneath. Still my go-to red for office days.',
      },
    ],
    description:
      'Maybelline Color Sensational Ultimatte delivers intense, true-to-tone colour with a weightless, ultra-matte finish. The slim bullet glides on smoothly for a precise application, and the blurring formula softens the look of lip lines. It is enriched to feel comfortable for hours, so you get bold colour without the heavy feel of a traditional matte lipstick.',
  },
  'lakme-9to5-lip': {
    zynnSays: '**Built-in primer** smooths lips first, then a **matte colour** that lasts through a full workday',
    relevance: 88,
    online: [
      { store: 'Nykaa', price: 265, logo: 'N' },
      { store: 'Amazon', price: 289, logo: 'A' },
    ],
    reviews: [
      {
        author: 'Meera K.',
        date: '3/10/2025',
        rating: 5,
        source: 'Nykaa',
        title: 'Lasts all day',
        body: 'The primer end really makes a difference. My lips look smoother and the colour does not settle into lines. It stayed put through two cups of coffee.',
      },
      {
        author: 'Ritu P.',
        date: '19/9/2025',
        rating: 4,
        source: 'Amazon',
        title: 'Good value two-in-one',
        body: 'Nice to have the primer and colour in one stick. The shade range is good. The matte side can feel a bit tight by evening, but it is great for the price.',
      },
    ],
    description:
      'Lakmé 9to5 Primer + Matte Lip Color pairs a smoothing lip primer with a long-wearing matte colour in one stick. Apply the primer to prep and fill fine lines, then follow with the colour for an even, velvety finish that holds up from morning meetings to evening plans.',
  },
  'sugar-matte-crayon': {
    zynnSays: '**Transfer-resistant crayon** with a **built-in sharpener** for crisp edges on the go',
    relevance: 82,
    online: [
      { store: 'Nykaa', price: 449, logo: 'N' },
      { store: 'Myntra', price: 474, logo: 'M' },
      { store: 'Amazon', price: 499, logo: 'A' },
    ],
    reviews: [
      {
        author: 'Kavya N.',
        date: '7/10/2025',
        rating: 5,
        source: 'Myntra',
        title: 'Truly transfer-proof',
        body: 'Once it sets, it really does not budge. The crayon shape makes it easy to line and fill at the same time. The sharpener in the cap is a lovely touch.',
      },
    ],
    description:
      'SUGAR Matte As Hell Crayon Lipstick is a twist-free crayon that delivers bold, highly pigmented colour with a transfer-resistant matte finish. Its pointed tip lets you line and fill in one step, and the built-in sharpener keeps the edges crisp wherever you are.',
  },
  'minimalist-niacinamide': {
    zynnSays:
      '**10% niacinamide** with zinc to calm **oil and visible pores**, in a light serum that layers under anything',
    relevance: 96,
    online: [
      { store: 'Nykaa', price: 569, logo: 'N' },
      { store: 'Amazon', price: 589, logo: 'A' },
    ],
    reviews: [
      {
        author: 'Arjun M.',
        date: '15/9/2025',
        rating: 5,
        source: 'Amazon',
        title: 'Visible difference in a month',
        body: 'My T-zone is much less oily and the pores on my nose look smaller after about four weeks. It absorbs quickly and does not pill under sunscreen.',
      },
      {
        author: 'Sneha D.',
        date: '2/9/2025',
        rating: 4,
        source: 'Nykaa',
        title: 'Works, but start slow',
        body: 'Great serum for the price. It tingled a little in the first week, so I used it every other night until my skin adjusted. Now I use it daily with no issues.',
      },
    ],
    description:
      'Minimalist Niacinamide 10% Face Serum combines a high concentration of niacinamide with 1% zinc to help regulate excess oil, reduce the look of enlarged pores and even out skin tone. The water-light, fragrance-free formula absorbs in seconds and layers easily under moisturiser and sunscreen, making it simple to add to any routine.',
  },
  'dermaco-niacinamide': {
    zynnSays: '**Blemish-focused niacinamide serum** that helps fade marks and keeps **skin balanced**',
    relevance: 90,
    online: [{ store: 'Amazon', price: 529, logo: 'A' }],
    reviews: [
      {
        author: 'Neha G.',
        date: '21/9/2025',
        rating: 4,
        source: 'Amazon',
        title: 'Helped with acne marks',
        body: 'My old acne marks look lighter after six weeks. The texture is slightly thicker than other niacinamide serums but it absorbs well.',
      },
    ],
    description:
      'The Derma Co 10% Niacinamide Serum helps reduce the appearance of blemishes and acne marks while balancing oil production. Suitable for oily and acne-prone skin, it strengthens the skin barrier for a clearer, more even complexion over time.',
  },
  'lakme-eyeconic-kajal': {
    zynnSays: '**Smudge-proof, deep black kajal** that glides on in one stroke and stays for **up to 22 hours**',
    relevance: 92,
    online: [
      { store: 'Nykaa', price: 189, logo: 'N' },
      { store: 'Myntra', price: 199, logo: 'M' },
      { store: 'Amazon', price: 209, logo: 'A' },
    ],
    reviews: [
      {
        author: 'Isha T.',
        date: '1/10/2025',
        rating: 5,
        source: 'Myntra',
        title: 'My forever kajal',
        body: 'Dark in one swipe and it does not smudge even on humid days. I have repurchased it more times than I can count.',
      },
    ],
    description:
      'Lakmé Eyeconic Kajal gives an intense, deep black line in a single stroke. The smudge-proof, water-resistant formula is enriched with nourishing ingredients and is ophthalmologically tested, so it is gentle enough for everyday wear on the waterline.',
  },
  'reequil-moisturiser': {
    zynnSays: '**Ceramides and hyaluronic acid** to repair a dry, tight barrier with a **non-greasy feel**',
    relevance: 86,
    description:
      "Re'equil Ceramide & Hyaluronic Acid Moisturiser is formulated for dry and normal skin. Ceramides help restore the skin barrier while hyaluronic acid draws in moisture, leaving skin soft, plump and comfortable without a heavy or greasy finish.",
  },
  'minimalist-b5': {
    zynnSays: '**Vitamin B5 and hyaluronic acid** for fast, **lightweight hydration** that suits oily skin',
    relevance: 84,
    online: [
      { store: 'Nykaa', price: 285, logo: 'N' },
      { store: 'Amazon', price: 299, logo: 'A' },
    ],
    reviews: [
      {
        author: 'Rohan V.',
        date: '24/9/2025',
        rating: 5,
        source: 'Nykaa',
        title: 'Perfect gel moisturiser',
        body: 'Finally a moisturiser that does not make my oily skin shiny. It sinks in fast and my skin feels calm after shaving.',
      },
    ],
    description:
      'Minimalist Vitamin B5 10% Moisturizer pairs panthenol with hyaluronic acid to hydrate, soothe and support the skin barrier. The lightweight gel-cream texture absorbs quickly, making it ideal for oily and combination skin in warm weather.',
  },
  'lip-oil': {
    zynnSays: '**Glossy, non-sticky shine** that cushions lips with **nourishing oils**',
    relevance: 72,
    description:
      'A lightweight lip oil that adds a high-shine, non-sticky finish while conditioning lips with a blend of nourishing plant oils. Wear it alone for a natural gloss or layer it over lipstick for extra dimension.',
  },
}

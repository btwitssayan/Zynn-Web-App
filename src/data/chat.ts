import type { Product } from './types'

// Canned replies stand in for the Zynn assistant until a backend is wired up.
export function replyFor(text: string, p?: Product): string[] {
  const t = text.toLowerCase()
  if (t.includes('vitamin c'))
    return [
      'Yes, you can use them together.',
      'Apply vitamin C first, let it absorb, then this serum.',
      'If your skin feels irritated, use one in the morning and one at night.',
    ]
  if (t.includes('cheaper'))
    return [
      'Here are a few cheaper picks.',
      'Lakmé 9to5 Primer + Matte Lip Color is ₹275 on Zepto.',
      'The Derma Co 10% Niacinamide Serum is ₹549 on Instamart.',
    ]
  if (t.includes('oily'))
    return [
      'Gel textures and niacinamide suit oily skin best.',
      'Minimalist Niacinamide 10% helps control oil and shine.',
      'Skip heavy creams during the day.',
    ]
  if (t.includes('vegan'))
    return ['The masalas and vegetables are plant based.', 'Butter is dairy, so swap it for oil or a plant-based spread.']
  if (t.includes('spicy')) return ['Use 1 tbsp masala instead of 2.', 'Halve the Kashmiri chilli, or leave it out.']
  if (t.includes('help'))
    return ['I can find products from a reel, compare prices across stores, and place orders for you.', 'What do you need help with?']
  if (p)
    return [
      `${p.short} is from ${p.brand}.`,
      p.offers.length ? `It's available on ${p.offers.map((o) => o.store).join(' and ')}.` : 'You can buy it on the stores listed in the product sheet.',
      'Ask me about ingredients, skin type or cheaper swaps.',
    ]
  return ["I'm on it.", "Share a reel or tell me what you need, and I'll find the products and the best prices."]
}

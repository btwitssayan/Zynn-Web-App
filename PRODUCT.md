# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Shoppers in India who discover products inside short video reels (beauty, grocery, lifestyle) and want to buy what they saw without hunting across apps. They already have accounts with one or more quick-commerce/e-commerce stores (Instamart, Zepto, Myntra, Amazon, Tirabeauty) and pay via UPI.

## Product Purpose

Zynn turns a shoppable video reel into a checkout. An AI assistant ("Zynn") reads the reel, identifies the products in it (e.g. "Lipstick, Shade: Rich Ruby"), and surfaces them as a shoppable list the user can chat with ("cheaper picks", "for oily skin"), swap, add to cart, and pay for — without leaving the reel experience.

## Positioning

Zynn's differentiated mechanism is cross-store price/offer aggregation on top of reel comprehension: for each product it identifies from the reel, it checks the user's connected stores (Instamart, Zepto, Myntra, Amazon, Tirabeauty, brand sites) and surfaces the best price/ETA (`displayPrice`, `bestOffer` in `src/data/products.ts`), plus cheaper or more suitable swaps. A single store's own app can show its own catalog; it cannot truthfully claim to compare itself against competitors the way Zynn does. Reel comprehension is the entry point; cross-store comparison is the reason to stay.

## Operating Context

- Core loop: open a reel → Zynn's chat identifies products in it → browse per-product groups (with swap/cheaper/popular tags) → open a product sheet ("Zynn says", reviews, description) → cart → checkout → pay via UPI (intent) or UPI QR → track order.
- Store connection is its own flow (`src/screens/Stores.tsx`): the user logs into each store (Instamart, Zepto, Myntra, Amazon, Tirabeauty) from within Zynn; connection state gates whether that store's offers are usable at checkout.
- Login is phone + OTP (`src/screens/Login.tsx`), surfaced contextually via a login sheet/drawer rather than a gate at app start.
- Chat is the secondary, open-ended entry point to the same assistant (ask Zynn anything about the identified products), not a separate feature.

## Capabilities and Constraints

- Reels are a fixed, authored set (`src/data/reels.ts`) grouped by product type (e.g. Lipstick, Face serum, Kajal, Moisturiser, Lip oil), each with a confirmed in-reel product plus optional cheaper/popular alternatives.
- Offers carry store, price, and ETA (e.g. Instamart 10 min, Zepto 12 min); `bestOffer`/`displayPrice` pick the cheapest connected offer, falling back to brand-site price when no store offer exists.
- Payment supports UPI intent and UPI QR, with explicit success/failed/duplicate result states.
- This is a real product heading toward launch: store integrations, pricing, and payment flows are treated as factual product commitments, not placeholders, even though current store "logins" are simulated for the build in progress.
- Terminology: "reel" (the shoppable video), "connected store" (a store the user has logged into inside Zynn), "Zynn says" (the assistant's per-product rationale).

## Brand Commitments

- Product name: Zynn.ai (logo at `/logo.png`, favicon at `/favicon.svg`). The assistant persona is also named "Zynn" and speaks in first person in chat and product rationale ("Zynn says").
- Supports both light and dark mode at the OS level (`theme-color` meta pair in `index.html`); no further brand voice or identity constraints were stated beyond the existing implementation.

## Evidence on Hand

- Product catalog, reel content, and chat responses are authored fixture data (`src/data/products.ts`, `src/data/reels.ts`, `src/data/chat.ts`, `src/data/seed.ts`) standing in for live store integrations and a real AI backend. No real customer evidence, testimonials, or case studies exist yet; future work must not fabricate them.

## Product Principles

- Reel-to-checkout in as few steps as possible; the assistant does the comparison work the user would otherwise do by hand across apps.
- Price/ETA truth per offer must stay traceable to a specific connected store, never an unattributed "best price."
- Chat is a utility for narrowing choices (cheaper, suited to a need), not a chatbot detour from the shopping task.
- Store connection and payment are real financial/account actions; their flows should read as trustworthy and unambiguous, not playful.

## Accessibility & Inclusion

No product-specific accessibility requirement has been established beyond standard web accessibility practice.

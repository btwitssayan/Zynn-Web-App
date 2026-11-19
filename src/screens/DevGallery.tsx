import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { CartBar, ChatBar, CollapsePill, GroupHeader } from '../components/Bars'
import { BillCard, CartItemRow, Note, SkeletonCardV1, StatusPill } from '../components/Bits'
import { Icon } from '../components/Icon'
import { ProductCard } from '../components/ProductCard'
import { ProductCardV2 } from '../components/ProductCardV2'
import { SlideToCheckout } from '../components/SlideToCheckout'
import { StoreOptionRow } from '../components/StoreOptionRow'
import { Logo, TopBar } from '../components/TopBar'

const SCREENS: [string, [string, string][]][] = [
  ['A · Home', [['Beauty reel', '/reel/beauty'], ['Recipe reel', '/reel/recipe'], ['1 product', '/reel/one'], ['Nothing found', '/reel/none']]],
  ['C · Login', [['Phone entry', '/login']]],
  ['D · Chat', [['Chat thread', '/chat?p=minimalist-niacinamide&q=Can%20I%20use%20this%20with%20vitamin%20C%3F'], ['New chat', '/chat']]],
  ['E–F · Saved and cart', [['Favourites', '/favourites'], ['Cart', '/cart']]],
  ['G–H · Stores and addresses', [['Connect stores', '/connect'], ['Choose address', '/address'], ['Add address', '/address/new'], ['Address book', '/addresses']]],
  ['L–M · Orders and account', [['Orders', '/orders'], ['Order detail', '/orders/IM-47902'], ['Account', '/account'], ['Connected stores', '/account/stores']]],
  ['System · Utility', [['404 Not found', '/404']]],
]

const SWATCHES: [string, string][] = [
  ['Base', '#0B0B0D'],
  ['Strip', '#141416'],
  ['Orange', '#F08A3C'],
  ['Sand', '#D8C7A6'],
  ['Lavender', '#98A5D8'],
  ['Cheaper tag', '#B7C0F0'],
  ['Accent', '#F2A35E'],
  ['Logo gradient', 'var(--z-grad)'],
  ['Ring', 'var(--z-ring)'],
]

function Section({ title, children, wide }: { title: string; children: ReactNode; wide?: boolean }) {
  return (
    <section className={wide ? 'w-full' : 'w-full max-w-[390px]'}>
      <p className="cap">{title}</p>
      {children}
    </section>
  )
}

const noop = () => {}

export default function DevGallery() {
  return (
    <div className="fixed inset-0 z-10 overflow-y-auto bg-z-bg">
      <div className="mx-auto flex max-w-[1320px] flex-wrap content-start gap-14 p-6 md:p-14">
        <div className="w-full">
          <Logo size={40} />
          <p className="s mt-2">Shared components · Phase 5.1 · open any screen below</p>
        </div>

        <Section title="Screens" wide>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SCREENS.map(([group, links]) => (
              <div key={group} className="g gc">
                <p className="h3">{group}</p>
                <div className="chips mt-3">
                  {links.map(([label, to]) => (
                    <Link key={to} to={to} className="chip">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="s mt-3">Checkout, payment, order placed and tracking screens are reached by adding items to the cart and checking out.</p>
        </Section>

        <Section title="TopBar · home / inner">
          <TopBar onMenu={noop} />
          <div className="h-4" />
          <TopBar inner />
        </Section>

        <Section title="Cart bar · Chat bar">
          <div className="flex flex-col gap-4">
            <CartBar
              text="3 items"
              thumbs={[
                { id: 'lipstick', src: '/products/lipstick-product.jpg' },
                { id: 'lip-balm', src: '/products/lip-balm.jpg' },
                { id: 'pav', src: '/products/pav-bread.jpg' },
              ]}
            />
            <ChatBar hints={['Find me a gentle face wash']} onSubmit={noop} />
            <ChatBar gradient hints={['cheaper option?', 'is this vegan?', 'does it suit oily skin?']} onSubmit={noop} />
          </div>
        </Section>

        <Section title="Buttons · Chips">
          <div className="flex flex-col items-start gap-3">
            <button className="btn">Primary</button>
            <button className="btn o">Secondary</button>
            <button className="btn off">Disabled</button>
            <div className="chips">
              <span className="chip">Sunscreen</span>
              <span className="chip on">Selected</span>
              <span className="chip f">100 g</span>
            </div>
            <div className="chips">
              <button className="g ec gap-1.5">
                <Icon name="flame" size={15} className="text-z-mut" /> less spicy
              </button>
              <button className="g ec gap-1.5">
                <Icon name="tag" size={15} className="text-z-mut" /> cheaper picks
              </button>
              <button className="g ec gap-1.5">
                <Icon name="drop" size={15} className="text-z-mut" /> for oily skin
              </button>
            </div>
            <div className="mt-2 flex w-full flex-col gap-2">
              <span className="xs text-z-mut">Slide to check out (Active)</span>
              <SlideToCheckout onSlideComplete={noop} />
              <span className="xs mt-1 text-z-mut">Slide to check out (Disabled)</span>
              <SlideToCheckout disabled disabledLabel="Minimum order not met" onSlideComplete={noop} />
            </div>
          </div>
        </Section>

        <Section title="ProductCard · Buy / Added / Visit / Out of stock / Saved" wide>
          <div className="flex flex-wrap items-start gap-4">
            <ProductCard className="w-[200px]" photoHeight={170} title="Maybelline Color Sensational Ultimatte Lipstick 1.7 g" price="₹299.00" store="on Instamart" kind="buy" />
            <ProductCard className="w-[200px]" photoHeight={170} title="Maybelline Color Sensational Ultimatte Lipstick 1.7 g" price="₹299.00" store="on Instamart" kind="added" />
            <ProductCard className="w-[200px]" photoHeight={170} title="Lip Oil" price="₹650.00" store="on brand website" kind="visit" />
            <ProductCard className="w-[200px]" photoHeight={170} title="Lakmé Eyeconic Kajal 0.35 g" price="₹199.00" store="on Zepto" kind="oos" />
            <ProductCard className="w-[200px]" photoHeight={170} title="Minimalist Niacinamide 10% Face Serum 30 ml" price="₹579.00" store="on Zepto" kind="buy" saved />
          </div>
        </Section>

        <Section title="ProductCard v2 · default / selected / added / out of stock / visit" wide>
          <div className="flex flex-wrap items-start gap-4">
            <ProductCardV2 title="Maybelline Color Sensational Ultimatte" size="1.7 g" price="₹299" store="Instamart" kind="buy" tag="In reel" />
            <ProductCardV2 title="MDH Pav Bhaji Masala" size="100 g" price="₹84" store="" kind="picked" tag="In reel" />
            <ProductCardV2 title="Maybelline Color Sensational Ultimatte" size="1.7 g" price="₹299" store="Instamart" kind="added" tag="In reel" />
            <ProductCardV2 title="Lakmé Eyeconic Kajal" size="0.35 g" price="₹199" store="Zepto" kind="oos" tag="In reel" />
            <ProductCardV2 title="Re'equil Ceramide & Hyaluronic Acid Moisturiser" size="100 g" price="₹245" store="on Myntra" kind="visit" tag="In reel" />
            <ProductCardV2 title="Lakmé 9to5 Primer + Matte Lip Color" size="3.6 g" price="₹275" store="Zepto" kind="buy" tag="Cheaper" />
            <ProductCardV2 title="Amul Butter" size="500 g" price="₹285" store="" kind="buy" tag="Bigger pack" />
            <ProductCardV2 title="Potato" size="1 kg" price="₹45" store="" kind="buy" tag="" />
          </div>
        </Section>

        <Section title="StoreOptionRow · Add / Added + Lowest / Visit / Fallback">
          <div className="pr-panel">
            <div className="pr-head">
              <p className="pr-title">Best prices</p>
              <span className="pr-sub">Compare instantly</span>
            </div>
            <StoreOptionRow store="Nykaa" price="₹259.00" kind="fb" lowest />
            <StoreOptionRow store="Myntra" price="₹299.00" kind="fb" />
            <StoreOptionRow store="Tirabeauty" price="₹748.00" kind="fb" />
            <StoreOptionRow store="Amazon" price="₹748.00" kind="fb" />
            <StoreOptionRow store="Zepto" price="₹579.00" eta="12 mins" kind="added" qty={2} />
            <StoreOptionRow store="Instamart" price="₹599.00" eta="10 mins" kind="add" />
            <StoreOptionRow store="Brand website" price="₹599.00" kind="visit" />
          </div>
        </Section>

        <Section title="BillCard">
          <BillCard
            rows={[
              { k: 'Item total', v: '₹299' },
              { k: 'Handling charge', v: '₹9' },
              { k: 'Delivery fee', v: 'Free' },
            ]}
            total="₹308"
          />
        </Section>

        <Section title="Notes · System states">
          <div className="flex flex-col gap-3">
            <Note text="Changing the address refreshes your cart, because items and prices can differ by area." />
            <Note tone="err" text="Instamart doesn't deliver to this address yet. Try another address or Zepto." />
            <Note text="Your Instamart login expired. Log in again to continue." action="Log in" primary />
            <Note tone="err" text="Zepto isn't responding right now. Your cart is saved." action="Retry" />
            <Note text="Prices updated since you added these items." action="Review cart" />
          </div>
        </Section>

        <Section title="Status pills · Cart item · Skeleton">
          <div className="chips">
            <StatusPill>Placed</StatusPill>
            <StatusPill kind="way">On the way</StatusPill>
            <StatusPill kind="done">Delivered</StatusPill>
            <StatusPill kind="cancel">Cancelled</StatusPill>
            <StatusPill kind="pend">Payment pending</StatusPill>
          </div>
          <div className="mt-5">
            <CartItemRow title="Maybelline Color Sensational Ultimatte Lipstick 1.7 g" size="1.7 g" price="₹299" mrp="₹399" qty={1} />
          </div>
          <div className="mt-4">
            <SkeletonCardV1 width={160} photoHeight={150} />
          </div>
        </Section>

        <Section title="GroupHeader · CollapsePill">
          <div className="-ml-5 flex flex-col gap-4">
            <GroupHeader title="Lipstick" detail="Shade: Rich Ruby" hint />
            <GroupHeader title="Kajal" detail="Black" />
          </div>
          <div className="mt-5 flex gap-4">
            <CollapsePill count={5} expanded={false} onClick={noop} />
            <CollapsePill count={5} expanded onClick={noop} />
          </div>
        </Section>

        <Section title="Tokens · colour · type" wide>
          <div className="flex flex-wrap gap-3">
            {SWATCHES.map(([name, c]) => (
              <div key={name} className="flex w-[86px] flex-col gap-1.5">
                <span className="h-14 rounded-2xl border border-white/14" style={{ background: c }} />
                <span className="xs text-z-tx">{name}</span>
                <span className="xs">{c.startsWith('#') ? c : name === 'Ring' ? 'conic 1.5px' : '95°'}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 max-w-[390px]">
            <p className="gr">
              hey Kunal <Icon name="wave" size={15} className="inline-block align-[-2.5px]" />
            </p>
            <h1 className="hd">
              Saved for <i>later</i>
            </h1>
            <p className="sb">Headline: SF 800, 32px, −0.03em. One word in SF Italic with the logo gradient.</p>
            <div className="g mt-4 inline-flex h-12 items-center gap-2.5 rounded-full bg-[rgba(40,40,44,.85)] px-[18px] text-sm font-semibold">
              <Icon name="wifiOff" className="text-z-err" />
              No internet connection.
            </div>
          </div>
        </Section>
      </div>
    </div>
  )
}

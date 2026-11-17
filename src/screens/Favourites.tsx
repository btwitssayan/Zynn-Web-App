import { useState } from 'react'
import { Link } from 'react-router'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { Icon } from '../components/Icon'
import { ProductCard } from '../components/ProductCard'
import { ProductSheet } from '../components/ProductSheet'
import { TopBar } from '../components/TopBar'
import { displayPrice, PRODUCTS, storeLabel } from '../data/products'
import { inr2 } from '../lib/format'
import { useApp } from '../store/AppStore'

export default function Favourites() {
  const app = useApp()
  const [sheet, setSheet] = useState<string | null>(null)

  if (!app.favourites.length)
    return (
      <div className="scr flex min-h-dvh flex-col">
        <TopBar inner />
        <div className="flex flex-1 flex-col items-center justify-center px-8 pb-16 text-center">
          <div className="relative flex h-52 w-52 items-center justify-center">
            <DotLottieReact
              src="/empty-ghost.lottie"
              loop
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <h2 className="h2 mt-4">Nothing saved yet</h2>
          <p className="s mt-2 max-w-[280px] text-sm">Tap the heart on any product to save it here.</p>
          <div className="mt-7">
            <Link className="btn" to="/">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    )

  return (
    <div className="scr pb-10">
      <TopBar inner />
      <div className="px-5 pt-4">
        <p className="s">Your favourites</p>
        <div className="mt-1 flex items-center gap-2">
          <h1 className="h1">Saved for later</h1>
          <Icon name="heart" size={26} fill="#FF4D61" style={{ color: '#FF4D61' }} />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {app.favourites.map((id) => {
            const p = PRODUCTS[id]
            const qty = app.qtyOf(id)
            const kind = p.oos ? 'oos' : !p.offers.length ? 'visit' : qty ? 'added' : 'buy'
            return (
              <ProductCard
                key={id}
                title={p.title}
                price={inr2(displayPrice(p))}
                store={p.offers.length ? `on ${storeLabel(p)}` : storeLabel(p)}
                kind={kind}
                image={p.image}
                qty={qty}
                saved
                photoHeight={150}
                onOpen={() => setSheet(id)}
                onAdd={() => app.add(id)}
                onInc={() => app.bumpProduct(id, 1)}
                onDec={() => app.bumpProduct(id, -1)}
                onVisit={() => setSheet(id)}
                onToggleSave={() => app.toggleFav(id)}
              />
            )
          })}
        </div>
      </div>
      {sheet && <ProductSheet id={sheet} onClose={() => setSheet(null)} />}
    </div>
  )
}

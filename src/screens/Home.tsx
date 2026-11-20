import { AnimatePresence } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { CartBar, ChatBar, CollapsePill, GroupHeader } from '../components/Bars'
import { SkeletonCard } from '../components/Bits'
import BlurText from '../components/BlurText'
import ShinyText from '../components/ShinyText'
import { NumberTicker } from '../components/ui/number-ticker'
import { useCssVar } from '../hooks/use-css-var'
import { Drawer } from '../components/Drawer'
import { Icon } from '../components/Icon'
import { ProductCardV2, type CardKind } from '../components/ProductCardV2'
import { ProductSheet } from '../components/ProductSheet'
import { TopBar } from '../components/TopBar'
import { displayPrice, PRODUCTS, storeLabel } from '../data/products'
import { REELS } from '../data/reels'
import type { ReelGroup, ReelId } from '../data/types'
import { inr } from '../lib/format'
import { useApp } from '../store/AppStore'

const LOADING_HEAD = { ha: 'reading your ', hi: 'reel', hb: '…', sub: 'Finding the exact products...' }

export default function Home({ reelId }: { reelId: ReelId }) {
  const reel = REELS[reelId]
  const app = useApp()
  const nav = useNavigate()
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [sheet, setSheet] = useState<string | null>(null)
  const [menu, setMenu] = useState(false)
  const [picked, setPicked] = useState(
    () => new Set(reel.groups.flatMap((g) => g.cards.filter((c) => c.picked).map((c) => c.id))),
  )
  const groupsRef = useRef<HTMLDivElement>(null)
  const mutColor = useCssVar('--z-mut', '#8e8e93')
  const strongColor = useCssVar('--z-tx-strong', '#ffffff')

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1100)
    return () => clearTimeout(t)
  }, [])

  const isRecipe = reel.type === 'recipe'
  const many = reel.groups.length > 2
  const collapsed = many && !expanded
  const groups = collapsed ? reel.groups.slice(0, 2) : reel.groups
  const head = loading ? LOADING_HEAD : reel
  const pickedTotal = [...picked].reduce((s, id) => s + displayPrice(PRODUCTS[id]), 0)

  const toggleExpanded = () => {
    if (expanded) {
      const top = groupsRef.current?.getBoundingClientRect().top ?? 0
      if (top < 0) window.scrollBy({ top: top - 80 })
    }
    setExpanded(!expanded)
  }

  const pick = (g: ReelGroup, id: string) =>
    setPicked((prev) => {
      const next = new Set(prev)
      if (g.multi) {
        if (next.has(id)) next.delete(id)
        else next.add(id)
      } else {
        g.cards.forEach((c) => next.delete(c.id))
        next.add(id)
      }
      return next
    })

  const kindOf = (id: string): CardKind => {
    const p = PRODUCTS[id]
    if (p.oos) return 'oos'
    if (!p.offers.length) return 'visit'
    if (app.qtyOf(id) > 0) return 'added'
    if (isRecipe && picked.has(id)) return 'picked'
    return 'buy'
  }

  const ask = (q: string) => nav(`/chat?q=${encodeURIComponent(q)}`)
  let cardIndex = 0
  const cartIds = [...new Set(app.cart.map((l) => l.productId))]

  return (
    <div className="z2 pb-48">
      <TopBar onMenu={() => setMenu(true)} />

      <div className="px-5 pt-7">
        <p className="gr">
          hey {app.user?.name ?? 'there'} <Icon name="wave" size={15} className="inline-block align-[-2.5px]" />
        </p>
        <div className="flex items-start justify-between gap-2">
          {loading ? (
            // React Bits ShinyText: a sheen sweeps the line while Zynn reads.
            <h1 className="hd" aria-live="polite">
              <ShinyText
                text={`${head.ha}${head.hi}${head.hb}`}
                color={mutColor}
                shineColor={strongColor}
                speed={1.6}
                shineWidth={36}
              />
            </h1>
          ) : (
            // Results land with a focus pull: the line resolves out of blur.
            <h1 className="hd hd-in" aria-live="polite">
              {head.ha}
              <i className={head.hi === 'found' ? 'found' : undefined}>{head.hi}</i>
              {head.hb}
            </h1>
          )}
          <Icon name="sparkle" size={22} className={`mt-1 shrink-0 text-z-mut${loading ? ' spk-think' : ' spk-done'}`} />
        </div>
        {head.sub && <Sub text={head.sub} counting={!loading} />}
        {!loading && isRecipe && (
          <div className="mt-2.5 flex items-center gap-3">
            <button className="btn sm" disabled={!picked.size} onClick={() => app.addMany([...picked])}>
              Add all picks · <NumberTicker value={pickedTotal} format={inr} />
            </button>
            <span className="s">Tap a pack to switch</span>
          </div>
        )}
      </div>

      {loading ? (
        <>
          {[0, 1].map((k) => (
            <section className="grp" key={k}>
              <div className="flex h-[22px] items-center px-5">
                <div className="sk h-4 w-[150px]" />
              </div>
              <div className="flex gap-2.5 overflow-hidden pt-2 pl-5">
                <SkeletonCard index={k * 3} />
                <SkeletonCard index={k * 3 + 1} />
                <SkeletonCard index={k * 3 + 2} />
              </div>
            </section>
          ))}
        </>
      ) : (
        <div ref={groupsRef}>
          {groups.map((g, gi) => (
            <section className="grp" key={g.title}>
              <GroupHeader title={g.title} detail={g.detail} hint={g.hint && gi === 0} />
              <div className={collapsed && gi === 1 ? (isRecipe ? 'pk r' : 'pk') : ''}>
                <div className="hs">
                  {g.cards.map((c) => {
                    const p = PRODUCTS[c.id]
                    return (
                      <ProductCardV2
                        key={c.id}
                        index={cardIndex++}
                        title={p.short}
                        size={p.size}
                        price={inr(displayPrice(p))}
                        store={reel.hideStore ? '' : storeLabel(p)}
                        tag={c.tag}
                        image={p.image}
                        kind={kindOf(c.id)}
                        qty={app.qtyOf(c.id)}
                        onOpen={() => (isRecipe ? pick(g, c.id) : setSheet(c.id))}
                        onAdd={() => app.add(c.id)}
                        onInc={() => app.bumpProduct(c.id, 1)}
                        onDec={() => app.bumpProduct(c.id, -1)}
                        onVisit={() => setSheet(c.id)}
                      />
                    )
                  })}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}

      {!loading && many && (
        <div className={collapsed ? 'cpw c' : 'cpw'}>
          <CollapsePill count={reel.groups.length} expanded={expanded} onClick={toggleExpanded} />
        </div>
      )}

      {!loading && reel.msg && (
        // React Bits BlurText: Zynn's note settles in word by word, like it's being said.
        <BlurText
          key={reel.msg}
          text={reel.msg}
          className="t mt-6 px-5 text-sm leading-5"
          delay={45}
          blur={6}
          distance={8}
          direction="bottom"
          stepDuration={0.3}
        />
      )}

      {!loading && reel.chips.length > 0 && (
        <div className="chips mt-2.5 px-5">
          {reel.chips.map((c) => (
            <button key={c.t} className="g ec gap-1.5" onClick={() => ask(c.t)}>
              <Icon name={c.icon} size={15} className="text-z-mut" />
              {c.t}
            </button>
          ))}
        </div>
      )}

      {!loading && isRecipe && reel.kitchen && reel.steps && <Kitchen items={reel.kitchen} steps={reel.steps} />}

      <div className="dock">
        <AnimatePresence initial={false}>
          {app.cartCount > 0 && (
            <CartBar
              key="cart"
              count={app.cartCount}
              productCount={cartIds.length}
              thumbs={cartIds
                .slice(-3)
                .reverse()
                .flatMap((id) => {
                  const src = PRODUCTS[id]?.image
                  return src ? [{ id, src }] : []
                })}
              text={`${app.cartCount} ${app.cartCount === 1 ? 'item' : 'items'}`}
            />
          )}
        </AnimatePresence>
        <ChatBar
          gradient
          hints={loading ? ['Zynn is reading your reel...'] : reel.hints}
          disabled={loading}
          onSubmit={ask}
        />
      </div>

      {sheet && <ProductSheet id={sheet} onClose={() => setSheet(null)} />}
      {menu && <Drawer onClose={() => setMenu(false)} />}
    </div>
  )
}

/** "5 products identified": the count ticks up from zero as results land. */
function Sub({ text, counting }: { text: string; counting: boolean }) {
  const m = counting ? /^(\d+)(\s.*)$/.exec(text) : null
  if (!m) return <p className="sb">{text}</p>
  return (
    <p className="sb">
      <NumberTicker value={Number(m[1])} startValue={0} delay={0.15} />
      {m[2]}
    </p>
  )
}

function Kitchen({ items, steps }: { items: string[]; steps: string[] }) {
  const [have, setHave] = useState<Set<string>>(new Set())
  const toggle = (k: string) =>
    setHave((s) => {
      const n = new Set(s)
      if (n.has(k)) n.delete(k)
      else n.add(k)
      return n
    })

  return (
    <div className="mt-6 px-5">
      <p className="kt">Already in your kitchen?</p>
      <div className="mt-3 -mr-5 flex gap-2.5 overflow-x-auto pr-5 [scrollbar-width:none]">
        {items.map((k) => (
          <button key={k} className={`ki${have.has(k) ? ' on' : ''}`} aria-pressed={have.has(k)} onClick={() => toggle(k)}>
            <span />
            {k}
          </button>
        ))}
      </div>
      <div className="g gc mt-5">
        <p className="kt">How it's made</p>
        {steps.map((s, i) => (
          <div className="stp" key={s}>
            <b>{i + 1}</b>
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

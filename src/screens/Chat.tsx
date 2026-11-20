import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { ChatBar } from '../components/Bars'
import { Icon } from '../components/Icon'
import ShinyText from '../components/ShinyText'
import { TopBar } from '../components/TopBar'
import { BlurFade } from '../components/ui/blur-fade'
import { useCssVar } from '../hooks/use-css-var'
import { replyFor } from '../data/chat'
import { bestOffer, PRODUCTS } from '../data/products'
import { inr } from '../lib/format'
import { useApp } from '../store/AppStore'

interface Msg {
  from: 'me' | 'zynn'
  lines: string[]
}

export default function Chat() {
  const [params] = useSearchParams()
  const app = useApp()
  const nav = useNavigate()
  const product = PRODUCTS[params.get('p') ?? '']
  const q = params.get('q')
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [typing, setTyping] = useState(false)
  const sentInitial = useRef(false)
  const endRef = useRef<HTMLDivElement>(null)
  const mutColor = useCssVar('--z-mut', '#8e8e93')
  const strongColor = useCssVar('--z-tx-strong', '#ffffff')

  const send = useCallback(
    (text: string) => {
      setMsgs((m) => [...m, { from: 'me', lines: [text] }])
      setTyping(true)
      setTimeout(() => {
        setMsgs((m) => [...m, { from: 'zynn', lines: replyFor(text, product) }])
        setTyping(false)
      }, 900)
    },
    [product],
  )

  useEffect(() => {
    if (q && !sentInitial.current) {
      sentInitial.current = true
      send(q)
    }
  }, [q, send])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [msgs, typing])

  const offer = product && bestOffer(product)
  const last = msgs[msgs.length - 1]
  const suggestions = product
    ? ['Can I use this with vitamin C?', 'Does it suit oily skin?', 'Cheaper option?']
    : ['Find me a gentle face wash', 'Cheaper option?', 'Is this vegan?']

  return (
    <div className="scr pb-32">
      <TopBar inner />
      <div className="px-5 pt-3">
        {product && (
          <div className="dk flex items-center gap-3 rounded-[20px] py-2.5 pr-3.5 pl-2.5">
            <div className="ph h-11 w-11 rounded-xl text-[6px]">{product.short}</div>
            <p className="flex-1 text-[13px] leading-[1.4]">
              <b>{product.short}</b>
              {offer && ` · ${inr(offer.price)} on ${offer.store}`}
            </p>
          </div>
        )}

        {!msgs.length && !typing && (
          <div className="mt-7">
            <p className="h2">{product ? 'Ask about this product' : 'What are you shopping for?'}</p>
            <div className="chips mt-4">
              {suggestions.map((s, i) => (
                <BlurFade key={s} delay={0.08 + i * 0.06} direction="up" offset={8}>
                  <button className="chip" onClick={() => send(s)}>
                    {s}
                  </button>
                </BlurFade>
              ))}
            </div>
          </div>
        )}

        {msgs.map((m, i) =>
          m.from === 'me' ? (
            <div key={i} className="mt-7 flex justify-end" style={{ animation: 'zIn .35s ease-out both' }}>
              <div className="max-w-[260px] rounded-[22px_22px_6px_22px] bg-z-surface-2 px-4 py-3 text-[15px] font-semibold text-z-tx">{m.lines[0]}</div>
            </div>
          ) : (
            // Magic UI BlurFade: each line of Zynn's reply resolves in turn.
            <div key={i} className="mt-6 flex flex-col gap-1.5">
              {m.lines.map((l, li) => (
                <BlurFade key={l} delay={li * 0.14} direction="up" offset={6} duration={0.45}>
                  <p className="t">{l}</p>
                </BlurFade>
              ))}
            </div>
          ),
        )}

        {typing && (
          <div className="typing" role="status" aria-label="Zynn is thinking">
            <i />
            <i />
            <i />
            <ShinyText
              text="Zynn is thinking"
              className="ml-2 text-[13px] font-medium"
              color={mutColor}
              shineColor={strongColor}
              speed={1.4}
            />
          </div>
        )}

        {last?.from === 'zynn' && !typing && (
          <BlurFade className="chips mt-[18px]" delay={0.1 + (last.lines.length - 1) * 0.14} direction="up" offset={8}>
            {product && offer && (
              <button className="chip" onClick={() => app.add(product.id)}>
                <Icon name="plus" size={16} />
                Add to cart
              </button>
            )}
            <button className="chip" onClick={() => nav('/')}>
              See other options
            </button>
          </BlurFade>
        )}
        <div ref={endRef} />
      </div>

      <div className="dock">
        <ChatBar hints={[product ? `Ask about ${product.short}` : 'Ask Zynn anything']} onSubmit={send} disabled={typing} />
      </div>
    </div>
  )
}

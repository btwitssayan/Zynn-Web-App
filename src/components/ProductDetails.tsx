import type { Review } from '../data/types'
import { Icon } from './Icon'
import { StoreLogo } from './StoreLogo'

/** Renders "**bold** plain" copy as text with <strong> runs. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))}
    </>
  )
}

function CardHead({ title, onInfo, infoLabel }: { title: string; onInfo: () => void; infoLabel: string }) {
  return (
    <div className="zs-head">
      <h3 className="zs-title">
        <svg viewBox="0 0 24 24" className="zs-spark" aria-hidden="true">
          <path d="M12 2c.6 4.9 3.1 7.4 8 8-4.9.6-7.4 3.1-8 8-.6-4.9-3.1-7.4-8-8 4.9-.6 7.4-3.1 8-8z" />
        </svg>
        <span>{title}</span>
      </h3>
      <button className="zs-info" aria-label={infoLabel} onClick={onInfo}>
        <Icon name="info" size={20} />
      </button>
    </div>
  )
}

export function ZynnSays({ text, relevance, onInfo }: { text: string; relevance?: number; onInfo: () => void }) {
  return (
    <section className="zs-card">
      <CardHead title="Zynn says" onInfo={onInfo} infoLabel="How Zynn picks products" />
      <p className="zs-text">
        <Rich text={text} />
      </p>
      {relevance != null && (
        <div className="zs-meter">
          <span className="zs-meter-label">Relevance</span>
          <div
            className="zs-bar"
            role="meter"
            aria-label="Relevance"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={relevance}
          >
            <span style={{ width: `${Math.max(0, Math.min(100, relevance))}%` }} />
          </div>
        </div>
      )}
    </section>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="rv-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" aria-hidden="true" className={i < Math.round(rating) ? 'on' : ''}>
          <path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" />
        </svg>
      ))}
    </span>
  )
}

export function CustomerReviews({
  reviews,
  onInfo,
  onReadAll,
}: {
  reviews: Review[]
  onInfo: () => void
  onReadAll: () => void
}) {
  return (
    <section className="zs-card rv-card">
      <CardHead title="Customers say" onInfo={onInfo} infoLabel="Where these reviews come from" />
      {reviews.map((r, i) => (
        <article key={`${r.author}-${i}`} className="rv-item">
          <div className="rv-rating">
            <Stars rating={r.rating} />
            <span>{r.rating}</span>
          </div>
          <p className="rv-meta">
            {r.author}, {r.date}
            <span className="rv-src">
              <span className="rv-src-logo">
                <StoreLogo store={r.source} fallback={r.source.charAt(0)} />
              </span>
              from {r.source}
            </span>
          </p>
          <h4 className="rv-title">{r.title}</h4>
          <p className="rv-body">{r.body}</p>
        </article>
      ))}
      <button className="rv-all" onClick={onReadAll}>
        Read all customer reviews
      </button>
    </section>
  )
}

export function ProductDescription({ text }: { text: string }) {
  return (
    <section className="pd-desc">
      <h3>Product description</h3>
      <p>{text}</p>
    </section>
  )
}

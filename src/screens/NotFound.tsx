import { useLocation, useNavigate } from 'react-router'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { ChatBar } from '../components/Bars'
import { TopBar } from '../components/TopBar'

export default function NotFound() {
  const nav = useNavigate()
  const { pathname } = useLocation()
  const ask = (q: string) => nav(`/chat?q=${encodeURIComponent(q)}`)

  return (
    <div className="scr flex min-h-dvh flex-col">
      <TopBar inner />
      {/* pb offsets the dock so the block sits at the optical center of the free area */}
      <main className="flex flex-1 flex-col items-center justify-center px-5 pb-28 text-center">
        <div className="relative mx-auto flex w-64 max-w-full items-center justify-center aspect-[6/7]">
          <DotLottieReact
            src="/404-ghost.lottie"
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <p className="mt-3">
          <code className="inline-block max-w-full truncate rounded-[10px] border border-ink/10 bg-ink/5 px-3 py-1.5 align-bottom font-mono text-[12px] leading-5 text-z-mut">
            404 · {pathname}
          </code>
        </p>
        <div className="mt-6">
          <button className="btn" onClick={() => nav('/', { replace: true })}>
            Back to your reel
          </button>
        </div>
      </main>
      <div className="dock">
        <ChatBar hints={['Ask Zynn anything']} onSubmit={ask} />
      </div>
    </div>
  )
}

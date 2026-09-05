import { useState } from 'react'
import { PackShelf } from './components/PackShelf'
import { PackOpening } from './components/PackOpening'
import { CardDetail } from './components/CardDetail'
import type { CardDef, PackDef } from './game/types'

export default function App() {
  const [opening, setOpening] = useState<PackDef | null>(null)
  const [detail, setDetail] = useState<CardDef | null>(null)
  const [blackout, setBlackout] = useState(false)

  function runBlackout() {
    setBlackout(true)
    // 완전히 어두워진 사이에 홈으로 교체하고, 다시 서서히 밝아진다
    window.setTimeout(() => setOpening(null), 520)
    window.setTimeout(() => setBlackout(false), 1300)
  }

  return (
    <div className="phone">
      <main className="screen">
        {opening ? (
          <PackOpening
            pack={opening}
            onDone={() => setOpening(null)}
            onInspect={setDetail}
            onBlackout={runBlackout}
          />
        ) : (
          <PackShelf onOpen={setOpening} />
        )}
      </main>

      {detail && <CardDetail card={detail} onClose={() => setDetail(null)} />}
      {blackout && <div className="blackout" aria-hidden />}
    </div>
  )
}

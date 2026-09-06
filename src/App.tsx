import { useState } from 'react'
import { PackShelf } from './components/PackShelf'
import { PackOpening } from './components/PackOpening'
import type { PackDef } from './game/types'

export default function App() {
  const [opening, setOpening] = useState<PackDef | null>(null)
  const [blackout, setBlackout] = useState(false)
  const [whiteout, setWhiteout] = useState(false)

  function runBlackout() {
    setBlackout(true)
    // 완전히 어두워진 사이에 홈으로 교체하고, 다시 서서히 밝아진다
    window.setTimeout(() => setOpening(null), 520)
    window.setTimeout(() => setBlackout(false), 1300)
  }

  function runWhiteout() {
    setWhiteout(true)
    window.setTimeout(() => setWhiteout(false), 950)
  }

  return (
    <div className="phone">
      <main className="screen">
        {opening ? (
          <PackOpening
            pack={opening}
            onDone={() => setOpening(null)}
            onBlackout={runBlackout}
            onWhiteout={runWhiteout}
          />
        ) : (
          <PackShelf onOpen={setOpening} />
        )}
      </main>

      {blackout && <div className="blackout" aria-hidden />}
      {whiteout && <div className="whiteout" aria-hidden />}
    </div>
  )
}

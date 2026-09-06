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

  // 흰 번쩍이 화면을 덮은 사이에 화면을 교체한다 (약 2초)
  function whiteTransition(swap: () => void) {
    setWhiteout(true)
    window.setTimeout(swap, 850)
    window.setTimeout(() => setWhiteout(false), 2000)
  }

  // 갤러리에서 팩 클릭 → 흰 번쩍 → 팩 화면
  function openPack(pack: PackDef) {
    if (pack.instant) setOpening(pack) // 히든 보스는 안개 등장이라 흰 번쩍 없이
    else whiteTransition(() => setOpening(pack))
  }

  // 카드 다 깐 뒤 → 흰 번쩍 → 홈(다음 팩)
  function finishPack() {
    whiteTransition(() => setOpening(null))
  }

  return (
    <div className="phone">
      <main className="screen">
        {opening ? (
          <PackOpening
            pack={opening}
            onDone={finishPack}
            onBlackout={runBlackout}
          />
        ) : (
          <PackShelf onOpen={openPack} />
        )}
      </main>

      {blackout && <div className="blackout" aria-hidden />}
      {whiteout && <div className="whiteout" aria-hidden />}
    </div>
  )
}

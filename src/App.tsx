import { useState } from 'react'
import { PackShelf } from './components/PackShelf'
import { PackOpening } from './components/PackOpening'
import { PACKS } from './data/packs'
import { useCollection } from './state/collection'
import type { PackDef } from './game/types'

export default function App() {
  const { openedPacks } = useCollection()
  const [opening, setOpening] = useState<PackDef | null>(null)
  const [blackout, setBlackout] = useState(false)
  const [whiteout, setWhiteout] = useState(false)
  const [bossReveal, setBossReveal] = useState(false)

  function runBlackout() {
    setBlackout(true)
    // 완전히 어두워진 사이에 홈으로 교체하고, 다시 서서히 밝아진다
    window.setTimeout(() => setOpening(null), 520)
    window.setTimeout(() => setBlackout(false), 1300)
  }

  // 흰 번쩍이 화면을 덮은 사이에 화면을 교체한다 (약 2초).
  // 교체는 흰색이 꽉 찬 후반부에, 페이드아웃은 짧게 → 다음 화면에 흰색이 안 남는다.
  function whiteTransition(swap: () => void) {
    setWhiteout(true)
    window.setTimeout(swap, 1700)
    window.setTimeout(() => setWhiteout(false), 2000)
  }

  // 갤러리에서 팩 클릭 → 흰 번쩍 → 팩 화면
  function openPack(pack: PackDef) {
    if (pack.instant) setOpening(pack) // 히든 보스는 안개 등장이라 흰 번쩍 없이
    else whiteTransition(() => setOpening(pack))
  }

  // 카드 다 깐 뒤 → 홈으로. 이번에 히든 팩이 풀리는 순간이면 암전 + 연기 연출
  function finishPack() {
    const hiddenPack = PACKS.find((p) => p.hidden)
    const revealsHidden =
      !!hiddenPack &&
      !openedPacks.has(hiddenPack.id) &&
      PACKS.filter((p) => !p.hidden).every((p) => openedPacks.has(p.id))

    if (revealsHidden) {
      setBossReveal(true)
      window.setTimeout(() => setOpening(null), 750)
      window.setTimeout(() => setBossReveal(false), 2400)
    } else {
      setOpening(null)
    }
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
      {bossReveal && (
        <div className="boss-reveal" aria-hidden>
          <span className="boss-reveal__smoke" />
          <span className="boss-reveal__smoke boss-reveal__smoke--2" />
        </div>
      )}
    </div>
  )
}

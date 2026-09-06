import { useEffect, useMemo, useRef, useState } from 'react'
import { openPack } from '../game/openPack'
import type { PackDef } from '../game/types'
import { useCollection } from '../state/collection'
import { CardView } from './CardView'

interface Props {
  pack: PackDef
  /** 개봉이 끝나 홈으로 돌아갈 때 (일반 팩) */
  onDone: () => void
  /** 암전으로 개봉을 끝낼 때 (instant 팩) */
  onBlackout: () => void
}

type Phase = 'sealed' | 'tearing' | 'revealing'

// 카드팩을 연 뒤 자동 진행 타이밍
const FLIP_DELAY = 1000 // 카드가 뒤집히기까지 1초
const VIEW_DURATION = 5000 // 뒤집힌 카드 내용을 보여주는 5초

export function PackOpening({ pack, onDone, onBlackout }: Props) {
  const { counts, addPull, markPackOpened } = useCollection()

  // 팩을 여는 순간의 보유 목록으로 결과를 고정한다.
  const ownedIdsRef = useRef<Set<string>>(
    new Set(Object.keys(counts).filter((id) => counts[id] > 0)),
  )
  const result = useMemo(() => openPack(pack, ownedIdsRef.current), [pack])
  const cards = result.cards

  // 팩 테마색을 개봉 화면 전체에 전달 (봉투·카드 뒷면 그라데이션 기준)
  const openingStyle = pack.color
    ? ({ ['--pack-color' as string]: pack.color } as React.CSSProperties)
    : undefined

  // instant 팩은 뜯기 연출 없이 바로 카드가 나온다
  const [phase, setPhase] = useState<Phase>(pack.instant ? 'revealing' : 'sealed')
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [fromTear, setFromTear] = useState(false)
  const mountedAt = useRef(Date.now())
  const exitTimer = useRef<number | undefined>(undefined)

  // 콜백은 ref 로 붙잡아 자동진행 타이머가 App 리렌더에 흔들리지 않게 한다
  const onDoneRef = useRef(onDone)
  const onBlackoutRef = useRef(onBlackout)
  onDoneRef.current = onDone
  onBlackoutRef.current = onBlackout

  // 결과는 마운트 시 한 번만 컬렉션에 반영하고, 이 팩을 "뜯은 팩"으로 기록한다.
  const committed = useRef(false)
  useEffect(() => {
    if (!committed.current && cards.length > 0) {
      committed.current = true
      addPull(cards)
      markPackOpened(pack.id)
    }
  }, [cards, addPull, markPackOpened, pack.id])

  // 뜯기: 팩이 잠깐 떨린 뒤 공개 화면으로
  useEffect(() => {
    if (phase !== 'tearing') return
    const t = window.setTimeout(() => {
      setFromTear(true)
      setPhase('revealing')
    }, 360)
    return () => window.clearTimeout(t)
  }, [phase])

  function startTear() {
    if (phase !== 'sealed') return
    // 화면이 방금 떴을 때 흘러넘친 탭은 무시 (대기화면이 확실히 보이도록)
    if (Date.now() - mountedAt.current < 300) return
    setPhase('tearing')
  }

  const isLast = idx >= cards.length - 1

  // 공개 화면: 1초 뒤 자동으로 뒤집고, 5초 더 보여준 뒤 다음 카드로 (또는 마무리)
  useEffect(() => {
    if (phase !== 'revealing') return
    setRevealed(false)
    setExiting(false)

    const flipT = window.setTimeout(() => setRevealed(true), FLIP_DELAY)
    const nextT = window.setTimeout(() => {
      if (isLast) {
        if (pack.instant) onBlackoutRef.current()
        else onDoneRef.current()
        return
      }
      setExiting(true)
      exitTimer.current = window.setTimeout(() => setIdx((i) => i + 1), 220)
    }, FLIP_DELAY + VIEW_DURATION)

    return () => {
      window.clearTimeout(flipT)
      window.clearTimeout(nextT)
      if (exitTimer.current) window.clearTimeout(exitTimer.current)
    }
  }, [phase, idx, isLast, pack.instant])

  if (cards.length === 0) {
    return (
      <div className="opening">
        <p className="hint">
          이 팩에서 뽑을 수 있는 카드가 없습니다. <code>src/data/cards.ts</code> 에
          카드를 추가해주세요.
        </p>
        <button className="btn" onClick={onDone} type="button">
          돌아가기
        </button>
      </div>
    )
  }

  if (phase === 'sealed' || phase === 'tearing') {
    const tearing = phase === 'tearing'
    return (
      <div
        className={'opening' + (tearing ? ' opening--tearing' : '')}
        style={openingStyle}
      >
        <div className={'tear' + (tearing ? ' tear--active' : '')}>
          <div className="tear__card" aria-hidden>
            <span>{pack.short ?? pack.name}</span>
          </div>
          <button
            className="tear__pack"
            onClick={startTear}
            type="button"
            aria-label="카드팩 뜯기"
            disabled={tearing}
          >
            <span className="tear__pack-title">{pack.name}</span>
          </button>
        </div>
        {!tearing && <div className="deck__hint">탭하여 뜯기</div>}
      </div>
    )
  }

  // phase === 'revealing'
  const pulled = cards[idx]
  const enterClass = exiting
    ? ' is-exiting'
    : pack.instant && idx === 0
      ? ' is-boss-in'
      : fromTear && idx === 0
        ? ' is-appearing'
        : ' is-entering'

  return (
    <div
      className={'opening' + (pack.instant ? ' opening--boss' : '')}
      style={openingStyle}
    >
      {cards.length > 1 && (
        <div className="deck__progress">
          {cards.map((_, i) => (
            <span
              key={i}
              className={
                'deck__dot' +
                (i === idx ? ' is-current' : i < idx ? ' is-done' : '')
              }
            />
          ))}
        </div>
      )}

      <div className="deck">
        {pack.instant && <div className="deck__fog" aria-hidden />}
        <div
          key={idx}
          className={'deck__card' + enterClass}
          style={exiting ? { transform: 'scale(0.94)', opacity: 0 } : undefined}
        >
          <div className={'flipper' + (revealed ? ' is-flipped' : '')}>
            <div className="flipper__inner">
              <div className="flipper__back" aria-hidden>
                <span>{pack.short ?? pack.name}</span>
              </div>
              <div className="flipper__front">
                <CardView card={pulled.card} isNew={pulled.isNew} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

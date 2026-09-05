import { useEffect, useMemo, useRef, useState } from 'react'
import { openPack } from '../game/openPack'
import type { CardDef, PackDef } from '../game/types'
import { useCollection } from '../state/collection'
import { CardView } from './CardView'

interface Props {
  pack: PackDef
  onDone: () => void
  onInspect: (card: CardDef) => void
}

type Phase = 'sealed' | 'tearing' | 'revealing' | 'summary'

export function PackOpening({ pack, onDone, onInspect }: Props) {
  const { counts, addPull } = useCollection()

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

  const [phase, setPhase] = useState<Phase>('sealed')
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState<boolean[]>(() => cards.map(() => false))
  const [drag, setDrag] = useState(0)
  const [exiting, setExiting] = useState(false)
  const [fromTear, setFromTear] = useState(false)
  const startX = useRef<number | null>(null)
  const moved = useRef(false)

  // 결과는 마운트 시 한 번만 컬렉션에 반영한다.
  const committed = useRef(false)
  useEffect(() => {
    if (!committed.current && cards.length > 0) {
      committed.current = true
      addPull(cards)
    }
  }, [cards, addPull])

  // 봉투에서 카드가 나오는 연출 → 끝나면 공개 화면으로
  useEffect(() => {
    if (phase !== 'tearing') return
    const t = window.setTimeout(() => {
      setFromTear(true)
      setPhase('revealing')
    }, 730)
    return () => window.clearTimeout(t)
  }, [phase])

  const isLast = idx >= cards.length - 1
  const curRevealed = revealed[idx] ?? false

  function reveal() {
    setRevealed((prev) => {
      if (prev[idx]) return prev
      const next = [...prev]
      next[idx] = true
      return next
    })
  }

  function advance() {
    if (!curRevealed || exiting) return
    if (isLast) {
      setPhase('summary')
      return
    }
    setExiting(true)
    window.setTimeout(() => {
      setIdx((i) => i + 1)
      setDrag(0)
      setExiting(false)
    }, 200)
  }

  // 카드 탭 / 스와이프
  function onPointerDown(e: React.PointerEvent) {
    startX.current = e.clientX
    moved.current = false
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* noop */
    }
  }
  function onPointerMove(e: React.PointerEvent) {
    if (startX.current == null) return
    const dx = e.clientX - startX.current
    if (Math.abs(dx) > 6) moved.current = true
    if (curRevealed) setDrag(dx)
  }
  function onPointerUp(e: React.PointerEvent) {
    const from = startX.current
    startX.current = null
    if (from == null) return
    const dx = e.clientX - from
    if (!moved.current) {
      // 탭: 안 뒤집혔으면 공개, 뒤집혔으면 다음
      if (!curRevealed) reveal()
      else advance()
      return
    }
    if (curRevealed && Math.abs(dx) > 55) advance()
    else setDrag(0)
  }
  function onPointerCancel() {
    startX.current = null
    setDrag(0)
  }

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
            onClick={() => !tearing && setPhase('tearing')}
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

  if (phase === 'revealing') {
    const pulled = cards[idx]
    const style: React.CSSProperties = exiting
      ? { transform: 'scale(0.94)', opacity: 0 }
      : drag
        ? { transform: `translateX(${drag}px) rotate(${drag * 0.02}deg)` }
        : {}

    return (
      <div className="opening" style={openingStyle}>
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

        <div className="deck">
          <div
            key={idx}
            className={
              'deck__card' +
              (exiting
                ? ' is-exiting'
                : fromTear && idx === 0
                  ? ' is-appearing'
                  : ' is-entering')
            }
            style={style}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
          >
            <div className={'flipper' + (curRevealed ? ' is-flipped' : '')}>
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

        <div className="deck__hint">
          {!curRevealed
            ? '카드를 탭해서 공개'
            : isLast
              ? '탭 또는 스와이프로 결과 보기'
              : '탭 또는 스와이프로 다음 카드'}
        </div>
      </div>
    )
  }

  // phase === 'summary'
  return (
    <div className="opening">
      <div className="summary">
        <h3>획득한 카드</h3>
        <div className="summary__cards">
          {cards.map((pulled, i) => (
            <div className="summary__card" key={i}>
              <CardView
                card={pulled.card}
                isNew={pulled.isNew}
                onClick={() => onInspect(pulled.card)}
              />
            </div>
          ))}
        </div>
        <div className="opening__actions">
          <button className="btn btn--primary" onClick={onDone} type="button">
            보관하고 계속
          </button>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { openPack } from '../game/openPack'
import { RARITY_LABEL } from '../game/rarity'
import type { CardDef, PackDef } from '../game/types'
import { useCollection } from '../state/collection'
import { CardView } from './CardView'

interface Props {
  pack: PackDef
  onDone: () => void
  onInspect: (card: CardDef) => void
}

type Phase = 'sealed' | 'revealing' | 'summary'

export function PackOpening({ pack, onDone, onInspect }: Props) {
  const { counts, addPull } = useCollection()

  // 팩을 여는 순간의 보유 목록으로 결과를 고정한다.
  const ownedIdsRef = useRef<Set<string>>(
    new Set(Object.keys(counts).filter((id) => counts[id] > 0)),
  )
  const result = useMemo(() => openPack(pack, ownedIdsRef.current), [pack])
  const cards = result.cards

  const [phase, setPhase] = useState<Phase>('sealed')
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState<boolean[]>(() => cards.map(() => false))
  const [drag, setDrag] = useState(0)
  const [exiting, setExiting] = useState(false)
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
    }, 240)
  }

  // ── 스와이프 ──
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
      // 탭: 공개
      if (!curRevealed) reveal()
      return
    }
    if (curRevealed && Math.abs(dx) > 60) {
      advance()
    } else {
      setDrag(0)
    }
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

  if (phase === 'sealed') {
    return (
      <div className="opening">
        <button
          className="sealed"
          onClick={() => setPhase('revealing')}
          type="button"
        >
          <div className="sealed__pack" aria-hidden>
            <span className="sealed__pack-mark">✦</span>
          </div>
          <div className="sealed__name">{pack.name}</div>
          <div className="sealed__sub">{cards.length}장 구성</div>
          <div className="sealed__cta">탭해서 뜯기</div>
        </button>
      </div>
    )
  }

  if (phase === 'revealing') {
    const pulled = cards[idx]
    const style: React.CSSProperties = exiting
      ? { transform: 'translateX(115%) rotate(12deg)', opacity: 0 }
      : { transform: `translateX(${drag}px) rotate(${drag * 0.03}deg)` }

    return (
      <div className="opening">
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
          {/* 뒤에 남은 카드 더미 */}
          {!isLast && <div className="deck__stack" aria-hidden />}

          <div
            className={'deck__card' + (exiting ? ' is-exiting' : '')}
            style={style}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              startX.current = null
              setDrag(0)
            }}
          >
            <div className={'flipper' + (curRevealed ? ' is-flipped' : '')}>
              <div className="flipper__inner">
                <div className="flipper__back" aria-hidden>
                  <span>?</span>
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
              ? '옆으로 넘겨서 결과 보기'
              : '옆으로 넘겨서 다음 카드'}
        </div>

        <div className="opening__actions">
          {!curRevealed ? (
            <button className="btn" onClick={reveal} type="button">
              공개
            </button>
          ) : (
            <button className="btn btn--primary" onClick={advance} type="button">
              {isLast ? '결과 보기' : `다음 (${idx + 1}/${cards.length})`}
            </button>
          )}
        </div>
      </div>
    )
  }

  // phase === 'summary'
  return (
    <div className="opening">
      <div className="summary">
        <h3>획득한 카드</h3>
        <ul className="summary__list">
          {cards.map((pulled, i) => (
            <li
              key={i}
              className={`summary__item rarity-${pulled.card.rarity}`}
              onClick={() => onInspect(pulled.card)}
            >
              <span>{pulled.card.name}</span>
              <span className="summary__tag">
                {RARITY_LABEL[pulled.card.rarity]}
                {pulled.isNew && ' · NEW'}
              </span>
            </li>
          ))}
        </ul>
        <div className="opening__actions">
          <button className="btn btn--primary" onClick={onDone} type="button">
            보관하고 계속
          </button>
        </div>
      </div>
    </div>
  )
}

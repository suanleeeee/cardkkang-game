import { useEffect, useMemo, useRef, useState } from 'react'
import { openPack } from '../game/openPack'
import { RARITY_LABEL } from '../game/rarity'
import type { PackDef } from '../game/types'
import { useCollection } from '../state/collection'
import { CardView } from './CardView'

interface Props {
  pack: PackDef
  onDone: () => void
}

type Phase = 'sealed' | 'revealing' | 'summary'

export function PackOpening({ pack, onDone }: Props) {
  const { counts, addPull } = useCollection()

  // 팩을 여는 순간의 보유 목록으로 결과를 고정한다.
  const ownedIdsRef = useRef<Set<string>>(
    new Set(Object.keys(counts).filter((id) => counts[id] > 0)),
  )
  const result = useMemo(
    () => openPack(pack, ownedIdsRef.current),
    [pack],
  )

  const [phase, setPhase] = useState<Phase>('sealed')
  const [flipped, setFlipped] = useState<boolean[]>(
    () => result.cards.map(() => false),
  )

  // 결과는 마운트 시 한 번만 컬렉션에 반영한다.
  const committed = useRef(false)
  useEffect(() => {
    if (!committed.current && result.cards.length > 0) {
      committed.current = true
      addPull(result.cards)
    }
  }, [result, addPull])

  const allFlipped = flipped.every(Boolean)

  function flip(i: number) {
    setFlipped((prev) => {
      if (prev[i]) return prev
      const next = [...prev]
      next[i] = true
      return next
    })
  }

  function revealAll() {
    setFlipped(result.cards.map(() => true))
  }

  if (result.cards.length === 0) {
    return (
      <div className="opening">
        <p className="opening__empty">
          이 팩에서 뽑을 수 있는 카드가 없습니다. <code>src/data/cards.ts</code>{' '}
          에 카드를 추가해주세요.
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
          className="pack pack--sealed"
          onClick={() => setPhase('revealing')}
          type="button"
        >
          <div className="pack__art">
            <div className="pack__art-placeholder" aria-hidden>
              🃏
            </div>
          </div>
          <div className="pack__name">{pack.name}</div>
          <div className="pack__cta">탭해서 뜯기</div>
        </button>
      </div>
    )
  }

  return (
    <div className="opening">
      <div className="reveal-grid">
        {result.cards.map((pulled, i) => (
          <div
            key={i}
            className={`flipper${flipped[i] ? ' is-flipped' : ''}`}
            onClick={() => flip(i)}
          >
            <div className="flipper__inner">
              <div className="flipper__back" aria-hidden>
                <span>?</span>
              </div>
              <div className="flipper__front">
                <CardView
                  card={pulled.card}
                  isNew={pulled.isNew}
                  size="lg"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {phase === 'revealing' && (
        <div className="opening__actions">
          {!allFlipped ? (
            <button className="btn" onClick={revealAll} type="button">
              모두 공개
            </button>
          ) : (
            <button
              className="btn btn--primary"
              onClick={() => setPhase('summary')}
              type="button"
            >
              결과 보기
            </button>
          )}
        </div>
      )}

      {phase === 'summary' && (
        <div className="summary">
          <h3>획득한 카드</h3>
          <ul className="summary__list">
            {result.cards.map((pulled, i) => (
              <li key={i} className={`summary__item rarity-${pulled.card.rarity}`}>
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
      )}
    </div>
  )
}

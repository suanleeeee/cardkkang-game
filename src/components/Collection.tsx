import { useMemo } from 'react'
import { CARDS } from '../data/cards'
import { RARITY_ORDER, type CardDef } from '../game/types'
import { RARITY_LABEL } from '../game/rarity'
import { useCollection } from '../state/collection'
import { CardView } from './CardView'

interface Props {
  onInspect: (card: CardDef) => void
}

export function Collection({ onInspect }: Props) {
  const { countOf, has, uniqueOwned, reset } = useCollection()

  const groups = useMemo(
    () =>
      RARITY_ORDER.map((rarity) => ({
        rarity,
        cards: CARDS.filter((c) => c.rarity === rarity),
      })).filter((g) => g.cards.length > 0),
    [],
  )

  if (CARDS.length === 0) {
    return (
      <p className="hint">
        아직 카드가 없습니다. <code>src/data/cards.ts</code> 에 카드를 추가하세요.
      </p>
    )
  }

  return (
    <div className="collection">
      <div className="collection__bar">
        <span>
          도감 <b>{uniqueOwned}</b> / {CARDS.length}
        </span>
        <button
          className="btn btn--ghost btn--sm"
          type="button"
          onClick={() => {
            if (confirm('컬렉션을 모두 초기화할까요?')) reset()
          }}
        >
          초기화
        </button>
      </div>

      {groups.map((g) => (
        <section key={g.rarity} className="collection__group">
          <h3>
            {RARITY_LABEL[g.rarity]}
            <span className="collection__group-count">
              {g.cards.filter((c) => has(c.id)).length}/{g.cards.length}
            </span>
          </h3>
          <div className="card-grid">
            {g.cards.map((card) => (
              <CardView
                key={card.id}
                card={card}
                locked={!has(card.id)}
                count={countOf(card.id)}
                onClick={() => has(card.id) && onInspect(card)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

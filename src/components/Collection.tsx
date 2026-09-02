import { useMemo } from 'react'
import { CARDS } from '../data/cards'
import { RARITY_ORDER } from '../game/types'
import { RARITY_LABEL } from '../game/rarity'
import { useCollection } from '../state/collection'
import { CardView } from './CardView'

export function Collection() {
  const { countOf, has, uniqueOwned } = useCollection()

  const groups = useMemo(() => {
    return RARITY_ORDER.map((rarity) => ({
      rarity,
      cards: CARDS.filter((c) => c.rarity === rarity),
    })).filter((g) => g.cards.length > 0)
  }, [])

  if (CARDS.length === 0) {
    return (
      <p className="collection__empty">
        아직 카드가 없습니다. <code>src/data/cards.ts</code> 에 카드를 추가하세요.
      </p>
    )
  }

  return (
    <div className="collection">
      <p className="collection__progress">
        도감 {uniqueOwned} / {CARDS.length}
      </p>
      {groups.map((g) => (
        <section key={g.rarity} className="collection__group">
          <h3>{RARITY_LABEL[g.rarity]}</h3>
          <div className="collection__grid">
            {g.cards.map((card) => (
              <CardView
                key={card.id}
                card={card}
                locked={!has(card.id)}
                count={countOf(card.id)}
                size="sm"
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

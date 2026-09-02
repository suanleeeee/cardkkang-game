import { useEffect } from 'react'
import type { CardDef } from '../game/types'
import { RARITY_LABEL } from '../game/rarity'
import { useCollection } from '../state/collection'
import { CardView } from './CardView'

interface Props {
  card: CardDef
  onClose: () => void
}

export function CardDetail({ card, onClose }: Props) {
  const { countOf } = useCollection()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const owned = countOf(card.id)

  return (
    <div className="sheet" onClick={onClose}>
      <div className="sheet__body" onClick={(e) => e.stopPropagation()}>
        <div className="sheet__card">
          <CardView card={card} count={owned} />
        </div>
        <div className="sheet__meta">
          <strong>{card.name}</strong>
          <span>
            {RARITY_LABEL[card.rarity]} · {owned > 0 ? `보유 ${owned}장` : '미보유'}
          </span>
        </div>
        <button className="btn btn--primary" onClick={onClose} type="button">
          닫기
        </button>
      </div>
    </div>
  )
}

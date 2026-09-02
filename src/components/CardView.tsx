import type { CardDef } from '../game/types'
import { RARITY_COLOR, RARITY_LABEL } from '../game/rarity'

interface Props {
  card: CardDef
  /** 미보유(실루엣) 표시 */
  locked?: boolean
  /** NEW 뱃지 */
  isNew?: boolean
  count?: number
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export function CardView({
  card,
  locked = false,
  isNew = false,
  count,
  size = 'md',
  onClick,
}: Props) {
  const color = RARITY_COLOR[card.rarity]

  return (
    <div
      className={`card card--${size} card--${card.rarity}${locked ? ' card--locked' : ''}`}
      style={{ ['--rarity' as string]: color }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="card__art">
        {card.image && !locked ? (
          <img src={card.image} alt={card.name} loading="lazy" />
        ) : (
          <div className="card__placeholder" aria-hidden>
            {locked ? '?' : card.name.slice(0, 1)}
          </div>
        )}
      </div>
      <div className="card__body">
        <span className="card__name">{locked ? '미획득' : card.name}</span>
        <span className="card__rarity">{RARITY_LABEL[card.rarity]}</span>
      </div>
      {isNew && <span className="card__badge card__badge--new">NEW</span>}
      {typeof count === 'number' && count > 1 && (
        <span className="card__badge card__badge--count">×{count}</span>
      )}
    </div>
  )
}

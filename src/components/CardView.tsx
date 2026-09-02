import type { CardDef } from '../game/types'
import { RARITY_LABEL } from '../game/rarity'
import { EnergyIcon } from './EnergyIcon'

interface Props {
  card: CardDef
  /** 미획득(뒷면) 표시 */
  locked?: boolean
  /** NEW 뱃지 */
  isNew?: boolean
  count?: number
  onClick?: () => void
}

export function CardView({ card, locked, isNew, count, onClick }: Props) {
  if (locked) {
    return (
      <div
        className="pcard pcard--back"
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        <div className="pcard__frame">
          <div className="cardback">
            <span className="cardback__mark">?</span>
            <span className="cardback__label">미획득</span>
          </div>
        </div>
      </div>
    )
  }

  const stage = card.stage ?? '기본'
  const attacks = card.attacks ?? []

  return (
    <div
      className={`pcard pcard--${card.rarity}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="pcard__frame">
        <header className="pc-head">
          <span className="pc-stage">{stage}</span>
          <span className="pc-name">{card.name}</span>
          <span className="pc-spacer" />
          {card.hp != null && (
            <span className="pc-hp">
              HP<b>{card.hp}</b>
            </span>
          )}
          {card.type && <EnergyIcon type={card.type} className="pc-type" />}
        </header>

        {card.category && <div className="pc-category">{card.category}</div>}

        <div className="pc-art">
          {card.image ? (
            <img src={card.image} alt={card.name} loading="lazy" />
          ) : (
            <div className="pc-art__ph" aria-hidden>
              {card.name.slice(0, 2)}
            </div>
          )}
        </div>

        <div className="pc-body">
          {card.ability && (
            <div className="pc-ability">
              <div className="pc-ability__head">
                <span className="pc-tag pc-tag--ability">
                  {card.ability.label ?? '특성'}
                </span>
                <span className="pc-ability__name">{card.ability.name}</span>
              </div>
              <p className="pc-text">{card.ability.text}</p>
            </div>
          )}

          {attacks.map((atk, i) => (
            <div className="pc-attack" key={i}>
              <div className="pc-attack__head">
                <span className="pc-cost">
                  {atk.cost.length === 0 ? (
                    <EnergyIcon type="colorless" />
                  ) : (
                    atk.cost.map((c, j) => <EnergyIcon key={j} type={c} />)
                  )}
                </span>
                <span className="pc-attack__name">{atk.name}</span>
                {atk.damage && (
                  <span className="pc-attack__dmg">{atk.damage}</span>
                )}
              </div>
              {atk.text && <p className="pc-text">{atk.text}</p>}
            </div>
          ))}

          {!card.ability && attacks.length === 0 && card.description && (
            <p className="pc-text pc-text--flavor">{card.description}</p>
          )}
        </div>

        <div className="pc-stats">
          <div className="pc-stats__cell">
            <span className="pc-stats__label">약점</span>
            {card.weakness ? (
              <span className="pc-stats__val">
                <EnergyIcon type={card.weakness.type} />
                {card.weakness.value}
              </span>
            ) : (
              <span className="pc-stats__val pc-muted">—</span>
            )}
          </div>
          <div className="pc-stats__cell">
            <span className="pc-stats__label">저항</span>
            {card.resistance ? (
              <span className="pc-stats__val">
                {card.resistance.type && (
                  <EnergyIcon type={card.resistance.type} />
                )}
                {card.resistance.value}
              </span>
            ) : (
              <span className="pc-stats__val pc-muted">—</span>
            )}
          </div>
          <div className="pc-stats__cell">
            <span className="pc-stats__label">후퇴</span>
            <span className="pc-stats__val">
              {card.retreat && card.retreat > 0 ? (
                Array.from({ length: card.retreat }).map((_, i) => (
                  <EnergyIcon key={i} type="colorless" />
                ))
              ) : (
                <span className="pc-muted">—</span>
              )}
            </span>
          </div>
        </div>

        <footer className="pc-foot">
          <span className="pc-illus">
            {card.illustrator ? `Illus. ${card.illustrator}` : ''}
          </span>
          <span className="pc-foot__right">
            {card.set && <span className="pc-set">{card.set}</span>}
            {card.number && <span className="pc-number">{card.number}</span>}
            <span className="pc-mark">{card.mark ?? RARITY_LABEL[card.rarity]}</span>
          </span>
        </footer>

        {card.flavorText && (
          <div className="pc-flavor">
            {card.flavorTitle && (
              <div className="pc-flavor__title">{card.flavorTitle}</div>
            )}
            <div className="pc-flavor__text">{card.flavorText}</div>
          </div>
        )}
      </div>

      {isNew && <span className="pcard__badge pcard__badge--new">NEW</span>}
      {typeof count === 'number' && count > 1 && (
        <span className="pcard__badge pcard__badge--count">×{count}</span>
      )}
    </div>
  )
}

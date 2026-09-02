import { PACKS } from '../data/packs'
import type { PackDef } from '../game/types'

interface Props {
  onOpen: (pack: PackDef) => void
}

export function PackShelf({ onOpen }: Props) {
  return (
    <div className="shelf">
      {PACKS.map((pack) => (
        <button
          key={pack.id}
          className="packcard"
          onClick={() => onOpen(pack)}
          type="button"
        >
          <div className="packcard__art">
            {pack.image ? (
              <img src={pack.image} alt={pack.name} />
            ) : (
              <span className="packcard__art-mark" aria-hidden>
                ✦
              </span>
            )}
          </div>
          <div className="packcard__info">
            <div className="packcard__name">{pack.name}</div>
            {pack.description && (
              <div className="packcard__desc">{pack.description}</div>
            )}
            <div className="packcard__cta">{pack.cardsPerPack}장 개봉 →</div>
          </div>
        </button>
      ))}
    </div>
  )
}

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
          className="pack"
          onClick={() => onOpen(pack)}
          type="button"
        >
          <div className="pack__art">
            {pack.image ? (
              <img src={pack.image} alt={pack.name} />
            ) : (
              <div className="pack__art-placeholder" aria-hidden>
                🃏
              </div>
            )}
          </div>
          <div className="pack__name">{pack.name}</div>
          {pack.description && (
            <div className="pack__desc">{pack.description}</div>
          )}
          <div className="pack__cta">{pack.cardsPerPack}장 · 열기</div>
        </button>
      ))}
    </div>
  )
}

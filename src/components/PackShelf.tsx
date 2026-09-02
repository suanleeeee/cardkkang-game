import { PACKS } from '../data/packs'
import type { PackDef } from '../game/types'

interface Props {
  onOpen: (pack: PackDef) => void
}

export function PackShelf({ onOpen }: Props) {
  return (
    <div className="pack-gallery">
      {PACKS.map((pack) => (
        <button
          key={pack.id}
          className="pack-tile"
          onClick={() => onOpen(pack)}
          type="button"
        >
          <div className="pack-tile__art">
            {pack.image ? (
              <img src={pack.image} alt={pack.name} />
            ) : (
              <span className="pack-tile__mark" aria-hidden>
                ✦
              </span>
            )}
          </div>
          <div className="pack-tile__name">{pack.name}</div>
        </button>
      ))}
    </div>
  )
}

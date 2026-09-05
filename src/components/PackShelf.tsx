import { PACKS } from '../data/packs'
import { useCollection } from '../state/collection'
import type { PackDef } from '../game/types'

interface Props {
  onOpen: (pack: PackDef) => void
}

export function PackShelf({ onOpen }: Props) {
  const { openedPacks, resetPacks } = useCollection()
  const available = PACKS.filter((pack) => !openedPacks.has(pack.id))

  if (available.length === 0) {
    return (
      <div className="pack-empty">
        <p>모든 팩을 열었어요</p>
        <button className="btn" onClick={resetPacks} type="button">
          다시 채우기
        </button>
      </div>
    )
  }

  return (
    <div
      className={
        'pack-gallery' + (available.length === 1 ? ' pack-gallery--single' : '')
      }
    >
      {available.map((pack) => (
        <button
          key={pack.id}
          className="pack-tile"
          onClick={() => onOpen(pack)}
          type="button"
          aria-label={pack.name}
          style={
            pack.color
              ? ({ ['--pack-color' as string]: pack.color } as React.CSSProperties)
              : undefined
          }
        >
          <div className="pack-tile__art">
            {pack.image ? (
              <img src={pack.image} alt={pack.name} />
            ) : (
              <span className="pack-tile__title">{pack.name}</span>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}

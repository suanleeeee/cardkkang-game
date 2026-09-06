import { useEffect, useRef } from 'react'
import { PACKS } from '../data/packs'
import { useCollection } from '../state/collection'
import {
  DEMO,
  DEMO_GALLERY_PAUSE,
  DEMO_GALLERY_PAUSE_HIDDEN,
} from '../game/demo'
import type { PackDef } from '../game/types'
import { SecretGate } from './SecretGate'

interface Props {
  onOpen: (pack: PackDef) => void
}

export function PackShelf({ onOpen }: Props) {
  const { openedPacks, resetPacks } = useCollection()

  const normalPacks = PACKS.filter((p) => !p.hidden)
  const hiddenPacks = PACKS.filter((p) => p.hidden)
  const allNormalCleared = normalPacks.every((p) => openedPacks.has(p.id))

  const available: PackDef[] = [
    ...normalPacks.filter((p) => !openedPacks.has(p.id)),
    ...(allNormalCleared
      ? hiddenPacks.filter((p) => !openedPacks.has(p.id))
      : []),
  ]

  // 시범 모드: 잠깐 팩을 보여준 뒤 자동으로 첫 팩을 연다
  const next = available[0]
  const onOpenRef = useRef(onOpen)
  onOpenRef.current = onOpen
  useEffect(() => {
    if (!DEMO || !next) return
    const t = window.setTimeout(
      () => onOpenRef.current(next),
      next.hidden ? DEMO_GALLERY_PAUSE_HIDDEN : DEMO_GALLERY_PAUSE,
    )
    return () => window.clearTimeout(t)
  }, [next])

  if (available.length === 0) {
    return <SecretGate onUnlock={resetPacks} />
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
          className={'pack-tile' + (pack.hidden ? ' pack-tile--hidden' : '')}
          onClick={() => onOpen(pack)}
          type="button"
          aria-label={pack.name}
          style={
            pack.color
              ? ({ ['--pack-color' as string]: pack.color } as React.CSSProperties)
              : undefined
          }
        >
          {pack.hidden && <span className="pack-tile__fog" aria-hidden />}
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

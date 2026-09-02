import { energyMeta } from '../game/energy'
import type { EnergyType } from '../game/types'

export function EnergyIcon({
  type,
  className,
}: {
  type: EnergyType
  className?: string
}) {
  const meta = energyMeta(type)
  return (
    <span
      className={`energy${className ? ' ' + className : ''}`}
      style={{ background: meta.color }}
      title={meta.label}
      aria-label={meta.label}
    >
      {meta.glyph}
    </span>
  )
}

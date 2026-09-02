import type { EnergyType } from './types'

interface EnergyMeta {
  label: string
  color: string
  /** 아이콘용 이모지 (플레이스홀더) */
  glyph: string
}

export const ENERGY: Record<EnergyType, EnergyMeta> = {
  grass: { label: '풀', color: '#5fa85f', glyph: '🌿' },
  fire: { label: '불꽃', color: '#e0533b', glyph: '🔥' },
  water: { label: '물', color: '#3d8fd6', glyph: '💧' },
  lightning: { label: '번개', color: '#e0b93b', glyph: '⚡' },
  psychic: { label: '초', color: '#9350b0', glyph: '🔮' },
  fighting: { label: '격투', color: '#c26a2e', glyph: '👊' },
  darkness: { label: '악', color: '#3b3f4a', glyph: '🌑' },
  metal: { label: '강철', color: '#8a94a0', glyph: '⚙️' },
  fairy: { label: '페어리', color: '#d96fae', glyph: '✨' },
  dragon: { label: '드래곤', color: '#b8892e', glyph: '🐉' },
  colorless: { label: '무색', color: '#cbb98f', glyph: '⭐' },
}

export function energyMeta(type: EnergyType): EnergyMeta {
  return ENERGY[type] ?? ENERGY.colorless
}

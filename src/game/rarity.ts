import type { Rarity } from './types'

export const RARITY_LABEL: Record<Rarity, string> = {
  normal: '일반',
  hidden: '히든',
}

/** 카드 테두리/글로우에 쓰는 색 */
export const RARITY_COLOR: Record<Rarity, string> = {
  normal: '#c9a13c',
  hidden: '#9b5de5',
}

/** 등급별 가중치 테이블에서 하나를 뽑는다 */
export function pickWeighted(
  odds: Partial<Record<Rarity, number>>,
  rng: () => number = Math.random,
): Rarity {
  const entries = Object.entries(odds).filter(([, w]) => (w ?? 0) > 0) as [
    Rarity,
    number,
  ][]
  if (entries.length === 0) return 'normal'

  const total = entries.reduce((sum, [, w]) => sum + w, 0)
  let roll = rng() * total
  for (const [rarity, weight] of entries) {
    roll -= weight
    if (roll <= 0) return rarity
  }
  return entries[entries.length - 1][0]
}

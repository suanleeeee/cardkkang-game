import type { Rarity } from './types'

export const RARITY_LABEL: Record<Rarity, string> = {
  common: '커먼',
  uncommon: '언커먼',
  rare: '레어',
  epic: '에픽',
  legendary: '레전더리',
}

/** 카드 테두리/글로우에 쓰는 색 */
export const RARITY_COLOR: Record<Rarity, string> = {
  common: '#9aa5b1',
  uncommon: '#3fb950',
  rare: '#4c8dff',
  epic: '#a371f7',
  legendary: '#f0a020',
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
  if (entries.length === 0) return 'common'

  const total = entries.reduce((sum, [, w]) => sum + w, 0)
  let roll = rng() * total
  for (const [rarity, weight] of entries) {
    roll -= weight
    if (roll <= 0) return rarity
  }
  return entries[entries.length - 1][0]
}

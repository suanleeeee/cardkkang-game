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

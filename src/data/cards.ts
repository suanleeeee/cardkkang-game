import type { CardDef } from '../game/types'

// ─────────────────────────────────────────────────────────────
// 카드 데이터
// 지금은 흐름 확인용 데모 카드입니다. 실제 카드가 준비되면
// 이 배열을 교체하거나 세트별 파일로 나눠서 합쳐주세요.
//   예) import { baseSet } from './sets/base'
//       export const CARDS = [...baseSet, ...jungleSet]
//
// image 를 비워두면 등급 색상 기반 플레이스홀더가 자동으로 그려집니다.
// 이미지는 public/cards/ 에 넣고 image: 'cards/base-001.png' 처럼 상대경로로 참조하세요.
// ─────────────────────────────────────────────────────────────

export const CARDS: CardDef[] = [
  { id: 'demo-001', name: '풀잎 정령', rarity: 'common', set: 'demo' },
  { id: 'demo-002', name: '불씨 도마뱀', rarity: 'common', set: 'demo' },
  { id: 'demo-003', name: '물방울 게', rarity: 'common', set: 'demo' },
  { id: 'demo-004', name: '바위 두더지', rarity: 'common', set: 'demo' },
  { id: 'demo-005', name: '번개 다람쥐', rarity: 'uncommon', set: 'demo' },
  { id: 'demo-006', name: '독안개 나방', rarity: 'uncommon', set: 'demo' },
  { id: 'demo-007', name: '얼음 여우', rarity: 'uncommon', set: 'demo' },
  { id: 'demo-008', name: '강철 기사', rarity: 'rare', set: 'demo' },
  { id: 'demo-009', name: '심연의 해파리', rarity: 'rare', set: 'demo' },
  { id: 'demo-010', name: '폭풍의 매', rarity: 'epic', set: 'demo' },
  { id: 'demo-011', name: '고대의 나무 정령', rarity: 'epic', set: 'demo' },
  { id: 'demo-012', name: '무지개 드래곤', rarity: 'legendary', set: 'demo' },
]

export const CARDS_BY_ID: Record<string, CardDef> = Object.fromEntries(
  CARDS.map((c) => [c.id, c]),
)

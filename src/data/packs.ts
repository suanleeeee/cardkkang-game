import type { PackDef } from '../game/types'

// ─────────────────────────────────────────────────────────────
// 카드팩 데이터
// cardPool: 이 팩에서 나올 카드 ID 목록. 정의된 순서대로, 중복 없이
//           cardsPerPack 장까지 뽑힙니다. 비우면 전체 카드 풀 사용.
// color: 봉투/카드 뒷면 배경 그라데이션의 기준색.
// ─────────────────────────────────────────────────────────────

export const PACKS: PackDef[] = [
  {
    id: 'eunpyeong',
    name: '전통의 은평구',
    short: '은평',
    description: '은평구 카드 3장 구성.',
    color: '#e07b2c', // 주황
    cardsPerPack: 3,
    cardPool: ['eunpyeong-1', 'eunpyeong-2', 'eunpyeong-3'],
  },
  {
    id: 'gwanggyo',
    name: '미래의 광교',
    short: '광교',
    description: '광교 카드 3장 구성.',
    color: '#3b7fd4', // 파랑
    cardsPerPack: 3,
    cardPool: ['gwanggyo-1', 'gwanggyo-2', 'gwanggyo-3'],
  },
]

export const PACKS_BY_ID: Record<string, PackDef> = Object.fromEntries(
  PACKS.map((p) => [p.id, p]),
)

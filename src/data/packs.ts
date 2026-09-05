import type { PackDef } from '../game/types'

// ─────────────────────────────────────────────────────────────
// 카드팩 데이터
// slots: 팩에서 카드가 뽑히는 "자리"마다 등급 확률을 정의합니다.
// cardsPerPack 이 slots 보다 많으면 마지막 슬롯 규칙을 반복 사용합니다.
// cardPool 을 지정하면 그 카드들 중에서만 뽑고, 비우면 전체 카드에서 뽑습니다.
// color: 봉투/카드 뒷면 배경 그라데이션의 기준색.
// 등급: normal(일반) / hidden(히든)
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
    slots: [
      { odds: { normal: 1 } },
      { odds: { normal: 1 } },
      { odds: { normal: 0.7, hidden: 0.3 } },
    ],
  },
  {
    id: 'gwanggyo',
    name: '미래의 광교',
    short: '광교',
    description: '광교 카드 3장 구성.',
    color: '#3b7fd4', // 파랑
    cardsPerPack: 3,
    cardPool: ['gwanggyo-1', 'gwanggyo-2', 'gwanggyo-3'],
    slots: [
      { odds: { normal: 1 } },
      { odds: { normal: 1 } },
      { odds: { normal: 0.7, hidden: 0.3 } },
    ],
  },
]

export const PACKS_BY_ID: Record<string, PackDef> = Object.fromEntries(
  PACKS.map((p) => [p.id, p]),
)

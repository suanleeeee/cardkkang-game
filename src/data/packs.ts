import type { PackDef } from '../game/types'

// ─────────────────────────────────────────────────────────────
// 카드팩 데이터
// slots: 팩에서 카드가 뽑히는 "자리"마다 등급 확률을 정의합니다.
// cardsPerPack 이 slots 보다 많으면 마지막 슬롯 규칙을 반복 사용합니다.
// cardPool 을 지정하면 그 카드들 중에서만 뽑고, 비우면 전체 카드에서 뽑습니다.
// 등급: normal(일반) / hidden(히든)
// ─────────────────────────────────────────────────────────────

export const PACKS: PackDef[] = [
  {
    id: 'demo-pack',
    name: '데모 부스터팩',
    description: '카드 3장 구성. 마지막 장에서 히든 찬스.',
    cardsPerPack: 3,
    slots: [
      { odds: { normal: 1 } },
      { odds: { normal: 1 } },
      { odds: { normal: 0.9, hidden: 0.1 } },
    ],
  },
  {
    id: 'demo-premium',
    name: '프리미엄 팩',
    description: '히든 확률이 크게 올라간 3장 구성.',
    cardsPerPack: 3,
    slots: [
      { odds: { normal: 1 } },
      { odds: { normal: 0.65, hidden: 0.35 } },
      { odds: { normal: 0.35, hidden: 0.65 } },
    ],
  },
]

export const PACKS_BY_ID: Record<string, PackDef> = Object.fromEntries(
  PACKS.map((p) => [p.id, p]),
)

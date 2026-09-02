import type { PackDef } from '../game/types'

// ─────────────────────────────────────────────────────────────
// 카드팩 데이터
// slots: 팩에서 카드가 뽑히는 "자리"마다 등급 확률을 정의합니다.
// cardsPerPack 이 slots 보다 많으면 마지막 슬롯 규칙을 반복 사용합니다.
// cardPool 을 지정하면 그 카드들 중에서만 뽑고, 비우면 전체 카드에서 뽑습니다.
// ─────────────────────────────────────────────────────────────

export const PACKS: PackDef[] = [
  {
    id: 'demo-pack',
    name: '데모 부스터팩',
    description: '흐름 확인용 기본 팩. 카드 5장이 들어 있습니다.',
    cardsPerPack: 5,
    slots: [
      { odds: { common: 1 } },
      { odds: { common: 1 } },
      { odds: { common: 0.7, uncommon: 0.3 } },
      { odds: { uncommon: 0.75, rare: 0.25 } },
      { odds: { rare: 0.7, epic: 0.25, legendary: 0.05 } },
    ],
  },
  {
    id: 'demo-premium',
    name: '프리미엄 팩',
    description: '고등급 확률이 크게 올라간 팩.',
    cardsPerPack: 5,
    slots: [
      { odds: { common: 0.6, uncommon: 0.4 } },
      { odds: { uncommon: 1 } },
      { odds: { uncommon: 0.5, rare: 0.5 } },
      { odds: { rare: 0.6, epic: 0.4 } },
      { odds: { epic: 0.6, legendary: 0.4 } },
    ],
  },
]

export const PACKS_BY_ID: Record<string, PackDef> = Object.fromEntries(
  PACKS.map((p) => [p.id, p]),
)

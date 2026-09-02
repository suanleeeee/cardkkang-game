// 카드깡 게임 도메인 타입 정의
// 카드/팩 데이터는 src/data/ 에서 이 타입에 맞춰 추가합니다.

export type Rarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'

export const RARITY_ORDER: Rarity[] = [
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary',
]

export interface CardDef {
  /** 고유 ID (예: "base-001") */
  id: string
  /** 카드 이름 */
  name: string
  rarity: Rarity
  /** 이미지 경로 또는 URL. 없으면 자동 플레이스홀더가 표시됩니다. */
  image?: string
  /** 카드 설명/플레이버 텍스트 */
  description?: string
  /** 소속 세트/시리즈 ID */
  set?: string
}

/** 팩의 한 장(슬롯)에 대한 등급별 확률 가중치 */
export interface RaritySlot {
  odds: Partial<Record<Rarity, number>>
}

export interface PackDef {
  /** 고유 ID (예: "base-pack") */
  id: string
  name: string
  description?: string
  /** 팩 아트워크 경로/URL */
  image?: string
  /** 한 팩에서 나오는 카드 수 (slots.length 와 일치시켜도 되고, 부족하면 마지막 슬롯 규칙을 반복 사용) */
  cardsPerPack: number
  /** 이 팩에서 나올 수 있는 카드 ID 목록. 비우면 전체 카드 풀 사용 */
  cardPool?: string[]
  /** 슬롯별 등급 확률 테이블 */
  slots: RaritySlot[]
}

/** 팩을 열어서 나온 카드 1장의 결과 */
export interface PulledCard {
  card: CardDef
  /** 이번 팩에서 처음 획득한 카드인지 */
  isNew: boolean
}

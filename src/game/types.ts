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

/** 에너지(속성) 타입 — 카드 우상단 아이콘, 기술 코스트, 약점/저항에 사용 */
export type EnergyType =
  | 'grass'
  | 'fire'
  | 'water'
  | 'lightning'
  | 'psychic'
  | 'fighting'
  | 'darkness'
  | 'metal'
  | 'fairy'
  | 'dragon'
  | 'colorless'

/** 특성 (샘플 카드의 "마음의 정원") */
export interface Ability {
  /** 라벨. 기본값 "특성" */
  label?: string
  name: string
  text: string
}

/** 기술 (샘플 카드의 "고즈넉한 쉼터") */
export interface Attack {
  /** 에너지 코스트 아이콘들 */
  cost: EnergyType[]
  name: string
  /** 데미지 표기 ("120", "50+", "30×" 등) — 없으면 표시 안 함 */
  damage?: string
  text?: string
}

export interface Weakness {
  type: EnergyType
  value: string // "×2"
}

export interface Resistance {
  type?: EnergyType
  value: string // "-30" 또는 자유 텍스트 ("번뇌삭제")
}

export interface CardDef {
  /** 고유 ID (예: "base-001") */
  id: string
  /** 카드 이름 */
  name: string
  rarity: Rarity
  /** 사진/일러스트 경로 또는 URL. 없으면 자동 플레이스홀더가 표시됩니다. */
  image?: string
  /** 소속 세트/시리즈 ID */
  set?: string

  // ── 포켓몬 카드 스타일 필드 (모두 선택) ─────────────
  /** 좌상단 뱃지. 기본값 "기본" */
  stage?: string
  /** 우상단 카테고리 배너 (샘플의 "사찰") */
  category?: string
  /** 체력 */
  hp?: number
  /** 주 속성 (우상단 아이콘) */
  type?: EnergyType
  ability?: Ability
  attacks?: Attack[]
  weakness?: Weakness
  resistance?: Resistance
  /** 후퇴 비용 (무색 에너지 개수) */
  retreat?: number
  /** 일러스트레이터 크레딧 */
  illustrator?: string
  /** 카드 번호 ("099/071") */
  number?: string
  /** 등급 약어 ("UR", "RR", "SR" 등) */
  mark?: string
  /** 하단 플레이버 박스 제목 */
  flavorTitle?: string
  /** 하단 플레이버 박스 본문 */
  flavorText?: string

  /** (구버전 호환) 자유 설명 */
  description?: string
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
  /** 한 팩에서 나오는 카드 수 */
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

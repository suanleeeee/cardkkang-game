import type { CardDef } from '../game/types'

// ─────────────────────────────────────────────────────────────
// 카드 데이터 — 광교 세트 / 은평구 세트
// rarity: 'normal'(일반) | 'hidden'(히든)
// image 를 비워두면 이름 첫 두 글자 플레이스홀더가 그려집니다.
// 이미지는 public/cards/ 에 넣고 image: 'cards/gwanggyo-1.png' 처럼 참조하세요.
// 필드 설명은 src/data/README.md 참고.
// ─────────────────────────────────────────────────────────────

const gwanggyo: CardDef[] = [
  {
    id: 'gwanggyo-1',
    name: '광교 1',
    rarity: 'normal',
    set: 'gwanggyo',
    stage: '기본',
    category: '광교',
    hp: 90,
    type: 'water',
    attacks: [{ cost: ['water'], name: '호수 산책', damage: '20' }],
    weakness: { type: 'lightning', value: '×2' },
    retreat: 1,
    number: '001/006',
  },
  {
    id: 'gwanggyo-2',
    name: '광교 2',
    rarity: 'normal',
    set: 'gwanggyo',
    stage: '기본',
    category: '광교',
    hp: 110,
    type: 'water',
    attacks: [{ cost: ['water', 'colorless'], name: '유리 타워', damage: '40' }],
    weakness: { type: 'lightning', value: '×2' },
    retreat: 2,
    number: '002/006',
  },
  {
    id: 'gwanggyo-3',
    name: '광교 3',
    rarity: 'hidden',
    set: 'gwanggyo',
    stage: '기본',
    category: '광교',
    hp: 180,
    type: 'water',
    ability: {
      name: '미래도시',
      text: '이 포켓몬이 배틀에 있는 한, 자신의 광교 포켓몬의 최대 HP가 20 늘어난다.',
    },
    attacks: [
      { cost: ['water', 'water', 'colorless'], name: '스카이라인', damage: '130' },
    ],
    weakness: { type: 'lightning', value: '×2' },
    retreat: 2,
    number: '003/006',
    mark: 'H',
  },
]

const eunpyeong: CardDef[] = [
  {
    id: 'eunpyeong-1',
    name: '은평 1',
    rarity: 'normal',
    set: 'eunpyeong',
    stage: '기본',
    category: '은평구',
    hp: 90,
    type: 'grass',
    attacks: [{ cost: ['grass'], name: '한옥 처마', damage: '20' }],
    weakness: { type: 'fire', value: '×2' },
    retreat: 1,
    number: '004/006',
  },
  {
    id: 'eunpyeong-2',
    name: '은평 2',
    rarity: 'normal',
    set: 'eunpyeong',
    stage: '기본',
    category: '은평구',
    hp: 110,
    type: 'grass',
    attacks: [{ cost: ['grass', 'colorless'], name: '고즈넉한 쉼터', damage: '40' }],
    weakness: { type: 'fire', value: '×2' },
    retreat: 2,
    number: '005/006',
  },
  {
    id: 'eunpyeong-3',
    name: '은평 3',
    rarity: 'hidden',
    set: 'eunpyeong',
    stage: '기본',
    category: '은평구',
    hp: 190,
    type: 'grass',
    ability: {
      name: '오랜 뿌리',
      text: '이 포켓몬은 특수 상태에 걸리지 않는다.',
    },
    attacks: [
      { cost: ['grass', 'grass', 'colorless'], name: '북한산 능선', damage: '130' },
    ],
    weakness: { type: 'fire', value: '×2' },
    retreat: 3,
    number: '006/006',
    mark: 'H',
  },
]

// 히든 보스 — 두 팩을 모두 연 뒤에만 등장하는 팩에서 나온다
const hidden: CardDef[] = [
  {
    id: 'hidden-boss',
    name: '???',
    rarity: 'hidden',
    set: 'hidden',
    stage: '기본',
    category: '히든 보스',
    hp: 300,
    type: 'darkness',
    ability: {
      name: '안개의 군림',
      text: '이 포켓몬이 배틀에 있는 한, 상대는 안개 밖으로 나갈 수 없다.',
    },
    attacks: [
      {
        cost: ['darkness', 'darkness', 'colorless'],
        name: '심연',
        damage: '200',
        text: '상대 벤치 포켓몬 1마리에게도 50 데미지.',
      },
    ],
    weakness: { type: 'fairy', value: '×2' },
    retreat: 4,
    number: '000/006',
    mark: '★',
    flavorTitle: '???',
    flavorText: '안개 속에서 계속 지켜보고 있었다.',
  },
]

export const CARDS: CardDef[] = [...gwanggyo, ...eunpyeong, ...hidden]

export const CARDS_BY_ID: Record<string, CardDef> = Object.fromEntries(
  CARDS.map((c) => [c.id, c]),
)

# 카드 · 팩 데이터 추가 가이드

## 1. 카드 추가 — `cards.ts`

`CARDS` 배열에 `CardDef` 객체를 넣습니다. 포켓몬 카드 스타일 필드는 모두 선택이며,
없는 필드는 카드에서 자동으로 생략됩니다.

```ts
{
  id: 'base-001',              // 고유 ID (중복 금지)
  name: '진관사 jeol',
  rarity: 'hidden',            // 'normal'(일반) | 'hidden'(히든)
  image: 'cards/base-001.png', // public/cards/base-001.png (없으면 글자 플레이스홀더)
  set: 'svSk',

  // ── 카드 표시용 (선택) ──
  stage: '기본',               // 좌상단 뱃지 (기본값 "기본")
  category: '사찰',            // 우상단 배너
  hp: 220,
  type: 'fighting',            // grass|fire|water|lightning|psychic|fighting|darkness|metal|fairy|dragon|colorless
  ability: { name: '마음의 정원', text: '...' },        // 특성 (label 로 이름 변경 가능)
  attacks: [
    { cost: ['fighting', 'grass', 'colorless'], name: '고즈넉한 쉼터', damage: '', text: '번뇌에 도움 많이 된다.' },
  ],
  weakness: { type: 'fire', value: '×2' },
  resistance: { value: '번뇌삭제' },                    // type 은 선택
  retreat: 2,                                           // 무색 에너지 개수
  illustrator: 'takuyoa',
  number: '099/071',
  mark: 'UR',                                           // 등급 약어
  flavorTitle: '진관 jeol 룸',                          // 하단 플레이버 박스
  flavorText: '의미부여ㄴㄴ 일단존재ㄱㄱ',
}
```

카드가 많아지면 세트별 파일로 나누세요.

```ts
// src/data/sets/base.ts
export const baseSet: CardDef[] = [ /* ... */ ]

// src/data/cards.ts
import { baseSet } from './sets/base'
export const CARDS: CardDef[] = [...baseSet]
```

## 2. 이미지

`public/cards/` 에 파일을 두고 `image: 'cards/파일명.png'` 로 참조합니다.
(원격 URL 도 가능하지만 CORS·수명에 주의)

## 3. 팩 추가 — `packs.ts`

```ts
{
  id: 'eunpyeong',
  name: '전통의 은평구',
  short: '은평',                            // 카드 뒷면에 찍히는 짧은 이름
  color: '#e07b2c',                        // 봉투·카드 뒷면 배경색 (hex)
  cardsPerPack: 3,
  cardPool: ['eunpyeong-1', 'eunpyeong-2', 'eunpyeong-3'],
}
```

- `cardPool`: 이 팩에서 나올 카드 ID 목록. **정의된 순서대로, 중복 없이** `cardsPerPack` 장까지 뽑힙니다. 생략 시 전체 카드 풀을 순서대로 사용.
- `color`: 지정하면 봉투·카드 뒷면 그라데이션이 그 색으로 바뀝니다. 생략 시 금색.
- `short`: 카드 뒷면 라벨. 생략 시 `name`.
- `hidden: true`: 다른 모든 일반 팩을 개봉한 뒤에만 홈에 안개와 함께 등장 (히든 보스).
- `instant: true`: 뜯기 연출 없이 바로 카드가 나오고, 탭하면 뒤집힘.
- 일반 개봉은 한 장씩 탭/스와이프로 넘기며 공개합니다.

## 4. 현재 데이터

`cards.ts` 는 `gwanggyo` / `eunpyeong` 세트(각 3장) + 히든 보스(`hidden-boss`)로 구성.
`packs.ts` 는 두 일반 팩 + `hidden: true, instant: true` 인 `???` 팩.
두 일반 팩을 모두 열면 히든 팩이 등장합니다.
새 세트를 추가할 때 같은 패턴(세트 배열 + 전용 팩)을 따르면 됩니다.
`localStorage` 컬렉션은 `localStorage.removeItem('cardkkang.collection.v1')` 로 리셋합니다.

## 5. 에너지 아이콘

`src/game/energy.ts` 에서 타입별 색상·라벨·이모지를 정의합니다.
지금은 이모지 플레이스홀더이며, 전용 아이콘(SVG)으로 교체하면 됩니다.

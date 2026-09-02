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

`slots` 는 "카드가 뽑히는 자리"마다의 등급 확률표입니다.
가중치는 합이 1이 아니어도 되며 상대 비율로 계산됩니다.

```ts
{
  id: 'base-pack',
  name: '베이스 세트 부스터',
  cardsPerPack: 3,
  cardPool: ['base-001', 'base-002', /* ... */], // 생략 시 전체 카드
  slots: [
    { odds: { normal: 1 } },
    { odds: { normal: 1 } },
    { odds: { normal: 0.9, hidden: 0.1 } }, // "히든 찬스" 슬롯
  ],
}
```

- `cardsPerPack` 이 `slots` 길이보다 크면 **마지막 슬롯 규칙을 반복**합니다.
- 지정한 등급의 카드가 풀에 없으면 hidden → normal 순으로 대체합니다.
- 개봉은 한 장씩 옆으로 넘기며 공개하는 방식입니다.

## 4. 데모 데이터 제거

실제 데이터가 준비되면 `cards.ts` / `packs.ts` 의 `demo-*` 항목을 지우면 됩니다.
`localStorage` 컬렉션은 도감 탭의 "초기화" 버튼으로 리셋할 수 있습니다.

## 5. 에너지 아이콘

`src/game/energy.ts` 에서 타입별 색상·라벨·이모지를 정의합니다.
지금은 이모지 플레이스홀더이며, 전용 아이콘(SVG)으로 교체하면 됩니다.

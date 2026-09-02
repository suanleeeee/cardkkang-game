# 카드 · 팩 데이터 추가 가이드

## 1. 카드 추가 — `cards.ts`

`CARDS` 배열에 `CardDef` 객체를 넣습니다.

```ts
{
  id: 'base-001',          // 고유 ID (중복 금지)
  name: '리자몽',
  rarity: 'legendary',     // common | uncommon | rare | epic | legendary
  image: 'cards/base-001.png',  // public/cards/base-001.png  (없으면 자동 플레이스홀더)
  description: '불꽃 도마뱀이 진화한 모습.',
  set: 'base',
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
  cardsPerPack: 5,
  cardPool: ['base-001', 'base-002', /* ... */], // 생략 시 전체 카드
  slots: [
    { odds: { common: 1 } },
    { odds: { common: 1 } },
    { odds: { common: 1 } },
    { odds: { uncommon: 1 } },
    { odds: { rare: 0.9, epic: 0.09, legendary: 0.01 } }, // "레어 슬롯"
  ],
}
```

- `cardsPerPack` 이 `slots` 길이보다 크면 **마지막 슬롯 규칙을 반복**합니다.
- 지정한 등급의 카드가 풀에 없으면 높은 등급 → 낮은 등급 순으로 대체합니다.

## 4. 데모 데이터 제거

실제 데이터가 준비되면 `cards.ts` / `packs.ts` 의 `demo-*` 항목을 지우면 됩니다.
`localStorage` 컬렉션은 앱 하단 "컬렉션 초기화" 버튼으로 리셋할 수 있습니다.

# 카드깡 게임

카드팩을 뜯어 카드를 모으는 웹 게임입니다. (포켓몬 카드 게임 앱류의 팩 오프닝 시뮬레이터)

- **스택**: React 18 + Vite + TypeScript
- **저장**: 브라우저 `localStorage` (컬렉션/개봉 횟수)
- **카드/팩 데이터**: `src/data/` 에서 코드로 추가 (서버 불필요)

## 개발

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.

```bash
npm run build     # 타입 체크 + 프로덕션 빌드 (dist/)
npm run preview   # 빌드 결과 미리보기
```

## 프로젝트 구조

```
src/
  game/
    types.ts       카드/팩 도메인 타입
    rarity.ts      등급 라벨·색상, 가중치 추첨
    openPack.ts    팩 개봉 로직
  data/
    cards.ts       카드 정의 (지금은 데모 카드)
    packs.ts       팩 정의 (슬롯별 등급 확률)
  state/
    collection.tsx 컬렉션 상태 + localStorage
  components/
    PackShelf.tsx    팩 목록
    PackOpening.tsx  개봉 연출(뜯기 → 뒤집기 → 결과)
    Collection.tsx   도감
    CardView.tsx     카드 한 장 렌더
```

## 카드·팩 추가하기

`src/data/README.md` 참고. 요약:

1. `src/data/cards.ts` 의 `CARDS` 배열에 카드 추가 (이미지는 `public/cards/`).
2. `src/data/packs.ts` 의 `PACKS` 배열에 팩 추가 (`slots` 로 등급 확률 정의).

## GitHub Pages 배포

`main` 브랜치에 push 하면 `.github/workflows/deploy.yml` 이 자동 빌드·배포합니다.
저장소 **Settings → Pages → Source** 를 **GitHub Actions** 로 설정하세요.

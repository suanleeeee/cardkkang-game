// 시범 영상용 자동 진행 모드. URL 에 ?demo 붙이면 켜진다.
// (예: https://suanleeeee.github.io/cardkkang-game/?demo)
// 전체 흐름이 탭 없이 자동으로 굴러가며, 대략 50~60초에 한 바퀴 돈다.

export const DEMO =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('demo')

// 자동 진행 대기 시간(ms)
export const DEMO_GALLERY_PAUSE = 4000 // 홈에서 팩 보고 있다가 자동으로 여는 시간
export const DEMO_GALLERY_PAUSE_HIDDEN = 4500 // 히든 팩은 조금 더 감상
export const DEMO_SEALED_PAUSE = 3500 // 대기화면에서 자동으로 뜯기까지
export const DEMO_GATE_HOLD = 4000 // 암전 시크릿 게이트에서 자동으로 넘어가기까지

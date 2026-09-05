import { useRef } from 'react'

/**
 * 모든 팩을 연 뒤 나오는 암전 화면.
 * 아무 표시 없이 검은 화면이며, 17번 클릭하면 팩 화면으로 넘어간다(시크릿 코드).
 */
export function SecretGate({ onUnlock }: { onUnlock: () => void }) {
  const taps = useRef(0)

  return (
    <div
      className="secret-gate"
      aria-hidden
      onClick={() => {
        taps.current += 1
        if (taps.current >= 17) {
          taps.current = 0
          onUnlock()
        }
      }}
    />
  )
}

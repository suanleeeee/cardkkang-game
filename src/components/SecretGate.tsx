import { useEffect, useRef } from 'react'
import { DEMO, DEMO_GATE_HOLD } from '../game/demo'

/**
 * 모든 팩을 연 뒤 나오는 암전 화면.
 * 아무 표시 없이 검은 화면이며, 17번 클릭하면 팩 화면으로 넘어간다(시크릿 코드).
 * 시범 모드에서는 잠깐 있다가 자동으로 넘어간다.
 */
export function SecretGate({ onUnlock }: { onUnlock: () => void }) {
  const taps = useRef(0)
  const onUnlockRef = useRef(onUnlock)
  onUnlockRef.current = onUnlock

  useEffect(() => {
    if (!DEMO) return
    const t = window.setTimeout(() => onUnlockRef.current(), DEMO_GATE_HOLD)
    return () => window.clearTimeout(t)
  }, [])

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

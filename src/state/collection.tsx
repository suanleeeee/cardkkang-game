import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { PulledCard } from '../game/types'

const STORAGE_KEY = 'cardkkang.collection.v1'

/** cardId -> 보유 수량 */
type CollectionMap = Record<string, number>

interface CollectionContextValue {
  counts: CollectionMap
  totalOwned: number
  uniqueOwned: number
  packsOpened: number
  /** 이미 뜯은(개봉한) 팩 ID 집합 */
  openedPacks: Set<string>
  has: (cardId: string) => boolean
  countOf: (cardId: string) => number
  addPull: (pulled: PulledCard[]) => void
  markPackOpened: (packId: string) => void
  /** 뜯은 팩 목록만 초기화 (카드 컬렉션은 유지) */
  resetPacks: () => void
  reset: () => void
}

const CollectionContext = createContext<CollectionContextValue | null>(null)

interface PersistShape {
  counts: CollectionMap
  packsOpened: number
  openedPacks: string[]
}

function load(): PersistShape {
  const empty: PersistShape = { counts: {}, packsOpened: 0, openedPacks: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return empty
    const parsed = JSON.parse(raw) as Partial<PersistShape>
    return {
      counts: parsed.counts ?? {},
      packsOpened: parsed.packsOpened ?? 0,
      openedPacks: parsed.openedPacks ?? [],
    }
  } catch {
    return empty
  }
}

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistShape>(() => load())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* 저장 실패는 무시 (프라이빗 모드 등) */
    }
  }, [state])

  const addPull = useCallback((pulled: PulledCard[]) => {
    setState((prev) => {
      const counts = { ...prev.counts }
      for (const { card } of pulled) {
        counts[card.id] = (counts[card.id] ?? 0) + 1
      }
      return { ...prev, counts, packsOpened: prev.packsOpened + 1 }
    })
  }, [])

  const markPackOpened = useCallback((packId: string) => {
    setState((prev) =>
      prev.openedPacks.includes(packId)
        ? prev
        : { ...prev, openedPacks: [...prev.openedPacks, packId] },
    )
  }, [])

  const resetPacks = useCallback(() => {
    setState((prev) => ({ ...prev, openedPacks: [] }))
  }, [])

  const reset = useCallback(() => {
    setState({ counts: {}, packsOpened: 0, openedPacks: [] })
  }, [])

  const value = useMemo<CollectionContextValue>(() => {
    const entries = Object.entries(state.counts).filter(([, n]) => n > 0)
    return {
      counts: state.counts,
      totalOwned: entries.reduce((sum, [, n]) => sum + n, 0),
      uniqueOwned: entries.length,
      packsOpened: state.packsOpened,
      openedPacks: new Set(state.openedPacks),
      has: (id) => (state.counts[id] ?? 0) > 0,
      countOf: (id) => state.counts[id] ?? 0,
      addPull,
      markPackOpened,
      resetPacks,
      reset,
    }
  }, [state, addPull, markPackOpened, resetPacks, reset])

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCollection(): CollectionContextValue {
  const ctx = useContext(CollectionContext)
  if (!ctx) throw new Error('useCollection must be used within CollectionProvider')
  return ctx
}

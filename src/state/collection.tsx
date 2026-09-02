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
  has: (cardId: string) => boolean
  countOf: (cardId: string) => number
  addPull: (pulled: PulledCard[]) => void
  reset: () => void
}

const CollectionContext = createContext<CollectionContextValue | null>(null)

interface PersistShape {
  counts: CollectionMap
  packsOpened: number
}

function load(): PersistShape {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { counts: {}, packsOpened: 0 }
    const parsed = JSON.parse(raw) as Partial<PersistShape>
    return {
      counts: parsed.counts ?? {},
      packsOpened: parsed.packsOpened ?? 0,
    }
  } catch {
    return { counts: {}, packsOpened: 0 }
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
      return { counts, packsOpened: prev.packsOpened + 1 }
    })
  }, [])

  const reset = useCallback(() => {
    setState({ counts: {}, packsOpened: 0 })
  }, [])

  const value = useMemo<CollectionContextValue>(() => {
    const entries = Object.entries(state.counts).filter(([, n]) => n > 0)
    return {
      counts: state.counts,
      totalOwned: entries.reduce((sum, [, n]) => sum + n, 0),
      uniqueOwned: entries.length,
      packsOpened: state.packsOpened,
      has: (id) => (state.counts[id] ?? 0) > 0,
      countOf: (id) => state.counts[id] ?? 0,
      addPull,
      reset,
    }
  }, [state, addPull, reset])

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

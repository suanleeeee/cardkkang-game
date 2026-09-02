import { useState } from 'react'
import { PackShelf } from './components/PackShelf'
import { PackOpening } from './components/PackOpening'
import { Collection } from './components/Collection'
import { useCollection } from './state/collection'
import type { PackDef } from './game/types'

type Tab = 'shop' | 'collection'

export default function App() {
  const [tab, setTab] = useState<Tab>('shop')
  const [opening, setOpening] = useState<PackDef | null>(null)
  const { packsOpened, totalOwned, uniqueOwned, reset } = useCollection()

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">카드깡 게임</h1>
        <nav className="app__tabs">
          <button
            className={tab === 'shop' ? 'is-active' : ''}
            onClick={() => setTab('shop')}
            type="button"
          >
            팩 열기
          </button>
          <button
            className={tab === 'collection' ? 'is-active' : ''}
            onClick={() => setTab('collection')}
            type="button"
          >
            도감
          </button>
        </nav>
      </header>

      {!opening && (
        <div className="app__stats">
          <span>개봉한 팩 {packsOpened}</span>
          <span>보유 카드 {totalOwned}</span>
          <span>도감 {uniqueOwned}</span>
        </div>
      )}

      <main className="app__main">
        {opening ? (
          <PackOpening pack={opening} onDone={() => setOpening(null)} />
        ) : tab === 'shop' ? (
          <PackShelf onOpen={setOpening} />
        ) : (
          <Collection />
        )}
      </main>

      <footer className="app__footer">
        <button
          className="btn btn--ghost"
          onClick={() => {
            if (confirm('컬렉션을 모두 초기화할까요?')) reset()
          }}
          type="button"
        >
          컬렉션 초기화
        </button>
      </footer>
    </div>
  )
}

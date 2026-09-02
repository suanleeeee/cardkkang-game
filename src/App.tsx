import { useState } from 'react'
import { PackShelf } from './components/PackShelf'
import { PackOpening } from './components/PackOpening'
import { Collection } from './components/Collection'
import { CardDetail } from './components/CardDetail'
import { useCollection } from './state/collection'
import type { CardDef, PackDef } from './game/types'

type Tab = 'shop' | 'collection'

export default function App() {
  const [tab, setTab] = useState<Tab>('shop')
  const [opening, setOpening] = useState<PackDef | null>(null)
  const [detail, setDetail] = useState<CardDef | null>(null)
  const { packsOpened, totalOwned, uniqueOwned } = useCollection()

  return (
    <div className="phone">
      <header className="topbar">
        <h1 className="topbar__title">카드깡</h1>
        {!opening && (
          <div className="topbar__stats">
            <span>팩 {packsOpened}</span>
            <span>카드 {totalOwned}</span>
            <span>도감 {uniqueOwned}</span>
          </div>
        )}
      </header>

      <main className="screen">
        {opening ? (
          <PackOpening
            pack={opening}
            onDone={() => setOpening(null)}
            onInspect={setDetail}
          />
        ) : tab === 'shop' ? (
          <PackShelf onOpen={setOpening} />
        ) : (
          <Collection onInspect={setDetail} />
        )}
      </main>

      {!opening && (
        <nav className="tabbar">
          <button
            className={tab === 'shop' ? 'is-active' : ''}
            onClick={() => setTab('shop')}
            type="button"
          >
            <span className="tabbar__icon">🎴</span>
            팩 열기
          </button>
          <button
            className={tab === 'collection' ? 'is-active' : ''}
            onClick={() => setTab('collection')}
            type="button"
          >
            <span className="tabbar__icon">📖</span>
            도감
          </button>
        </nav>
      )}

      {detail && (
        <CardDetail card={detail} onClose={() => setDetail(null)} />
      )}
    </div>
  )
}

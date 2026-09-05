import { useState } from 'react'
import { PackShelf } from './components/PackShelf'
import { PackOpening } from './components/PackOpening'
import { CardDetail } from './components/CardDetail'
import type { CardDef, PackDef } from './game/types'

export default function App() {
  const [opening, setOpening] = useState<PackDef | null>(null)
  const [detail, setDetail] = useState<CardDef | null>(null)

  return (
    <div className="phone">
      <main className="screen">
        {opening ? (
          <PackOpening
            pack={opening}
            onDone={() => setOpening(null)}
            onInspect={setDetail}
          />
        ) : (
          <PackShelf onOpen={setOpening} />
        )}
      </main>

      {detail && <CardDetail card={detail} onClose={() => setDetail(null)} />}
    </div>
  )
}

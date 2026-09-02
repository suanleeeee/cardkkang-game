import { CARDS, CARDS_BY_ID } from '../data/cards'
import { pickWeighted } from './rarity'
import type { CardDef, PackDef, PulledCard, Rarity } from './types'

function resolvePool(pack: PackDef): CardDef[] {
  if (pack.cardPool && pack.cardPool.length > 0) {
    return pack.cardPool
      .map((id) => CARDS_BY_ID[id])
      .filter((c): c is CardDef => Boolean(c))
  }
  return CARDS
}

function randomOf<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]
}

/**
 * 한 슬롯의 등급을 정하고, 그 등급의 카드를 풀에서 뽑는다.
 * 해당 등급 카드가 없으면 한 단계씩 낮춰가며 대체한다.
 */
function pullOne(
  pool: CardDef[],
  slotOdds: Partial<Record<Rarity, number>>,
  rng: () => number,
): CardDef {
  const wanted = pickWeighted(slotOdds, rng)
  const fallbackOrder: Rarity[] = [
    wanted,
    'legendary',
    'epic',
    'rare',
    'uncommon',
    'common',
  ]
  for (const rarity of fallbackOrder) {
    const matches = pool.filter((c) => c.rarity === rarity)
    if (matches.length > 0) return randomOf(matches, rng)
  }
  return randomOf(pool, rng)
}

export interface OpenPackResult {
  pack: PackDef
  cards: PulledCard[]
}

/**
 * 팩을 연다. ownedIds 는 현재 보유 중인 카드 ID 집합(isNew 판정용).
 */
export function openPack(
  pack: PackDef,
  ownedIds: ReadonlySet<string> = new Set(),
  rng: () => number = Math.random,
): OpenPackResult {
  const pool = resolvePool(pack)
  if (pool.length === 0) {
    return { pack, cards: [] }
  }

  const seenThisPack = new Set<string>()
  const cards: PulledCard[] = []

  for (let i = 0; i < pack.cardsPerPack; i++) {
    const slot = pack.slots[Math.min(i, pack.slots.length - 1)]
    const card = pullOne(pool, slot.odds, rng)
    const isNew = !ownedIds.has(card.id) && !seenThisPack.has(card.id)
    seenThisPack.add(card.id)
    cards.push({ card, isNew })
  }

  return { pack, cards }
}

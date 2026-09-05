import { CARDS, CARDS_BY_ID } from '../data/cards'
import type { CardDef, PackDef, PulledCard } from './types'

function resolvePool(pack: PackDef): CardDef[] {
  if (pack.cardPool && pack.cardPool.length > 0) {
    return pack.cardPool
      .map((id) => CARDS_BY_ID[id])
      .filter((c): c is CardDef => Boolean(c))
  }
  return CARDS
}

export interface OpenPackResult {
  pack: PackDef
  cards: PulledCard[]
}

/**
 * 팩을 연다. 팩의 카드 풀을 정의된 순서대로, 중복 없이 cardsPerPack 장까지 나눠준다.
 * ownedIds 는 현재 보유 중인 카드 ID 집합(isNew 판정용).
 */
export function openPack(
  pack: PackDef,
  ownedIds: ReadonlySet<string> = new Set(),
): OpenPackResult {
  const pool = resolvePool(pack)
  const seen = new Set<string>()
  const cards: PulledCard[] = []

  for (const card of pool) {
    if (cards.length >= pack.cardsPerPack) break
    if (seen.has(card.id)) continue
    seen.add(card.id)
    cards.push({ card, isNew: !ownedIds.has(card.id) })
  }

  return { pack, cards }
}

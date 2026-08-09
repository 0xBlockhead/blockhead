import { describe, expect, it } from 'vitest'
import {
	marketAssetByKind,
	marketAssets,
	MarketAssetKind,
	marketKindByMarketKind,
	marketKinds,
	MarketKind,
} from '$/constants/Market.ts'

describe('market catalog rows', () => {
	it('derives market kind lookups from canonical rows', () => {
		expect(marketKindByMarketKind[MarketKind.Spot]).toBe(marketKinds[0])
		expect(marketKindByMarketKind[MarketKind.Perpetual].label).toBe('Perpetual')
	})

	it('derives route labels as catalog rows rather than primitive-only duplicates', () => {
		expect(marketAssetByKind[MarketAssetKind.Coin]).toBe(marketAssets[0])
		expect(marketAssetByKind[MarketAssetKind.CoinInstance].label).toBe('coin-instance')
	})
})

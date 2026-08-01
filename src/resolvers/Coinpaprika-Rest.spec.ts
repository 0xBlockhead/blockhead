import { describe, expect, it, vi } from 'vitest'

import { CoinId } from '$/constants/Coin.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const getCoins = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Coinpaprika/OpenApi/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Coinpaprika/OpenApi/queries.ts')>(),
	getCoins,
}))

const { default: coinpaprikaResolvers } = await import('$/resolvers/Coinpaprika-Rest.ts')

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('Coinpaprika coin catalog resolver', () => {
	it('emits mapped canonical selectors with structured identity fields', async () => {
		getCoins.mockResolvedValue([
			{
				id: 'eth-ethereum',
				name: 'Ethereum',
				symbol: 'eth',
			},
			{
				id: 'unknown-coin',
				name: 'Unknown Coin',
				symbol: 'unknown',
			},
			{
				id: 'btc-bitcoin',
				name: '',
				symbol: 'btc',
			},
		])
		const resolver = coinpaprikaResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType._Global
			&& '$$coins' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Coinpaprika global coin resolver is not registered')

		const rows = await resolver.resolve['Scope'].resolve({
			scope: 'global',
		}, resolverContext)

		expect(rows).toEqual([
			{
				[EntityMetaKey.Selector]: {
					coinId: CoinId.ETH,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.Coin, [], 'name')]: 'Ethereum',
					[entityFieldAddressKey(EntityType.Coin, [], 'symbol')]: 'ETH',
				},
			},
		])
	})
})

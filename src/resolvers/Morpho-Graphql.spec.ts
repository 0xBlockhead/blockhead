import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceFetch,
}))

const { default: morphoGraphql } = await import('$/resolvers/Morpho-Graphql.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 16,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const networkResolver = morphoGraphql.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
))

const market = {
	marketId: '0x9103c3b4e834476c9a62ea009ba2c884ee42e94e6e314a26f04d312434191836',
	chain: {
		id: 8453,
	},
	loanAsset: {
		address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
	},
	collateralAsset: {
		address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
	},
	lltv: '860000000000000000',
	irmAddress: '0x46415998764C29aB2a25CbeA6254146D50D22687',
	oracle: {
		address: '0x663BECd10daE6C4A3Dcd89F1d76c1174199639B9',
	},
}

describe('Morpho GraphQL resolver module', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('registers under Morpho_Graphql for Network', () => {
		expect(morphoGraphql.source).toBe(Source.Morpho_Graphql)
		expect(networkResolver).toBeDefined()
	})

	it('rejects non-eip155 networks before transport', async () => {
		if (networkResolver == null)
			throw new Error('missing Network resolver')

		await expect(
			networkResolver.resolve.Caip2.resolve({
				caip2: {
					namespace: 'solana',
					reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
				},
			}, context)
		).rejects.toThrow(`${Source.Morpho_Graphql}: network must use the eip155 CAIP-2 namespace`)
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('resolves $$morphoMarkets selectors for the requested chain', async () => {
		if (networkResolver == null)
			throw new Error('missing Network resolver')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				markets: {
					items: [
						market,
					],
				},
			},
		})))

		const network = {
			caip2: {
				namespace: 'eip155',
				reference: '8453',
			},
		}

		const snapshot = await networkResolver.resolve.Caip2.resolve(network, context)
		const markets = networkResolver.projections.Evm.$$morphoMarkets(snapshot)

		expect(markets).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					marketId: market.marketId,
				},
			},
		])
	})
})

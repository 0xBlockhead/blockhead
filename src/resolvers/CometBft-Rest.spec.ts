import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/CometBft/bindings.ts'
import { Source } from '$/sources/Source.ts'

const getBlock = vi.hoisted(() => vi.fn())

vi.mock('$/sources/CometBft/Rest/queries.ts', () => ({
	getBlock,
	getTx: vi.fn(),
}))

const { default: cometBft } = await import('$/resolvers/CometBft-Rest.ts')

const cometBftBinding = bindings[Source.CometBft_Rest]

describe('CometBFT resolver binding', () => {
	it('passes the exact canonical Cosmos Hub binding to transport', async () => {
		getBlock.mockResolvedValue({
			result: {
				block_id: {
					hash: 'block-hash',
				},
				block: {
					header: {
						proposer_address: 'proposer',
						time: '2026-01-01T00:00:00.000Z',
					},
				},
			},
		})

		const resolver = cometBft.resolvers.find((candidate) => (
			candidate.entityType === EntityType.CosmosBlock
		))
		if (resolver == null)
			throw new Error('CometBft-Rest spec missing block resolver')

		await resolver.resolve['NetworkHeight'].resolve({
			$network: {
				caip2: networkBySlug.cosmos.caip2,
			},
			height: 1n,
		}, {
			filters: [],
			sorts: [],
			pagination: {},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		})

		expect(getBlock).toHaveBeenCalledWith({
			height: 1n,
		})
	})
})

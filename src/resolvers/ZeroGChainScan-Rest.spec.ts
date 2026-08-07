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

const queries = vi.hoisted(() => ({
	getInfo: vi.fn(),
	getExplorerIdentity: vi.fn(),
	getLlmInfo: vi.fn(),
}))

vi.mock('$/sources/ZeroG/ChainScan/Rest/queries.ts', () => queries)

const { default: zeroGChainScan } = await import('$/resolvers/ZeroGChainScan-Rest.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const network = {
	slug: '0g',
} as const

describe('ZeroGChainScan_Rest resolver identity', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		queries.getExplorerIdentity.mockResolvedValue({
			url: 'https://chainscan.0g.ai',
			chainId: 16661,
			features: [
				'accounts',
				'blocks',
				'contracts',
				'transactions',
				'validators',
			],
		})
	})

	it('projects consensus network tip from explorer identity URL', async () => {
		const consensusResolver = zeroGChainScan.resolvers.find((candidate) => (
			candidate.entityType === EntityType.ZeroGConsensusNetwork
		))
		if (consensusResolver == null)
			throw new Error('missing ZeroGConsensusNetwork resolver')

		await expect(consensusResolver.resolve.NetworkConsensusNetworkId.resolve({
			$network: network,
			consensusNetworkId: '0g',
		}, context)).resolves.toMatchObject({
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					source: Source.ZeroGChainScan_Rest,
				},
			}],
		})
		expect(queries.getExplorerIdentity).toHaveBeenCalled()
	})
})

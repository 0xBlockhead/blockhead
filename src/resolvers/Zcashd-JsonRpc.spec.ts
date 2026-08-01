import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const getTreeState = vi.fn()

vi.mock('$/sources/Zcashd/JsonRpc/queries.ts', () => ({
	getTreeState,
}))

const { default: zcashdResolvers } = await import('$/resolvers/Zcashd-JsonRpc.ts')
const blockResolver = zcashdResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoBlock
))

if (blockResolver == null)
	throw new Error('Zcashd-JsonRpc spec missing UtxoBlock resolver')

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
const network = {
	caip2: networkBySlug.zcash.caip2,
}

describe('Zcashd block selector ownership', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('uses height and hash only for their exact selector arms', async () => {
		const heightSelector = {
			$network: network,
			height: 2_000_000n,
		}
		getTreeState.mockResolvedValueOnce({
			height: Number(heightSelector.height),
			hash: 'height-response-hash',
			sapling: {
				commitments: 'sapling-tree',
			},
			orchard: {
				commitments: 'orchard-tree',
			},
		})
		const heightSnapshot = await blockResolver.resolve.NetworkHeight.resolve(
			heightSelector,
			resolverContext
		)
		expect(getTreeState).toHaveBeenCalledWith({
			block: Number(heightSelector.height),
		})
		expect(blockResolver.projections.$$zcashShieldedPoolStates(heightSnapshot)).toHaveLength(2)

		const hashSelector = {
			...heightSelector,
			hash: 'zcash-block-hash',
		}
		getTreeState.mockResolvedValueOnce({
			height: Number(hashSelector.height),
			hash: hashSelector.hash,
		})
		const hashSnapshot = await blockResolver.resolve.NetworkHeightHash.resolve(
			hashSelector,
			resolverContext
		)
		expect(getTreeState).toHaveBeenLastCalledWith({
			block: hashSelector.hash,
		})
		expect(blockResolver.projections.$$zcashShieldedPoolStates(hashSnapshot)
			.map((state) => state[EntityMetaKey.Selector].$block)
		).toEqual([
			hashSelector,
			hashSelector,
		])
	})

	it('rejects height and hash identity mismatches independently', async () => {
		getTreeState.mockResolvedValueOnce({
			height: 2_000_001,
			hash: 'height-response-hash',
		})
		await expect(blockResolver.resolve.NetworkHeight.resolve({
			$network: network,
			height: 2_000_000n,
		}, resolverContext)).rejects.toThrow('returned a different block')

		getTreeState.mockResolvedValueOnce({
			height: 2_000_000,
			hash: 'different-hash',
		})
		await expect(blockResolver.resolve.NetworkHeightHash.resolve({
			$network: network,
			height: 2_000_000n,
			hash: 'zcash-block-hash',
		}, resolverContext)).rejects.toThrow('returned a different block')
	})
})

import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getDydxLatestBlock = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Kingnodes/Rest/queries.ts', () => ({
	getDydxLatestBlock,
}))

const { default: kingnodes } = await import('$/resolvers/Kingnodes-Rest.ts')

const networkResolver = kingnodes.resolvers.find((resolver) => (
	resolver.entityType === EntityType.DydxChainNetwork
))
if (networkResolver == null)
	throw new Error('Kingnodes-Rest spec missing resolver')

const network = {
	$network: {
		slug: 'dydx',
	},
}

const observedAtMs = Date.parse('2026-07-31T19:32:02.172381662Z')

describe('Kingnodes dYdX LCD tip projections', () => {
	it('projects validator blockHeight onto DydxChainNetwork.$$timestamps', async () => {
		getDydxLatestBlock.mockResolvedValue({
			block: {
				header: {
					chain_id: 'dydx-mainnet-1',
					height: '99785572',
					time: '2026-07-31T19:32:02.172381662Z',
				},
			},
		})

		const snapshot = await networkResolver.resolve.Network.resolve(network)
		expect(networkResolver.projections.$$timestamps(snapshot, network)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				timestampMs: observedAtMs,
				source: Source.KingnodesDydxNode,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.DydxChainNetwork_Timestamp, [], 'blockHeight')]: 99785572n,
			},
		}])
	})

	it('does not replay the latest block at an arbitrary observation timestamp', () => {
		expect(kingnodes.resolvers.some((resolver) => (
			resolver.entityType === EntityType.DydxChainNetwork_Timestamp
		))).toBe(false)
	})

	it('rejects foreign networks', async () => {
		await expect(
			networkResolver.resolve.Network.resolve({
				$network: {
					slug: 'osmosis',
				},
			})
		).rejects.toThrow('unsupported network')
	})
})

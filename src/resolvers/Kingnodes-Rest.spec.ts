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
const networkTimestampResolver = kingnodes.resolvers.find((resolver) => (
	resolver.entityType === EntityType.DydxChainNetwork_Timestamp
))

if (networkResolver == null || networkTimestampResolver == null)
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

	it('re-resolves tip blockHeight for NetworkTimestampMsSource', async () => {
		getDydxLatestBlock.mockResolvedValue({
			block: {
				header: {
					chain_id: 'dydx-mainnet-1',
					height: '99785573',
					time: '2026-07-31T19:32:02.172381662Z',
				},
			},
		})

		await expect(
			networkTimestampResolver.resolve.NetworkTimestampMsSource.resolve({
				$network: network,
				timestampMs: observedAtMs,
				source: Source.KingnodesDydxNode,
			})
		).resolves.toMatchObject({
			blockHeight: 99785573n,
		})
		expect(
			networkTimestampResolver.projections.blockHeight({
				blockHeight: 99785573n,
				observedAtMs,
			})
		).toBe(99785573n)
	})

	it('rejects foreign networks and non-Kingnodes sources', async () => {
		await expect(
			networkResolver.resolve.Network.resolve({
				$network: {
					slug: 'osmosis',
				},
			})
		).rejects.toThrow('unsupported network')

		await expect(
			networkTimestampResolver.resolve.NetworkTimestampMsSource.resolve({
				$network: network,
				timestampMs: observedAtMs,
				source: Source.DydxIndexer,
			})
		).rejects.toThrow('unsupported source')
	})
})

import {
	beforeEach,
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
import { LightningChannelStatus } from '$/schema/LightningChannelStatus.ts'
import { Source } from '$/sources/Source.ts'

const getLightningStatistics = vi.hoisted(() => vi.fn())
const getTopLightningNodesByConnectivity = vi.hoisted(() => vi.fn())
const getLightningNode = vi.hoisted(() => vi.fn())
const getLightningNodeChannels = vi.hoisted(() => vi.fn())
const getLightningChannel = vi.hoisted(() => vi.fn())

vi.mock('$/sources/LightningMempoolSpace/Rest/queries.ts', () => ({
	getLightningStatistics,
	getTopLightningNodesByConnectivity,
	getLightningNode,
	getLightningNodeChannels,
	getLightningChannel,
}))

const { default: lightningMempoolSpaceRest } = await import('$/resolvers/LightningMempoolSpace-Rest.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 1,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const lightningNetwork = {
	slug: 'lightning',
} as const

const publicKey = '02'.padEnd(66, 'a')

describe('LightningMempoolSpace exact relationship counts', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('derives node relationship counts from statistics node_count, not ranked page length', async () => {
		getLightningStatistics.mockResolvedValue({
			latest: {
				added: '2026-01-01T00:00:00.000Z',
				node_count: 42_000,
			},
		})
		getTopLightningNodesByConnectivity.mockResolvedValue([
			{
				publicKey,
				alias: 'hub',
			},
		])

		const lightningNetworkNodesResolver = lightningMempoolSpaceRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.LightningNetwork
			&& typeof resolver.projections.$$nodes === 'function'
		))
		const lightningNetworkNodeCountResolver = lightningMempoolSpaceRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.LightningNetwork
			&& typeof resolver.projections.$$nodes === 'object'
			&& 'resolveCount' in resolver.projections.$$nodes
		))
		const networkNodesResolver = lightningMempoolSpaceRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network
			&& 'Lightning' in resolver.projections
			&& typeof resolver.projections.Lightning.$$nodes === 'function'
		))
		const networkNodeCountResolver = lightningMempoolSpaceRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network
			&& 'Lightning' in resolver.projections
			&& typeof resolver.projections.Lightning.$$nodes === 'object'
			&& 'resolveCount' in resolver.projections.Lightning.$$nodes
		))
		if (
			lightningNetworkNodesResolver == null
			|| lightningNetworkNodeCountResolver == null
			|| networkNodesResolver == null
			|| networkNodeCountResolver == null
		)
			throw new Error('LightningMempoolSpace_Rest: missing node relationship resolvers')

		const partialNodes = await lightningNetworkNodesResolver.resolve.Network.resolve({
			$network: lightningNetwork,
		}, context)
		expect(lightningNetworkNodesResolver.projections.$$nodes(partialNodes)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: lightningNetwork,
				publicKey,
			},
		}])
		expect(getTopLightningNodesByConnectivity).toHaveBeenCalledOnce()
		expect(getLightningStatistics).not.toHaveBeenCalled()

		await expect(lightningNetworkNodeCountResolver.resolve.Network.resolve({
			$network: lightningNetwork,
		}, context)).resolves.toBe(42_000)
		expect(lightningNetworkNodeCountResolver.projections.$$nodes.resolveCount(42_000)).toBe(42_000)
		expect(getLightningStatistics).toHaveBeenCalledOnce()
		expect(getTopLightningNodesByConnectivity).toHaveBeenCalledOnce()

		const partialNetworkNodes = await networkNodesResolver.resolve.Slug.resolve(
			lightningNetwork,
			context
		)
		expect(networkNodesResolver.projections.Lightning.$$nodes(partialNetworkNodes)).toHaveLength(1)
		await expect(networkNodeCountResolver.resolve.Slug.resolve(
			lightningNetwork,
			context
		)).resolves.toBe(42_000)
	})

	it('derives LightningNode channel counts from node detail, not sliced channel rows', async () => {
		getLightningNode.mockResolvedValue({
			alias: 'hub',
			active_channel_count: 17,
			updated_at: 1_700_000_000,
		})
		getLightningNodeChannels.mockResolvedValue([
			{
				id: 123,
				status: 1,
				capacity: '1000000',
				updated_at: '2026-01-01T00:00:00.000Z',
				node: {
					public_key: publicKey,
				},
			},
		])

		const nodeChannelsResolver = lightningMempoolSpaceRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.LightningNode
			&& typeof resolver.projections.$$channels === 'function'
		))
		const nodeChannelCountResolver = lightningMempoolSpaceRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.LightningNode
			&& typeof resolver.projections.$$channels === 'object'
			&& 'resolveCount' in resolver.projections.$$channels
		))
		if (nodeChannelsResolver == null || nodeChannelCountResolver == null)
			throw new Error('LightningMempoolSpace_Rest: missing node channel resolvers')

		const partialChannels = await nodeChannelsResolver.resolve.NetworkPublicKey.resolve({
			$network: lightningNetwork,
			publicKey,
		}, context)
		expect(nodeChannelsResolver.projections.$$channels(partialChannels)).toHaveLength(1)
		expect(getLightningNodeChannels).toHaveBeenCalledOnce()
		expect(getLightningNode).not.toHaveBeenCalled()

		await expect(nodeChannelCountResolver.resolve.NetworkPublicKey.resolve({
			$network: lightningNetwork,
			publicKey,
		}, context)).resolves.toBe(17)
		expect(nodeChannelCountResolver.projections.$$channels.resolveCount(17)).toBe(17)
		expect(getLightningNode).toHaveBeenCalledWith({
			publicKey,
		})
	})

	it('falls back to node.channels and fail-closes missing authoritative channel counts', async () => {
		getLightningNode
			.mockResolvedValueOnce({
				alias: 'hub',
				channels: 9,
				updated_at: 1_700_000_000,
			})
			.mockResolvedValueOnce({
				alias: 'empty',
				updated_at: 1_700_000_000,
			})

		const nodeChannelCountResolver = lightningMempoolSpaceRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.LightningNode
			&& typeof resolver.projections.$$channels === 'object'
			&& 'resolveCount' in resolver.projections.$$channels
		))
		if (nodeChannelCountResolver == null)
			throw new Error('LightningMempoolSpace_Rest: missing node channel count resolver')

		await expect(nodeChannelCountResolver.resolve.NetworkPublicKey.resolve({
			$network: lightningNetwork,
			publicKey,
		}, context)).resolves.toBe(9)

		await expect(nodeChannelCountResolver.resolve.NetworkPublicKey.resolve({
			$network: lightningNetwork,
			publicKey,
		}, context)).rejects.toThrow('node detail missing channel count')
	})

	it('fail-closes unsupported Lightning network selectors before transport', async () => {
		const nodeChannelCountResolver = lightningMempoolSpaceRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.LightningNode
			&& typeof resolver.projections.$$channels === 'object'
			&& 'resolveCount' in resolver.projections.$$channels
		))
		if (nodeChannelCountResolver == null)
			throw new Error('LightningMempoolSpace_Rest: missing node channel count resolver')

		await expect(nodeChannelCountResolver.resolve.NetworkPublicKey.resolve({
			$network: {
				slug: 'ethereum',
			},
			publicKey,
		}, context)).rejects.toThrow('unsupported Lightning network')
		expect(getLightningNode).not.toHaveBeenCalled()
		expect(getLightningStatistics).not.toHaveBeenCalled()
		expect(lightningMempoolSpaceRest.source).toBe(Source.LightningMempoolSpace_Rest)
	})
})

describe('LightningMempoolSpace parent timestamp materialization', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('does not register current-state Lightning timestamp replay resolvers', () => {
		expect(lightningMempoolSpaceRest.resolvers.some((resolver) => (
			resolver.entityType === EntityType.LightningNetwork_Timestamp
			|| resolver.entityType === EntityType.LightningNode_Timestamp
			|| resolver.entityType === EntityType.LightningChannel_Timestamp
		))).toBe(false)
	})

	it('embeds the same full network observation on the non-live parent and live helper', async () => {
		const statistics = {
			added: '2026-01-01T00:00:00.000Z',
			node_count: 10,
			channel_count: 20,
			total_capacity: '3000',
			tor_nodes: 4,
			clearnet_nodes: 6,
			unannounced_nodes: 1,
			avg_capacity: '150',
			med_capacity: '100',
			avg_fee_rate: 4,
			med_fee_rate: 3,
		}
		getLightningStatistics.mockResolvedValue({
			latest: statistics,
		})

		const lightningNetworkTimestampsResolver = lightningMempoolSpaceRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.LightningNetwork
			&& typeof resolver.projections.$$timestamps === 'function'
			&& resolver.resolveLive?.networkStats != null
		))
		const networkTimestampsResolver = lightningMempoolSpaceRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network
			&& 'Lightning' in resolver.projections
			&& typeof resolver.projections.Lightning.$$timestamps === 'function'
		))
		if (lightningNetworkTimestampsResolver == null || networkTimestampsResolver == null)
			throw new Error('LightningMempoolSpace_Rest: missing network timestamp parents')

		const expectedRow = {
			[EntityMetaKey.Selector]: {
				$lightningNetwork: {
					$network: lightningNetwork,
				},
				timestampMs: Date.parse(statistics.added),
				source: Source.LightningMempoolSpace_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], 'nodeCount')]: 10,
				[entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], 'channelCount')]: 20,
				[entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], 'totalCapacitySats')]: 3_000n,
				[entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], 'torNodeCount')]: 4,
				[entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], 'clearnetNodeCount')]: 6,
				[entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], 'unannouncedNodeCount')]: 1,
				[entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], 'averageCapacitySats')]: 150n,
				[entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], 'medianCapacitySats')]: 100n,
				[entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], 'averageFeeRatePpm')]: 4,
				[entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], 'medianFeeRatePpm')]: 3,
			},
		}

		expect(lightningNetworkTimestampsResolver.projections.$$timestamps(
			await lightningNetworkTimestampsResolver.resolve.Network.resolve({
				$network: lightningNetwork,
			}, context)
		)).toEqual([expectedRow])
		expect(networkTimestampsResolver.projections.Lightning.$$timestamps(
			await networkTimestampsResolver.resolve.Slug.resolve(
				lightningNetwork,
				context
			)
		)).toEqual([expectedRow])

		if (lightningNetworkTimestampsResolver.resolveLive?.networkStats == null)
			throw new Error('LightningMempoolSpace_Rest: missing networkStats live publisher')

		const replaceTimestamps = vi.fn()
		const abortController = new AbortController()
		const stop = lightningNetworkTimestampsResolver.resolveLive.networkStats.start({
			fields: {
				'$$timestamps': {
					replaceRows: replaceTimestamps,
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
			},
			parentEntitySelector: {
				$network: lightningNetwork,
			},
			queryClient: {},
			signal: abortController.signal,
			trigger: context,
		})
		await vi.waitFor(() => expect(replaceTimestamps).toHaveBeenCalledOnce())
		expect(replaceTimestamps.mock.calls[0]?.[0]?.[0]?.value).toEqual([expectedRow])
		abortController.abort()
		stop()
	})

	it('embeds full node observation Fields on the parent $$timestamps row', async () => {
		getLightningNode.mockResolvedValue({
			alias: 'hub',
			color: '#abcdef',
			capacity: '9000000',
			active_channel_count: 3,
			first_seen: 1_600_000_000,
			updated_at: 1_700_000_000,
			iso_code: 'US',
			city: {
				en: 'Austin',
			},
			sockets: '1.2.3.4:9735,5.6.7.8:9735',
		})

		const nodeResolver = lightningMempoolSpaceRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.LightningNode
			&& '$$timestamps' in resolver.projections
		))
		if (nodeResolver == null)
			throw new Error('LightningMempoolSpace_Rest: missing node timestamp parent')

		expect(nodeResolver.projections.$$timestamps(
			await nodeResolver.resolve.NetworkPublicKey.resolve({
				$network: lightningNetwork,
				publicKey,
			}, context)
		)).toEqual([{
			[EntityMetaKey.Selector]: {
				$node: {
					$network: lightningNetwork,
					publicKey,
				},
				timestampMs: 1_700_000_000_000,
				source: Source.LightningMempoolSpace_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'alias')]: 'hub',
				[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'color')]: '#abcdef',
				[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'capacitySats')]: 9_000_000n,
				[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'channelCount')]: 3,
				[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'firstSeenMs')]: 1_600_000_000_000,
				[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'updatedAtMs')]: 1_700_000_000_000,
				[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'countryCode')]: 'US',
				[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'city')]: 'Austin',
				[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'networkAddresses')]: [
					'1.2.3.4:9735',
					'5.6.7.8:9735',
				],
			},
		}])
	})

	it('embeds full channel observation Fields while keeping stable identity on the parent', async () => {
		const updatedAt = '2026-01-01T00:00:00.000Z'
		getLightningChannel.mockResolvedValue({
			id: '42',
			short_id: '100x2x0',
			transaction_id: 'a'.repeat(64),
			transaction_vout: 1,
			created: '2025-12-01T00:00:00.000Z',
			updated_at: updatedAt,
			status: 1,
			capacity: '250000',
			node: {
				public_key: publicKey,
			},
			node_left: {
				public_key: publicKey,
				fee_rate: 125,
			},
			node_right: {
				public_key: '03'.padEnd(66, 'b'),
				fee_rate: 125,
			},
			closing_transaction_id: 'closetxid',
			closing_fee: '2500',
			closing_reason: 'mutual',
			closing_date: '2026-01-02T00:00:00.000Z',
		})

		const channelResolver = lightningMempoolSpaceRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.LightningChannel
			&& '$$timestamps' in resolver.projections
			&& 'shortChannelId' in resolver.projections
		))
		if (channelResolver == null)
			throw new Error('LightningMempoolSpace_Rest: missing channel timestamp parent')

		const channelSnapshot = await channelResolver.resolve.NetworkChannelId.resolve({
			$network: lightningNetwork,
			channelId: '42',
		}, context)

		expect(channelResolver.projections.shortChannelId(channelSnapshot)).toBe('100x2x0')
		expect(channelResolver.projections.fundingTransactionId(channelSnapshot)).toBe('a'.repeat(64))
		expect(channelResolver.projections.fundingOutputIndex(channelSnapshot)).toBe(1)
		expect(channelResolver.projections.openedAtMs(channelSnapshot)).toBe(Date.parse('2025-12-01T00:00:00.000Z'))
		expect(channelResolver.projections.$node1(channelSnapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: lightningNetwork,
				publicKey,
			},
		})
		expect(channelResolver.projections.$$timestamps(channelSnapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$channel: {
					$network: lightningNetwork,
					channelId: '42',
				},
				timestampMs: Date.parse(updatedAt),
				source: Source.LightningMempoolSpace_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'status')]: LightningChannelStatus.Open,
				[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'capacitySats')]: 250000n,
				[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'closingTransactionId')]: 'closetxid',
				[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'closingFeeSats')]: 2500n,
				[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'closingReason')]: 'mutual',
				[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'closedAtMs')]: Date.parse('2026-01-02T00:00:00.000Z'),
				[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'updatedAtMs')]: Date.parse(updatedAt),
				[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'feeRatePpm')]: 125,
			},
		}])
	})
})

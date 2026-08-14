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

const getLightningStatistics = vi.hoisted(() => vi.fn())
const getTopLightningNodesByConnectivity = vi.hoisted(() => vi.fn())
const getLightningNode = vi.hoisted(() => vi.fn())
const getLightningNodeChannels = vi.hoisted(() => vi.fn())

vi.mock('$/sources/LightningMempoolSpace/Rest/queries.ts', () => ({
	getLightningStatistics,
	getTopLightningNodesByConnectivity,
	getLightningNode,
	getLightningNodeChannels,
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

import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { LightningChannelStatus } from '$/schema/LightningChannelStatus.ts'
import { Source } from '$/sources/Source.ts'

const getNode = vi.hoisted(() => vi.fn())
const getEdge = vi.hoisted(() => vi.fn())
const getNodeChannels = vi.hoisted(() => vi.fn())
const getPopularNodePubkeys = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Amboss/Graphql/queries.ts', () => ({
	getNode,
	getEdge,
	getNodeChannels,
	getPopularNodePubkeys,
}))

import ambossGraphqlResolvers from '$/resolvers/Amboss-Graphql.ts'

const publicKey = `02${'a'.repeat(64)}`
const peerPublicKey = `03${'b'.repeat(64)}`
const lightningNetwork = {
	slug: 'lightning',
} as const

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const nodeResolver = ambossGraphqlResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.LightningNode
	&& '$$timestamps' in resolver.projections
))

const nodeChannelsResolver = ambossGraphqlResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.LightningNode
	&& '$$channels' in resolver.projections
))

const channelResolver = ambossGraphqlResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.LightningChannel
	&& '$node1' in resolver.projections
))

if (
	nodeResolver == null
	|| nodeChannelsResolver == null
	|| channelResolver == null
)
	throw new Error('Amboss_Graphql spec missing node/channel resolvers')

describe('Amboss GraphQL Lightning node/channel resolvers', () => {
	beforeEach(() => {
		getNode.mockReset()
		getEdge.mockReset()
		getNodeChannels.mockReset()
		getPopularNodePubkeys.mockReset()
	})

	it('rejects unsupported networks before transport', async () => {
		await expect(nodeResolver.resolve.NetworkPublicKey.resolve({
			$network: {
				slug: 'bitcoin',
			},
			publicKey,
		}, resolverContext)).rejects.toThrow('unsupported Lightning network')
		expect(getNode).not.toHaveBeenCalled()
	})

	it('does not register current-state Lightning timestamp replay resolvers', () => {
		expect(ambossGraphqlResolvers.resolvers.some((resolver) => (
			resolver.entityType === EntityType.LightningNode_Timestamp
			|| resolver.entityType === EntityType.LightningChannel_Timestamp
		))).toBe(false)
	})

	it('materializes fail-closed node observations from getNode', async () => {
		getNode.mockResolvedValue({
			graph_info: {
				node: {
					pub_key: publicKey,
					alias: 'self',
					color: '#abcdef',
					last_update: 1_700_000_000,
					addresses: [
						{
							addr: '1.2.3.4:9735',
							ip_info: {
								city: 'Austin',
								country_code: 'US',
							},
						},
					],
				},
				channels: {
					num_channels: 12,
					total_capacity: '500000000',
				},
			},
		})

		const nodeSnapshot = await nodeResolver.resolve.NetworkPublicKey.resolve({
			$network: lightningNetwork,
			publicKey,
		}, resolverContext)

		expect(nodeResolver.projections.$$timestamps(nodeSnapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$node: {
						$network: lightningNetwork,
						publicKey,
					},
					timestampMs: 1_700_000_000_000,
					source: Source.Amboss_Graphql,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'alias')]: 'self',
					[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'color')]: '#abcdef',
					[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'capacitySats')]: 500000000n,
					[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'channelCount')]: 12,
					[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'updatedAtMs')]: 1_700_000_000_000,
					[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'countryCode')]: 'US',
					[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'city')]: 'Austin',
					[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'networkAddresses')]: [
						'1.2.3.4:9735',
					],
				},
			},
		])
		expect(getNode).toHaveBeenCalledWith({
			publicKey,
		})
	})

	it('lists node channels with enrolled leftovers, resolveCount, and continuation', async () => {
		getNodeChannels.mockResolvedValue({
			num_channels: 2,
			channel_list: {
				list: [
					{
						long_channel_id: '123',
						short_channel_id: '1x2x3',
						chan_point: 'fundingtxid:0',
						capacity: '1000000',
						last_update: 1_700_000_000,
						node1_pub: publicKey,
						node2_pub: peerPublicKey,
						node1_policy: {
							fee_rate_milli_msat: '250',
							disabled: false,
						},
						node2_policy: null,
					},
				],
				pagination: {
					limit: 1,
					offset: 0,
				},
			},
		})

		const snapshot = await nodeChannelsResolver.resolve.NetworkPublicKey.resolve({
			$network: lightningNetwork,
			publicKey,
		}, {
			...resolverContext,
			pagination: {
				limit: 1,
			},
		})

		expect(nodeChannelsResolver.projections.$$channels.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: lightningNetwork,
					channelId: '123',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.LightningChannel, [], 'shortChannelId')]: '1x2x3',
					[entityFieldAddressKey(EntityType.LightningChannel, [], 'fundingTransactionId')]: 'fundingtxid',
					[entityFieldAddressKey(EntityType.LightningChannel, [], 'fundingOutputIndex')]: 0,
					[entityFieldAddressKey(EntityType.LightningChannel, [], '$node1')]: {
						[EntityMetaKey.Selector]: {
							$network: lightningNetwork,
							publicKey: peerPublicKey,
						},
					},
					[entityFieldAddressKey(EntityType.LightningChannel, [], '$$timestamps')]: [
						{
							[EntityMetaKey.Selector]: {
								$channel: {
									$network: lightningNetwork,
									channelId: '123',
								},
								timestampMs: 1_700_000_000_000,
								source: Source.Amboss_Graphql,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'capacitySats')]: 1000000n,
								[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'updatedAtMs')]: 1_700_000_000_000,
								[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], '$$routingPolicies')]: [{
									[EntityMetaKey.Selector]: {
										$channelTimestamp: {
											$channel: {
												$network: lightningNetwork,
												channelId: '123',
											},
											timestampMs: 1_700_000_000_000,
											source: Source.Amboss_Graphql,
										},
										$towardNode: {
											$network: lightningNetwork,
											publicKey: peerPublicKey,
										},
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.LightningChannelRoutingPolicy_Timestamp, [], 'feeRatePpm')]: 250,
										[entityFieldAddressKey(EntityType.LightningChannelRoutingPolicy_Timestamp, [], 'disabled')]: false,
									},
								}],
							},
						},
					],
				},
			},
		])
		expect(nodeChannelsResolver.projections.$$channels.resolveCount?.(snapshot)).toBe(2)
		expect(getNodeChannels).toHaveBeenCalledWith({
			publicKey,
			limit: 1,
			offset: 0,
		})
		expect(nodeChannelsResolver.projections.$$channels.continuation?.(snapshot)).toEqual({
			operation: 'node-channels',
			target: 'amboss',
			terminal: false,
			token: '1',
		})
	})

	it('materializes fail-closed channel peers, funding, and observations from getEdge', async () => {
		getEdge.mockResolvedValue({
			long_channel_id: '123',
			short_channel_id: '1x2x3',
			graph: {
				info: {
					capacity: '1000000',
					is_closed: false,
					last_update: '1700000000',
					chan_point: 'abcdef0123456789:1',
					node1_pub: publicKey,
					node2_pub: peerPublicKey,
					node1_policy: {
						fee_rate_milli_msat: '250',
						disabled: false,
					},
					node2_policy: null,
					closed_info: null,
					transactions: {
						close_transaction: null,
					},
				},
			},
		})

		const channelSnapshot = await channelResolver.resolve.NetworkChannelId.resolve({
			$network: lightningNetwork,
			channelId: '1x2x3',
		}, resolverContext)

		expect(channelResolver.projections.shortChannelId(channelSnapshot)).toBe('1x2x3')
		expect(channelResolver.projections.fundingTransactionId(channelSnapshot)).toBe('abcdef0123456789')
		expect(channelResolver.projections.fundingOutputIndex(channelSnapshot)).toBe(1)
		expect(channelResolver.projections.$node1(channelSnapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: lightningNetwork,
				publicKey: peerPublicKey,
			},
		})
		expect(channelResolver.projections.$$timestamps(channelSnapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$channel: {
						$network: lightningNetwork,
						channelId: '123',
					},
					timestampMs: 1_700_000_000_000,
					source: Source.Amboss_Graphql,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'status')]: LightningChannelStatus.Open,
					[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'capacitySats')]: 1000000n,
					[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'updatedAtMs')]: 1_700_000_000_000,
					[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], '$$routingPolicies')]: [{
						[EntityMetaKey.Selector]: {
							$channelTimestamp: {
								$channel: {
									$network: lightningNetwork,
									channelId: '123',
								},
								timestampMs: 1_700_000_000_000,
								source: Source.Amboss_Graphql,
							},
							$towardNode: {
								$network: lightningNetwork,
								publicKey: peerPublicKey,
							},
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.LightningChannelRoutingPolicy_Timestamp, [], 'feeRatePpm')]: 250,
							[entityFieldAddressKey(EntityType.LightningChannelRoutingPolicy_Timestamp, [], 'disabled')]: false,
						},
					}],
				},
			},
		])
		expect(getEdge).toHaveBeenCalledWith({
			channelId: '1x2x3',
		})
	})

	it('omits channel feeRatePpm when directional policies disagree or one side is absent', async () => {
		getEdge.mockResolvedValue({
			long_channel_id: '123',
			short_channel_id: '1x2x3',
			graph: {
				info: {
					capacity: '1000000',
					is_closed: false,
					last_update: '1700000000',
					chan_point: 'abcdef0123456789:1',
					node1_pub: publicKey,
					node2_pub: peerPublicKey,
					node1_policy: null,
					node2_policy: {
						fee_rate_milli_msat: '400',
						disabled: false,
					},
					closed_info: null,
					transactions: {
						close_transaction: null,
					},
				},
			},
		})

		const channelSnapshot = await channelResolver.resolve.NetworkChannelId.resolve({
			$network: lightningNetwork,
			channelId: '123',
		}, resolverContext)

		expect(channelResolver.projections.$$timestamps(channelSnapshot)[0]?.[EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'status')]: LightningChannelStatus.Open,
			[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'capacitySats')]: 1000000n,
			[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'updatedAtMs')]: 1_700_000_000_000,
			[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], '$$routingPolicies')]: [{
				[EntityMetaKey.Selector]: {
					$channelTimestamp: {
						$channel: {
							$network: lightningNetwork,
							channelId: '123',
						},
						timestampMs: 1_700_000_000_000,
						source: Source.Amboss_Graphql,
					},
					$towardNode: {
						$network: lightningNetwork,
						publicKey,
					},
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.LightningChannelRoutingPolicy_Timestamp, [], 'feeRatePpm')]: 400,
					[entityFieldAddressKey(EntityType.LightningChannelRoutingPolicy_Timestamp, [], 'disabled')]: false,
				},
			}],
		})
	})

	it('keeps channel feeRatePpm only when both directional policies agree', async () => {
		getEdge.mockResolvedValue({
			long_channel_id: '123',
			short_channel_id: '1x2x3',
			graph: {
				info: {
					capacity: '1000000',
					is_closed: false,
					last_update: '1700000000',
					chan_point: 'abcdef0123456789:1',
					node1_pub: publicKey,
					node2_pub: peerPublicKey,
					node1_policy: {
						fee_rate_milli_msat: '250',
						disabled: false,
					},
					node2_policy: {
						fee_rate_milli_msat: '250',
						disabled: false,
					},
					closed_info: null,
					transactions: {
						close_transaction: null,
					},
				},
			},
		})

		const channelSnapshot = await channelResolver.resolve.NetworkChannelId.resolve({
			$network: lightningNetwork,
			channelId: '123',
		}, resolverContext)

		expect(channelResolver.projections.$$timestamps(channelSnapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$channel: {
						$network: lightningNetwork,
						channelId: '123',
					},
					timestampMs: 1_700_000_000_000,
					source: Source.Amboss_Graphql,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'status')]: LightningChannelStatus.Open,
					[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'capacitySats')]: 1000000n,
					[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'updatedAtMs')]: 1_700_000_000_000,
					[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'feeRatePpm')]: 250,
					[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], '$$routingPolicies')]: [
						{
							[EntityMetaKey.Selector]: {
								$channelTimestamp: {
									$channel: {
										$network: lightningNetwork,
										channelId: '123',
									},
									timestampMs: 1_700_000_000_000,
									source: Source.Amboss_Graphql,
								},
								$towardNode: {
									$network: lightningNetwork,
									publicKey: peerPublicKey,
								},
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.LightningChannelRoutingPolicy_Timestamp, [], 'feeRatePpm')]: 250,
								[entityFieldAddressKey(EntityType.LightningChannelRoutingPolicy_Timestamp, [], 'disabled')]: false,
							},
						},
						{
							[EntityMetaKey.Selector]: {
								$channelTimestamp: {
									$channel: {
										$network: lightningNetwork,
										channelId: '123',
									},
									timestampMs: 1_700_000_000_000,
									source: Source.Amboss_Graphql,
								},
								$towardNode: {
									$network: lightningNetwork,
									publicKey,
								},
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.LightningChannelRoutingPolicy_Timestamp, [], 'feeRatePpm')]: 250,
								[entityFieldAddressKey(EntityType.LightningChannelRoutingPolicy_Timestamp, [], 'disabled')]: false,
							},
						},
					],
				},
			},
		])
	})

	it('projects enrolled closing clocks from Amboss closed_info', async () => {
		getEdge.mockResolvedValue({
			long_channel_id: '123',
			short_channel_id: '1x2x3',
			graph: {
				info: {
					capacity: '1000000',
					is_closed: true,
					last_update: '1700000100',
					chan_point: 'abcdef0123456789:1',
					node1_pub: publicKey,
					node2_pub: peerPublicKey,
					node1_policy: null,
					node2_policy: null,
					closed_info: {
						close_transaction_id: 'closetxid',
						closed_date: '2023-11-14T22:15:00.000Z',
						closed_height: 800_000,
						closure_type: 'MUTUAL',
					},
					transactions: {
						close_transaction: {
							id: 'closetxid',
							fee: '2500',
						},
					},
				},
			},
		})

		const channelSnapshot = await channelResolver.resolve.NetworkChannelId.resolve({
			$network: lightningNetwork,
			channelId: '123',
		}, resolverContext)

		expect(channelResolver.projections.$$timestamps(channelSnapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$channel: {
						$network: lightningNetwork,
						channelId: '123',
					},
					timestampMs: 1_700_000_100_000,
					source: Source.Amboss_Graphql,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'status')]: LightningChannelStatus.Closed,
					[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'capacitySats')]: 1000000n,
					[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'updatedAtMs')]: 1_700_000_100_000,
					[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'closingTransactionId')]: 'closetxid',
					[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'closingFeeSats')]: 2500n,
					[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'closingReason')]: 'MUTUAL',
					[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'closedAtMs')]: Date.parse('2023-11-14T22:15:00.000Z'),
					[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], '$$routingPolicies')]: [],
				},
			},
		])
	})
})

import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const {
	getChannelBalance,
	getChannelInfo,
	getForwardingHistory,
	getInfo,
	getInvoice,
	getNetworkInfo,
	getNodeInfo,
	getPayment,
	getWalletBalance,
	listChannels,
	listInvoices,
	listPayments,
	listPeers,
	lookupGraphNode,
} = vi.hoisted(() => ({
	getChannelBalance: vi.fn(),
	getChannelInfo: vi.fn(),
	getForwardingHistory: vi.fn(),
	getInfo: vi.fn(),
	getInvoice: vi.fn(),
	getNetworkInfo: vi.fn(),
	getNodeInfo: vi.fn(),
	getPayment: vi.fn(),
	getWalletBalance: vi.fn(),
	listChannels: vi.fn(),
	listInvoices: vi.fn(),
	listPayments: vi.fn(),
	listPeers: vi.fn(),
	lookupGraphNode: vi.fn(),
}))

vi.mock('$/sources/LightningLnd/Rest/queries.ts', () => ({
	getChannelBalance,
	getChannelInfo,
	getForwardingHistory,
	getInfo,
	getInvoice,
	getNetworkInfo,
	getNodeInfo,
	getPayment,
	getWalletBalance,
	listChannels,
	listInvoices,
	listPayments,
	listPeers,
	lookupGraphNode,
}))

const { default: lightningLnd } = await import('$/resolvers/LightningLnd-Rest.ts')

type InvoiceListResolver = Extract<
	typeof lightningLnd.resolvers[number],
	{ projections: Record<'$$invoices', unknown> }
>
type PaymentListResolver = Extract<
	typeof lightningLnd.resolvers[number],
	{ projections: Record<'$$payments', unknown> }
>
type ChannelListResolver = Extract<
	typeof lightningLnd.resolvers[number],
	{ projections: Record<'$$channels', unknown> }
>

const nodeStateResolver = lightningLnd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadLightningNodeState
	&& 'lndPubkey' in resolver.projections
))
const nodeStateTimestampResolver = lightningLnd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadLightningNodeState_Timestamp
))
const nodeChannelStatesResolver = lightningLnd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadLightningNodeState
	&& typeof resolver.projections.$$channelStates === 'function'
	&& !('lndPubkey' in resolver.projections)
))
const nodeChannelStateCountResolver = lightningLnd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadLightningNodeState
	&& typeof resolver.projections.$$channelStates === 'object'
	&& 'resolveCount' in resolver.projections.$$channelStates
))
const channelStateResolver = lightningLnd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadLightningChannelState
	&& 'private' in resolver.projections
))
const htlcResolver = lightningLnd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadLightningHtlc
))
const networkTimestampResolver = lightningLnd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.LightningNetwork_Timestamp
))
const nodeTimestampResolver = lightningLnd.resolvers.find((resolver) => resolver.entityType === EntityType.LightningNode_Timestamp)
const channelResolver = lightningLnd.resolvers.find((resolver) => resolver.entityType === EntityType.LightningChannel)
const channelTimestampResolver = lightningLnd.resolvers.find((resolver) => resolver.entityType === EntityType.LightningChannel_Timestamp)
const invoiceResolver = lightningLnd.resolvers.find((resolver) => resolver.entityType === EntityType.BlockheadLightningInvoice)
const invoiceTimestampResolver = lightningLnd.resolvers.find((resolver) => resolver.entityType === EntityType.BlockheadLightningInvoice_Timestamp)
const paymentResolver = lightningLnd.resolvers.find((resolver) => resolver.entityType === EntityType.BlockheadLightningPayment)
const paymentTimestampResolver = lightningLnd.resolvers.find((resolver) => resolver.entityType === EntityType.BlockheadLightningPayment_Timestamp)
const invoiceListResolver = lightningLnd.resolvers.find((resolver): resolver is InvoiceListResolver => (
	resolver.entityType === EntityType.LightningNetwork
	&& '$$invoices' in resolver.projections
))
const paymentListResolver = lightningLnd.resolvers.find((resolver): resolver is PaymentListResolver => (
	resolver.entityType === EntityType.LightningNetwork
	&& '$$payments' in resolver.projections
))
const channelListResolver = lightningLnd.resolvers.find((resolver): resolver is ChannelListResolver => (
	resolver.entityType === EntityType.LightningNetwork
	&& typeof resolver.projections.$$channels === 'function'
))
const nodeResolver = lightningLnd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.LightningNode
	&& '$$timestamps' in resolver.projections
))
const nodeChannelsResolver = lightningLnd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.LightningNode
	&& typeof resolver.projections.$$channels === 'function'
))
const nodeChannelCountResolver = lightningLnd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.LightningNode
	&& typeof resolver.projections.$$channels === 'object'
	&& 'resolveCount' in resolver.projections.$$channels
))
const nodePeersResolver = lightningLnd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadLightningNodeState
	&& typeof resolver.projections.$$peers === 'function'
	&& !('lndPubkey' in resolver.projections)
))
const nodePeerCountResolver = lightningLnd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadLightningNodeState
	&& typeof resolver.projections.$$peers === 'object'
	&& 'resolveCount' in resolver.projections.$$peers
))
const channelStateHtlcsResolver = lightningLnd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadLightningChannelState
	&& typeof resolver.projections.$$htlcs === 'object'
	&& 'resolveCount' in resolver.projections.$$htlcs
))
const peerResolver = lightningLnd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadLightningPeer
))
const nodeForwardsResolver = lightningLnd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadLightningNodeState
	&& '$$forwards' in resolver.projections
))
const forwardResolver = lightningLnd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadLightningForward
))
if (
	nodeStateResolver == null
	|| nodeStateTimestampResolver == null
	|| nodeChannelStatesResolver == null
	|| nodeChannelStateCountResolver == null
	|| channelStateResolver == null
	|| channelStateHtlcsResolver == null
	|| htlcResolver == null
	|| networkTimestampResolver == null
	|| nodeResolver == null
	|| nodeTimestampResolver == null
	|| channelResolver == null
	|| channelTimestampResolver == null
	|| invoiceResolver == null
	|| invoiceTimestampResolver == null
	|| paymentResolver == null
	|| paymentTimestampResolver == null
	|| channelListResolver == null
	|| nodeChannelsResolver == null
	|| nodeChannelCountResolver == null
	|| nodePeersResolver == null
	|| nodePeerCountResolver == null
	|| peerResolver == null
	|| nodeForwardsResolver == null
	|| forwardResolver == null
)
	throw new Error('LightningLnd-Rest spec missing resolver')
if (!('resolveLive' in nodeStateResolver))
	throw new Error('LightningLnd-Rest spec missing resolver')
if (!('operatorState' in nodeStateResolver.resolveLive))
	throw new Error('LightningLnd-Rest spec missing resolver')

const lightningNetwork = {
	slug: 'lightning',
} as const
const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
const localPublicKey = `02${'a'.repeat(64)}`
const peerPublicKey = `03${'b'.repeat(64)}`
const channel = {
	active: true,
	remote_pubkey: peerPublicKey,
	channel_point: 'funding-transaction:7',
	chan_id: '42',
	capacity: '250000',
	local_balance: '100000',
	remote_balance: '150000',
	unsettled_balance: '0',
	commit_fee: '183',
	commit_weight: '600',
	fee_per_kw: '253',
	num_updates: '69',
	private: false,
	initiator: true,
	pending_htlcs: [
		{
			incoming: true,
			amount: '12',
			hash_lock: 'aa',
			expiration_height: 800_001,
			htlc_index: '7',
			state: 'Accepted',
		},
	],
}
const edge = {
	channel_id: '42',
	chan_point: 'funding-transaction:7',
	last_update: 1_700_000_010,
	node1_pub: localPublicKey,
	node2_pub: peerPublicKey,
	capacity: '250000',
	node1_policy: {
		fee_rate_milli_msat: '125',
		disabled: false,
	},
}
const invoice = {
	r_hash_str: 'invoice-hash',
	value_msat: '123000',
	creation_date: '1700000000',
	amt_paid_msat: '123000',
	settle_date: '1700000010',
	state: 'SETTLED',
	settle_index: '5',
}
const payment = {
	payment_hash: 'payment-hash',
	payment_preimage: 'preimage',
	fee_msat: '20',
	creation_time_ns: '1700000000123456789',
	status: 'SUCCEEDED',
	failure_reason: '',
}
const peer = {
	pub_key: peerPublicKey,
	address: '127.0.0.1:9735',
	bytes_sent: '101',
	bytes_recv: '202',
	sat_sent: '303',
	sat_recv: '404',
	inbound: true,
	ping_time: '505',
}
const forward = {
	chan_id_in: '42',
	chan_id_out: '99',
	amt_in_msat: '1000',
	amt_out_msat: '900',
	fee_msat: '100',
	timestamp_ns: '1700000000123456789',
	incoming_htlc_id: '7',
	outgoing_htlc_id: '8',
}

beforeEach(() => {
	vi.resetAllMocks()
	vi.restoreAllMocks()
})

describe('Lightning LND resolver ownership', () => {
	it('owns the exact local connection identity and rejects other networks before transport', async () => {
		getInfo.mockResolvedValue({
			identity_pubkey: localPublicKey,
			alias: 'Local',
		})
		await expect(nodeStateResolver.resolve.ConnectionIdNetwork.resolve({
			connectionId: 'local-lnd',
			$network: {
				$network: lightningNetwork,
			},
		}, context)).resolves.toMatchObject({
			connectionId: 'local-lnd',
			lndPubkey: localPublicKey,
			alias: 'Local',
			$node: {
				[EntityMetaKey.Selector]: {
					$network: lightningNetwork,
					publicKey: localPublicKey,
				},
			},
		})

		getInfo.mockClear()
		await expect(nodeStateResolver.resolve.ConnectionIdNetwork.resolve({
			connectionId: 'wrong-network',
			$network: {
				$network: {
					slug: 'bitcoin',
				},
			},
		}, context)).rejects.toThrow('unsupported Lightning network')
		expect(getInfo).not.toHaveBeenCalled()
	})

	it('projects public-graph node capacity and rejects unavailable historical replay', async () => {
		getNodeInfo.mockResolvedValueOnce({
			node: {
				pub_key: peerPublicKey,
				alias: 'Peer',
				color: '#abcdef',
				last_update: 1_700_000_000,
				addresses: [{ addr: '1.2.3.4:9735' }],
			},
			num_channels: 3,
			total_capacity: '9000000',
		})

		await expect(nodeTimestampResolver.resolve.NodeTimestampMsSource.resolve({
			$node: {
				$network: lightningNetwork,
				publicKey: peerPublicKey,
			},
			timestampMs: 1_700_000_000_000,
			source: Source.LightningLnd_Rest,
		}, context)).resolves.toMatchObject({
			alias: 'Peer',
			color: '#abcdef',
			capacitySats: 9_000_000n,
			channelCount: 3,
			updatedAtMs: 1_700_000_000_000,
			networkAddresses: ['1.2.3.4:9735'],
		})

		getNodeInfo.mockRejectedValueOnce(new Error('not in graph'))
		await expect(nodeTimestampResolver.resolve.NodeTimestampMsSource.resolve({
			$node: {
				$network: lightningNetwork,
				publicKey: peerPublicKey,
			},
			timestampMs: 1,
			source: Source.LightningLnd_Rest,
		}, context)).rejects.toThrow('not in graph')
		expect(getInfo).not.toHaveBeenCalled()
		expect(listChannels).not.toHaveBeenCalled()
	})

	it('resolves public graph channels without collapsing directional fees', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_001)
		getChannelInfo.mockResolvedValue(edge)
		listChannels.mockResolvedValue({ channels: [channel] })
		const channelSelector = {
			$network: lightningNetwork,
			channelId: channel.chan_id,
		}
		const timestampSelector = {
			$channel: channelSelector,
			timestampMs: 1_700_000_010_000,
			source: Source.LightningLnd_Rest,
		} as const

		const channelFields = await channelResolver.resolve.NetworkChannelId.resolve(channelSelector, context)
		expect(channelFields).toMatchObject({
			fundingTransactionId: 'funding-transaction',
			fundingOutputIndex: 7,
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					...timestampSelector,
					timestampMs: 1_700_000_010_000,
				},
			}],
		})
		await expect(
			channelTimestampResolver.resolve.ChannelTimestampMsSource.resolve(timestampSelector, context)
		).resolves.toEqual({
			status: 'Active',
			capacitySats: 250000n,
			updatedAtMs: 1_700_000_010_000,
			feeRatePpm: undefined,
		})

		getChannelInfo.mockResolvedValueOnce({
			...edge,
			node2_policy: {
				fee_rate_milli_msat: '125',
				disabled: false,
			},
		})
		await expect(
			channelTimestampResolver.resolve.ChannelTimestampMsSource.resolve(timestampSelector, context)
		).resolves.toMatchObject({
			feeRatePpm: 125,
		})

		getChannelInfo.mockRejectedValueOnce(new Error('edge missing'))
		await expect(
			channelTimestampResolver.resolve.ChannelTimestampMsSource.resolve(timestampSelector, context)
		).rejects.toThrow('edge missing')
		expect(listChannels).not.toHaveBeenCalled()
	})

	it('lists node channels from graph edges when available', async () => {
		getNodeInfo.mockResolvedValue({
			node: {
				pub_key: peerPublicKey,
			},
			channels: [
				edge,
				{
					...edge,
					channel_id: '99',
				},
			],
		})

		await expect(nodeChannelsResolver.resolve.NetworkPublicKey.resolve({
			$network: lightningNetwork,
			publicKey: peerPublicKey,
		}, {
			...context,
			pagination: {
				limit: 1,
				offset: 1,
			},
		})).resolves.toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$network: lightningNetwork,
					channelId: '99',
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.LightningChannel, [], '$$timestamps')]: [expect.objectContaining({
						[EntityMetaKey.Fields]: expect.objectContaining({
							[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'capacitySats')]: 250000n,
						}),
					})],
				}),
			}),
		])
		expect(getNodeInfo).toHaveBeenCalledWith({
			publicKey: peerPublicKey,
			includeChannels: true,
		})

		getNodeInfo.mockRejectedValueOnce(new Error('graph lookup unavailable'))
		getInfo.mockResolvedValue({
			identity_pubkey: localPublicKey,
		})
		listChannels.mockResolvedValue({
			channels: [
				channel,
				{
					...channel,
					chan_id: '99',
				},
			],
		})
		await expect(nodeChannelsResolver.resolve.NetworkPublicKey.resolve({
			$network: lightningNetwork,
			publicKey: peerPublicKey,
		}, {
			...context,
			pagination: {
				limit: 1,
				offset: 1,
			},
		})).resolves.toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$network: lightningNetwork,
					channelId: '99',
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.LightningChannel, [], '$$timestamps')]: [expect.objectContaining({
						[EntityMetaKey.Fields]: expect.objectContaining({
							[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'capacitySats')]: 250000n,
						}),
					})],
				}),
			}),
		])
	})

	it('materializes bounded public channel facts and observations from the local list read', async () => {
		listChannels.mockResolvedValue({
			channels: [
				channel,
				{
					...channel,
					chan_id: 'private-channel',
					private: true,
				},
			],
		})

		const channels = await channelListResolver.resolve.Network.resolve({
			$network: lightningNetwork,
		}, context)
		expect(channelListResolver.projections.$$channels(channels)).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$network: lightningNetwork,
					channelId: '42',
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.LightningChannel, [], 'fundingTransactionId')]: 'funding-transaction',
					[entityFieldAddressKey(EntityType.LightningChannel, [], 'fundingOutputIndex')]: 7,
					[entityFieldAddressKey(EntityType.LightningChannel, [], '$$timestamps')]: [expect.objectContaining({
						[EntityMetaKey.Fields]: expect.objectContaining({
							[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'status')]: 'Active',
							[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'capacitySats')]: 250000n,
						}),
					})],
				}),
			}),
		])
		expect(getChannelInfo).not.toHaveBeenCalled()
	})

	it('materializes complete local peer snapshots without public-graph fan-out', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_123)
		listPeers.mockResolvedValue({ peers: [peer] })
		const $localNodeState = {
			connectionId: 'local-lnd',
			$network: {
				$network: lightningNetwork,
			},
		}
		const peers = await nodePeersResolver.resolve.ConnectionIdNetwork.resolve($localNodeState, context)
		expect(nodePeersResolver.projections.$$peers(peers)).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$localNodeState,
					publicKey: peerPublicKey,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BlockheadLightningPeer, [], '$$timestamps')]: [expect.objectContaining({
						[EntityMetaKey.Selector]: {
							$peer: {
								$localNodeState,
								publicKey: peerPublicKey,
							},
							timestampMs: 1_700_000_000_123,
							source: Source.LightningLnd_Rest,
						},
						[EntityMetaKey.Fields]: expect.objectContaining({
							[entityFieldAddressKey(EntityType.BlockheadLightningPeer_Timestamp, [], 'address')]: peer.address,
							[entityFieldAddressKey(EntityType.BlockheadLightningPeer_Timestamp, [], 'bytesSent')]: 101n,
							[entityFieldAddressKey(EntityType.BlockheadLightningPeer_Timestamp, [], 'pingTimeMicros')]: 505n,
						}),
					})],
				},
			}),
		])
		expect(lookupGraphNode).not.toHaveBeenCalled()
		await expect(peerResolver.resolve.LocalNodeStatePublicKey.resolve({
			$localNodeState,
			publicKey: peerPublicKey,
		}, context)).resolves.toMatchObject({
			$$timestamps: [expect.objectContaining({
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.BlockheadLightningPeer_Timestamp, [], 'satsRecv')]: 404n,
				}),
			})],
		})
		expect(lookupGraphNode).toHaveBeenCalledWith({
			publicKey: peerPublicKey,
		})
		expect(getNodeInfo).not.toHaveBeenCalled()
	})

	it('links a local peer to the public graph only when that node exists there', async () => {
		listPeers.mockResolvedValue({ peers: [peer] })
		lookupGraphNode.mockResolvedValueOnce({
			node: {
				pub_key: peerPublicKey,
			},
		})
		const $localNodeState = {
			connectionId: 'local-lnd',
			$network: {
				$network: lightningNetwork,
			},
		}
		await expect(peerResolver.resolve.LocalNodeStatePublicKey.resolve({
			$localNodeState,
			publicKey: peerPublicKey,
		}, context)).resolves.toMatchObject({
			$node: {
				[EntityMetaKey.Selector]: {
					$network: lightningNetwork,
					publicKey: peerPublicKey,
				},
			},
		})

		lookupGraphNode.mockResolvedValueOnce(undefined)
		expect(
			peerResolver.projections.$node(
				await peerResolver.resolve.LocalNodeStatePublicKey.resolve({
					$localNodeState,
					publicKey: peerPublicKey,
				}, context)
			)
		).toBeUndefined()

		lookupGraphNode.mockRejectedValueOnce(new Error('graph unavailable'))
		await expect(peerResolver.resolve.LocalNodeStatePublicKey.resolve({
			$localNodeState,
			publicKey: peerPublicKey,
		}, context)).rejects.toThrow('graph unavailable')
	})

	it('pages modern forwarding occurrences and resolves an exact later-page forward', async () => {
		const $localNodeState = {
			connectionId: 'local-lnd',
			$network: {
				$network: lightningNetwork,
			},
		}
		getForwardingHistory.mockResolvedValueOnce({
			forwarding_events: [forward],
			last_offset_index: 1,
		})
		const firstPage = await nodeForwardsResolver.resolve.ConnectionIdNetwork.resolve($localNodeState, {
			...context,
			pagination: { limit: 1 },
		})
		expect(nodeForwardsResolver.projections.$$forwards.select(firstPage)).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$localNodeState,
					$incomingChannel: {
						$network: lightningNetwork,
						channelId: '42',
					},
					incomingHtlcId: 7n,
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.BlockheadLightningForward, [], '$outgoingChannel')]: {
						[EntityMetaKey.Selector]: {
							$network: lightningNetwork,
							channelId: '99',
						},
					},
					[entityFieldAddressKey(EntityType.BlockheadLightningForward, [], 'outgoingHtlcId')]: 8n,
					[entityFieldAddressKey(EntityType.BlockheadLightningForward, [], 'feeMsat')]: 100n,
					[entityFieldAddressKey(EntityType.BlockheadLightningForward, [], 'completionTimestampNs')]: 1_700_000_000_123_456_789n,
				}),
			}),
		])
		expect(nodeForwardsResolver.projections.$$forwards.continuation(
			firstPage,
			$localNodeState,
			context
		)).toEqual({
			operation: 'forwards',
			target: 'local-lnd',
			terminal: false,
			token: '1',
		})

		getForwardingHistory
			.mockResolvedValueOnce({
				forwarding_events: Array.from({ length: 100 }, (_, index) => ({
					...forward,
					incoming_htlc_id: String(index + 100),
				})),
				last_offset_index: 100,
			})
			.mockResolvedValueOnce({
				forwarding_events: [forward],
				last_offset_index: 101,
			})
		await expect(forwardResolver.resolve.LocalNodeStateIncomingChannelIncomingHtlcId.resolve({
			$localNodeState,
			$incomingChannel: {
				$network: lightningNetwork,
				channelId: '42',
			},
			incomingHtlcId: 7n,
		}, context)).resolves.toMatchObject({
			incomingHtlcId: 7n,
			outgoingHtlcId: 8n,
			incomingMsat: 1000n,
			outgoingMsat: 900n,
		})
		expect(getForwardingHistory).toHaveBeenLastCalledWith({
			indexOffset: 100,
			numMaxEvents: 100,
		})
	})

	it('omits hashless invoices and separates stable and observed invoice fields', async () => {
		getInvoice.mockResolvedValue(invoice)
		listInvoices.mockResolvedValue({
			invoices: [
				{},
				invoice,
			],
		})
		const invoiceSelector = {
			$network: lightningNetwork,
			paymentHash: invoice.r_hash_str,
		}

		await expect(invoiceResolver.resolve.NetworkPaymentHash.resolve(invoiceSelector, context)).resolves.toMatchObject({
			valueMsat: 123000n,
			createdAtMs: 1_700_000_000_000,
		})
		await expect(invoiceTimestampResolver.resolve.InvoiceTimestampMsSource.resolve({
			$invoice: invoiceSelector,
			timestampMs: 1,
			source: Source.LightningLnd_Rest,
		}, context)).resolves.toEqual({
			amountPaidMsat: 123000n,
			settledAtMs: 1_700_000_010_000,
			state: 'Settled',
			settleIndex: 5n,
		})
		expect(getInvoice).toHaveBeenCalledTimes(2)
		expect(getInvoice).toHaveBeenLastCalledWith({
			paymentHash: invoice.r_hash_str,
		})
		const invoicePage = await invoiceListResolver.resolve.Network.resolve({ $network: lightningNetwork }, context)
		expect(invoiceListResolver.projections.$$invoices.select(invoicePage)).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: invoiceSelector,
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], 'valueMsat')]: 123000n,
					[entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], 'createdAtMs')]: 1_700_000_000_000,
					[entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], '$$timestamps')]: [expect.objectContaining({
						[EntityMetaKey.Fields]: expect.objectContaining({
							[entityFieldAddressKey(EntityType.BlockheadLightningInvoice_Timestamp, [], 'state')]: 'Settled',
							[entityFieldAddressKey(EntityType.BlockheadLightningInvoice_Timestamp, [], 'amountPaidMsat')]: 123000n,
						}),
					})],
				}),
			}),
		])
		expect(listInvoices).toHaveBeenLastCalledWith({
			indexOffset: undefined,
			numMaxInvoices: 64,
		})
	})

	it('rejects duplicate invoice and payment identities from provider pages', () => {
		expect(() => invoiceListResolver.projections.$$invoices.select({
			page: {
				invoices: [
					invoice,
					invoice,
				],
			},
			pageSize: 2,
		})).toThrow('LightningLnd_Rest: invoice page contains duplicate identities')

		expect(() => paymentListResolver.projections.$$payments.select({
			page: {
				payments: [
					payment,
					payment,
				],
			},
			pageSize: 2,
		})).toThrow('LightningLnd_Rest: payment page contains duplicate identities')
	})

	it('continues invoice and payment pages from lossless LND offsets', async () => {
		const invoicePage = {
			page: {
				invoices: Array.from({ length: 2 }, () => invoice),
				last_index_offset: '9007199254740993',
			},
			pageSize: 2,
		}
		expect(invoiceListResolver.projections.$$invoices.continuation(
			invoicePage,
			{ $network: lightningNetwork },
			context
		)).toEqual({
			operation: 'invoices',
			target: 'lightning',
			terminal: false,
			token: '9007199254740993',
		})

		const continuationContext = {
			...context,
			providerContinuationToken: '9007199254740993',
		}
		listPayments.mockResolvedValue({
			payments: [payment],
			last_index_offset: '9007199254740994',
		})
		const paymentPage = await paymentListResolver.resolve.Network.resolve(
			{ $network: lightningNetwork },
			continuationContext
		)
		expect(listPayments).toHaveBeenCalledWith({
			indexOffset: '9007199254740993',
			maxPayments: 64,
		})
		expect(paymentListResolver.projections.$$payments.select(paymentPage)).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$network: lightningNetwork,
					paymentHash: payment.payment_hash,
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.BlockheadLightningPayment, [], 'createdAtMs')]: 1_700_000_000_123,
					[entityFieldAddressKey(EntityType.BlockheadLightningPayment, [], '$$timestamps')]: [expect.objectContaining({
						[EntityMetaKey.Fields]: expect.objectContaining({
							[entityFieldAddressKey(EntityType.BlockheadLightningPayment_Timestamp, [], 'status')]: 'Succeeded',
							[entityFieldAddressKey(EntityType.BlockheadLightningPayment_Timestamp, [], 'feeMsat')]: 20n,
						}),
					})],
				}),
			}),
		])
		expect(paymentListResolver.projections.$$payments.continuation(
			paymentPage,
			{ $network: lightningNetwork },
			continuationContext
		)).toEqual({
			operation: 'payments',
			target: 'lightning',
			terminal: false,
			token: '9007199254740994',
		})
	})

	it('prefers nanosecond payment time and preserves observations', async () => {
		getPayment.mockResolvedValue(payment)
		const paymentSelector = {
			$network: lightningNetwork,
			paymentHash: payment.payment_hash,
		}

		await expect(paymentResolver.resolve.NetworkPaymentHash.resolve(paymentSelector, context)).resolves.toMatchObject({
			createdAtMs: 1_700_000_000_123,
		})
		await expect(paymentTimestampResolver.resolve.PaymentTimestampMsSource.resolve({
			$payment: paymentSelector,
			timestampMs: 1,
			source: Source.LightningLnd_Rest,
		}, context)).resolves.toEqual({
			feeMsat: 20n,
			status: 'Succeeded',
			failureReason: '',
			preimage: 'preimage',
		})
		expect(getPayment).toHaveBeenNthCalledWith(1, {
			paymentHash: payment.payment_hash,
		})
		expect(getPayment).toHaveBeenNthCalledWith(2, {
			paymentHash: payment.payment_hash,
		})
	})

	it('projects local node tip sync fields and channel state balances including private peers', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_111_000)
		getInfo.mockResolvedValue({
			version: '0.18.5-beta',
			identity_pubkey: localPublicKey,
			alias: 'Local',
			synced_to_chain: true,
			synced_to_graph: false,
			block_height: 800_000,
			best_header_timestamp: '1700000111',
			num_peers: 4,
			num_active_channels: 1,
			num_inactive_channels: 0,
			num_pending_channels: 2,
		})
		getWalletBalance.mockResolvedValue({
			total_balance: '500000',
			confirmed_balance: '499000',
		})
		getChannelBalance.mockResolvedValue({
			local_balance: {
				sat: '250000',
			},
			pending_open_local_balance: {
				sat: '10000',
			},
		})
		listChannels.mockResolvedValue({
			channels: [
				channel,
				{
					...channel,
					chan_id: '43',
					private: true,
					pending_htlcs: [],
				},
			],
		})

		const localNodeState = {
			connectionId: 'local-lnd',
			$network: {
				$network: lightningNetwork,
			},
		} as const
		const channelSelector = {
			$network: lightningNetwork,
			channelId: '43',
		}

		await expect(nodeStateTimestampResolver.resolve.LocalNodeStateTimestampMsSource.resolve({
			$localNodeState: localNodeState,
			timestampMs: 1,
			source: Source.LightningLnd_Rest,
		}, context)).resolves.toEqual({
			nodeVersion: '0.18.5-beta',
			syncedToChain: true,
			syncedToGraph: false,
			blockHeight: 800000n,
			bestHeaderTimestampMs: 1_700_000_111_000,
			walletBalanceSats: 500000n,
			channelBalanceSats: 250000n,
			pendingChannelBalanceSats: 10000n,
			peerCount: 4,
			activeChannelCount: 1,
			inactiveChannelCount: 0,
			pendingChannelCount: 2,
		})
		expect(getWalletBalance).toHaveBeenCalledWith()
		expect(getChannelBalance).toHaveBeenCalledWith()

		const channelStates = await nodeChannelStatesResolver.resolve.ConnectionIdNetwork.resolve(
			localNodeState,
			context
		)
		expect(channelStates.map((channelState) => channelState[EntityMetaKey.Selector])).toEqual([
			{
				$localNodeState: localNodeState,
				$channel: {
					$network: lightningNetwork,
					channelId: '42',
				},
			},
			{
				$localNodeState: localNodeState,
				$channel: channelSelector,
			},
		])
		expect(channelStates[0]?.[EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.BlockheadLightningChannelState, [], 'private')]: false,
			[entityFieldAddressKey(EntityType.BlockheadLightningChannelState, [], 'initiator')]: true,
			[entityFieldAddressKey(EntityType.BlockheadLightningChannelState, [], '$$timestamps')]: [{
				[EntityMetaKey.Selector]: {
					$channelState: {
						$localNodeState: localNodeState,
						$channel: {
							$network: lightningNetwork,
							channelId: '42',
						},
					},
					timestampMs: 1_700_000_111_000,
					source: Source.LightningLnd_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'localBalanceSats')]: 100000n,
					[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'remoteBalanceSats')]: 150000n,
					[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'unsettledBalanceSats')]: 0n,
					[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'active')]: true,
					[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'commitFeeSats')]: 183n,
					[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'commitWeight')]: 600n,
					[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'feePerKw')]: 253n,
					[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'numUpdates')]: 69n,
				},
			}],
			[entityFieldAddressKey(EntityType.BlockheadLightningChannelState, [], '$$htlcs')]: [{
				[EntityMetaKey.Selector]: {
					$channelState: {
						$localNodeState: localNodeState,
						$channel: {
							$network: lightningNetwork,
							channelId: '42',
						},
					},
					htlcIndex: 7,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BlockheadLightningHtlc, [], '$channel')]: {
						[EntityMetaKey.Selector]: {
							$network: lightningNetwork,
							channelId: '42',
						},
					},
					[entityFieldAddressKey(EntityType.BlockheadLightningHtlc, [], 'direction')]: 'Incoming',
					[entityFieldAddressKey(EntityType.BlockheadLightningHtlc, [], 'amountMsat')]: 12000n,
					[entityFieldAddressKey(EntityType.BlockheadLightningHtlc, [], 'expiryHeight')]: 800001n,
					[entityFieldAddressKey(EntityType.BlockheadLightningHtlc, [], 'hashLock')]: 'aa',
					[entityFieldAddressKey(EntityType.BlockheadLightningHtlc, [], 'state')]: 'Accepted',
				},
			}],
		})

		await expect(channelStateResolver.resolve.LocalNodeStateChannel.resolve({
			$localNodeState: localNodeState,
			$channel: channelSelector,
		}, context)).resolves.toMatchObject({
			private: true,
			initiator: true,
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					$channelState: {
						$localNodeState: localNodeState,
						$channel: channelSelector,
					},
					timestampMs: 1_700_000_111_000,
					source: Source.LightningLnd_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'localBalanceSats')]: 100000n,
					[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'remoteBalanceSats')]: 150000n,
					[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'unsettledBalanceSats')]: 0n,
					[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'active')]: true,
					[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'commitFeeSats')]: 183n,
					[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'commitWeight')]: 600n,
					[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'feePerKw')]: 253n,
					[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'numUpdates')]: 69n,
				},
			}],
		})
		expect(lightningLnd.resolvers.some((resolver) => (
			resolver.entityType === EntityType.BlockheadLightningChannelState_Timestamp
		))).toBe(false)

		await expect(htlcResolver.resolve.ChannelStateHtlcIndex.resolve({
			$channelState: {
				$localNodeState: localNodeState,
				$channel: {
					$network: lightningNetwork,
					channelId: '42',
				},
			},
			htlcIndex: 7,
		}, context)).resolves.toEqual({
			htlcIndex: 7,
			$channel: {
				[EntityMetaKey.Selector]: {
					$network: lightningNetwork,
					channelId: '42',
				},
			},
			direction: 'Incoming',
			amountMsat: 12000n,
			expiryHeight: 800001n,
			hashLock: 'aa',
			state: 'Accepted',
		})
	})

	it('projects enrolled Lightning network tip capacities from graph info', async () => {
		getNetworkInfo.mockResolvedValue({
			num_nodes: 20_000,
			num_channels: 80_000,
			total_network_capacity: '5000000000000',
			avg_channel_size: 62_500,
			median_channel_size_sat: '50000',
		})

		await expect(networkTimestampResolver.resolve.LightningNetworkTimestampMsSource.resolve({
			$lightningNetwork: {
				$network: lightningNetwork,
			},
			timestampMs: 1,
			source: Source.LightningLnd_Rest,
		}, context)).resolves.toEqual({
			nodeCount: 20_000,
			channelCount: 80_000,
			totalCapacitySats: 5_000_000_000_000n,
			averageCapacitySats: 62500n,
			medianCapacitySats: 50000n,
		})
	})
})

describe('Lightning LND exact relationship counts, continuations, and provider clocks', () => {
	const localNodeState = {
		connectionId: 'local-lnd',
		$network: {
			$network: lightningNetwork,
		},
	} as const

	it('stamps public node observations with last_update and rejects a mismatched retrieval clock', async () => {
		getNodeInfo.mockResolvedValue({
			node: {
				pub_key: peerPublicKey,
				last_update: 1_700_000_000,
			},
			num_channels: 3,
			total_capacity: '9000000',
		})

		await expect(nodeResolver.resolve.NetworkPublicKey.resolve({
			$network: lightningNetwork,
			publicKey: peerPublicKey,
		}, context)).resolves.toEqual({
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					$node: {
						$network: lightningNetwork,
						publicKey: peerPublicKey,
					},
					timestampMs: 1_700_000_000_000,
					source: Source.LightningLnd_Rest,
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'capacitySats')]: 9_000_000n,
					[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'channelCount')]: 3,
				}),
			}],
		})
		await expect(nodeTimestampResolver.resolve.NodeTimestampMsSource.resolve({
			$node: {
				$network: lightningNetwork,
				publicKey: peerPublicKey,
			},
			timestampMs: 1,
			source: Source.LightningLnd_Rest,
		}, context)).rejects.toThrow('node observation clock mismatch')
		expect(getInfo).not.toHaveBeenCalled()
		expect(listChannels).not.toHaveBeenCalled()

		getNodeInfo.mockResolvedValueOnce({
			node: {
				pub_key: peerPublicKey,
			},
			num_channels: 3,
		})
		await expect(nodeTimestampResolver.resolve.NodeTimestampMsSource.resolve({
			$node: {
				$network: lightningNetwork,
				publicKey: peerPublicKey,
			},
			timestampMs: 1,
			source: Source.LightningLnd_Rest,
		}, context)).rejects.toThrow('node missing observation clock')
	})

	it('embeds retrieval-clock local node fields instead of replaying them through the timestamp resolver', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_111_000)
		getNodeInfo.mockRejectedValue(new Error('not in graph'))
		getInfo.mockResolvedValue({
			identity_pubkey: localPublicKey,
			alias: 'Local',
			color: '#abcdef',
			num_active_channels: 1,
			num_inactive_channels: 2,
			uris: ['local.example:9735'],
		})
		listChannels.mockResolvedValue({ channels: [channel] })

		await expect(nodeResolver.resolve.NetworkPublicKey.resolve({
			$network: lightningNetwork,
			publicKey: localPublicKey,
		}, context)).resolves.toEqual({
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					$node: {
						$network: lightningNetwork,
						publicKey: localPublicKey,
					},
					timestampMs: 1_700_000_111_000,
					source: Source.LightningLnd_Rest,
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'alias')]: 'Local',
					[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'channelCount')]: 3,
					[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'networkAddresses')]: ['local.example:9735'],
				}),
			}],
		})
		await expect(nodeTimestampResolver.resolve.NodeTimestampMsSource.resolve({
			$node: {
				$network: lightningNetwork,
				publicKey: localPublicKey,
			},
			timestampMs: 1_700_000_111_000,
			source: Source.LightningLnd_Rest,
		}, context)).rejects.toThrow('not in graph')
	})

	it('rejects a mismatched public channel last_update without falling back to the local list', async () => {
		getChannelInfo.mockResolvedValue(edge)
		listChannels.mockResolvedValue({ channels: [channel] })

		await expect(channelTimestampResolver.resolve.ChannelTimestampMsSource.resolve({
			$channel: {
				$network: lightningNetwork,
				channelId: channel.chan_id,
			},
			timestampMs: 99,
			source: Source.LightningLnd_Rest,
		}, context)).rejects.toThrow('channel observation clock mismatch')
		expect(listChannels).not.toHaveBeenCalled()
	})

	it('counts node channels from graph num_channels, not the sliced edge page', async () => {
		getNodeInfo.mockResolvedValue({
			node: {
				pub_key: peerPublicKey,
			},
			num_channels: 17,
			channels: [edge],
		})

		const partialChannels = await nodeChannelsResolver.resolve.NetworkPublicKey.resolve({
			$network: lightningNetwork,
			publicKey: peerPublicKey,
		}, {
			...context,
			pagination: {
				limit: 1,
			},
		})
		expect(nodeChannelsResolver.projections.$$channels(partialChannels)).toHaveLength(1)
		expect(getNodeInfo).toHaveBeenCalledWith({
			publicKey: peerPublicKey,
			includeChannels: true,
		})

		await expect(nodeChannelCountResolver.resolve.NetworkPublicKey.resolve({
			$network: lightningNetwork,
			publicKey: peerPublicKey,
		}, context)).resolves.toBe(17)
		expect(nodeChannelCountResolver.projections.$$channels.resolveCount(17)).toBe(17)
		expect(getNodeInfo).toHaveBeenLastCalledWith({
			publicKey: peerPublicKey,
		})
		expect(listChannels).not.toHaveBeenCalled()
	})

	it('fail-closes a graph node missing num_channels or unavailable from the public graph', async () => {
		getNodeInfo.mockResolvedValueOnce({
			node: {
				pub_key: peerPublicKey,
			},
		})
		await expect(nodeChannelCountResolver.resolve.NetworkPublicKey.resolve({
			$network: lightningNetwork,
			publicKey: peerPublicKey,
		}, context)).rejects.toThrow('node info missing channel count')
		expect(listChannels).not.toHaveBeenCalled()

		getNodeInfo.mockRejectedValueOnce(new Error('not in graph'))
		await expect(nodeChannelCountResolver.resolve.NetworkPublicKey.resolve({
			$network: lightningNetwork,
			publicKey: peerPublicKey,
		}, context)).rejects.toThrow('not in graph')
		expect(getInfo).not.toHaveBeenCalled()
		expect(listChannels).not.toHaveBeenCalled()
	})

	it('counts local peers and open channel states from getinfo, not list page length', async () => {
		getInfo.mockResolvedValue({
			identity_pubkey: localPublicKey,
			num_peers: 4,
			num_active_channels: 1,
			num_inactive_channels: 2,
			num_pending_channels: 9,
		})

		await expect(nodePeerCountResolver.resolve.ConnectionIdNetwork.resolve(
			localNodeState,
			context
		)).resolves.toBe(4)
		expect(nodePeerCountResolver.projections.$$peers.resolveCount(4)).toBe(4)
		expect(listPeers).not.toHaveBeenCalled()

		await expect(nodeChannelStateCountResolver.resolve.ConnectionIdNetwork.resolve(
			localNodeState,
			context
		)).resolves.toBe(3)
		expect(nodeChannelStateCountResolver.projections.$$channelStates.resolveCount(3)).toBe(3)
		expect(listChannels).not.toHaveBeenCalled()
	})

	it('fail-closes missing getinfo peer and open-channel counts before transport lists', async () => {
		getInfo.mockResolvedValueOnce({
			identity_pubkey: localPublicKey,
		})
		await expect(nodePeerCountResolver.resolve.ConnectionIdNetwork.resolve(
			localNodeState,
			context
		)).rejects.toThrow('getinfo missing peer count')

		getInfo.mockResolvedValueOnce({
			identity_pubkey: localPublicKey,
			num_active_channels: 1,
		})
		await expect(nodeChannelStateCountResolver.resolve.ConnectionIdNetwork.resolve(
			localNodeState,
			context
		)).rejects.toThrow('getinfo missing open channel counts')
		expect(listPeers).not.toHaveBeenCalled()
		expect(listChannels).not.toHaveBeenCalled()
	})

	it('counts pending HTLCs from the complete local channel array', async () => {
		listChannels.mockResolvedValue({ channels: [channel] })
		const htlcs = await channelStateHtlcsResolver.resolve.LocalNodeStateChannel.resolve({
			$localNodeState: localNodeState,
			$channel: {
				$network: lightningNetwork,
				channelId: '42',
			},
		}, context)
		expect(channelStateHtlcsResolver.projections.$$htlcs.select(htlcs)).toEqual([{
			[EntityMetaKey.Selector]: {
				$channelState: {
					$localNodeState: localNodeState,
					$channel: {
						$network: lightningNetwork,
						channelId: '42',
					},
				},
				htlcIndex: 7,
			},
		}])
		expect(channelStateHtlcsResolver.projections.$$htlcs.resolveCount(htlcs)).toBe(1)
	})

	it('continues invoice and payment index pages until the offset stops advancing or the page is empty', () => {
		expect(invoiceListResolver.projections.$$invoices.continuation({
			page: {
				invoices: [invoice],
				last_index_offset: '2',
			},
		}, { $network: lightningNetwork }, context)).toEqual({
			operation: 'invoices',
			target: 'lightning',
			terminal: false,
			token: '2',
		})
		expect(invoiceListResolver.projections.$$invoices.continuation({
			page: {
				invoices: [invoice],
				last_index_offset: '2',
			},
		}, { $network: lightningNetwork }, {
			...context,
			providerContinuationToken: '2',
		})).toEqual({
			operation: 'invoices',
			target: 'lightning',
			terminal: true,
		})
		expect(paymentListResolver.projections.$$payments.continuation({
			page: {
				payments: [],
				last_index_offset: '9',
			},
		}, { $network: lightningNetwork }, context)).toEqual({
			operation: 'payments',
			target: 'lightning',
			terminal: true,
		})
	})
})

describe('Lightning LND BlockheadLightningNodeState $$timestamps resolveLive', () => {
	const localNodeState = {
		connectionId: 'local-lnd',
		$network: {
			$network: lightningNetwork,
		},
	} as const
	const liveFieldHandle = () => ({
		replaceRows: vi.fn(),
		invalidate: vi.fn(),
		count: {
			replaceRows: vi.fn(),
			invalidate: vi.fn(),
		},
	})
	const liveFields = () => ({
		$$timestamps: liveFieldHandle(),
		$$peers: liveFieldHandle(),
		$$channelStates: liveFieldHandle(),
	})
	const mockLndNodeObservation = ({
		num_peers = 4,
		num_active_channels = 1,
		num_inactive_channels = 0,
		num_pending_channels = 2,
	} = {}) => {
		getInfo.mockResolvedValue({
			version: '0.18.5-beta',
			identity_pubkey: localPublicKey,
			alias: 'Local',
			synced_to_chain: true,
			synced_to_graph: false,
			block_height: 800_000,
			best_header_timestamp: '1700000111',
			num_peers,
			num_active_channels,
			num_inactive_channels,
			num_pending_channels,
		})
		getWalletBalance.mockResolvedValue({
			total_balance: '500000',
			confirmed_balance: '499000',
		})
		getChannelBalance.mockResolvedValue({
			local_balance: {
				sat: '250000',
			},
			pending_open_local_balance: {
				sat: '10000',
			},
		})
	}
	const startOperatorState = (
		fields = liveFields(),
		signal = new AbortController().signal
	) => ({
		fields,
		cleanup: nodeStateResolver.resolveLive.operatorState.start({
			parentEntitySelector: localNodeState,
			queryClient: {},
			signal,
			trigger: context,
			fields,
		}),
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('polls getinfo, walletbalance, and channelbalance into one native retrieval-clock timestamp row', async () => {
		vi.useFakeTimers()
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_111_000)
		mockLndNodeObservation()
		const { fields, cleanup } = startOperatorState()
		await vi.waitFor(() => expect(fields.$$timestamps.replaceRows).toHaveBeenCalledOnce())

		expect(getInfo).toHaveBeenCalledOnce()
		expect(getWalletBalance).toHaveBeenCalledOnce()
		expect(getChannelBalance).toHaveBeenCalledOnce()
		expect(getNetworkInfo).not.toHaveBeenCalled()
		expect(listChannels).not.toHaveBeenCalled()
		expect(listPeers).not.toHaveBeenCalled()
		expect(fields.$$timestamps.replaceRows).toHaveBeenCalledWith([{
			source: Source.LightningLnd_Rest,
			value: [{
				[EntityMetaKey.Selector]: {
					$localNodeState: localNodeState,
					timestampMs: 1_700_000_111_000,
					source: Source.LightningLnd_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BlockheadLightningNodeState_Timestamp, [], 'nodeVersion')]: '0.18.5-beta',
					[entityFieldAddressKey(EntityType.BlockheadLightningNodeState_Timestamp, [], 'syncedToChain')]: true,
					[entityFieldAddressKey(EntityType.BlockheadLightningNodeState_Timestamp, [], 'syncedToGraph')]: false,
					[entityFieldAddressKey(EntityType.BlockheadLightningNodeState_Timestamp, [], 'blockHeight')]: 800000n,
					[entityFieldAddressKey(EntityType.BlockheadLightningNodeState_Timestamp, [], 'bestHeaderTimestampMs')]: 1_700_000_111_000,
					[entityFieldAddressKey(EntityType.BlockheadLightningNodeState_Timestamp, [], 'walletBalanceSats')]: 500000n,
					[entityFieldAddressKey(EntityType.BlockheadLightningNodeState_Timestamp, [], 'channelBalanceSats')]: 250000n,
					[entityFieldAddressKey(EntityType.BlockheadLightningNodeState_Timestamp, [], 'pendingChannelBalanceSats')]: 10000n,
					[entityFieldAddressKey(EntityType.BlockheadLightningNodeState_Timestamp, [], 'peerCount')]: 4,
					[entityFieldAddressKey(EntityType.BlockheadLightningNodeState_Timestamp, [], 'activeChannelCount')]: 1,
					[entityFieldAddressKey(EntityType.BlockheadLightningNodeState_Timestamp, [], 'inactiveChannelCount')]: 0,
					[entityFieldAddressKey(EntityType.BlockheadLightningNodeState_Timestamp, [], 'pendingChannelCount')]: 2,
				},
			}],
		}])
		expect(fields.$$peers.invalidate).not.toHaveBeenCalled()
		expect(fields.$$channelStates.invalidate).not.toHaveBeenCalled()
		expect(nodeStateResolver.resolveLive.operatorState.publishes).toEqual({
			$$timestamps: true,
			$$peers: true,
			$$channelStates: true,
		})

		cleanup()
	})

	it('leaves the prior timestamp row intact when a later coherent poll fails, then resumes', async () => {
		vi.useFakeTimers()
		vi.spyOn(console, 'error').mockImplementation(() => {})
		mockLndNodeObservation()
		const abortController = new AbortController()
		const { fields, cleanup } = startOperatorState(liveFields(), abortController.signal)
		await vi.waitFor(() => expect(fields.$$timestamps.replaceRows).toHaveBeenCalledOnce())

		getInfo.mockRejectedValueOnce(new Error('lnd unavailable'))
		await vi.advanceTimersByTimeAsync(10_000)
		expect(fields.$$timestamps.replaceRows).toHaveBeenCalledOnce()
		expect(fields.$$peers.invalidate).not.toHaveBeenCalled()
		expect(fields.$$channelStates.invalidate).not.toHaveBeenCalled()
		expect(console.error).toHaveBeenCalledWith(
			'LightningLnd_Rest live node state failed',
			expect.objectContaining({
				message: 'lnd unavailable',
			})
		)

		await vi.advanceTimersByTimeAsync(10_000)
		await vi.waitFor(() => expect(fields.$$timestamps.replaceRows).toHaveBeenCalledTimes(2))

		abortController.abort()
		cleanup()
	})

	it('stops polling after abort and cleanup, including an in-flight three-call snapshot', async () => {
		vi.useFakeTimers()
		mockLndNodeObservation()
		const abortController = new AbortController()
		const { fields, cleanup } = startOperatorState(liveFields(), abortController.signal)
		await vi.waitFor(() => expect(fields.$$timestamps.replaceRows).toHaveBeenCalledOnce())

		abortController.abort()
		cleanup()
		await vi.advanceTimersByTimeAsync(10_000)
		expect(getInfo).toHaveBeenCalledTimes(1)
		expect(getWalletBalance).toHaveBeenCalledTimes(1)
		expect(getChannelBalance).toHaveBeenCalledTimes(1)

		const inFlightInfo = Promise.withResolvers()
		getInfo.mockImplementationOnce(() => inFlightInfo.promise)
		const inFlightAbort = new AbortController()
		const inFlight = startOperatorState(liveFields(), inFlightAbort.signal)
		inFlightAbort.abort()
		inFlight.cleanup()
		inFlightInfo.resolve({
			identity_pubkey: localPublicKey,
			num_peers: 9,
			num_active_channels: 3,
			num_inactive_channels: 1,
		})
		await Promise.resolve()
		expect(inFlight.fields.$$timestamps.replaceRows).not.toHaveBeenCalled()
	})

	it('invalidates $$peers only when a later poll proves peerCount changed', async () => {
		vi.useFakeTimers()
		mockLndNodeObservation({
			num_peers: 4,
		})
		const abortController = new AbortController()
		const { fields, cleanup } = startOperatorState(liveFields(), abortController.signal)
		await vi.waitFor(() => expect(fields.$$timestamps.replaceRows).toHaveBeenCalledOnce())
		expect(fields.$$peers.invalidate).not.toHaveBeenCalled()

		mockLndNodeObservation({
			num_peers: 4,
		})
		await vi.advanceTimersByTimeAsync(10_000)
		await vi.waitFor(() => expect(fields.$$timestamps.replaceRows).toHaveBeenCalledTimes(2))
		expect(fields.$$peers.invalidate).not.toHaveBeenCalled()

		mockLndNodeObservation({
			num_peers: 5,
		})
		await vi.advanceTimersByTimeAsync(10_000)
		await vi.waitFor(() => expect(fields.$$timestamps.replaceRows).toHaveBeenCalledTimes(3))
		expect(fields.$$peers.invalidate).toHaveBeenCalledOnce()
		expect(fields.$$channelStates.invalidate).not.toHaveBeenCalled()

		abortController.abort()
		cleanup()
	})

	it('invalidates $$channelStates only when open-channel membership count changes, not equal active/inactive splits or pending-only drift', async () => {
		vi.useFakeTimers()
		mockLndNodeObservation({
			num_active_channels: 1,
			num_inactive_channels: 0,
			num_pending_channels: 2,
		})
		const abortController = new AbortController()
		const { fields, cleanup } = startOperatorState(liveFields(), abortController.signal)
		await vi.waitFor(() => expect(fields.$$timestamps.replaceRows).toHaveBeenCalledOnce())
		expect(fields.$$channelStates.invalidate).not.toHaveBeenCalled()

		mockLndNodeObservation({
			num_active_channels: 0,
			num_inactive_channels: 1,
			num_pending_channels: 9,
		})
		await vi.advanceTimersByTimeAsync(10_000)
		await vi.waitFor(() => expect(fields.$$timestamps.replaceRows).toHaveBeenCalledTimes(2))
		expect(fields.$$channelStates.invalidate).not.toHaveBeenCalled()
		expect(fields.$$peers.invalidate).not.toHaveBeenCalled()

		mockLndNodeObservation({
			num_active_channels: 2,
			num_inactive_channels: 1,
			num_pending_channels: 9,
		})
		await vi.advanceTimersByTimeAsync(10_000)
		await vi.waitFor(() => expect(fields.$$timestamps.replaceRows).toHaveBeenCalledTimes(3))
		expect(fields.$$channelStates.invalidate).toHaveBeenCalledOnce()

		abortController.abort()
		cleanup()
	})

	it('rejects a non-Lightning parent before the three LND retrievals', () => {
		expect(() => nodeStateResolver.resolveLive.operatorState.start({
			parentEntitySelector: {
				connectionId: 'local-lnd',
				$network: {
					$network: {
						slug: 'bitcoin',
					},
				},
			},
			queryClient: {},
			signal: new AbortController().signal,
			trigger: context,
			fields: liveFields(),
		})).toThrow('unsupported Lightning network')
		expect(getInfo).not.toHaveBeenCalled()
		expect(getWalletBalance).not.toHaveBeenCalled()
		expect(getChannelBalance).not.toHaveBeenCalled()
	})
})

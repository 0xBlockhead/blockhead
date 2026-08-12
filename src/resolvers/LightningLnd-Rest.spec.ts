import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const {
	getChannelBalance,
	getChannelInfo,
	getInfo,
	getInvoice,
	getNetworkInfo,
	getNodeInfo,
	getWalletBalance,
	listChannels,
	listInvoices,
	listPayments,
} = vi.hoisted(() => ({
	getChannelBalance: vi.fn(),
	getChannelInfo: vi.fn(),
	getInfo: vi.fn(),
	getInvoice: vi.fn(),
	getNetworkInfo: vi.fn(),
	getNodeInfo: vi.fn(),
	getWalletBalance: vi.fn(),
	listChannels: vi.fn(),
	listInvoices: vi.fn(),
	listPayments: vi.fn(),
}))

vi.mock('$/sources/LightningLnd/Rest/queries.ts', () => ({
	getChannelBalance,
	getChannelInfo,
	getInfo,
	getInvoice,
	getNetworkInfo,
	getNodeInfo,
	getWalletBalance,
	listChannels,
	listInvoices,
	listPayments,
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
	&& '$$channelStates' in resolver.projections
))
const channelStateResolver = lightningLnd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadLightningChannelState
	&& 'private' in resolver.projections
))
const channelStateTimestampResolver = lightningLnd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadLightningChannelState_Timestamp
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
	&& '$$channels' in resolver.projections
))
const nodeChannelsResolver = lightningLnd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.LightningNode
	&& '$$channels' in resolver.projections
))
if (
	nodeStateResolver == null
	|| nodeStateTimestampResolver == null
	|| nodeChannelStatesResolver == null
	|| channelStateResolver == null
	|| channelStateTimestampResolver == null
	|| htlcResolver == null
	|| networkTimestampResolver == null
	|| nodeTimestampResolver == null
	|| channelResolver == null
	|| channelTimestampResolver == null
	|| invoiceResolver == null
	|| invoiceTimestampResolver == null
	|| paymentResolver == null
	|| paymentTimestampResolver == null
	|| channelListResolver == null
	|| nodeChannelsResolver == null
)
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

	it('projects public-graph node capacity and falls back for private local peers', async () => {
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
			timestampMs: 1,
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
		getInfo.mockResolvedValue({
			identity_pubkey: localPublicKey,
		})
		listChannels.mockResolvedValue({
			channels: [
				channel,
				{
					...channel,
					remote_pubkey: `02${'c'.repeat(64)}`,
					chan_id: '43',
					private: true,
				},
			],
		})

		await expect(nodeTimestampResolver.resolve.NodeTimestampMsSource.resolve({
			$node: {
				$network: lightningNetwork,
				publicKey: peerPublicKey,
			},
			timestampMs: 1,
			source: Source.LightningLnd_Rest,
		}, context)).resolves.toMatchObject({
			channelCount: 1,
			networkAddresses: [],
		})
		await expect(nodeTimestampResolver.resolve.NodeTimestampMsSource.resolve({
			$node: {
				$network: lightningNetwork,
				publicKey: `02${'c'.repeat(64)}`,
			},
			timestampMs: 1,
			source: Source.LightningLnd_Rest,
		}, context)).rejects.toThrow('node not found')
	})

	it('resolves public graph channels with feeRatePpm and local fallback funding', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_001)
		getChannelInfo.mockResolvedValue(edge)
		listChannels.mockResolvedValue({ channels: [channel] })
		const channelSelector = {
			$network: lightningNetwork,
			channelId: channel.chan_id,
		}
		const timestampSelector = {
			$channel: channelSelector,
			timestampMs: 99,
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
			feeRatePpm: 125,
		})

		getChannelInfo.mockRejectedValueOnce(new Error('edge missing'))
		listChannels.mockResolvedValue({ channels: [channel] })
		await expect(
			channelTimestampResolver.resolve.ChannelTimestampMsSource.resolve(timestampSelector, context)
		).resolves.toEqual({
			status: 'Active',
			capacitySats: 250000n,
			feeRatePpm: undefined,
			updatedAtMs: undefined,
		})
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
							[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'feeRatePpm')]: 125,
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
			terminal: true,
		})
	})

	it('prefers nanosecond payment time and preserves observations', async () => {
		listPayments.mockResolvedValue({ payments: [payment] })
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
					[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'lastSyncedAt')]: 1_700_000_111_000,
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
		})

		await expect(channelStateTimestampResolver.resolve.ChannelStateTimestampMsSource.resolve({
			$channelState: {
				$localNodeState: localNodeState,
				$channel: {
					$network: lightningNetwork,
					channelId: '42',
				},
			},
			timestampMs: 1,
			source: Source.LightningLnd_Rest,
		}, context)).resolves.toEqual({
			localBalanceSats: 100000n,
			remoteBalanceSats: 150000n,
			unsettledBalanceSats: 0n,
			active: true,
			commitFeeSats: 183n,
			commitWeight: 600n,
			feePerKw: 253n,
			numUpdates: 69n,
			lastSyncedAt: 1_700_000_111_000,
		})

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

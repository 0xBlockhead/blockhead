import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const {
	getInfo,
	listChannels,
	listInvoices,
	listPayments,
} = vi.hoisted(() => ({
	getInfo: vi.fn(),
	listChannels: vi.fn(),
	listInvoices: vi.fn(),
	listPayments: vi.fn(),
}))

vi.mock('$/sources/LightningLnd/Rest/queries.ts', () => ({
	getInfo,
	listChannels,
	listInvoices,
	listPayments,
}))

const { default: lightningLnd } = await import('$/resolvers/LightningLnd-Rest.ts')

type InvoiceListResolver = Extract<
	typeof lightningLnd.resolvers[number],
	{ projections: Record<'$$invoices', unknown> }
>

const nodeStateResolver = lightningLnd.resolvers.find((resolver) => resolver.entityType === EntityType.BlockheadLightningNodeState)
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
if (
	nodeStateResolver == null
	|| nodeTimestampResolver == null
	|| channelResolver == null
	|| channelTimestampResolver == null
	|| invoiceResolver == null
	|| invoiceTimestampResolver == null
	|| paymentResolver == null
	|| paymentTimestampResolver == null
	|| invoiceListResolver == null
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
	publicEnv: {
		PUBLIC_LND_MACAROON_HEX: 'macaroon',
	},
}
const channel = {
	active: true,
	remote_pubkey: '02peer',
	channel_point: 'funding-transaction:7',
	chan_id: '42',
	capacity: '250000',
	private: false,
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
			identity_pubkey: '02local',
			alias: 'Local',
		})
		await expect(nodeStateResolver.resolve.ConnectionIdNetwork.resolve({
			connectionId: 'local-lnd',
			$network: {
				$network: lightningNetwork,
			},
		}, context)).resolves.toMatchObject({
			connectionId: 'local-lnd',
			lndPubkey: '02local',
			alias: 'Local',
			$node: {
				[EntityMetaKey.Selector]: {
					$network: lightningNetwork,
					publicKey: '02local',
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

	it('derives local and public-peer node observations without admitting private peers', async () => {
		getInfo.mockResolvedValue({
			identity_pubkey: '02local',
		})
		listChannels.mockResolvedValue({
			channels: [
				channel,
				{
					...channel,
					chan_id: '43',
				},
				{
					...channel,
					remote_pubkey: '02private',
					private: true,
				},
			],
		})
		const resolveNode = (publicKey: string) => (
			nodeTimestampResolver.resolve.NodeTimestampMsSource.resolve({
				$node: {
					$network: lightningNetwork,
					publicKey,
				},
				timestampMs: 1,
				source: Source.LightningLnd_Rest,
			}, context)
		)

		await expect(resolveNode('02peer')).resolves.toMatchObject({
			channelCount: 2,
			networkAddresses: [],
		})
		await expect(resolveNode('02private')).rejects.toThrow('node not found 02private')
	})

	it('keeps channel identity and observation fields separate and source-scoped', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_001)
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
					timestampMs: 1_700_000_000_001,
				},
			}],
		})
		const snapshot = await channelTimestampResolver.resolve.ChannelTimestampMsSource.resolve(timestampSelector, context)
		expect(snapshot).toEqual({
			status: 'Active',
			capacitySats: 250000n,
		})

		listChannels.mockClear()
		await expect(channelTimestampResolver.resolve.ChannelTimestampMsSource.resolve({
			...timestampSelector,
			source: Source.LightningMempoolSpace_Rest,
		}, context)).rejects.toThrow('unsupported source')
		expect(listChannels).not.toHaveBeenCalled()
	})

	it('omits hashless invoices and separates stable and observed invoice fields', async () => {
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
		await expect(invoiceListResolver.resolve.Network.resolve({ $network: lightningNetwork }, context)).resolves.toEqual([{
			[EntityMetaKey.Selector]: invoiceSelector,
		}])
		expect(listInvoices).toHaveBeenLastCalledWith({
			publicEnv: context.publicEnv,
			numMaxInvoices: 64,
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
})

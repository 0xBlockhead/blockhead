import { createResolverContext } from '../../tests/resolverContext.ts'
import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const {
	getBlock,
	getChannelInfo,
	getInfo,
	getLightningStatistics,
	getNetworkInfo,
	listChannels,
	listInvoices,
	listPayments,
} = vi.hoisted(() => ({
	getBlock: vi.fn(),
	getChannelInfo: vi.fn(),
	getInfo: vi.fn(),
	getLightningStatistics: vi.fn(),
	getNetworkInfo: vi.fn(),
	listChannels: vi.fn(),
	listInvoices: vi.fn(),
	listPayments: vi.fn(),
}))

vi.mock('$/sources/LightningLnd/Rest/queries.ts', () => ({
	getChannelInfo,
	getInfo,
	getNetworkInfo,
	listChannels,
	listInvoices,
	listPayments,
}))

vi.mock('$/sources/LightningMempoolSpace/Rest/queries.ts', () => ({
	getLightningStatistics,
}))

vi.mock('$/sources/MempoolSpace/Rest/queries.ts', () => ({
	getBlock,
}))

const [
	{ default: lightningLnd },
	{ default: lightningMempoolSpace },
	{ default: mempoolSpace },
] = await Promise.all([
	import('$/resolvers/LightningLnd-Rest.ts'),
	import('$/resolvers/LightningMempoolSpace-Rest.ts'),
	import('$/resolvers/MempoolSpace-Rest.ts'),
])

const context = createResolverContext()

const lightningNetwork = {
	slug: 'lightning',
} as const

const mempoolNetworkResolver = lightningMempoolSpace.resolvers.find((resolver) => (
	resolver.entityType === EntityType.LightningNetwork
	&& '$$timestamps' in resolver.projections
))
const lndNodeStateResolver = lightningLnd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadLightningNodeState
))
const lndChannelTimestampResolver = lightningLnd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.LightningChannel_Timestamp
))
if (
	mempoolNetworkResolver == null
	|| lndNodeStateResolver == null
	|| lndChannelTimestampResolver == null
)
	throw new Error('LightningMempoolBindings spec missing resolver')

beforeEach(() => {
	vi.resetAllMocks()
})

describe('Lightning and mempool resolver bindings', () => {
	it('fail-closes Mempool public observations for unsupported networks before transport', async () => {
		await expect(mempoolNetworkResolver.resolve.Network.resolve({
			$network: {
				slug: 'bitcoin',
			},
		}, context)).rejects.toThrow('unsupported Lightning network')
		expect(getLightningStatistics).not.toHaveBeenCalled()
		expect(getInfo).not.toHaveBeenCalled()
		expect(getNetworkInfo).not.toHaveBeenCalled()
	})

	it('fail-closes LND channel observations when stamped as MempoolSpace before transport', async () => {
		await expect(lndChannelTimestampResolver.resolve.ChannelTimestampMsSource.resolve({
			$channel: {
				$network: lightningNetwork,
				channelId: '42',
			},
			timestampMs: 1,
			source: Source.LightningMempoolSpace_Rest,
		}, context)).rejects.toThrow('unsupported source')
		expect(listChannels).not.toHaveBeenCalled()
		expect(getLightningStatistics).not.toHaveBeenCalled()
	})

	it('keeps LND local-node channel observations free of Mempool closing fields', async () => {
		getChannelInfo.mockResolvedValue({
			channel_id: '42',
			last_update: 1,
			node1_pub: '02local',
			node2_pub: '02peer',
			capacity: '250000',
		})

		await expect(lndChannelTimestampResolver.resolve.ChannelTimestampMsSource.resolve({
			$channel: {
				$network: lightningNetwork,
				channelId: '42',
			},
			timestampMs: 1_000,
			source: Source.LightningLnd_Rest,
		}, context)).resolves.toEqual({
			status: 'Active',
			capacitySats: 250000n,
			feeRatePpm: undefined,
			updatedAtMs: 1_000,
			$$routingPolicies: [],
		})
		expect(getLightningStatistics).not.toHaveBeenCalled()
	})

	it('uses source-owned transport bindings without cross-calling the other Lightning surface', async () => {
		getInfo.mockResolvedValue({
			identity_pubkey: '02'.padEnd(66, '0'),
			alias: 'local',
		})
		getLightningStatistics.mockResolvedValue({
			latest: {
				added: '2026-01-01T00:00:00.000Z',
			},
		})
		getBlock.mockResolvedValue({
			id: 'block',
			height: 1,
			timestamp: 1,
			merkle_root: 'root',
			nonce: 1,
			difficulty: 1,
			size: 1,
			weight: 1,
			tx_count: 1,
		})

		await lndNodeStateResolver.resolve.ConnectionIdNetwork.resolve({
			connectionId: 'local',
			$network: {
				$network: lightningNetwork,
			},
		}, context)
		expect(getLightningStatistics).not.toHaveBeenCalled()
		expect(getNetworkInfo).not.toHaveBeenCalled()
		expect(listInvoices).not.toHaveBeenCalled()
		expect(listPayments).not.toHaveBeenCalled()

		await mempoolNetworkResolver.resolve.Network.resolve({
			$network: lightningNetwork,
		}, context)
		expect(getInfo).toHaveBeenCalledOnce()
		expect(getLightningStatistics).toHaveBeenCalledOnce()
		expect(getNetworkInfo).not.toHaveBeenCalled()
		expect(listChannels).not.toHaveBeenCalled()

		await mempoolSpace.resolvers
			.find((resolver) => resolver.entityType === EntityType.UtxoBlock)!
			.resolve['NetworkHeightHash'].resolve({
				$network: {
					caip2: networkBySlug.bitcoin.caip2,
				},
				height: 1n,
				hash: 'block',
			}, context)

		expect(getInfo).toHaveBeenCalledWith()
		expect(getBlock).toHaveBeenCalledWith({
			blockHash: 'block',
			target: 'bip122:000000000019d6689c085ae165831e93',
		})
	})
})

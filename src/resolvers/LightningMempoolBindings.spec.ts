import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { entityFieldDefinitions } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import lightningNetworkDefinition from '$/schema/LightningNetwork.ts'
import { Source } from '$/sources/Source.ts'

const {
	getBlock,
	getInfo,
	getLightningStatistics,
	getNetworkInfo,
	listChannels,
	listInvoices,
	listPayments,
} = vi.hoisted(() => ({
	getBlock: vi.fn(),
	getInfo: vi.fn(),
	getLightningStatistics: vi.fn(),
	getNetworkInfo: vi.fn(),
	listChannels: vi.fn(),
	listInvoices: vi.fn(),
	listPayments: vi.fn(),
}))

vi.mock('$/sources/LightningLnd/Rest/queries.ts', () => ({
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

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const lightningNetwork = {
	slug: 'lightning',
} as const

const mempoolNetworkTimestampResolver = lightningMempoolSpace.resolvers.find((resolver) => (
	resolver.entityType === EntityType.LightningNetwork_Timestamp
))
const lndNodeStateResolver = lightningLnd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadLightningNodeState
))
const lndChannelTimestampResolver = lightningLnd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.LightningChannel_Timestamp
))
if (
	mempoolNetworkTimestampResolver == null
	|| lndNodeStateResolver == null
	|| lndChannelTimestampResolver == null
)
	throw new Error('LightningMempoolBindings spec missing resolver')

beforeEach(() => {
	vi.resetAllMocks()
})

describe('Lightning and mempool resolver bindings', () => {
	it('binds public graph collections only to their registered materializers', () => {
		expect(Object.fromEntries(entityFieldDefinitions(lightningNetworkDefinition)
			.filter(({ name }) => [
				'$$timestamps',
				'$$nodes',
				'$$channels',
			].includes(name))
			.map(({ defaultSources, name }) => [
				name,
				defaultSources,
			]))).toEqual({
			'$$timestamps': [
				Source.LightningMempoolSpace_Rest,
				Source.LightningLnd_Rest,
			],
			'$$nodes': [
				Source.LightningMempoolSpace_Rest,
				Source.LightningLnd_Rest,
				Source.Amboss_Graphql,
			],
			'$$channels': [
				Source.LightningLnd_Rest,
			],
		})
	})

	it('keeps MempoolSpace on public graph entities and LND on local session rows', () => {
		const mempoolEntityTypes = new Set(
			lightningMempoolSpace.resolvers.map((resolver) => resolver.entityType)
		)
		const lndEntityTypes = new Set(
			lightningLnd.resolvers.map((resolver) => resolver.entityType)
		)

		expect(mempoolEntityTypes.has(EntityType.LightningNetwork)).toBe(true)
		expect(mempoolEntityTypes.has(EntityType.LightningNode)).toBe(true)
		expect(mempoolEntityTypes.has(EntityType.LightningChannel)).toBe(true)
		expect(mempoolEntityTypes.has(EntityType.LightningNetwork_Timestamp)).toBe(true)
		expect(
			[...mempoolEntityTypes].some((entityType) => (
				String(entityType).startsWith('BlockheadLightning')
			))
		).toBe(false)

		expect(lndEntityTypes.has(EntityType.BlockheadLightningNodeState)).toBe(true)
		expect(lndEntityTypes.has(EntityType.BlockheadLightningInvoice)).toBe(true)
		expect(lndEntityTypes.has(EntityType.BlockheadLightningPayment)).toBe(true)
		expect(lndEntityTypes.has(EntityType.LightningNetwork_Timestamp)).toBe(true)
		expect(lndEntityTypes.has(EntityType.LightningNode)).toBe(true)
		expect(lndEntityTypes.has(EntityType.LightningChannel)).toBe(true)
	})

	it('keeps live publishers on their source-owned Lightning surfaces', () => {
		expect(lightningLnd.resolvers.flatMap((resolver) => (
			'resolveLive' in resolver ?
				Object.keys(resolver.resolveLive)
			:
				[]
		))).toEqual(['operatorState'])
		expect(lightningMempoolSpace.resolvers.flatMap((resolver) => (
			'resolveLive' in resolver ?
				Object.keys(resolver.resolveLive)
			:
				[]
		))).toEqual(['networkStats'])
	})

	it('fail-closes Mempool public tip when stamped as LND before transport', async () => {
		await expect(mempoolNetworkTimestampResolver.resolve.LightningNetworkTimestampMsSource.resolve({
			$lightningNetwork: {
				$network: lightningNetwork,
			},
			timestampMs: 1,
			source: Source.LightningLnd_Rest,
		}, context)).rejects.toThrow('unsupported source')
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
		listChannels.mockResolvedValue({
			channels: [{
				active: true,
				remote_pubkey: '02peer',
				channel_point: 'funding-transaction:7',
				chan_id: '42',
				capacity: '250000',
				local_balance: '100000',
				remote_balance: '150000',
				private: false,
			}],
		})

		await expect(lndChannelTimestampResolver.resolve.ChannelTimestampMsSource.resolve({
			$channel: {
				$network: lightningNetwork,
				channelId: '42',
			},
			timestampMs: 1,
			source: Source.LightningLnd_Rest,
		}, context)).resolves.toEqual({
			status: 'Active',
			capacitySats: 250000n,
			feeRatePpm: undefined,
			updatedAtMs: undefined,
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

		await mempoolNetworkTimestampResolver.resolve.LightningNetworkTimestampMsSource.resolve({
			$lightningNetwork: {
				$network: lightningNetwork,
			},
			timestampMs: Date.parse('2026-01-01T00:00:00.000Z'),
			source: Source.LightningMempoolSpace_Rest,
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
		expect(getBlock).toHaveBeenCalledWith('block')
	})
})

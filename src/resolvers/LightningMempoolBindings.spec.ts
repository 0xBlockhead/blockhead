import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { bitcoinNetworkBySlug } from '$/constants/BitcoinNetwork.ts'
import { EntityType } from '$/schema/EntityType.ts'

const {
	getBlock,
	getInfo,
	getLightningStatistics,
} = vi.hoisted(() => ({
	getBlock: vi.fn(),
	getInfo: vi.fn(),
	getLightningStatistics: vi.fn(),
}))

vi.mock('$/sources/LightningLnd/Rest/queries.ts', () => ({
	getInfo,
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

describe('Lightning and mempool resolver bindings', () => {
	it('uses source-owned transport bindings', async () => {
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

		await lightningLnd.resolvers
			.find((resolver) => resolver.entityType === EntityType.BlockheadLightningNodeState)!
			.resolve['ConnectionIdNetwork'].resolve({
				connectionId: 'local',
				$network: {
					$network: {
						slug: 'lightning',
					},
				},
			}, context)
		await lightningMempoolSpace.resolvers
			.find((resolver) => resolver.entityType === EntityType.LightningNetwork_Timestamp)!
			.resolve['LightningNetworkTimestampMsSource'].resolve({
				$lightningNetwork: {
					$network: {
						slug: 'lightning',
					},
				},
				timestampMs: 1,
				source: 'LightningMempoolSpace_Rest',
			}, context)
		await mempoolSpace.resolvers
			.find((resolver) => resolver.entityType === EntityType.UtxoBlock)!
			.resolve['NetworkHeightHash'].resolve({
				$network: {
					caip2: bitcoinNetworkBySlug.bitcoin.caip2,
				},
				height: 1n,
				hash: 'block',
			}, context)

		expect(getInfo).toHaveBeenCalledWith({
			publicEnv: {},
		})
		expect(getLightningStatistics).toHaveBeenCalledOnce()
		expect(getBlock).toHaveBeenCalledWith('block')
	})
})

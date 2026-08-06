import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getBlock = vi.hoisted(() => vi.fn())
const getBlockByHash = vi.hoisted(() => vi.fn())
const getTx = vi.hoisted(() => vi.fn())
const getStatus = vi.hoisted(() => vi.fn())
const getBlockchain = vi.hoisted(() => vi.fn())

vi.mock('$/sources/CometBft/Rest/queries.ts', () => ({
	getBlock,
	getBlockByHash,
	getTx,
	getStatus,
	getBlockchain,
}))

const { default: cometBft } = await import('$/resolvers/CometBft-Rest.ts')

const cosmosNetwork = {
	caip2: networkBySlug.cosmos.caip2,
}

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const blockResolver = cometBft.resolvers.find((candidate) => (
	candidate.entityType === EntityType.CosmosBlock
))
const transactionResolver = cometBft.resolvers.find((candidate) => (
	candidate.entityType === EntityType.CosmosTransaction
))
const networkTimestampResolver = cometBft.resolvers.find((candidate) => (
	candidate.entityType === EntityType.Network_Timestamp
))
const networkBlocksResolver = cometBft.resolvers.find((candidate) => (
	candidate.entityType === EntityType.Network
	&& 'Cosmos' in candidate.projections
	&& '$$blocks' in candidate.projections.Cosmos
))
const networkTimestampsResolver = cometBft.resolvers.find((candidate) => (
	candidate.entityType === EntityType.Network
	&& '$$timestamps' in candidate.projections
))

if (
	blockResolver == null
	|| transactionResolver == null
	|| networkTimestampResolver == null
	|| networkBlocksResolver == null
	|| networkTimestampsResolver == null
)
	throw new Error('CometBft-Rest spec missing resolvers')

beforeEach(() => {
	getBlock.mockReset()
	getBlockByHash.mockReset()
	getTx.mockReset()
	getStatus.mockReset()
	getBlockchain.mockReset()
})

describe('CometBFT resolver binding', () => {
	it('projects transactionCount from block data.txs', async () => {
		getBlock.mockResolvedValue({
			result: {
				block_id: {
					hash: 'BLOCKHASH',
				},
				block: {
					header: {
						height: '42',
						proposer_address: 'proposer',
						time: '2026-01-01T00:00:00.000Z',
					},
					data: {
						txs: [
							'tx-a',
							'tx-b',
						],
					},
				},
			},
		})

		const snapshot = await blockResolver.resolve.NetworkHeight.resolve({
			$network: cosmosNetwork,
			height: 42n,
		}, context)

		expect(blockResolver.projections.hash(snapshot)).toBe('BLOCKHASH')
		expect(blockResolver.projections.transactionCount(snapshot)).toBe(2)
		expect(getBlock).toHaveBeenCalledWith({
			height: 42n,
		})
	})

	it('resolves CosmosBlock by NetworkHash via block_by_hash', async () => {
		getBlockByHash.mockResolvedValue({
			result: {
				block_id: {
					hash: 'ABCDEF',
				},
				block: {
					header: {
						height: '7',
						proposer_address: 'proposer',
						time: '2026-01-01T00:00:00.000Z',
					},
					data: {
						txs: [],
					},
				},
			},
		})

		const snapshot = await blockResolver.resolve.NetworkHash.resolve({
			$network: cosmosNetwork,
			hash: 'ABCDEF',
		}, context)

		expect(blockResolver.projections.height(snapshot)).toBe(7n)
		expect(blockResolver.projections.transactionCount(snapshot)).toBe(0)
		expect(getBlockByHash).toHaveBeenCalledWith({
			hash: 'ABCDEF',
		})
	})

	it('projects codespace, rawLog, and eventTypes from tx_result', async () => {
		getTx.mockResolvedValue({
			result: {
				hash: 'TXHASH',
				height: '9',
				index: 0,
				tx_result: {
					code: 0,
					codespace: 'sdk',
					gas_wanted: '100',
					gas_used: '80',
					log: '[]',
					events: [
						{
							type: 'transfer',
						},
						{
							type: 'message',
						},
						{
							type: 'transfer',
						},
					],
				},
			},
		})

		const snapshot = await transactionResolver.resolve.NetworkTxHash.resolve({
			$network: cosmosNetwork,
			txHash: 'TXHASH',
		}, context)

		expect(transactionResolver.projections.code(snapshot)).toBe(0)
		expect(transactionResolver.projections.codespace(snapshot)).toBe('sdk')
		expect(transactionResolver.projections.rawLog(snapshot)).toBe('[]')
		expect(transactionResolver.projections.eventTypes(snapshot)).toEqual([
			'transfer',
			'message',
		])
		expect(transactionResolver.projections.$block(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: cosmosNetwork,
				height: 9n,
			},
		})
	})

	it('projects Network_Timestamp tip fields from /status + tip block', async () => {
		getStatus.mockResolvedValue({
			result: {
				node_info: {
					network: 'cosmoshub-4',
				},
				sync_info: {
					latest_block_hash: 'TIPHASH',
					latest_block_height: '100',
					latest_block_time: '2026-01-01T00:00:00.000Z',
					catching_up: true,
				},
			},
		})
		getBlock.mockResolvedValue({
			result: {
				block_id: {
					hash: 'TIPHASH',
				},
				block: {
					header: {
						height: '100',
						proposer_address: 'proposer',
						time: '2026-01-01T00:00:10.000Z',
					},
					data: {
						txs: [
							'a',
							'b',
							'c',
						],
					},
				},
			},
		})

		const snapshot = await networkTimestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: cosmosNetwork,
			timestampMs: 1_700_000_000_000,
			source: Source.CometBft_Rest,
		}, context)

		expect(networkTimestampResolver.projections.Cosmos.latestBlockHeight(snapshot)).toBe(100n)
		expect(networkTimestampResolver.projections.Cosmos.latestBlockHash(snapshot)).toBe('TIPHASH')
		expect(networkTimestampResolver.projections.Cosmos.latestBlockTimeMs(snapshot)).toBe(
			Date.parse('2026-01-01T00:00:10.000Z')
		)
		expect(networkTimestampResolver.projections.Cosmos.latestBlockTransactionCount(snapshot)).toBe(3)
		expect(networkTimestampResolver.projections.Cosmos.chainId(snapshot)).toBe('cosmoshub-4')
		expect(networkTimestampResolver.projections.Cosmos.isSyncing(snapshot)).toBe(true)
		expect(getBlock).toHaveBeenCalledWith({
			height: 100n,
		})
	})

	it('lists Network.Cosmos.$$blocks from /blockchain metas with enrolled hash fields', async () => {
		getStatus.mockResolvedValue({
			result: {
				node_info: {
					network: 'cosmoshub-4',
				},
				sync_info: {
					latest_block_hash: 'TIPHASH',
					latest_block_height: '5',
					latest_block_time: '2026-01-01T00:00:00.000Z',
					catching_up: false,
				},
			},
		})
		getBlockchain.mockResolvedValue({
			result: {
				last_height: '5',
				block_metas: [
					{
						block_id: {
							hash: 'HASH5',
						},
						header: {
							height: '5',
							time: '2026-01-01T00:00:05.000Z',
							proposer_address: 'proposer-5',
						},
						num_txs: '2',
					},
					{
						block_id: {
							hash: 'HASH3',
						},
						header: {
							height: '3',
							time: '2026-01-01T00:00:03.000Z',
							proposer_address: 'proposer-3',
						},
						num_txs: '0',
					},
					{
						block_id: {
							hash: 'HASH4',
						},
						header: {
							height: '4',
							time: '2026-01-01T00:00:04.000Z',
							proposer_address: 'proposer-4',
						},
						num_txs: '1',
					},
				],
			},
		})

		const snapshot = await networkBlocksResolver.resolve.Caip2.resolve(
			cosmosNetwork,
			{
				...context,
				pagination: {
					limit: 3,
				},
			}
		)
		expect(getBlockchain).toHaveBeenCalledWith({
			minHeight: 3n,
			maxHeight: 5n,
		})
		expect(networkBlocksResolver.projections.Cosmos.$$blocks(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: cosmosNetwork,
					height: 5n,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CosmosBlock, [], 'hash')]: 'HASH5',
					[entityFieldAddressKey(EntityType.CosmosBlock, [], 'proposerConsensusAddress')]: 'proposer-5',
					[entityFieldAddressKey(EntityType.CosmosBlock, [], 'timestampMs')]: Date.parse('2026-01-01T00:00:05.000Z'),
					[entityFieldAddressKey(EntityType.CosmosBlock, [], 'transactionCount')]: 2,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: cosmosNetwork,
					height: 4n,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CosmosBlock, [], 'hash')]: 'HASH4',
					[entityFieldAddressKey(EntityType.CosmosBlock, [], 'proposerConsensusAddress')]: 'proposer-4',
					[entityFieldAddressKey(EntityType.CosmosBlock, [], 'timestampMs')]: Date.parse('2026-01-01T00:00:04.000Z'),
					[entityFieldAddressKey(EntityType.CosmosBlock, [], 'transactionCount')]: 1,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: cosmosNetwork,
					height: 3n,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CosmosBlock, [], 'hash')]: 'HASH3',
					[entityFieldAddressKey(EntityType.CosmosBlock, [], 'proposerConsensusAddress')]: 'proposer-3',
					[entityFieldAddressKey(EntityType.CosmosBlock, [], 'timestampMs')]: Date.parse('2026-01-01T00:00:03.000Z'),
					[entityFieldAddressKey(EntityType.CosmosBlock, [], 'transactionCount')]: 0,
				},
			},
		])
	})

	it('exposes Network.$$timestamps tip handle for CometBft_Rest', async () => {
		const snapshot = await networkTimestampsResolver.resolve.Caip2.resolve(
			cosmosNetwork,
			context
		)
		expect(networkTimestampsResolver.projections.$$timestamps(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: cosmosNetwork,
					timestampMs: expect.any(Number),
					source: Source.CometBft_Rest,
				},
			},
		])
	})

	it('registers CometBft_Rest source', () => {
		expect(cometBft.source).toBe(Source.CometBft_Rest)
	})
})

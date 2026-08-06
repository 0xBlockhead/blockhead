import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getBlock = vi.hoisted(() => vi.fn())
const getBlockByHash = vi.hoisted(() => vi.fn())
const getTx = vi.hoisted(() => vi.fn())

vi.mock('$/sources/CometBft/Rest/queries.ts', () => ({
	getBlock,
	getBlockByHash,
	getTx,
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

if (blockResolver == null || transactionResolver == null)
	throw new Error('CometBft-Rest spec missing resolvers')

beforeEach(() => {
	getBlock.mockReset()
	getBlockByHash.mockReset()
	getTx.mockReset()
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

	it('registers CometBft_Rest source', () => {
		expect(cometBft.source).toBe(Source.CometBft_Rest)
	})
})

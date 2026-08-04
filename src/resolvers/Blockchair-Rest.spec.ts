import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getBlocks = vi.fn()
const getBitcoinLikeAddressDashboard = vi.fn()
const getBitcoinLikeBlockDashboard = vi.fn()
const getBitcoinLikeStats = vi.fn()
const getBitcoinLikeTransactionDashboard = vi.fn()

vi.mock('$/sources/Blockchair/Rest/queries.ts', () => ({
	getBlocks,
	getBitcoinLikeAddressDashboard,
	getBitcoinLikeBlockDashboard,
	getBitcoinLikeStats,
	getBitcoinLikeTransactionDashboard,
}))

const { default: blockchairResolvers } = await import('$/resolvers/Blockchair-Rest.ts')

const networkResolvers = blockchairResolvers.resolvers.filter((resolver) => (
	resolver.entityType === EntityType.Network
))
const blocksResolver = networkResolvers.find((resolver) => (
	'Utxo' in resolver.projections
	&& '$$blocks' in resolver.projections.Utxo
	&& typeof resolver.projections.Utxo.$$blocks === 'function'
))
const timestampsResolver = networkResolvers.find((resolver) => (
	'$$timestamps' in resolver.projections
))
const timestampResolver = blockchairResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network_Timestamp
))
const blockResolver = blockchairResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoBlock
))
const transactionResolver = blockchairResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoTransaction
))
const addressResolvers = blockchairResolvers.resolvers.filter((resolver) => (
	resolver.entityType === EntityType.UtxoAddress
))
const addressRelationsResolver = addressResolvers.find((resolver) => (
	'$$transactions' in resolver.projections
))

if (blocksResolver == null)
	throw new Error('Blockchair-Rest spec missing Network.Utxo.$$blocks resolver')
if (timestampsResolver == null)
	throw new Error('Blockchair-Rest spec missing Network.$$timestamps resolver')
if (timestampResolver == null)
	throw new Error('Blockchair-Rest spec missing Network_Timestamp resolver')
if (blockResolver == null)
	throw new Error('Blockchair-Rest spec missing UtxoBlock resolver')
if (transactionResolver == null)
	throw new Error('Blockchair-Rest spec missing UtxoTransaction resolver')
if (addressRelationsResolver == null)
	throw new Error('Blockchair-Rest spec missing UtxoAddress $$transactions resolver')

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 1,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {
		PUBLIC_BLOCKCHAIR_API_KEY: 'test-key',
	},
}

describe('Blockchair Network selector applicability', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('covers both canonical CAIP-2 and preserved slug selectors for every Network projection', () => {
		for (const resolver of networkResolvers) {
			expect(resolver.resolve['Caip2'].appliesTo).toContainEqual({
				caip2: networkBySlug.bitcoin.caip2,
			})
			expect(resolver.resolve['Slug'].appliesTo).toContainEqual({
				slug: 'bitcoin',
			})
			expect(resolver.resolve['Caip2'].appliesTo).not.toContainEqual({
				caip2: networkBySlug.ethereum.caip2,
			})
		}
	})

	it('limits observations to Blockchair-owned timestamps on supported networks', () => {
		const appliesTo = timestampResolver.resolve[
			'NetworkTimestampMsSource'
		].appliesTo
		expect(appliesTo).toContainEqual({
			$network: {
				caip2: networkBySlug.bitcoin.caip2,
			},
			source: Source.Blockchair_Rest,
		})
		expect(appliesTo).not.toContainEqual(expect.objectContaining({
			source: Source.MempoolSpace_Rest,
		}))
	})

	it('issues Bitcoin list requests for canonical CAIP-2 and rejects unsupported networks before I/O', async () => {
		getBlocks.mockResolvedValue({
			data: [
				{
					id: 1,
					hash: 'a'.repeat(64),
				},
			],
		})

		await expect(blocksResolver.resolve['Caip2'].resolve({
			caip2: networkBySlug.bitcoin.caip2,
		}, resolverContext)).resolves.toHaveLength(1)
		expect(getBlocks).toHaveBeenCalledWith({
			chain: 'bitcoin',
			params: {
				sort: 'id(desc)',
				limit: 1,
			},
			options: {
				publicEnv: resolverContext.publicEnv,
			},
		})

		await expect(blocksResolver.resolve['Caip2'].resolve({
			caip2: networkBySlug.ethereum.caip2,
		}, resolverContext)).rejects.toThrow('unsupported UTXO network')
		expect(getBlocks).toHaveBeenCalledTimes(1)
	})

	it('emits compact timestamp references and resolves their fields at the timestamp owner', async () => {
		const bestBlockTime = '2026-01-15T00:00:00.000Z'
		const timestampMs = Date.parse(bestBlockTime)
		getBitcoinLikeStats.mockResolvedValue({
			data: {
				best_block_time: bestBlockTime,
				best_block_height: 900_000,
				blocks: 900_001,
				transactions: 1_200_000_000,
			},
		})

		const network = await timestampsResolver.resolve['Slug'].resolve(
			{ slug: 'bitcoin' },
			resolverContext
		)
		expect(getBitcoinLikeStats).toHaveBeenCalledOnce()
		expect(getBitcoinLikeStats).toHaveBeenCalledWith({
			chain: 'bitcoin',
			options: {
				publicEnv: resolverContext.publicEnv,
			},
		})
		expect(timestampsResolver.projections.$$timestamps(network)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: { slug: 'bitcoin' },
				timestampMs,
				source: Source.Blockchair_Rest,
			},
		}])
		if (!('Utxo' in timestampsResolver.projections))
			throw new Error('Blockchair-Rest spec missing Network.Utxo projections')
		expect(timestampsResolver.projections.Utxo.$$blocks.resolveCount(network)).toBe(900_001)
		expect(timestampsResolver.projections.Utxo.$$transactions.resolveCount(network)).toBe(1_200_000_000)

		const timestamp = await timestampResolver.resolve['NetworkTimestampMsSource'].resolve({
			$network: { slug: 'bitcoin' },
			timestampMs,
			source: Source.Blockchair_Rest,
		}, resolverContext)
		expect(getBitcoinLikeStats).toHaveBeenCalledTimes(2)
		expect(timestamp).toMatchObject({
			bestBlockHeight: 900_000n,
			bestBlockTimeMs: timestampMs,
		})
		expect(timestamp).not.toHaveProperty(EntityMetaKey.Fields)

		await expect(timestampResolver.resolve['NetworkTimestampMsSource'].resolve({
			$network: { slug: 'bitcoin' },
			timestampMs: timestampMs - 1,
			source: Source.Blockchair_Rest,
		}, resolverContext)).rejects.toThrow('network timestamp mismatch')
	})

	it('projects both block selectors and transaction references from one dashboard response', async () => {
		const network = {
			caip2: networkBySlug.bitcoin.caip2,
		}
		const dashboard = {
			block: {
				id: 900_000,
				hash: 'block-hash',
				time: '2026-01-15T00:00:00.000Z',
				merkle_root: 'merkle-root',
				nonce: 1,
				difficulty: 2,
				size: 3,
				weight: 4,
				transaction_count: 1,
			},
			transactions: [{
				hash: 'transaction-hash',
			}],
		}
		getBitcoinLikeBlockDashboard.mockResolvedValue({
			data: {
				'block-hash': dashboard,
			},
		})

		const heightSelector = {
			$network: network,
			height: 900_000n,
		}
		const heightSnapshot = await blockResolver.resolve.NetworkHeight.resolve(
			heightSelector,
			resolverContext
		)
		expect(getBitcoinLikeBlockDashboard).toHaveBeenCalledOnce()
		expect(getBitcoinLikeBlockDashboard).toHaveBeenCalledWith({
			chain: 'bitcoin',
			block: heightSelector.height,
			options: {
				publicEnv: resolverContext.publicEnv,
			},
		})
		expect(blockResolver.projections.hash(heightSnapshot)).toBe(dashboard.block.hash)
		expect(blockResolver.projections.$parent(heightSnapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				height: 899_999n,
			},
		})
		expect(blockResolver.projections.transactionCount(heightSnapshot)).toBe(1)
		expect(blockResolver.projections.$$transactions(heightSnapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				txId: dashboard.transactions[0].hash,
			},
		}])

		const hashSelector = {
			...heightSelector,
			hash: dashboard.block.hash,
		}
		const hashSnapshot = await blockResolver.resolve.NetworkHeightHash.resolve(
			hashSelector,
			resolverContext
		)
		expect(getBitcoinLikeBlockDashboard).toHaveBeenCalledTimes(2)
		expect(getBitcoinLikeBlockDashboard).toHaveBeenLastCalledWith({
			chain: 'bitcoin',
			block: hashSelector.hash,
			options: {
				publicEnv: resolverContext.publicEnv,
			},
		})
		expect(blockResolver.projections.hash(hashSnapshot)).toBe(hashSelector.hash)
		expect(blockResolver.projections.$$transactions(hashSnapshot)).toEqual(
			blockResolver.projections.$$transactions(heightSnapshot)
		)
	})

	it('projects transaction fields, inputs, and outputs from one dashboard response', async () => {
		const entitySelector = {
			$network: {
				caip2: networkBySlug.bitcoin.caip2,
			},
			txId: 'transaction-hash',
		}
		getBitcoinLikeTransactionDashboard.mockResolvedValue({
			data: {
				[entitySelector.txId]: {
					transaction: {
						block_id: 900_000,
						version: 2,
						lock_time: 3,
						size: 4,
						weight: 5,
						fee: 6,
						is_coinbase: false,
					},
					inputs: [{}],
					outputs: [{}, {}],
				},
			},
		})

		const snapshot = await transactionResolver.resolve.NetworkTxId.resolve(
			entitySelector,
			resolverContext
		)
		expect(getBitcoinLikeTransactionDashboard).toHaveBeenCalledOnce()
		expect(getBitcoinLikeTransactionDashboard).toHaveBeenCalledWith({
			chain: 'bitcoin',
			transactionHash: entitySelector.txId,
			options: {
				publicEnv: resolverContext.publicEnv,
			},
		})
		expect(transactionResolver.projections.version(snapshot)).toBe(2)
		expect(transactionResolver.projections.virtualSizeBytes(snapshot)).toBe(2)
		expect(transactionResolver.projections.$$inputs(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: entitySelector,
				indexInTransaction: 0,
			},
		}])
		expect(transactionResolver.projections.$$outputs(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$transaction: entitySelector,
					indexInTransaction: 0,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$transaction: entitySelector,
					indexInTransaction: 1,
				},
			},
		])
	})

	it('projects address transactions and unspent outputs from one dashboard response', async () => {
		const entitySelector = {
			$network: {
				caip2: networkBySlug.bitcoin.caip2,
			},
			address: 'bc1qaddress',
		}
		getBitcoinLikeAddressDashboard.mockResolvedValue({
			data: {
				[entitySelector.address]: {
					address: {
						balance: 10,
						transaction_count: 2,
						unspent_output_count: 1,
						received: 20,
						spent: 10,
					},
					transactions: [
						'tx-a',
						{
							hash: 'tx-b',
						},
					],
					utxo: [
						{
							transaction_hash: 'tx-a',
							index: 0,
						},
						{
							transaction_hash: null,
							index: 1,
						},
					],
				},
			},
		})

		const snapshot = await addressRelationsResolver.resolve.NetworkAddress.resolve(
			entitySelector,
			resolverContext
		)
		expect(getBitcoinLikeAddressDashboard).toHaveBeenCalledOnce()
		expect(getBitcoinLikeAddressDashboard).toHaveBeenCalledWith({
			chain: 'bitcoin',
			address: entitySelector.address,
			params: {
				limit: 1,
			},
			options: {
				publicEnv: resolverContext.publicEnv,
			},
		})
		expect(addressRelationsResolver.projections.$$transactions(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: entitySelector.$network,
					txId: 'tx-a',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: entitySelector.$network,
					txId: 'tx-b',
				},
			},
		])
		expect(addressRelationsResolver.projections.$$outputs(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: entitySelector.$network,
					txId: 'tx-a',
				},
				indexInTransaction: 0,
			},
		}])
	})
})

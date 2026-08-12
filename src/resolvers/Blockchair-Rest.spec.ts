import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getBlocks = vi.fn()
const getBitcoinLikeAddressDashboard = vi.fn()
const getBitcoinLikeBlockDashboard = vi.fn()
const getBitcoinLikeStats = vi.fn()
const getBitcoinLikeTransactionDashboard = vi.fn()
const getEthereumLikeStats = vi.fn()
const getTransactions = vi.fn()

vi.mock('$/sources/Blockchair/Rest/queries.ts', () => ({
	getBlocks,
	getBitcoinLikeAddressDashboard,
	getBitcoinLikeBlockDashboard,
	getBitcoinLikeStats,
	getBitcoinLikeTransactionDashboard,
	getEthereumLikeStats,
	getTransactions,
}))

const { default: blockchairResolvers } = await import('$/resolvers/Blockchair-Rest.ts')

const networkResolvers = blockchairResolvers.resolvers.filter((resolver) => (
	resolver.entityType === EntityType.Network
))
const blocksResolver = networkResolvers.find((resolver) => (
	'Utxo' in resolver.projections
	&& '$$blocks' in resolver.projections.Utxo
	&& typeof resolver.projections.Utxo.$$blocks === 'object'
	&& 'select' in resolver.projections.Utxo.$$blocks
))
const transactionsResolver = networkResolvers.find((resolver) => (
	'Utxo' in resolver.projections
	&& '$$transactions' in resolver.projections.Utxo
	&& typeof resolver.projections.Utxo.$$transactions === 'object'
	&& 'select' in resolver.projections.Utxo.$$transactions
))
const timestampsResolver = networkResolvers.find((resolver) => (
	'$$timestamps' in resolver.projections
))
const evmTipResolver = networkResolvers.find((resolver) => (
	'Evm' in resolver.projections
	&& '$$timestamps' in resolver.projections.Evm
))
const timestampResolver = blockchairResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network_Timestamp
))
const evmTimestampResolver = blockchairResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmNetwork_Timestamp
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
const addressTimestampResolver = blockchairResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress_Timestamp
))

if (blocksResolver == null)
	throw new Error('Blockchair-Rest spec missing Network.Utxo.$$blocks resolver')
if (transactionsResolver == null)
	throw new Error('Blockchair-Rest spec missing Network.Utxo.$$transactions resolver')
if (timestampsResolver == null)
	throw new Error('Blockchair-Rest spec missing Network.$$timestamps resolver')
if (evmTipResolver == null)
	throw new Error('Blockchair-Rest spec missing Network.Evm.$$timestamps resolver')
if (timestampResolver == null)
	throw new Error('Blockchair-Rest spec missing Network_Timestamp resolver')
if (evmTimestampResolver == null)
	throw new Error('Blockchair-Rest spec missing EvmNetwork_Timestamp resolver')
if (blockResolver == null)
	throw new Error('Blockchair-Rest spec missing UtxoBlock resolver')
if (transactionResolver == null)
	throw new Error('Blockchair-Rest spec missing UtxoTransaction resolver')
if (addressRelationsResolver == null)
	throw new Error('Blockchair-Rest spec missing UtxoAddress $$transactions resolver')
if (addressTimestampResolver == null)
	throw new Error('Blockchair-Rest spec missing UtxoAddress_Timestamp resolver')

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
			if ('Caip2' in resolver.resolve && 'appliesTo' in resolver.resolve.Caip2) {
				const appliesTo = resolver.resolve.Caip2.appliesTo
				if (appliesTo.some((row) => (
					'caip2' in row
					&& row.caip2.reference === networkBySlug.ethereum.caip2.reference
				))) {
					expect(appliesTo).toContainEqual({
						caip2: networkBySlug.ethereum.caip2,
					})
					expect(appliesTo).not.toContainEqual({
						caip2: networkBySlug.bitcoin.caip2,
					})
					continue
				}
				expect(appliesTo).toContainEqual({
					caip2: networkBySlug.bitcoin.caip2,
				})
				expect(resolver.resolve.Slug.appliesTo).toContainEqual({
					slug: 'bitcoin',
				})
				expect(appliesTo).not.toContainEqual({
					caip2: networkBySlug.ethereum.caip2,
				})
			}
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
		}, resolverContext)).resolves.toMatchObject({ rows: expect.any(Array) })
		expect(getBlocks).toHaveBeenCalledWith({
			chain: 'bitcoin',
			params: {
				sort: 'id(desc)',
				limit: 1,
				offset: 0,
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

	it('materializes recent block and transaction facts from list responses without detail reads', async () => {
		getBlocks.mockResolvedValue({
			data: [{
				id: 900_000,
				hash: 'a'.repeat(64),
				time: '2026-01-15T00:00:00.000Z',
				merkle_root: 'b'.repeat(64),
				nonce: 42,
				difficulty: 123.5,
				size: 1_200_000,
				weight: 3_900_000,
				transaction_count: 2_500,
			}],
		})
		getTransactions.mockResolvedValue({
			data: [{
				block_id: 900_000,
				hash: 'c'.repeat(64),
				version: 2,
				lock_time: 899_999,
				size: 250,
				weight: 800,
				fee: 1_234,
				is_coinbase: false,
			}],
		})

		const $network = {
			caip2: networkBySlug.bitcoin.caip2,
		}
		const blockSnapshot = await blocksResolver.resolve.Caip2.resolve($network, resolverContext)
		const transactionSnapshot = await transactionsResolver.resolve.Caip2.resolve($network, resolverContext)
		const blocks = blocksResolver.projections.Utxo.$$blocks.select(blockSnapshot)
		const transactions = transactionsResolver.projections.Utxo.$$transactions.select(transactionSnapshot)

		expect(blocks).toEqual([{
			[EntityMetaKey.Selector]: {
				$network,
				height: 900_000n,
				hash: 'a'.repeat(64),
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.UtxoBlock, [], '$parent')]: {
					[EntityMetaKey.Selector]: {
						$network,
						height: 899_999n,
					},
				},
				[entityFieldAddressKey(EntityType.UtxoBlock, [], 'timestampMs')]: Date.parse('2026-01-15T00:00:00.000Z'),
				[entityFieldAddressKey(EntityType.UtxoBlock, [], 'merkleRoot')]: 'b'.repeat(64),
				[entityFieldAddressKey(EntityType.UtxoBlock, [], 'nonce')]: 42,
				[entityFieldAddressKey(EntityType.UtxoBlock, [], 'difficulty')]: 123.5,
				[entityFieldAddressKey(EntityType.UtxoBlock, [], 'sizeBytes')]: 1_200_000,
				[entityFieldAddressKey(EntityType.UtxoBlock, [], 'weightUnits')]: 3_900_000,
				[entityFieldAddressKey(EntityType.UtxoBlock, [], 'transactionCount')]: 2_500,
			},
		}])
		expect(transactions).toEqual([{
			[EntityMetaKey.Selector]: {
				$network,
				txId: 'c'.repeat(64),
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$block')]: {
					[EntityMetaKey.Selector]: {
						$network,
						height: 900_000n,
					},
				},
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'version')]: 2,
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'lockTime')]: 899_999,
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'sizeBytes')]: 250,
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'virtualSizeBytes')]: 200,
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'weightUnits')]: 800,
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'feeSats')]: 1_234n,
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'isCoinbase')]: false,
			},
		}])
		expect(getBitcoinLikeBlockDashboard).not.toHaveBeenCalled()
		expect(getBitcoinLikeTransactionDashboard).not.toHaveBeenCalled()
		expect(blocksResolver.projections.Utxo.$$blocks.continuation(blockSnapshot, {
			...resolverContext,
			parentEntitySelector: $network,
		})).toEqual({
			operation: 'network-blocks',
			target: 'bitcoin',
			terminal: false,
			token: '1',
		})
		expect(transactionsResolver.projections.Utxo.$$transactions.continuation(transactionSnapshot, {
			...resolverContext,
			parentEntitySelector: $network,
		})).toEqual({
			operation: 'network-transactions',
			target: 'bitcoin',
			terminal: false,
			token: '1',
		})
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
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.Network_Timestamp, [], 'ledgerModels')]: [
					'Utxo',
				],
				[entityFieldAddressKey(EntityType.Network_Timestamp, [], 'executionModels')]: [],
				[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHeight')]: 900_000n,
				[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockTimeMs')]: timestampMs,
				[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'blockCount')]: 900_001n,
				[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'transactionCount')]: 1_200_000_000n,
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

	it('projects ethereum tip leftovers onto EvmNetwork_Timestamp.blockHeight', async () => {
		const bestBlockTime = '2026-01-15T00:00:00.000Z'
		const timestampMs = Date.parse(bestBlockTime)
		getEthereumLikeStats.mockResolvedValue({
			data: {
				best_block_time: bestBlockTime,
				best_block_height: 24_999_999,
				blocks: 25_000_000,
			},
		})

		const network = await evmTipResolver.resolve.Slug.resolve(
			{ slug: 'ethereum' },
			resolverContext
		)
		expect(getEthereumLikeStats).toHaveBeenCalledOnce()
		expect(getEthereumLikeStats).toHaveBeenCalledWith({
			chain: 'ethereum',
			options: {
				publicEnv: resolverContext.publicEnv,
			},
		})
		expect(evmTipResolver.projections.Evm.$$timestamps(network)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: { slug: 'ethereum' },
				timestampMs,
				source: Source.Blockchair_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EvmNetwork_Timestamp, [], 'blockHeight')]: 24_999_999n,
			},
		}])
		expect(evmTipResolver.projections.Evm.$$blocks.resolveCount(network)).toBe(25_000_000)

		const timestamp = await evmTimestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: { slug: 'ethereum' },
			timestampMs,
			source: Source.Blockchair_Rest,
		}, resolverContext)
		expect(getEthereumLikeStats).toHaveBeenCalledTimes(2)
		expect(evmTimestampResolver.projections.blockHeight(timestamp)).toBe(24_999_999n)

		await expect(evmTimestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: { slug: 'ethereum' },
			timestampMs: timestampMs - 1,
			source: Source.Blockchair_Rest,
		}, resolverContext)).rejects.toThrow('EVM network timestamp mismatch')
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
				version: 2,
				lock_time: 3,
				size: 4,
				weight: 5,
				fee: 6,
				is_coinbase: false,
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
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$block')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						height: 900_000n,
						hash: 'block-hash',
					},
				},
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'version')]: 2,
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'lockTime')]: 3,
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'sizeBytes')]: 4,
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'virtualSizeBytes')]: 2,
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'weightUnits')]: 5,
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'feeSats')]: 6n,
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'isCoinbase')]: false,
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
					inputs: [{
						transaction_hash: 'spent-transaction-hash',
						index: 3,
						script_hex: 'input-script',
						spending_sequence: 4,
						spending_witness: 'witness-stack',
					}],
					outputs: [
						{
							value: 7,
							script_hex: 'output-script',
							type: 'witness_v1_taproot',
							recipient: 'bc1precipient',
							spending_transaction_hash: 'spending-transaction-hash',
						},
						{},
					],
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
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.UtxoInput, [], '$spentOutput')]: {
					[EntityMetaKey.Selector]: {
						$transaction: {
							$network: entitySelector.$network,
							txId: 'spent-transaction-hash',
						},
						indexInTransaction: 3,
					},
				},
				[entityFieldAddressKey(EntityType.UtxoInput, [], 'scriptSigAsm')]: 'input-script',
				[entityFieldAddressKey(EntityType.UtxoInput, [], 'sequence')]: 4,
				[entityFieldAddressKey(EntityType.UtxoInput, [], 'witness')]: ['witness-stack'],
			},
		}])
		expect(transactionResolver.projections.$$outputs(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$transaction: entitySelector,
					indexInTransaction: 0,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.UtxoOutput, [], 'valueSats')]: 7n,
					[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyHex')]: 'output-script',
					[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyType')]: 'witness_v1_taproot',
					[entityFieldAddressKey(EntityType.UtxoOutput, [], '$address')]: {
						[EntityMetaKey.Selector]: {
							$network: entitySelector.$network,
							address: 'bc1precipient',
						},
					},
					[entityFieldAddressKey(EntityType.UtxoOutput, [], 'isSpent')]: true,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$transaction: entitySelector,
					indexInTransaction: 1,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.UtxoOutput, [], 'isSpent')]: false,
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
						output_count: 4,
						received: 20,
						spent: 10,
					},
					transactions: [
						'tx-a',
						{
							block_id: 900_000,
							hash: 'tx-b',
							version: 2,
							size: 200,
							weight: 600,
							fee: 500,
						},
					],
					utxo: [
						{
							transaction_hash: 'tx-a',
							index: 0,
							value: 7,
							script_hex: '0014abcd',
							type: 'witness_v0_keyhash',
							recipient: entitySelector.address,
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
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$block')]: {
						[EntityMetaKey.Selector]: {
							$network: entitySelector.$network,
							height: 900_000n,
						},
					},
					[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'version')]: 2,
					[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'sizeBytes')]: 200,
					[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'virtualSizeBytes')]: 150,
					[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'weightUnits')]: 600,
					[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'feeSats')]: 500n,
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
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.UtxoOutput, [], 'valueSats')]: 7n,
				[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyHex')]: '0014abcd',
				[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyType')]: 'witness_v0_keyhash',
				[entityFieldAddressKey(EntityType.UtxoOutput, [], '$address')]: {
					[EntityMetaKey.Selector]: {
						$network: entitySelector.$network,
						address: entitySelector.address,
					},
				},
				[entityFieldAddressKey(EntityType.UtxoOutput, [], 'isSpent')]: false,
			},
		}])

		const addressObservation = await addressTimestampResolver.resolve.AddressTimestampMsSource.resolve({
			$address: entitySelector,
			timestampMs: Date.now(),
			source: Source.Blockchair_Rest,
		}, resolverContext)
		expect(addressTimestampResolver.projections.fundedOutputCount(addressObservation)).toBe(4)
		expect(addressTimestampResolver.projections.spentOutputCount(addressObservation)).toBe(3)
		expect(addressTimestampResolver.projections.unspentOutputCount(addressObservation)).toBe(1)
	})
})

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug, NetworkLedgerModel } from '$/constants/Network.ts'
import { entityFieldAddressKey, EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/MempoolSpace/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.fn()
const sourceGetText = vi.fn()

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
	sourceGetText,
}))

const { default: mempoolSpaceResolvers } = await import('$/resolvers/MempoolSpace-Rest.ts')
const { default: lightningMempoolSpaceResolvers } = await import('$/resolvers/LightningMempoolSpace-Rest.ts')

const networkResolvers = mempoolSpaceResolvers.resolvers.filter((resolver) => (
	resolver.entityType === EntityType.Network
))
const networkTimestampsResolver = networkResolvers.find((resolver) => (
	'$$timestamps' in resolver.projections
))
const blocksResolver = networkResolvers.find((resolver) => (
	'Utxo' in resolver.projections
	&& '$$blocks' in resolver.projections.Utxo
	&& typeof resolver.projections.Utxo.$$blocks === 'function'
))
const difficultyAdjustmentBlocksResolver = networkResolvers.find((resolver) => (
	'Utxo' in resolver.projections
	&& '$$difficultyAdjustmentBlocks' in resolver.projections.Utxo
))
const mempoolTransactionsResolver = networkResolvers.find((resolver) => (
	'Utxo' in resolver.projections
	&& '$$transactions' in resolver.projections.Utxo
	&& typeof resolver.projections.Utxo.$$transactions === 'function'
))
const miningPoolsResolver = networkResolvers.find((resolver) => (
	'Utxo' in resolver.projections
	&& '$$miningPools' in resolver.projections.Utxo
))
const miningPoolResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BitcoinMiningPool
))
const blockResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoBlock
	&& 'NetworkHeight' in resolver.resolve
	&& 'NetworkHeightHash' in resolver.resolve
))
const difficultyAdjustmentBlockResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoBlock
	&& 'difficultyAdjustmentPercent' in resolver.projections
))
const blockTransactionsResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoBlock
	&& '$$transactions' in resolver.projections
))
const addressTransactionsResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress
	&& '$$transactions' in resolver.projections
))
const addressOutputsResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress
	&& '$$outputs' in resolver.projections
))
const transactionResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoTransaction
))
const inputResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoInput
))
const outputResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoOutput
	&& 'valueSats' in resolver.projections
))
const outputSpentResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoOutput
	&& 'isSpent' in resolver.projections
	&& !('valueSats' in resolver.projections)
))

if (blocksResolver == null)
	throw new Error('MempoolSpace-Rest spec missing Network.Utxo.$$blocks resolver')

if (difficultyAdjustmentBlocksResolver == null)
	throw new Error('MempoolSpace-Rest spec missing Network.Utxo.$$difficultyAdjustmentBlocks resolver')

if (networkTimestampsResolver == null)
	throw new Error('MempoolSpace-Rest spec missing Network.$$timestamps resolver')

if (mempoolTransactionsResolver == null)
	throw new Error('MempoolSpace-Rest spec missing Network.Utxo.$$transactions resolver')

if (miningPoolsResolver == null)
	throw new Error('MempoolSpace-Rest spec missing Network.Utxo.$$miningPools resolver')

if (miningPoolResolver == null)
	throw new Error('MempoolSpace-Rest spec missing BitcoinMiningPool resolver')

if (blockResolver == null)
	throw new Error('MempoolSpace-Rest spec missing UtxoBlock NetworkHeight resolver')

if (difficultyAdjustmentBlockResolver == null)
	throw new Error('MempoolSpace-Rest spec missing UtxoBlock difficulty adjustment resolver')

if (blockTransactionsResolver == null)
	throw new Error('MempoolSpace-Rest spec missing UtxoBlock.$$transactions resolver')

if (addressTransactionsResolver == null)
	throw new Error('MempoolSpace-Rest spec missing UtxoAddress.$$transactions resolver')

if (addressOutputsResolver == null)
	throw new Error('MempoolSpace-Rest spec missing UtxoAddress.$$outputs resolver')

if (transactionResolver == null)
	throw new Error('MempoolSpace-Rest spec missing UtxoTransaction same-response resolver')

if (inputResolver == null || outputResolver == null || outputSpentResolver == null)
	throw new Error('MempoolSpace-Rest spec missing independently addressable child resolver')

const [bitcoinBinding, bitcoinTestnetBinding] = bindings[Source.MempoolSpace_Rest]

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 1,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
const network = {
	caip2: networkBySlug.bitcoin.caip2,
}
const bitcoinTestnetNetwork = {
	caip2: networkBySlug['bitcoin-testnet'].caip2,
}
const address = {
	$network: network,
	address: 'bc1qexample',
}
const transactions = [
	{
		txid: 'a'.repeat(64),
		vin: [],
		vout: [],
		status: {
			confirmed: true,
		},
	},
	{
		txid: 'd'.repeat(64),
		vin: [],
		vout: [],
		status: {
			confirmed: true,
		},
	},
]

describe('MempoolSpace UTXO', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	it('projects transaction fields and child selectors from one provider response', async () => {
		const txId = 'b'.repeat(64)
		sourceGetJson.mockResolvedValueOnce({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 200,
			weight: 800,
			fee: 1_000,
			status: {
				confirmed: true,
				block_height: 840_000,
				block_hash: 'c'.repeat(64),
			},
			vin: [{
				txid: 'd'.repeat(64),
				vout: 1,
				is_coinbase: false,
				sequence: 1,
			}],
			vout: [{
				scriptpubkey: '0014',
				scriptpubkey_type: 'v0_p2wpkh',
				value: 5_000,
			}],
		})
		const entitySelector = {
			$network: network,
			txId,
		}
		const transaction = await transactionResolver.resolve[
			'NetworkTxId'
		].resolve(entitySelector)

		expect(transactionResolver.projections.version(transaction)).toBe(2)
		expect(transactionResolver.projections.$$inputs(transaction)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: entitySelector,
				indexInTransaction: 0,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.UtxoInput, [], '$spentOutput')]: {
					[EntityMetaKey.Selector]: {
						$transaction: {
							$network: network,
							txId: 'd'.repeat(64),
						},
						indexInTransaction: 1,
					},
				},
				[entityFieldAddressKey(EntityType.UtxoInput, [], 'sequence')]: 1,
				[entityFieldAddressKey(EntityType.UtxoInput, [], 'witness')]: [],
			},
		}])
		expect(transactionResolver.projections.$$outputs(transaction)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: entitySelector,
				indexInTransaction: 0,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.UtxoOutput, [], 'valueSats')]: 5_000n,
				[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyHex')]: '0014',
				[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyType')]: 'v0_p2wpkh',
			},
		}])
		expect(sourceGetJson).toHaveBeenCalledOnce()
		expect(sourceGetJson).toHaveBeenCalledWith(
			bitcoinBinding,
			`https://mempool.space/api/tx/${txId}`
		)
		expect(mempoolSpaceResolvers.resolvers.filter((resolver) => (
			resolver.entityType === EntityType.UtxoTransaction
		))).toEqual([transactionResolver])
	})

	it('materializes Bitcoin Testnet transactions through their native CAIP-2 source target', async () => {
		const txId = 'f'.repeat(64)
		sourceGetJson.mockResolvedValueOnce({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 100,
			weight: 400,
			status: {
				confirmed: false,
			},
			vin: [{
				txid: 'e'.repeat(64),
				vout: 1,
				is_coinbase: false,
				sequence: 4_294_967_293,
			}],
			vout: [{
				scriptpubkey: '0014',
				scriptpubkey_type: 'v0_p2wpkh',
				value: 10_000,
			}],
		})

		const entitySelector = {
			$network: bitcoinTestnetNetwork,
			txId,
		}
		const transaction = await transactionResolver.resolve[
			'NetworkTxId'
		].resolve(entitySelector)

		expect(sourceGetJson).toHaveBeenCalledWith(
			bitcoinTestnetBinding,
			`https://mempool.space/testnet/api/tx/${txId}`
		)
		expect(transactionResolver.projections.$$inputs(transaction)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: entitySelector,
				indexInTransaction: 0,
			},
			[EntityMetaKey.Fields]: expect.objectContaining({
				[entityFieldAddressKey(EntityType.UtxoInput, [], 'sequence')]: 4_294_967_293,
			}),
		}])
		expect(transactionResolver.projections.$$outputs(transaction)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: entitySelector,
				indexInTransaction: 0,
			},
			[EntityMetaKey.Fields]: expect.objectContaining({
				[entityFieldAddressKey(EntityType.UtxoOutput, [], 'valueSats')]: 10_000n,
			}),
		}])
		expect(transactionResolver.projections.$$bitcoinOrdinalInscriptions(transaction)).toEqual([])
		expect(transactionResolver.projections.$bitcoinRunestone(transaction)).toBeUndefined()
	})

	it('materializes a paged block transaction hierarchy without child refetches', async () => {
		const blockHash = 'c'.repeat(64)
		sourceGetJson
			.mockResolvedValueOnce({
				id: blockHash,
				height: 840_000,
				timestamp: 1_700_000_000,
				tx_count: 26,
				size: 1_000,
				weight: 4_000,
			})
			.mockResolvedValueOnce([{
				txid: 'b'.repeat(64),
				version: 2,
				locktime: 1,
				size: 200,
				weight: 800,
				fee: 1_000,
				status: {
					confirmed: true,
					block_height: 840_000,
					block_hash: blockHash,
				},
				vin: [{
					txid: 'd'.repeat(64),
					vout: 1,
					is_coinbase: false,
					sequence: 4,
				}],
				vout: [{
					scriptpubkey: '0014',
					scriptpubkey_type: 'v0_p2wpkh',
					value: 5_000,
				}],
			}])

		const page = await blockTransactionsResolver.resolve.NetworkHeightHash.resolve({
			$network: network,
			height: 840_000n,
			hash: blockHash,
		}, {
			...resolverContext,
			pagination: {
				limit: 1,
				offset: 25,
			},
		})

		const rows = blockTransactionsResolver.projections.$$transactions.select(page, {
			$network: network,
			height: 840_000n,
			hash: blockHash,
		}, resolverContext)

		expect(rows).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$network: network,
				txId: 'b'.repeat(64),
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'version')]: 2,
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'feeSats')]: 1_000n,
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$$inputs')]: [expect.objectContaining({
					[EntityMetaKey.Selector]: expect.objectContaining({
						indexInTransaction: 0,
					}),
				})],
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$$outputs')]: [expect.objectContaining({
					[EntityMetaKey.Selector]: expect.objectContaining({
						indexInTransaction: 0,
					}),
				})],
			},
		}])
		expect(blockTransactionsResolver.projections.$$transactions.resolveCount(page, {
			$network: network,
			height: 840_000n,
			hash: blockHash,
		}, resolverContext)).toBe(26)
		expect(sourceGetJson).toHaveBeenNthCalledWith(
			1,
			bitcoinBinding,
			`https://mempool.space/api/block/${blockHash}`
		)
		expect(sourceGetJson).toHaveBeenNthCalledWith(
			2,
			bitcoinBinding,
			`https://mempool.space/api/block/${blockHash}/txs/25`
		)
	})

	it('fails closed when a block transaction page ends before the authoritative total', async () => {
		const blockHash = 'c'.repeat(64)
		sourceGetJson
			.mockResolvedValueOnce({
				id: blockHash,
				height: 840_000,
				timestamp: 1_700_000_000,
				tx_count: 1,
				size: 1_000,
				weight: 4_000,
			})
			.mockResolvedValueOnce([])

		await expect(blockTransactionsResolver.resolve.NetworkHeightHash.resolve({
			$network: network,
			height: 840_000n,
			hash: blockHash,
		}, resolverContext)).rejects.toThrow(
			'MempoolSpace_Rest: block transaction page ended before authoritative total'
		)
	})

	it('fails closed when a requested child index is absent', async () => {
		const txId = '9'.repeat(64)
		sourceGetJson.mockResolvedValue({
			txid: txId,
			status: {
				confirmed: false,
			},
			vin: [],
			vout: [],
		})
		const childSelector = {
			$transaction: {
				$network: network,
				txId,
			},
			indexInTransaction: 0,
		}

		await expect(inputResolver.resolve.TransactionIndexInTransaction.resolve(childSelector)).rejects.toThrow(
			'MempoolSpace_Rest: transaction input 0 not found'
		)
		await expect(outputResolver.resolve.TransactionIndexInTransaction.resolve(childSelector)).rejects.toThrow(
			'MempoolSpace_Rest: transaction output 0 not found'
		)
	})

	it('resolves UtxoBlock by height via block-height then block', async () => {
		const hash = 'c'.repeat(64)
		const previous = 'd'.repeat(64)
		sourceGetText.mockResolvedValueOnce(hash)
		sourceGetJson
			.mockResolvedValueOnce({
				id: hash,
				height: 840_000,
				timestamp: 1_700_000_000,
				merkle_root: 'e'.repeat(64),
				nonce: 1,
				difficulty: 2,
				size: 3,
				weight: 4,
				tx_count: 5,
				previousblockhash: previous,
			})

		const snapshot = await blockResolver.resolve.NetworkHeight.resolve({
			$network: network,
			height: 840_000n,
		})

		expect(sourceGetText.mock.calls).toEqual([
			[
				bitcoinBinding,
				'https://mempool.space/api/block-height/840000',
			],
		])
		expect(sourceGetJson.mock.calls).toEqual([
			[
				bitcoinBinding,
				`https://mempool.space/api/block/${hash}`,
			],
		])
		expect(blockResolver.projections.hash(snapshot)).toBe(hash)
		expect(blockResolver.projections.$parent(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				height: 839_999n,
				hash: previous,
			},
		})
		expect(blockResolver.projections.transactionCount(snapshot)).toBe(5)
	})

	it('projects address UTXO outputs from /address/.../utxo', async () => {
		const txId = 'f'.repeat(64)
		sourceGetJson.mockResolvedValueOnce([
			{
				txid: txId,
				vout: 2,
				status: {
					confirmed: true,
				},
				value: 9_000,
			},
		])

		const outputs = await addressOutputsResolver.resolve.NetworkAddress.resolve(
			address,
			resolverContext
		)

		expect(sourceGetJson).toHaveBeenCalledWith(
			bitcoinBinding,
			`https://mempool.space/api/address/${address.address}/utxo`
		)
		expect(addressOutputsResolver.projections.$$outputs(outputs)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: network,
					txId,
				},
				indexInTransaction: 2,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.UtxoOutput, [], 'valueSats')]: 9_000n,
				[entityFieldAddressKey(EntityType.UtxoOutput, [], 'isSpent')]: false,
			},
		}])
	})

	it('continues block transaction pagination across provider pages and height-only routes', async () => {
		const blockHash = 'c'.repeat(64)
		const transactionWire = (index: number) => ({
			txid: index.toString(16).padStart(64, '0'),
			vin: [],
			vout: [],
			status: {
				confirmed: true,
				block_height: 840_000,
				block_hash: blockHash,
			},
		})
		sourceGetText.mockResolvedValueOnce(blockHash)
		sourceGetJson
			.mockResolvedValueOnce({
				id: blockHash,
				height: 840_000,
				timestamp: 1_700_000_000,
				tx_count: 50,
				size: 1_000,
				weight: 4_000,
			})
			.mockResolvedValueOnce(Array.from({ length: 25 }, (_, index) => transactionWire(index)))
			.mockResolvedValueOnce(Array.from({ length: 5 }, (_, index) => transactionWire(index + 25)))

		const page = await blockTransactionsResolver.resolve.NetworkHeight.resolve({
			$network: network,
			height: 840_000n,
		}, {
			...resolverContext,
			pagination: {
				limit: 30,
				offset: 10,
			},
		})
		const rows = blockTransactionsResolver.projections.$$transactions.select(page, {
			$network: network,
			height: 840_000n,
			hash: blockHash,
		}, resolverContext)

		expect(rows).toHaveLength(30)
		expect(rows[0][EntityMetaKey.Selector]).toEqual({
			$network: network,
			txId: '0'.repeat(64),
		})
		expect(rows[29][EntityMetaKey.Selector]).toEqual({
			$network: network,
			txId: '1d'.padStart(64, '0'),
		})
		expect(blockTransactionsResolver.projections.$$transactions.resolveCount(page, {
			$network: network,
			height: 840_000n,
			hash: blockHash,
		}, resolverContext)).toBe(50)
		expect(sourceGetText).toHaveBeenNthCalledWith(
			1,
			bitcoinBinding,
			`https://mempool.space/api/block-height/840000`
		)
		expect(sourceGetJson).toHaveBeenNthCalledWith(
			1,
			bitcoinBinding,
			`https://mempool.space/api/block/${blockHash}`
		)
		expect(sourceGetJson).toHaveBeenNthCalledWith(
			2,
			bitcoinBinding,
			`https://mempool.space/api/block/${blockHash}/txs/10`
		)
		expect(sourceGetJson).toHaveBeenNthCalledWith(
			3,
			bitcoinBinding,
			`https://mempool.space/api/block/${blockHash}/txs/35`
		)
	})

	it('projects address tip mempoolTransactionCount and rejects fabricated network retrieval clocks', async () => {
		const addressTimestampsResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.UtxoAddress
			&& '$$timestamps' in resolver.projections
		))
		const networkTimestampResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network_Timestamp
		))
		if (addressTimestampsResolver == null || networkTimestampResolver == null)
			throw new Error('MempoolSpace-Rest missing tip timestamp resolvers')

		sourceGetJson.mockResolvedValueOnce({
			address: address.address,
			chain_stats: {
				funded_txo_count: 2,
				funded_txo_sum: 1000,
				spent_txo_count: 1,
				spent_txo_sum: 400,
				tx_count: 3,
			},
			mempool_stats: {
				funded_txo_count: 0,
				funded_txo_sum: 0,
				spent_txo_count: 0,
				spent_txo_sum: 0,
				tx_count: 5,
			},
		})
		const addressTip = await addressTimestampsResolver.resolve.NetworkAddress.resolve(address, resolverContext)
		const addressObservation = addressTimestampsResolver.projections.$$timestamps(addressTip)[0]
		expect(addressObservation[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.UtxoAddress_Timestamp, [], 'balanceSats')]: 600n,
			[entityFieldAddressKey(EntityType.UtxoAddress_Timestamp, [], 'mempoolTransactionCount')]: 5,
		})
		expect(mempoolSpaceResolvers.resolvers.some((resolver) => (
			resolver.entityType === EntityType.UtxoAddress_Timestamp
		))).toBe(false)

		sourceGetJson.mockResolvedValueOnce({
			hashrates: [],
			difficulty: [],
			currentHashrate: 886_019_350_377_919_800_000,
			currentDifficulty: 127_479_855_693_691.4,
		})
		await expect(networkTimestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: network,
			timestampMs: 2,
			source: Source.MempoolSpace_Rest,
		}, resolverContext)).rejects.toThrow('no mining hashrate observation at 2')
	})

	it('materializes bounded provider-clocked hashrate history and resolves exact observations', async () => {
		const networkTimestampResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network_Timestamp
		))
		if (networkTimestampResolver == null)
			throw new Error('MempoolSpace-Rest missing Network_Timestamp resolver')

		sourceGetJson
			.mockResolvedValueOnce([{
				id: 'a'.repeat(64),
				height: 840_000,
				timestamp: 1_700_000_000,
				tx_count: 1,
			}])
			.mockResolvedValueOnce({
				count: 9,
				vsize: 1800,
				total_fee: 1,
			})
			.mockResolvedValueOnce({
				hashrates: [
					{
						timestamp: 100,
						avgHashrate: 1000,
					},
					{
						timestamp: 300,
						avgHashrate: 3000,
					},
					{
						timestamp: 200,
						avgHashrate: 2000,
					},
				],
				difficulty: [],
				currentHashrate: 4000,
				currentDifficulty: 1,
			})
			.mockResolvedValueOnce({
				fastestFee: 20,
				halfHourFee: 10,
				hourFee: 6,
				economyFee: 2,
				minimumFee: 1,
			})
			.mockResolvedValueOnce({
				progressPercent: 50,
				difficultyChange: 1.5,
				estimatedRetargetDate: 1_800_000_000_000,
				remainingBlocks: 1000,
				remainingTime: 600_000,
				previousRetarget: -2,
				previousTime: 1_700_000_000_000,
				nextRetargetHeight: 841_000,
				timeAvg: 600_000,
				adjustedTimeAvg: 600_000,
				timeOffset: 0,
				expectedBlocks: 2016,
			})

		const rows = await networkTimestampsResolver.resolve.Caip2.resolve(network, {
			...resolverContext,
			pagination: {
				limit: 3,
			},
		})
		const projection = networkTimestampsResolver.projections.$$timestamps
		if (typeof projection !== 'function')
			throw new Error('MempoolSpace-Rest Network.$$timestamps projection is not direct')
		expect(projection(rows)[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'hashrateHashesPerSecond')]: 4000,
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'difficultyAdjustmentProgressPercent')]: 50,
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'nextRetargetHeight')]: 841_000,
		})
		expect(projection(rows).slice(1)).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: expect.objectContaining({ timestampMs: 300_000 }),
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'hashrateHashesPerSecond')]: 3000,
				}),
			}),
			expect.objectContaining({
				[EntityMetaKey.Selector]: expect.objectContaining({ timestampMs: 200_000 }),
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'hashrateHashesPerSecond')]: 2000,
				}),
			}),
		])

		sourceGetJson.mockResolvedValueOnce({
			hashrates: [{
				timestamp: 300,
				avgHashrate: 3000,
			}],
			difficulty: [],
			currentHashrate: 4000,
			currentDifficulty: 1,
		})
		const historical = await networkTimestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: network,
			timestampMs: 300_000,
			source: Source.MempoolSpace_Rest,
		}, resolverContext)
		expect(networkTimestampResolver.projections.Utxo.hashrateHashesPerSecond(historical)).toBe(3000)
		expect(sourceGetJson).toHaveBeenCalledTimes(6)
	})

	it('lists Bitcoin mining pools from the catalog without fetching pool stats', async () => {
		sourceGetJson.mockResolvedValueOnce([
			{
				name: 'Unknown',
				slug: 'unknown',
				unique_id: 0,
			},
			{
				name: 'F2Pool',
				slug: 'f2pool',
				unique_id: 36,
			},
		])
		const snapshot = await miningPoolsResolver.resolve.Caip2.resolve(network, {
			...resolverContext,
			pagination: {
				limit: 16,
			},
		})
		const projection = miningPoolsResolver.projections.Utxo.$$miningPools
		if (typeof projection === 'function' || projection.select == null || projection.resolveCount == null)
			throw new Error('MempoolSpace-Rest Network.Utxo.$$miningPools projection is not counted')
		expect(projection.select(snapshot, network)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					slug: 'unknown',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BitcoinMiningPool, [], 'uniqueId')]: 0,
					[entityFieldAddressKey(EntityType.BitcoinMiningPool, [], 'name')]: 'Unknown',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					slug: 'f2pool',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BitcoinMiningPool, [], 'uniqueId')]: 36,
					[entityFieldAddressKey(EntityType.BitcoinMiningPool, [], 'name')]: 'F2Pool',
				},
			},
		])
		expect(projection.resolveCount(snapshot, network)).toBe(2)
		expect(sourceGetJson).toHaveBeenCalledTimes(1)
		expect(sourceGetJson).toHaveBeenCalledWith(
			bitcoinBinding,
			'https://mempool.space/api/v1/mining/pools'
		)
	})

	it('resolves a mining pool by slug with coinbase identity and a retrieval-clocked stats observation', async () => {
		sourceGetJson.mockResolvedValueOnce({
			pool: {
				id: 37,
				name: 'F2Pool',
				link: 'https://www.f2pool.com',
				addresses: [
					'1KFHE7w8BhaENAswwryaoccDb6qcT6DbYY',
					'bc1qf274x7penhcd8hsv3jcmwa5xxzjl2a6pa9pxwm',
				],
				regexes: [
					'F2Pool',
					'🐟',
				],
				slug: 'f2pool',
				unique_id: 36,
			},
			blockCount: {
				all: 97_479,
				'24h': 18,
				'1w': 167,
			},
			blockShare: {
				all: 0.10126509954166373,
				'24h': 0.1232876712328767,
				'1w': 0.16851664984863773,
			},
			estimatedHashrate: 113_185_830_253_682_540_000,
			reportedHashrate: null,
			avgBlockHealth: 99.15,
			totalReward: '128416697905845',
		})
		const now = 1_700_000_123_000
		const dateNow = vi.spyOn(Date, 'now').mockReturnValue(now)
		const pool = await miningPoolResolver.resolve.NetworkSlug.resolve({
			$network: network,
			slug: 'f2pool',
		}, resolverContext)
		dateNow.mockRestore()
		expect(miningPoolResolver.projections.name(pool)).toBe('F2Pool')
		expect(miningPoolResolver.projections.uniqueId(pool)).toBe(36)
		expect(miningPoolResolver.projections.websiteUrl(pool)).toBe('https://www.f2pool.com')
		expect(miningPoolResolver.projections.coinbaseTagRegexes(pool)).toEqual([
			'F2Pool',
			'🐟',
		])
		expect(miningPoolResolver.projections.$$coinbaseAddresses(pool)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					address: '1KFHE7w8BhaENAswwryaoccDb6qcT6DbYY',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					address: 'bc1qf274x7penhcd8hsv3jcmwa5xxzjl2a6pa9pxwm',
				},
			},
		])
		expect(miningPoolResolver.projections.$$timestamps(pool)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$pool: {
						$network: network,
						slug: 'f2pool',
					},
					timestampMs: now,
					source: Source.MempoolSpace_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BitcoinMiningPool_Timestamp, [], 'blockCountAll')]: 97_479,
					[entityFieldAddressKey(EntityType.BitcoinMiningPool_Timestamp, [], 'blockCount24h')]: 18,
					[entityFieldAddressKey(EntityType.BitcoinMiningPool_Timestamp, [], 'blockCount1w')]: 167,
					[entityFieldAddressKey(EntityType.BitcoinMiningPool_Timestamp, [], 'blockShareAll')]: 0.10126509954166373,
					[entityFieldAddressKey(EntityType.BitcoinMiningPool_Timestamp, [], 'blockShare24h')]: 0.1232876712328767,
					[entityFieldAddressKey(EntityType.BitcoinMiningPool_Timestamp, [], 'blockShare1w')]: 0.16851664984863773,
					[entityFieldAddressKey(EntityType.BitcoinMiningPool_Timestamp, [], 'estimatedHashrateHashesPerSecond')]: 113_185_830_253_682_540_000,
					[entityFieldAddressKey(EntityType.BitcoinMiningPool_Timestamp, [], 'avgBlockHealth')]: 99.15,
					[entityFieldAddressKey(EntityType.BitcoinMiningPool_Timestamp, [], 'totalRewardSats')]: 128416697905845n,
				},
			},
		])
		expect(mempoolSpaceResolvers.resolvers.some((resolver) => (
			resolver.entityType === EntityType.BitcoinMiningPool_Timestamp
		))).toBe(false)
		expect(sourceGetJson).toHaveBeenCalledWith(
			bitcoinBinding,
			'https://mempool.space/api/v1/mining/pool/f2pool'
		)
	})

	it('limits every selector to canonical Bitcoin subjects', () => {
		for (const resolver of mempoolSpaceResolvers.resolvers)
			for (const selectorEntry of Object.values(resolver.resolve))
				expect(selectorEntry.appliesTo?.length).toBeGreaterThan(0)

		for (const resolver of networkResolvers) {
			expect(resolver.resolve['Caip2'].appliesTo).toEqual([
				{
					caip2: networkBySlug.bitcoin.caip2,
				},
			])
			expect(resolver.resolve['Slug'].appliesTo).toEqual([
				{
					slug: 'bitcoin',
				},
			])
		}
	})

	it('issues Bitcoin list requests for canonical CAIP-2 and rejects unsupported networks before I/O', async () => {
		sourceGetJson.mockResolvedValueOnce([
			{
				height: 1,
				id: 'a'.repeat(64),
				timestamp: 1_700_000_000,
				tx_count: 1,
			},
		])

		await expect(blocksResolver.resolve['Caip2'].resolve(network, resolverContext)).resolves.toHaveLength(1)
		expect(sourceGetJson).toHaveBeenCalledWith(
			bitcoinBinding,
			'https://mempool.space/api/v1/blocks'
		)

		await expect(blocksResolver.resolve['Caip2'].resolve({
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		}, resolverContext)).rejects.toThrow('unsupported Bitcoin network')
		expect(sourceGetJson).toHaveBeenCalledTimes(1)
	})

	it('materializes native mining facts in block history without block detail reads', async () => {
		sourceGetJson.mockResolvedValueOnce([{
			difficulty: 83_148_355_189_239,
			height: 840_000,
			id: 'a'.repeat(64),
			merkle_root: 'b'.repeat(64),
			nonce: 1_234,
			previousblockhash: 'c'.repeat(64),
			size: 1_500_000,
			timestamp: 1_700_000_000,
			tx_count: 3_000,
			weight: 3_990_000,
		}])

		expect(await blocksResolver.resolve.Caip2.resolve(network, resolverContext)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				height: 840_000n,
				hash: 'a'.repeat(64),
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.UtxoBlock, [], 'height')]: 840_000n,
				[entityFieldAddressKey(EntityType.UtxoBlock, [], 'hash')]: 'a'.repeat(64),
				[entityFieldAddressKey(EntityType.UtxoBlock, [], '$parent')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						height: 839_999n,
						hash: 'c'.repeat(64),
					},
				},
				[entityFieldAddressKey(EntityType.UtxoBlock, [], 'timestampMs')]: 1_700_000_000_000,
				[entityFieldAddressKey(EntityType.UtxoBlock, [], 'merkleRoot')]: 'b'.repeat(64),
				[entityFieldAddressKey(EntityType.UtxoBlock, [], 'nonce')]: 1_234,
				[entityFieldAddressKey(EntityType.UtxoBlock, [], 'difficulty')]: 83_148_355_189_239,
				[entityFieldAddressKey(EntityType.UtxoBlock, [], 'sizeBytes')]: 1_500_000,
				[entityFieldAddressKey(EntityType.UtxoBlock, [], 'weightUnits')]: 3_990_000,
				[entityFieldAddressKey(EntityType.UtxoBlock, [], 'transactionCount')]: 3_000,
			},
		}])
		expect(sourceGetJson).toHaveBeenCalledOnce()
	})

	it('materializes sparse difficulty adjustment block references with deterministic identities', async () => {
		sourceGetJson
			.mockResolvedValueOnce([
				[1_786_217_755, 961_632, 127_479_855_693_691.4, 1.00989],
				[1_785_019_866, 959_616, 126_231_507_121_868.2, 0.992616],
			])
		sourceGetText.mockResolvedValueOnce('a'.repeat(64))

		expect(await difficultyAdjustmentBlocksResolver.resolve.Caip2.resolve(network, {
			...resolverContext,
			pagination: {
				offset: 1,
				limit: 1,
			},
		})).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				height: 959_616n,
				hash: 'a'.repeat(64),
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.UtxoBlock, [], 'height')]: 959_616n,
				[entityFieldAddressKey(EntityType.UtxoBlock, [], 'hash')]: 'a'.repeat(64),
				[entityFieldAddressKey(EntityType.UtxoBlock, [], 'timestampMs')]: 1_785_019_866_000,
				[entityFieldAddressKey(EntityType.UtxoBlock, [], 'difficulty')]: 126_231_507_121_868.2,
				[entityFieldAddressKey(EntityType.UtxoBlock, [], 'difficultyAdjustmentPercent')]: -0.7383999999999946,
			},
		}])
		expect(sourceGetJson).toHaveBeenCalledOnce()
		expect(sourceGetText).toHaveBeenCalledWith(bitcoinBinding, 'https://mempool.space/api/block-height/959616')
	})

	it('fail-closes repeated block hashes in sparse difficulty adjustment history', async () => {
		sourceGetJson
			.mockResolvedValueOnce([
				[1_786_217_755, 961_632, 127_479_855_693_691.4, 1.00989],
				[1_785_019_866, 959_616, 126_231_507_121_868.2, 0.992616],
			])
		sourceGetText
			.mockResolvedValueOnce('a'.repeat(64))
			.mockResolvedValueOnce('a'.repeat(64))

		await expect(difficultyAdjustmentBlocksResolver.resolve.Caip2.resolve(network, {
			...resolverContext,
			pagination: {
				limit: 2,
			},
		})).rejects.toThrow('duplicate block hashes')
	})

	it('resolves exact retarget block facts and validates height-hash identity', async () => {
		sourceGetJson.mockResolvedValueOnce([
			[1_786_217_755, 961_632, 127_479_855_693_691.4, 1.00989],
		])
		const difficultyAdjustment = await difficultyAdjustmentBlockResolver.resolve.NetworkHeight.resolve({
			$network: network,
			height: 961_632n,
		}, resolverContext)
		expect(difficultyAdjustmentBlockResolver.projections.difficultyAdjustmentPercent(difficultyAdjustment)).toBeCloseTo(0.989)

		sourceGetText.mockResolvedValueOnce('a'.repeat(64))
		sourceGetJson
			.mockResolvedValueOnce([
				[1_786_217_755, 961_632, 127_479_855_693_691.4, 1.00989],
			])
		await expect(difficultyAdjustmentBlockResolver.resolve.NetworkHeightHash.resolve({
			$network: network,
			height: 961_632n,
			hash: 'a'.repeat(64),
		}, resolverContext)).resolves.toMatchObject({
			height: 961_632,
		})

		sourceGetText.mockResolvedValueOnce('b'.repeat(64))
		await expect(difficultyAdjustmentBlockResolver.resolve.NetworkHeightHash.resolve({
			$network: network,
			height: 961_632n,
			hash: 'a'.repeat(64),
		}, resolverContext)).rejects.toThrow('block hash mismatch')
	})

	it('materializes a paged mempool transaction hierarchy from authoritative transaction reads', async () => {
		sourceGetJson
			.mockResolvedValueOnce([
				'a'.repeat(64),
				'b'.repeat(64),
				'c'.repeat(64),
			])
			.mockResolvedValueOnce({
				txid: 'b'.repeat(64),
				version: 2,
				locktime: 0,
				size: 141,
				weight: 561,
				fee: 1_250,
				status: {
					confirmed: false,
				},
				vin: [{
					txid: 'd'.repeat(64),
					vout: 2,
					is_coinbase: false,
					sequence: 4_294_967_293,
					witness: ['3044'],
				}],
				vout: [{
					scriptpubkey: '0014',
					scriptpubkey_type: 'v0_p2wpkh',
					scriptpubkey_address: 'bc1qrecipient',
					value: 40_000,
				}],
			})

		const rows = await mempoolTransactionsResolver.resolve.Caip2.resolve(network, {
			...resolverContext,
			pagination: {
				limit: 1,
				offset: 1,
			},
		})

		expect(rows).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$network: network,
				txId: 'b'.repeat(64),
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'virtualSizeBytes')]: 141,
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'feeSats')]: 1_250n,
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'isCoinbase')]: false,
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$$inputs')]: [{
					[EntityMetaKey.Selector]: {
						$transaction: {
							$network: network,
							txId: 'b'.repeat(64),
						},
						indexInTransaction: 0,
					},
				}],
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$$outputs')]: [{
					[EntityMetaKey.Selector]: {
						$transaction: {
							$network: network,
							txId: 'b'.repeat(64),
						},
						indexInTransaction: 0,
					},
				}],
			},
		}])
		expect(sourceGetJson).toHaveBeenNthCalledWith(
			1,
			bitcoinBinding,
			'https://mempool.space/api/mempool/txids'
		)
		expect(sourceGetJson).toHaveBeenNthCalledWith(
			2,
			bitcoinBinding,
			`https://mempool.space/api/tx/${'b'.repeat(64)}`
		)
	})

	it('resumes block history from the native height endpoint and stops after genesis', async () => {
		sourceGetJson
			.mockResolvedValueOnce([
				{
					height: 3,
					id: 'a'.repeat(64),
					timestamp: 1_700_000_000,
					tx_count: 1,
				},
			])
			.mockResolvedValueOnce([
				{
					height: 1,
					id: 'b'.repeat(64),
					timestamp: 1_699_999_000,
					tx_count: 1,
				},
				{
					height: 0,
					id: 'c'.repeat(64),
					timestamp: 1_699_998_000,
					tx_count: 1,
				},
			])

		expect((await blocksResolver.resolve.Caip2.resolve(network, {
			...resolverContext,
			pagination: {
				limit: 2,
				offset: 2,
			},
		})).map((block) => block[EntityMetaKey.Selector])).toEqual([
			{
				$network: network,
				height: 1n,
				hash: 'b'.repeat(64),
			},
			{
				$network: network,
				height: 0n,
				hash: 'c'.repeat(64),
			},
		])
		expect(sourceGetJson.mock.calls).toEqual([
			[
				bitcoinBinding,
				'https://mempool.space/api/v1/blocks',
			],
			[
				bitcoinBinding,
				'https://mempool.space/api/v1/blocks/1',
			],
		])

		sourceGetJson.mockReset()
		sourceGetJson.mockResolvedValueOnce([
			{
				height: 3,
				id: 'a'.repeat(64),
				timestamp: 1_700_000_000,
				tx_count: 1,
			},
		])
		expect(await blocksResolver.resolve.Caip2.resolve(network, {
			...resolverContext,
			pagination: {
				limit: 2,
				offset: 4,
			},
		})).toEqual([])
		expect(sourceGetJson).toHaveBeenCalledOnce()
	})

	it('uses the bound confirmed-history endpoint with resumable pagination', async () => {
		sourceGetJson.mockResolvedValueOnce(transactions)

		const page = await addressTransactionsResolver.resolve[
			'NetworkAddress'
		].resolve(address, resolverContext)
		const projection = addressTransactionsResolver.projections.$$transactions
		if (
			typeof projection === 'function'
			|| projection.select == null
			|| projection.continuation == null
		)
			throw new Error('MempoolSpace-Rest spec missing address transaction pagination')

		expect(sourceGetJson).toHaveBeenCalledWith(
			bitcoinBinding,
			`https://mempool.space/api/address/${address.address}/txs/chain`
		)
		expect(projection.continuation(page, address, resolverContext)).toEqual({
			operation: 'address-transactions',
			target: address.address,
			terminal: false,
			token: transactions[0].txid,
		})

		sourceGetJson.mockResolvedValueOnce([])
		const terminalPage = await addressTransactionsResolver.resolve[
			'NetworkAddress'
		].resolve(address, {
			...resolverContext,
			providerContinuationToken: transactions[0].txid,
		})
		expect(sourceGetJson).toHaveBeenLastCalledWith(
			bitcoinBinding,
			`https://mempool.space/api/address/${address.address}/txs/chain/${transactions[0].txid}`
		)
		expect(projection.continuation(terminalPage, address, resolverContext)).toEqual({
			operation: 'address-transactions',
			target: address.address,
			terminal: true,
		})
	})

	it('materializes address transaction facts and native children from the history response', async () => {
		const txId = 'e'.repeat(64)
		sourceGetJson.mockResolvedValueOnce([{
			txid: txId,
			version: 2,
			locktime: 840_000,
			size: 180,
			weight: 600,
			fee: 900,
			status: {
				confirmed: true,
				block_height: 840_000,
				block_hash: 'f'.repeat(64),
			},
			vin: [{
				txid: 'a'.repeat(64),
				vout: 1,
				is_coinbase: false,
				sequence: 4_294_967_293,
				witness: ['01'],
			}],
			vout: [{
				scriptpubkey: '0014',
				scriptpubkey_type: 'v0_p2wpkh',
				scriptpubkey_address: address.address,
				value: 5_000,
			}],
		}])

		const page = await addressTransactionsResolver.resolve.NetworkAddress.resolve(
			address,
			resolverContext
		)
		const projection = addressTransactionsResolver.projections.$$transactions
		if (typeof projection === 'function' || projection.select == null)
			throw new Error('MempoolSpace-Rest spec missing address transaction selection')

		expect(projection.select(page, address)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				txId,
			},
			[EntityMetaKey.Fields]: expect.objectContaining({
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'version')]: 2,
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'feeSats')]: 900n,
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$block')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						height: 840_000n,
						hash: 'f'.repeat(64),
					},
				},
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$$inputs')]: [expect.objectContaining({
					[EntityMetaKey.Selector]: {
						$transaction: {
							$network: network,
							txId,
						},
						indexInTransaction: 0,
					},
				})],
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$$outputs')]: [expect.objectContaining({
					[EntityMetaKey.Fields]: expect.objectContaining({
						[entityFieldAddressKey(EntityType.UtxoOutput, [], 'valueSats')]: 5_000n,
					}),
				})],
			}),
		}])
		expect(sourceGetJson).toHaveBeenCalledOnce()
	})

	it('rejects non-Bitcoin subjects before provider I/O', async () => {
		for (const $network of [
			{
				slug: 'litecoin',
			},
			{
				caip2: {
					namespace: 'wrong-namespace',
					reference: networkBySlug.bitcoin.caip2.reference,
				},
			},
			{
				caip2: {
					namespace: networkBySlug.bitcoin.caip2.namespace,
					reference: 'wrong-mainnet',
				},
			},
		])
			await expect(addressTransactionsResolver.resolve[
				'NetworkAddress'
			].resolve({
				$network,
				address: address.address,
			}, resolverContext)).rejects.toThrow('unsupported Bitcoin network')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('projects Ordinals/Runes from fetched mempool.space transaction wires', async () => {
		const txId = 'e'.repeat(64)
		const helloWorldInscriptionHex = (
			'0063'
			+ '036f7264'
			+ '0101'
			+ '18746578742f706c61696e3b636861727365743d7574662d38'
			+ '00'
			+ '0d48656c6c6f2c20776f726c6421'
			+ '68'
		)
		const wire = {
			txid: txId,
			version: 2,
			locktime: 0,
			size: 200,
			weight: 400,
			fee: 100,
			status: {
				confirmed: true,
				block_height: 840000,
				block_hash: 'f'.repeat(64),
			},
			vin: [{
				txid: '1'.repeat(64),
				vout: 0,
				is_coinbase: false,
				sequence: 0xffffffff,
				witness: [
					helloWorldInscriptionHex,
				],
			}],
			vout: [
				{
					scriptpubkey: '6a5d03020100',
					scriptpubkey_type: 'op_return',
					value: 0,
				},
				{
					scriptpubkey: '0014',
					scriptpubkey_type: 'v0_p2wpkh',
					scriptpubkey_address: 'bc1qexample',
					value: 546,
				},
			],
		}
		sourceGetJson.mockResolvedValue(wire)

		const entitySelector = {
			$network: network,
			txId,
		}
		const transaction = await transactionResolver.resolve.NetworkTxId.resolve(entitySelector, resolverContext)
		expect(transactionResolver.projections.$$bitcoinOrdinalInscriptions(transaction)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					inscriptionId: `${txId}i0`,
				},
			},
		])
		expect(transactionResolver.projections.$bitcoinRunestone(transaction)).toEqual({
			[EntityMetaKey.Selector]: {
				$transaction: entitySelector,
				outputIndex: 0,
			},
		})

		const runestoneOutput = await outputResolver.resolve.TransactionIndexInTransaction.resolve({
			$transaction: entitySelector,
			indexInTransaction: 0,
		}, resolverContext)
		expect(outputResolver.projections.$bitcoinRunestone(runestoneOutput)).toEqual({
			[EntityMetaKey.Selector]: {
				$transaction: entitySelector,
				outputIndex: 0,
			},
		})

		const inscriptionResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.BitcoinOrdinalInscription
		))
		const runestoneResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.BitcoinRunestone
		))
		if (inscriptionResolver == null || runestoneResolver == null)
			throw new Error('MempoolSpace-Rest missing Ordinals/Runes entity resolvers')

		const inscription = await inscriptionResolver.resolve.NetworkInscriptionId.resolve({
			$network: network,
			inscriptionId: `${txId}i0`,
		}, resolverContext)
		expect(inscriptionResolver.projections.contentType(inscription)).toBe('text/plain;charset=utf-8')
		expect(inscriptionResolver.projections.bodyHex(inscription)).toBe('48656c6c6f2c20776f726c6421')

		const runestone = await runestoneResolver.resolve.TransactionOutputIndex.resolve({
			$transaction: entitySelector,
			outputIndex: 0,
		}, resolverContext)
		expect(runestoneResolver.projections.payloadHex(runestone)).toBe('020100')
		expect(runestoneResolver.projections.isCenotaph(runestone)).toBe(false)
	})

	it('projects multi-envelope inscriptions and LEB128 cenotaph runestones', async () => {
		const txId = 'a'.repeat(64)
		const helloWorldInscriptionHex = (
			'0063'
			+ '036f7264'
			+ '0101'
			+ '18746578742f706c61696e3b636861727365743d7574662d38'
			+ '00'
			+ '0d48656c6c6f2c20776f726c6421'
			+ '68'
		)
		const secondInscriptionHex = (
			'0063'
			+ '036f7264'
			+ '0101'
			+ '0a746578742f706c61696e'
			+ '00'
			+ '024869'
			+ '68'
		)
		sourceGetJson.mockResolvedValue({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 300,
			weight: 600,
			fee: 200,
			status: {
				confirmed: true,
				block_height: 840002,
				block_hash: 'b'.repeat(64),
			},
			vin: [{
				txid: 'c'.repeat(64),
				vout: 0,
				is_coinbase: false,
				sequence: 0xffffffff,
				witness: [
					helloWorldInscriptionHex + secondInscriptionHex,
				],
			}],
			vout: [
				{
					scriptpubkey: '6a5d037e0000',
					scriptpubkey_type: 'op_return',
					value: 0,
				},
			],
		})

		const entitySelector = {
			$network: network,
			txId,
		}
		const transactionResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.UtxoTransaction
		))
		const inscriptionResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.BitcoinOrdinalInscription
		))
		const runestoneResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.BitcoinRunestone
		))
		if (transactionResolver == null || inscriptionResolver == null || runestoneResolver == null)
			throw new Error('MempoolSpace-Rest missing Ordinals/Runes resolvers')

		const transaction = await transactionResolver.resolve.NetworkTxId.resolve(entitySelector, resolverContext)
		expect(transactionResolver.projections.$$bitcoinOrdinalInscriptions(transaction)).toHaveLength(2)

		const second = await inscriptionResolver.resolve.NetworkInscriptionId.resolve({
			$network: network,
			inscriptionId: `${txId}i1`,
		}, resolverContext)
		expect(inscriptionResolver.projections.inscriptionIndex(second)).toBe(1)
		expect(inscriptionResolver.projections.bodyHex(second)).toBe('4869')

		const runestone = await runestoneResolver.resolve.TransactionOutputIndex.resolve({
			$transaction: entitySelector,
			outputIndex: 0,
		}, resolverContext)
		expect(runestoneResolver.projections.isCenotaph(runestone)).toBe(true)
	})

	it('resolves independently addressable output spent status from native outspend', async () => {
		const txId = 'b'.repeat(64)
		sourceGetJson.mockResolvedValueOnce({
			spent: false,
		})
		expect(
			outputSpentResolver.projections.isSpent(
				await outputSpentResolver.resolve.TransactionIndexInTransaction.resolve({
					$transaction: {
						$network: network,
						txId,
					},
					indexInTransaction: 1,
				}, resolverContext)
			)
		).toBe(false)
		expect(sourceGetJson).toHaveBeenCalledWith(
			bitcoinBinding,
			`https://mempool.space/api/tx/${txId}/outspend/1`
		)
	})
})

describe('MempoolSpace live network head', () => {
	beforeEach(() => {
		vi.resetAllMocks()
		vi.useFakeTimers()
		sourceGetJson
			.mockResolvedValueOnce(840_000)
			.mockResolvedValueOnce({
				count: 9,
				vsize: 1_800,
				total_fee: 1,
			})
			.mockResolvedValueOnce({
				fastestFee: 20,
				halfHourFee: 10,
				hourFee: 6,
				economyFee: 2,
				minimumFee: 1,
			})
	})

	it('polls mempool, fees, and tip height into a live Network_Timestamp', async () => {
		const networkHeadResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network
			&& resolver.resolveLive?.networkHead
		))
		if (networkHeadResolver == null)
			throw new Error('MempoolSpace-Rest missing Network networkHead resolveLive')

		const replaceTimestamps = vi.fn()
		const abortController = new AbortController()
		const stop = networkHeadResolver.resolveLive.networkHead.start({
			fields: {
				'$$timestamps': {
					replaceRows: replaceTimestamps,
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
			},
			parentEntitySelector: network,
			queryClient: {},
			signal: abortController.signal,
			trigger: resolverContext,
		})
		await vi.waitFor(() => expect(replaceTimestamps).toHaveBeenCalledOnce())

		const row = replaceTimestamps.mock.calls[0]?.[0]?.[0]?.value[0]
		if (row == null)
			throw new Error('MempoolSpace live network head did not publish a row')

		expect(row[EntityMetaKey.Selector]).toMatchObject({
			$network: network,
			source: Source.MempoolSpace_Rest,
		})
		expect(row[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.Network_Timestamp, [], 'ledgerModels')]: [NetworkLedgerModel.Utxo],
			[entityFieldAddressKey(EntityType.Network_Timestamp, [], 'executionModels')]: [],
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHeight')]: 840_000n,
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolTransactionCount')]: 9,
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolSizeBytes')]: 1_800n,
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'suggestedTransactionFeePerByteSats')]: 6,
		})
		expect(sourceGetJson).toHaveBeenCalledWith(bitcoinBinding, 'https://mempool.space/api/blocks/tip/height')
		expect(sourceGetJson).toHaveBeenCalledWith(bitcoinBinding, 'https://mempool.space/api/mempool')
		expect(sourceGetJson).toHaveBeenCalledWith(bitcoinBinding, 'https://mempool.space/api/v1/fees/recommended')

		abortController.abort()
		stop()
	})

	it('invalidates the block list only when the tip height changes', async () => {
		if (!blocksResolver.resolveLive?.utxoHead)
			throw new Error('MempoolSpace-Rest missing Network.Utxo utxoHead resolveLive')

		sourceGetJson.mockReset()
		sourceGetJson
			.mockResolvedValueOnce(840_000)
			.mockResolvedValueOnce(840_000)
			.mockResolvedValueOnce(840_001)
		const invalidateBlocks = vi.fn()
		const abortController = new AbortController()
		const stop = blocksResolver.resolveLive.utxoHead.start({
			fields: {
				'$$blocks': {
					replaceRows: vi.fn(),
					invalidate: invalidateBlocks,
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
			},
			parentEntitySelector: network,
			queryClient: {},
			signal: abortController.signal,
			trigger: resolverContext,
		})
		await vi.waitFor(() => expect(invalidateBlocks).toHaveBeenCalledOnce())
		await vi.advanceTimersByTimeAsync(15_000)
		expect(invalidateBlocks).toHaveBeenCalledOnce()
		await vi.advanceTimersByTimeAsync(15_000)
		expect(invalidateBlocks).toHaveBeenCalledTimes(2)

		abortController.abort()
		stop()
	})
})

describe('LightningMempoolSpace live network statistics', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.useFakeTimers()
		sourceGetJson.mockResolvedValue({
			latest: {
				added: '2026-01-01T00:00:00.000Z',
				node_count: 10,
				channel_count: 20,
				total_capacity: '3000',
				avg_fee_rate: 4,
			},
		})
	})

	it('publishes the authoritative statistics clock and fields', async () => {
		const networkStatsResolver = lightningMempoolSpaceResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.LightningNetwork
			&& resolver.resolveLive?.networkStats
		))
		if (networkStatsResolver == null)
			throw new Error('LightningMempoolSpace-Rest missing LightningNetwork networkStats resolveLive')

		const replaceTimestamps = vi.fn()
		const abortController = new AbortController()
		const stop = networkStatsResolver.resolveLive.networkStats.start({
			fields: {
				'$$timestamps': {
					replaceRows: replaceTimestamps,
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
			},
			parentEntitySelector: {
				$network: {
					slug: 'lightning',
				},
			},
			queryClient: {},
			signal: abortController.signal,
			trigger: resolverContext,
		})
		await vi.dynamicImportSettled()
		expect(replaceTimestamps).toHaveBeenCalledOnce()

		const row = replaceTimestamps.mock.calls[0]?.[0]?.[0]?.value[0]
		if (row == null)
			throw new Error('LightningMempoolSpace live network statistics did not publish a row')

		expect(row[EntityMetaKey.Selector]).toEqual({
			$lightningNetwork: {
				$network: {
					slug: 'lightning',
				},
			},
			timestampMs: Date.parse('2026-01-01T00:00:00.000Z'),
			source: Source.LightningMempoolSpace_Rest,
		})
		expect(row[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], 'nodeCount')]: 10,
			[entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], 'channelCount')]: 20,
			[entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], 'totalCapacitySats')]: 3_000n,
			[entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], 'averageFeeRatePpm')]: 4,
		})

		abortController.abort()
		stop()
	})
})

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { entityFieldAddressKey, EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/LitecoinCore/bindings.ts'
import { Source } from '$/sources/Source.ts'

const getBlock = vi.fn()
const getRawTransaction = vi.fn()
const getBlockCount = vi.fn()
const getBlockHash = vi.fn()
const getMempoolInfo = vi.fn()
const getTransparentAddressUtxos = vi.fn()

vi.mock('$/sources/LitecoinCore/JsonRpc/queries.ts', () => ({
	getBlock,
	getRawTransaction,
	getBlockCount,
	getBlockHash,
	getMempoolInfo,
	getTransparentAddressUtxos,
}))

const { default: litecoinCoreResolvers } = await import('$/resolvers/LitecoinCore-JsonRpc.ts')

const litecoinMainnetBinding = bindings[Source.LitecoinCore_JsonRpc][0]

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 2,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const blockHash = 'a'.repeat(64)
const parentHash = 'b'.repeat(64)

const tipBlock = {
	hash: blockHash,
	height: 2_700_000,
	version: 1,
	versionHex: '00000001',
	merkleroot: 'c'.repeat(64),
	time: 1_750_000_000,
	mediantime: 1_750_000_000,
	nonce: 1,
	bits: '1a00ffff',
	difficulty: 1,
	chainwork: '01',
	nTx: 1,
	previousblockhash: parentHash,
	tx: ['d'.repeat(64)],
}

const blockResolver = litecoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoBlock
	&& 'NetworkHeight' in resolver.resolve
))

const networkBlocksResolver = litecoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Utxo' in resolver.projections
	&& '$$blocks' in resolver.projections.Utxo
	&& typeof resolver.projections.Utxo.$$blocks === 'object'
	&& 'select' in resolver.projections.Utxo.$$blocks
))

const addressOutputsResolver = litecoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress
	&& '$$outputs' in resolver.projections
))

const addressTimestampsResolver = litecoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress
	&& '$$timestamps' in resolver.projections
))

const networkTimestampResolver = litecoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network_Timestamp
))

const networkTimestampsResolver = litecoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& '$$timestamps' in resolver.projections
))

const transactionResolver = litecoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoTransaction
))

const inputResolver = litecoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoInput
))

const outputResolver = litecoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoOutput
))

if (transactionResolver == null)
	throw new Error('LitecoinCore-JsonRpc spec missing UtxoTransaction resolver')

if (inputResolver == null || outputResolver == null)
	throw new Error('LitecoinCore-JsonRpc spec missing child input/output resolver')

if (blockResolver == null || networkBlocksResolver == null)
	throw new Error('LitecoinCore-JsonRpc spec missing UTXO block / network list resolvers')

if (addressOutputsResolver == null || addressTimestampsResolver == null)
	throw new Error('LitecoinCore-JsonRpc spec missing address UTXO resolvers')

if (networkTimestampResolver == null || networkTimestampsResolver == null)
	throw new Error('LitecoinCore-JsonRpc spec missing network tip observation resolvers')

describe('LitecoinCore UTXO', () => {
	beforeEach(() => {
		getRawTransaction.mockReset()
		getBlock.mockReset()
		getBlockCount.mockReset()
		getBlockHash.mockReset()
		getMempoolInfo.mockReset()
		getTransparentAddressUtxos.mockReset()
	})

	it('projects transaction child selectors from one verbose getrawtransaction', async () => {
		const txId = 'd'.repeat(64)
		getRawTransaction.mockResolvedValueOnce({
			txid: txId,
			version: 1,
			locktime: 0,
			size: 200,
			vsize: 100,
			weight: 400,
			vin: [{
				txid: 'e'.repeat(64),
				vout: 0,
				scriptSig: {
					asm: 'input script',
				},
				sequence: 1,
			}],
			vout: [{
				value: 1.5,
				n: 0,
				scriptPubKey: {
					asm: 'output script',
					hex: '76a914',
					type: 'pubkeyhash',
					address: 'LExampleAddress',
				},
			}],
		})
		const entitySelector = {
			$network: {
				slug: networkBySlug.litecoin.slug,
			},
			txId,
		}
		const transaction = await transactionResolver.resolve[
			'NetworkTxId'
		].resolve(entitySelector, resolverContext)

		expect(transactionResolver.projections.$$inputs(transaction)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: entitySelector,
				indexInTransaction: 0,
			},
		}])
		expect(transactionResolver.projections.$$outputs(transaction)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: entitySelector,
				indexInTransaction: 0,
			},
		}])
	})

	it('resolves input and output fields from the same transaction response', async () => {
		const txId = 'a'.repeat(64)
		const spentTxId = 'b'.repeat(64)
		getRawTransaction.mockResolvedValue({
			txid: txId,
			version: 1,
			locktime: 0,
			size: 200,
			vsize: 100,
			weight: 400,
			vin: [{
				txid: spentTxId,
				vout: 2,
				scriptSig: {
					asm: 'spent input',
				},
				sequence: 0xffffffff,
				txinwitness: [
					'witness-item',
				],
			}],
			vout: [{
				value: 1.5,
				n: 0,
				scriptPubKey: {
					asm: 'OP_DUP',
					hex: '76a914',
					type: 'pubkeyhash',
					address: 'LExampleAddress',
				},
			}],
		})
		const $transaction = {
			$network: {
				slug: networkBySlug.litecoin.slug,
			},
			txId,
		}
		const input = await inputResolver.resolve[
			'TransactionIndexInTransaction'
		].resolve({
			$transaction,
			indexInTransaction: 0,
		}, resolverContext)
		const output = await outputResolver.resolve[
			'TransactionIndexInTransaction'
		].resolve({
			$transaction,
			indexInTransaction: 0,
		}, resolverContext)

		expect(inputResolver.projections.$spentOutput(input)).toEqual({
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: $transaction.$network,
					txId: spentTxId,
				},
				indexInTransaction: 2,
			},
		})
		expect(inputResolver.projections.scriptSigAsm(input)).toBe('spent input')
		expect(inputResolver.projections.witness(input)).toEqual([
			'witness-item',
		])
		expect(outputResolver.projections.valueSats(output)).toBe(150_000_000n)
		expect(outputResolver.projections.scriptPubKeyType(output)).toBe('pubkeyhash')
		expect(outputResolver.projections.$address(output)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: $transaction.$network,
				address: 'LExampleAddress',
			},
		})
		expect(getRawTransaction).toHaveBeenCalledTimes(2)
	})

	it('projects Network.Utxo.$$blocks tip walk and height-resolved UtxoBlock', async () => {
		getBlockCount.mockResolvedValueOnce(5)
		getBlockHash
			.mockResolvedValueOnce('1'.repeat(64))
			.mockResolvedValueOnce('2'.repeat(64))
		getBlock.mockResolvedValueOnce({
			...tipBlock,
			hash: '1'.repeat(64),
			height: 5,
			tx: ['3'.repeat(64)],
		})

		const network = {
			slug: networkBySlug.litecoin.slug,
		}
		const blocksSnapshot = await networkBlocksResolver.resolve.Slug.resolve(
			network,
			resolverContext
		)
		expect(networkBlocksResolver.projections.Utxo.$$blocks.select(blocksSnapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					height: 5n,
					hash: '1'.repeat(64),
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					height: 4n,
					hash: '2'.repeat(64),
				},
			},
		])
		expect(networkBlocksResolver.projections.Utxo.$$blocks.resolveCount(blocksSnapshot)).toBe(6n)

		const block = await blockResolver.resolve.NetworkHeight.resolve({
			$network: network,
			height: 5n,
		}, resolverContext)
		expect(blockResolver.projections.hash(block)).toBe('1'.repeat(64))
		expect(blockResolver.projections.transactionCount(block)).toBe(1)
		expect(getBlockHash).toHaveBeenCalledWith({
			height: 5n,
		})
		expect(litecoinMainnetBinding).toBeTruthy()
	})

	it('projects address $$outputs and tip balance observations from scantxoutset', async () => {
		const address = 'LExampleAddress0123456789ABCDEF'
		const network = {
			slug: networkBySlug.litecoin.slug,
		}
		getTransparentAddressUtxos.mockResolvedValue({
			unspents: [{
				txid: '4'.repeat(64),
				vout: 1,
				valueSatoshis: 50_000_000n,
				scriptPubKey: '76a91400',
			}],
			totalAmountSatoshis: 50_000_000n,
		})

		const outputs = await addressOutputsResolver.resolve.NetworkAddress.resolve({
			$network: network,
			address,
		}, resolverContext)
		expect(addressOutputsResolver.projections.$$outputs(outputs)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: network,
					txId: '4'.repeat(64),
				},
				indexInTransaction: 1,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.UtxoOutput, [], 'valueSats')]: 50_000_000n,
				[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyHex')]: '76a91400',
				[entityFieldAddressKey(EntityType.UtxoOutput, [], 'isSpent')]: false,
			},
		}])

		const addressTip = await addressTimestampsResolver.resolve.NetworkAddress.resolve({
			$network: network,
			address,
		}, resolverContext)
		expect(addressTimestampsResolver.projections.$$timestamps(addressTip)[0]?.[EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.UtxoAddress_Timestamp, [], 'balanceSats')]: 50_000_000n,
			[entityFieldAddressKey(EntityType.UtxoAddress_Timestamp, [], 'unspentOutputCount')]: 1,
		})
		expect(litecoinCoreResolvers.resolvers.some((resolver) => (
			resolver.entityType === EntityType.UtxoAddress_Timestamp
		))).toBe(false)
	})

	it('projects Network_Timestamp tip fields from block tip + getmempoolinfo', async () => {
		const network = {
			slug: networkBySlug.litecoin.slug,
		}
		getBlockCount.mockResolvedValue(2_700_000)
		getBlockHash.mockResolvedValue(blockHash)
		getBlock.mockResolvedValue(tipBlock)
		getMempoolInfo.mockResolvedValue({
			loaded: true,
			size: 42,
			bytes: 12_345,
			usage: 20_000,
			total_fee: 0.1,
			maxmempool: 300_000_000,
			mempoolminfee: 0.00001,
			minrelaytxfee: 0.00001,
		})

		await expect(networkTimestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: network,
			timestampMs: 1_700_000_000_000,
			source: Source.LitecoinCore_JsonRpc,
		}, resolverContext)).rejects.toThrow('no network observation at 1700000000000')

		const timestamps = await networkTimestampsResolver.resolve.Slug.resolve(network, resolverContext)
		expect(networkTimestampsResolver.projections.$$timestamps(timestamps)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					timestampMs: expect.any(Number),
					source: Source.LitecoinCore_JsonRpc,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHeight')]: 2_700_000n,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHash')]: blockHash,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockTimeMs')]: 1_750_000_000_000,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'blockCount')]: 2_700_001n,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolTransactionCount')]: 42,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolSizeBytes')]: 12_345n,
				},
			},
		])
	})

	it('fails closed on unsupported networks before transport', async () => {
		await expect(transactionResolver.resolve[
			'NetworkTxId'
		].resolve({
			$network: {
				slug: networkBySlug.bitcoin.slug,
			},
			txId: 'c'.repeat(64),
		}, resolverContext)).rejects.toThrow('LitecoinCore_JsonRpc: unsupported Litecoin network')

		await expect(blockResolver.resolve.NetworkHeightHash.resolve({
			$network: {
				slug: networkBySlug.bitcoin.slug,
			},
			height: 1n,
			hash: blockHash,
		}, resolverContext)).rejects.toThrow('LitecoinCore_JsonRpc: unsupported Litecoin network')
	})
})

describe('LitecoinCore live network head', () => {
	const network = {
		slug: networkBySlug.litecoin.slug,
	}

	beforeEach(() => {
		getRawTransaction.mockReset()
		getBlock.mockReset()
		getBlockCount.mockReset()
		getBlockHash.mockReset()
		getMempoolInfo.mockReset()
		getTransparentAddressUtxos.mockReset()
		vi.useFakeTimers()
		getBlockCount.mockResolvedValue(2_700_000)
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('publishes retrieval-clock Network_Timestamp rows from getblockcount only', async () => {
		if (networkTimestampsResolver.resolveLive?.networkHead == null)
			throw new Error('LitecoinCore-JsonRpc missing Network networkHead resolveLive')

		const replaceTimestamps = vi.fn()
		const abortController = new AbortController()
		const stop = networkTimestampsResolver.resolveLive.networkHead.start({
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
			throw new Error('LitecoinCore live network head did not publish a row')

		expect(row[EntityMetaKey.Selector]).toMatchObject({
			$network: network,
			source: Source.LitecoinCore_JsonRpc,
		})
		expect(row[EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHeight')]: 2_700_000n,
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'blockCount')]: 2_700_001n,
		})
		expect(getBlockCount).toHaveBeenCalledOnce()
		expect(getBlockHash).not.toHaveBeenCalled()
		expect(getBlock).not.toHaveBeenCalled()
		expect(getMempoolInfo).not.toHaveBeenCalled()

		abortController.abort()
		stop()
		await vi.advanceTimersByTimeAsync(15_000)
		expect(getBlockCount).toHaveBeenCalledOnce()
	})

	it('rejects unsupported networks before polling', () => {
		if (networkTimestampsResolver.resolveLive?.networkHead == null)
			throw new Error('LitecoinCore-JsonRpc missing Network networkHead resolveLive')

		expect(() => networkTimestampsResolver.resolveLive.networkHead.start({
			fields: {
				'$$timestamps': {
					replaceRows: vi.fn(),
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
			},
			parentEntitySelector: {
				slug: networkBySlug.bitcoin.slug,
			},
			queryClient: {},
			signal: new AbortController().signal,
			trigger: resolverContext,
		})).toThrow('LitecoinCore_JsonRpc: unsupported Litecoin network')
		expect(getBlockCount).not.toHaveBeenCalled()
	})

	it('invalidates Network.Utxo.$$blocks only when height changes', async () => {
		if (networkBlocksResolver.resolveLive?.utxoHead == null)
			throw new Error('LitecoinCore-JsonRpc missing Network.Utxo utxoHead resolveLive')

		getBlockCount
			.mockResolvedValueOnce(2_700_000)
			.mockResolvedValueOnce(2_700_000)
			.mockResolvedValueOnce(2_700_001)
		const invalidateBlocks = vi.fn()
		const abortController = new AbortController()
		const stop = networkBlocksResolver.resolveLive.utxoHead.start({
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
		await vi.advanceTimersByTimeAsync(15_000)
		expect(getBlockCount).toHaveBeenCalledTimes(3)
	})
})

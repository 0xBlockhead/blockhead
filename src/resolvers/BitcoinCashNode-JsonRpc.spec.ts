import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { entityFieldAddressKey, EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getRawTransaction = vi.fn()
const getBlock = vi.fn()
const getBlockCount = vi.fn()
const getBlockHash = vi.fn()
const getMempoolInfo = vi.fn()
const getTransparentAddressUtxos = vi.fn()

vi.mock('$/sources/BitcoinCashNode/JsonRpc/queries.ts', () => ({
	getRawTransaction,
	getBlock,
	getBlockCount,
	getBlockHash,
	getMempoolInfo,
	getTransparentAddressUtxos,
}))

const { default: bitcoinCashNodeResolvers } = await import('$/resolvers/BitcoinCashNode-JsonRpc.ts')

const transactionResolver = bitcoinCashNodeResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoTransaction
))
const inputResolver = bitcoinCashNodeResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoInput
))
const outputResolver = bitcoinCashNodeResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoOutput
))
const blockResolver = bitcoinCashNodeResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoBlock
	&& 'NetworkHeight' in resolver.resolve
))
const networkBlocksResolver = bitcoinCashNodeResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Utxo' in resolver.projections
	&& '$$blocks' in resolver.projections.Utxo
	&& typeof resolver.projections.Utxo.$$blocks === 'object'
	&& 'select' in resolver.projections.Utxo.$$blocks
))
const addressOutputsResolver = bitcoinCashNodeResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress
	&& '$$outputs' in resolver.projections
))
const addressTimestampsResolver = bitcoinCashNodeResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress
	&& '$$timestamps' in resolver.projections
))
const networkTimestampResolver = bitcoinCashNodeResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network_Timestamp
))
const networkTimestampsResolver = bitcoinCashNodeResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& '$$timestamps' in resolver.projections
))

if (transactionResolver == null)
	throw new Error('BitcoinCashNode-JsonRpc spec missing UtxoTransaction resolver')

if (inputResolver == null || outputResolver == null)
	throw new Error('BitcoinCashNode-JsonRpc spec missing child input/output resolver')

if (blockResolver == null || networkBlocksResolver == null)
	throw new Error('BitcoinCashNode-JsonRpc spec missing UTXO block / network list resolvers')

if (addressOutputsResolver == null || addressTimestampsResolver == null)
	throw new Error('BitcoinCashNode-JsonRpc spec missing address UTXO resolvers')

if (networkTimestampResolver == null || networkTimestampsResolver == null)
	throw new Error('BitcoinCashNode-JsonRpc spec missing network tip observation resolvers')

const network = {
	caip2: networkBySlug['bitcoin-cash'].caip2,
}

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

describe('BitcoinCashNode UTXO', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('projects transaction fields and child selectors from one provider response', async () => {
		const txId = 'b'.repeat(64)
		getRawTransaction.mockResolvedValueOnce({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 200,
			vsize: 200,
			weight: 800,
			vin: [{
				txid: 'd'.repeat(64),
				vout: 1,
				scriptSig: {
					asm: 'input script',
				},
				sequence: 1,
			}],
			vout: [{
				value: 0.00005,
				n: 0,
				scriptPubKey: {
					asm: 'output script',
					hex: '76a914',
					type: 'pubkeyhash',
					address: 'bitcoincash:qpexample',
				},
			}],
		})
		const entitySelector = {
			$network: network,
			txId,
		}
		const transaction = await transactionResolver.resolve[
			'NetworkTxId'
		].resolve(entitySelector, resolverContext)

		expect(transactionResolver.projections.version(transaction)).toBe(2)
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
		expect(getRawTransaction).toHaveBeenCalledOnce()
		expect(getRawTransaction).toHaveBeenCalledWith({
			txId,
		})
	})

	it('resolves input and output fields including CashToken refs from the same transaction response', async () => {
		const txId = 'e'.repeat(64)
		const spentTxId = 'f'.repeat(64)
		const categoryId = 'a'.repeat(64)
		getRawTransaction.mockResolvedValue({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 200,
			vsize: 200,
			weight: 800,
			vin: [{
				txid: spentTxId,
				vout: 2,
				scriptSig: {
					asm: 'spent input',
				},
				sequence: 0xffffffff,
			}],
			vout: [{
				value: 1.5,
				n: 0,
				scriptPubKey: {
					asm: 'paid output',
					hex: '76a914',
					type: 'pubkeyhash',
					address: 'bitcoincash:qpexample',
				},
				tokenData: {
					category: categoryId,
					amount: '42',
					nft: {
						capability: 'none',
						commitment: 'abcd',
					},
				},
			}],
		})
		const entitySelector = {
			$network: network,
			txId,
		}
		const input = await inputResolver.resolve[
			'TransactionIndexInTransaction'
		].resolve({
			$transaction: entitySelector,
			indexInTransaction: 0,
		}, resolverContext)
		const output = await outputResolver.resolve[
			'TransactionIndexInTransaction'
		].resolve({
			$transaction: entitySelector,
			indexInTransaction: 0,
		}, resolverContext)

		expect(inputResolver.projections.$spentOutput(input)).toEqual({
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: network,
					txId: spentTxId,
				},
				indexInTransaction: 2,
			},
		})
		expect(inputResolver.projections.scriptSigAsm(input)).toBe('spent input')
		expect(outputResolver.projections.valueSats(output)).toBe(150_000_000n)
		expect(outputResolver.projections.scriptPubKeyType(output)).toBe('pubkeyhash')
		expect(outputResolver.projections.$address(output)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				address: 'bitcoincash:qpexample',
			},
		})
		expect(outputResolver.projections.$bitcoinCashCashTokenFungibleAmount(output)).toEqual({
			[EntityMetaKey.Selector]: {
				$output: {
					$transaction: entitySelector,
					indexInTransaction: 0,
				},
			},
		})
		expect(outputResolver.projections.$bitcoinCashCashTokenNft(output)).toEqual({
			[EntityMetaKey.Selector]: {
				$output: {
					$transaction: entitySelector,
					indexInTransaction: 0,
				},
			},
		})
		expect(getRawTransaction).toHaveBeenCalledTimes(2)
	})

	it('projects Network.Utxo.$$blocks tip walk and UtxoBlock by height', async () => {
		getBlockCount.mockResolvedValueOnce(10)
		getBlockHash
			.mockResolvedValueOnce('1'.repeat(64))
			.mockResolvedValueOnce('2'.repeat(64))
		getBlock.mockResolvedValueOnce({
			hash: '1'.repeat(64),
			height: 10,
			version: 1,
			versionHex: '00000001',
			merkleroot: '3'.repeat(64),
			time: 1_700_000_000,
			mediantime: 1_700_000_000,
			nonce: 1,
			bits: '1a00ffff',
			difficulty: 1,
			chainwork: '01',
			nTx: 2,
			previousblockhash: '2'.repeat(64),
			tx: ['4'.repeat(64), '5'.repeat(64)],
		})

		const blocksSnapshot = await networkBlocksResolver.resolve.Caip2.resolve(
			network,
			resolverContext
		)
		expect(networkBlocksResolver.projections.Utxo.$$blocks.select(blocksSnapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					height: 10n,
					hash: '1'.repeat(64),
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					height: 9n,
					hash: '2'.repeat(64),
				},
			},
		])
		expect(networkBlocksResolver.projections.Utxo.$$blocks.resolveCount(blocksSnapshot)).toBe(11n)

		const block = await blockResolver.resolve.NetworkHeight.resolve({
			$network: network,
			height: 10n,
		}, resolverContext)
		expect(blockResolver.projections.hash(block)).toBe('1'.repeat(64))
		expect(blockResolver.projections.transactionCount(block)).toBe(2)
	})

	it('projects address $$outputs and tip balance from CashToken-aware scantxoutset', async () => {
		const address = `bitcoincash:q${'q'.repeat(41)}`
		getTransparentAddressUtxos.mockResolvedValue({
			unspents: [{
				txid: '6'.repeat(64),
				vout: 0,
				valueZatoshis: 12_345n,
				scriptPubKey: '76a91400',
			}],
			totalAmountZatoshis: 12_345n,
			tokenTotalAmountByCategory: {},
		})

		const outputs = await addressOutputsResolver.resolve.NetworkAddress.resolve({
			$network: network,
			address,
		}, resolverContext)
		expect(addressOutputsResolver.projections.$$outputs(outputs)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: network,
					txId: '6'.repeat(64),
				},
				indexInTransaction: 0,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.UtxoOutput, [], 'valueSats')]: 12_345n,
				[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyHex')]: '76a91400',
				[entityFieldAddressKey(EntityType.UtxoOutput, [], 'isSpent')]: false,
			},
		}])

		const addressTip = await addressTimestampsResolver.resolve.NetworkAddress.resolve({
			$network: network,
			address,
		}, resolverContext)
		expect(addressTimestampsResolver.projections.$$timestamps(addressTip)[0]?.[EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.UtxoAddress_Timestamp, [], 'balanceSats')]: 12_345n,
			[entityFieldAddressKey(EntityType.UtxoAddress_Timestamp, [], 'unspentOutputCount')]: 1,
		})
		expect(bitcoinCashNodeResolvers.resolvers.some((resolver) => (
			resolver.entityType === EntityType.UtxoAddress_Timestamp
		))).toBe(false)
	})

	it('projects Network_Timestamp tip fields from block tip + getmempoolinfo', async () => {
		const tipHash = 'a'.repeat(64)
		getBlockCount.mockResolvedValue(850_000)
		getBlockHash.mockResolvedValue(tipHash)
		getBlock.mockResolvedValue({
			hash: tipHash,
			height: 850_000,
			version: 1,
			versionHex: '00000001',
			merkleroot: 'b'.repeat(64),
			time: 1_700_000_000,
			mediantime: 1_700_000_000,
			nonce: 1,
			bits: '1a00ffff',
			difficulty: 1,
			chainwork: '01',
			nTx: 2,
			tx: ['c'.repeat(64), 'd'.repeat(64)],
		})
		getMempoolInfo.mockResolvedValue({
			loaded: true,
			size: 17,
			bytes: 9_001,
			usage: 10_000,
			total_fee: 0.01,
			maxmempool: 300_000_000,
			mempoolminfee: 0.00001,
			minrelaytxfee: 0.00001,
		})

		await expect(networkTimestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: network,
			timestampMs: 1_700_000_000_000,
			source: Source.BitcoinCashNode_JsonRpc,
		}, resolverContext)).rejects.toThrow('no network observation at 1700000000000')

		const timestamps = await networkTimestampsResolver.resolve.Caip2.resolve(network, resolverContext)
		expect(networkTimestampsResolver.projections.$$timestamps(timestamps)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					timestampMs: expect.any(Number),
					source: Source.BitcoinCashNode_JsonRpc,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHeight')]: 850_000n,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHash')]: tipHash,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockTimeMs')]: 1_700_000_000_000,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'blockCount')]: 850_001n,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolTransactionCount')]: 17,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolSizeBytes')]: 9_001n,
				},
			},
		])
	})

	it('fails closed on unsupported networks before transport', async () => {
		await expect(transactionResolver.resolve[
			'NetworkTxId'
		].resolve({
			$network: {
				caip2: networkBySlug.bitcoin.caip2,
			},
			txId: 'c'.repeat(64),
		}, resolverContext)).rejects.toThrow('BitcoinCashNode_JsonRpc: unsupported network')

		await expect(inputResolver.resolve[
			'TransactionIndexInTransaction'
		].resolve({
			$transaction: {
				$network: {
					slug: networkBySlug.bitcoin.slug,
				},
				txId: 'c'.repeat(64),
			},
			indexInTransaction: 0,
		}, resolverContext)).rejects.toThrow('BitcoinCashNode_JsonRpc: unsupported network')

		expect(getRawTransaction).not.toHaveBeenCalled()
	})

	it('fails closed on JSON-RPC errors', async () => {
		getRawTransaction.mockRejectedValueOnce(new Error('JSON-RPC getrawtransaction: No such mempool transaction'))

		await expect(transactionResolver.resolve[
			'NetworkTxId'
		].resolve({
			$network: network,
			txId: 'missing-transaction',
		}, resolverContext)).rejects.toThrow('No such mempool transaction')
	})
})

describe('BitcoinCashNode live network head', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.useFakeTimers()
		getBlockCount.mockResolvedValue(850_000)
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('publishes retrieval-clock Network_Timestamp rows from getblockcount only', async () => {
		if (networkTimestampsResolver.resolveLive?.networkHead == null)
			throw new Error('BitcoinCashNode-JsonRpc missing Network networkHead resolveLive')

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
			throw new Error('BitcoinCashNode live network head did not publish a row')

		expect(row[EntityMetaKey.Selector]).toMatchObject({
			$network: network,
			source: Source.BitcoinCashNode_JsonRpc,
		})
		expect(row[EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHeight')]: 850_000n,
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'blockCount')]: 850_001n,
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
			throw new Error('BitcoinCashNode-JsonRpc missing Network networkHead resolveLive')

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
				caip2: networkBySlug.bitcoin.caip2,
			},
			queryClient: {},
			signal: new AbortController().signal,
			trigger: resolverContext,
		})).toThrow('BitcoinCashNode_JsonRpc: unsupported network')
		expect(getBlockCount).not.toHaveBeenCalled()
	})

	it('invalidates Network.Utxo.$$blocks only when height changes', async () => {
		if (networkBlocksResolver.resolveLive?.utxoHead == null)
			throw new Error('BitcoinCashNode-JsonRpc missing Network.Utxo utxoHead resolveLive')

		getBlockCount
			.mockResolvedValueOnce(850_000)
			.mockResolvedValueOnce(850_000)
			.mockResolvedValueOnce(850_001)
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

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { entityFieldAddressKey, EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getBlock = vi.fn()
const getRawTransaction = vi.fn()
const getBlockCount = vi.fn()
const getBlockHash = vi.fn()
const getMempoolInfo = vi.fn()
const getMempoolTransactionIds = vi.fn()
const getBlockTemplate = vi.fn()
const getNetworkHashrate = vi.fn()
const estimateSmartFee = vi.fn()
const getTransparentAddressUtxos = vi.fn()
const getTransactionProtocolPayloads = vi.fn(async () => [])

vi.mock('$/sources/BitcoinCore/JsonRpc/queries.ts', () => ({
	getBlock,
	getRawTransaction,
	getBlockCount,
	getBlockHash,
	getMempoolInfo,
	getMempoolTransactionIds,
	getBlockTemplate,
	getNetworkHashrate,
	estimateSmartFee,
	getTransparentAddressUtxos,
	getTransactionProtocolPayloads,
}))

const { default: bitcoinCoreResolvers } = await import('$/resolvers/BitcoinCore-JsonRpc.ts')

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
	height: 850_000,
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

const transactionResolver = bitcoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoTransaction
))
const inputResolver = bitcoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoInput
))
const outputResolver = bitcoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoOutput
))
const blockResolver = bitcoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoBlock
	&& 'NetworkHeight' in resolver.resolve
))
const networkBlocksResolver = bitcoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Utxo' in resolver.projections
	&& '$$blocks' in resolver.projections.Utxo
	&& typeof resolver.projections.Utxo.$$blocks === 'object'
	&& 'select' in resolver.projections.Utxo.$$blocks
))
const networkMempoolTransactionsResolver = bitcoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Utxo' in resolver.projections
	&& '$$transactions' in resolver.projections.Utxo
	&& typeof resolver.projections.Utxo.$$transactions === 'function'
))
const addressOutputsResolver = bitcoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress
	&& '$$outputs' in resolver.projections
))
const addressTimestampResolver = bitcoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress_Timestamp
))
const networkTimestampResolver = bitcoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network_Timestamp
))
const networkTimestampsResolver = bitcoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& '$$timestamps' in resolver.projections
))

if (transactionResolver == null)
	throw new Error('BitcoinCore-JsonRpc spec missing UtxoTransaction resolver')

if (inputResolver == null || outputResolver == null)
	throw new Error('BitcoinCore-JsonRpc spec missing child input/output resolver')

if (blockResolver == null || networkBlocksResolver == null)
	throw new Error('BitcoinCore-JsonRpc spec missing UTXO block / network list resolvers')

if (networkMempoolTransactionsResolver == null)
	throw new Error('BitcoinCore-JsonRpc spec missing native mempool transaction resolver')

if (addressOutputsResolver == null || addressTimestampResolver == null)
	throw new Error('BitcoinCore-JsonRpc spec missing address UTXO resolvers')

if (networkTimestampResolver == null || networkTimestampsResolver == null)
	throw new Error('BitcoinCore-JsonRpc spec missing network tip observation resolvers')

const network = {
	caip2: networkBySlug.bitcoin.caip2,
}

describe('BitcoinCore UTXO', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		getTransactionProtocolPayloads.mockResolvedValue([])
	})

	it('projects transaction fields and child selectors from one provider response', async () => {
		const txId = 'b'.repeat(64)
		getRawTransaction.mockResolvedValueOnce({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 200,
			vsize: 100,
			weight: 400,
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
					hex: '0014',
					type: 'witness_v0_keyhash',
					address: 'bc1qexample',
				},
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
				[entityFieldAddressKey(EntityType.UtxoInput, [], 'scriptSigAsm')]: 'input script',
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
				[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyAsm')]: 'output script',
				[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyHex')]: '0014',
				[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyType')]: 'witness_v0_keyhash',
				[entityFieldAddressKey(EntityType.UtxoOutput, [], '$address')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						address: 'bc1qexample',
					},
				},
			},
		}])
		expect(getRawTransaction).toHaveBeenCalledOnce()
		expect(getRawTransaction).toHaveBeenCalledWith({
			txId,
		})
	})

	it('resolves input and output fields from the same transaction response', async () => {
		const txId = 'e'.repeat(64)
		const spentTxId = 'f'.repeat(64)
		getRawTransaction.mockResolvedValue({
			txid: txId,
			version: 2,
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
					asm: 'paid output',
					hex: '76a914',
					type: 'pubkeyhash',
					address: '1ExampleAddress',
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
		})
		const output = await outputResolver.resolve[
			'TransactionIndexInTransaction'
		].resolve({
			$transaction: entitySelector,
			indexInTransaction: 0,
		})

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
		expect(inputResolver.projections.witness(input)).toEqual([
			'witness-item',
		])
		expect(outputResolver.projections.valueSats(output)).toBe(150_000_000n)
		expect(outputResolver.projections.scriptPubKeyType(output)).toBe('pubkeyhash')
		expect(outputResolver.projections.$address(output)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				address: '1ExampleAddress',
			},
		})
		expect(getRawTransaction).toHaveBeenCalledTimes(2)
	})

	it('fails closed when a requested child index is absent', async () => {
		const txId = '9'.repeat(64)
		getRawTransaction.mockResolvedValue({
			txid: txId,
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
			'BitcoinCore_JsonRpc: transaction input 0 not found'
		)
		await expect(outputResolver.resolve.TransactionIndexInTransaction.resolve(childSelector)).rejects.toThrow(
			'BitcoinCore_JsonRpc: transaction output 0 not found'
		)
	})

	it('fails closed on JSON-RPC errors', async () => {
		getRawTransaction.mockRejectedValueOnce(new Error('JSON-RPC getrawtransaction: No such mempool transaction'))

		await expect(transactionResolver.resolve[
			'NetworkTxId'
		].resolve({
			$network: network,
			txId: 'missing-transaction',
		})).rejects.toThrow('No such mempool transaction')
	})

	it('projects Network.Utxo.$$blocks tip walk and height-resolved UtxoBlock', async () => {
		getBlockCount.mockResolvedValueOnce(5)
		getBlockHash
			.mockResolvedValueOnce('1'.repeat(64))
			.mockResolvedValueOnce('2'.repeat(64))
			.mockResolvedValueOnce('1'.repeat(64))
		getBlock.mockResolvedValueOnce({
			...tipBlock,
			hash: '1'.repeat(64),
			height: 5,
			tx: ['3'.repeat(64)],
		})

		const blocksSnapshot = await networkBlocksResolver.resolve.Caip2.resolve(
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
	})

	it('materializes paged direct-node mempool transactions with native ancestry and outputs', async () => {
		getMempoolTransactionIds.mockResolvedValueOnce([
			'a'.repeat(64),
			'b'.repeat(64),
			'c'.repeat(64),
		])
		getRawTransaction.mockResolvedValueOnce({
			txid: 'b'.repeat(64),
			version: 2,
			locktime: 0,
			size: 141,
			vsize: 110,
			weight: 438,
			vin: [{
				txid: 'd'.repeat(64),
				vout: 1,
				sequence: 4_294_967_293,
				txinwitness: ['3044'],
			}],
			vout: [{
				value: 0.0004,
				n: 0,
				scriptPubKey: {
					asm: '0 example',
					hex: '0014',
					type: 'witness_v0_keyhash',
					address: 'bc1qexample',
				},
			}],
		})

		const rows = await networkMempoolTransactionsResolver.resolve.Caip2.resolve(network, {
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
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'virtualSizeBytes')]: 110,
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
		expect(getRawTransaction).toHaveBeenCalledOnce()
		expect(getRawTransaction).toHaveBeenCalledWith({
			txId: 'b'.repeat(64),
		})
	})

	it('rejects block responses with a mismatched hash or duplicate transaction identity', async () => {
		getBlockHash.mockResolvedValueOnce(blockHash)
		getBlock.mockResolvedValueOnce({
			...tipBlock,
			hash: 'f'.repeat(64),
		})

		await expect(blockResolver.resolve.NetworkHeight.resolve({
			$network: network,
			height: 850_000n,
		}, resolverContext)).rejects.toThrow('BitcoinCore_JsonRpc: block response does not match requested hash')

		getBlockHash.mockResolvedValueOnce(blockHash)
		getBlock.mockResolvedValueOnce({
			...tipBlock,
			tx: [
				'd'.repeat(64),
				'd'.repeat(64),
			],
		})

		await expect(blockResolver.resolve.NetworkHeight.resolve({
			$network: network,
			height: 850_000n,
		}, resolverContext)).rejects.toThrow('BitcoinCore_JsonRpc: block response contains duplicate transaction identities')
	})

	it('projects address $$outputs and tip balance observations from scantxoutset', async () => {
		const address = 'bc1qexampleaddress000000000000000000000'
		getTransparentAddressUtxos.mockResolvedValue({
			unspents: [{
				txid: '4'.repeat(64),
				vout: 1,
				valueSatoshis: 50_000_000n,
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
		}])

		const observation = await addressTimestampResolver.resolve.AddressTimestampMsSource.resolve({
			$address: {
				$network: network,
				address,
			},
			timestampMs: 1,
			source: Source.BitcoinCore_JsonRpc,
		}, resolverContext)
		expect(addressTimestampResolver.projections.balanceSats(observation)).toBe(50_000_000n)
		expect(addressTimestampResolver.projections.unspentOutputCount(observation)).toBe(1)
	})

	it('projects Network_Timestamp tip fields from block tip + getmempoolinfo', async () => {
		getBlockCount.mockResolvedValue(850_000)
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
		getBlockTemplate.mockResolvedValue({
			version: 536_870_912,
			rules: ['segwit'],
			previousblockhash: blockHash,
			transactions: [{
				data: '00',
				txid: 'd'.repeat(64),
				hash: 'e'.repeat(64),
				depends: [],
				fee: 1200,
				sigops: 1,
				weight: 400,
			}],
			coinbasevalue: 312_500_000,
			target: 'f'.repeat(64),
			mintime: 1_749_999_999,
			mutable: ['time'],
			noncerange: '00000000ffffffff',
			sigoplimit: 80_000,
			sizelimit: 4_000_000,
			weightlimit: 4_000_000,
			curtime: 1_750_000_001,
			bits: '17034219',
			height: 850_001,
		})
		getNetworkHashrate.mockResolvedValue(600_000_000_000_000_000)
		estimateSmartFee.mockImplementation(async ({ confirmationTarget }) => ({
			feerate: confirmationTarget / 100_000,
			blocks: confirmationTarget,
		}))

		const tip = await networkTimestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: network,
			timestampMs: 1_700_000_000_000,
			source: Source.BitcoinCore_JsonRpc,
		}, resolverContext)

		expect(networkTimestampResolver.projections.Utxo.bestBlockHeight(tip)).toBe(850_000n)
		expect(networkTimestampResolver.projections.Utxo.bestBlockHash(tip)).toBe(blockHash)
		expect(networkTimestampResolver.projections.Utxo.bestBlockTimeMs(tip)).toBe(1_750_000_000_000)
		expect(networkTimestampResolver.projections.Utxo.blockCount(tip)).toBe(850_001n)
		expect(networkTimestampResolver.projections.Utxo.mempoolTransactionCount(tip)).toBe(42)
		expect(networkTimestampResolver.projections.Utxo.mempoolSizeBytes(tip)).toBe(12_345n)
		expect(networkTimestampResolver.projections.Utxo.hashrateHashesPerSecond(tip)).toBe(600_000_000_000_000_000)
		expect(networkTimestampResolver.projections.Utxo.miningTemplateHeight(tip)).toBe(850_001n)
		expect(networkTimestampResolver.projections.Utxo.$$miningTemplateTransactions(tip)).toHaveLength(1)

		const timestamps = await networkTimestampsResolver.resolve.Caip2.resolve(network, resolverContext)
		expect(networkTimestampsResolver.projections.$$timestamps(timestamps)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					timestampMs: expect.any(Number),
					source: Source.BitcoinCore_JsonRpc,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHeight')]: 850_000n,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHash')]: blockHash,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockTimeMs')]: 1_750_000_000_000,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'blockCount')]: 850_001n,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolTransactionCount')]: 42,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolSizeBytes')]: 12_345n,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'hashrateHashesPerSecond')]: 600_000_000_000_000_000,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'hashrateBlockWindow')]: 120,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'conservativeFeeRate2BlocksSatsPerKvb')]: 2_000n,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'conservativeFeeRate6BlocksSatsPerKvb')]: 6_000n,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'conservativeFeeRate12BlocksSatsPerKvb')]: 12_000n,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'conservativeFeeRate24BlocksSatsPerKvb')]: 24_000n,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateHeight')]: 850_001n,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplatePreviousBlockHash')]: blockHash,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateTarget')]: 'f'.repeat(64),
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateCurrentTimeMs')]: 1_750_000_001_000,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateMinimumTimeMs')]: 1_749_999_999_000,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateCoinbaseValueSats')]: 312_500_000n,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateTransactionCount')]: 1,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateSizeLimitBytes')]: 4_000_000,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateWeightLimit')]: 4_000_000,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateSigopLimit')]: 80_000,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateRules')]: ['segwit'],
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateMutableFields')]: ['time'],
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateNonceRange')]: '00000000ffffffff',
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateBits')]: '17034219',
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], '$$miningTemplateTransactions')]: [expect.objectContaining({
						[EntityMetaKey.Selector]: {
							$network: network,
							txId: 'd'.repeat(64),
						},
					})],
				},
			},
		])
	})

	it('projects Ordinals and Runes refs from the fetched transaction witness/scripts', async () => {
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
		getRawTransaction.mockResolvedValue({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 200,
			vsize: 100,
			weight: 400,
			vin: [{
				txid: 'b'.repeat(64),
				vout: 0,
				scriptSig: {
					asm: '',
				},
				sequence: 0xffffffff,
				txinwitness: [
					helloWorldInscriptionHex,
				],
			}],
			vout: [
				{
					value: 0.00000546,
					n: 0,
					scriptPubKey: {
						asm: 'OP_RETURN OP_13 020100',
						hex: '6a5d03020100',
						type: 'nulldata',
					},
				},
				{
					value: 0.00001,
					n: 1,
					scriptPubKey: {
						asm: 'OP_DUP',
						hex: '76',
						type: 'pubkeyhash',
						address: '1Example',
					},
				},
			],
		})

		const entitySelector = {
			$network: network,
			txId,
		}
		const transaction = await transactionResolver.resolve.NetworkTxId.resolve(entitySelector)
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
		})
		expect(outputResolver.projections.$bitcoinRunestone(runestoneOutput)).toEqual({
			[EntityMetaKey.Selector]: {
				$transaction: entitySelector,
				outputIndex: 0,
			},
		})

		const paymentOutput = await outputResolver.resolve.TransactionIndexInTransaction.resolve({
			$transaction: entitySelector,
			indexInTransaction: 1,
		})
		expect(outputResolver.projections.$bitcoinRunestone(paymentOutput)).toBeUndefined()

		const inscriptionResolver = bitcoinCoreResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.BitcoinOrdinalInscription
		))
		const runestoneResolver = bitcoinCoreResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.BitcoinRunestone
		))
		if (inscriptionResolver == null || runestoneResolver == null)
			throw new Error('BitcoinCore-JsonRpc missing Ordinals/Runes entity resolvers')

		const inscription = await inscriptionResolver.resolve.NetworkInscriptionId.resolve({
			$network: network,
			inscriptionId: `${txId}i0`,
		})
		expect(inscriptionResolver.projections.contentType(inscription)).toBe('text/plain;charset=utf-8')
		expect(inscriptionResolver.projections.revealInputIndex(inscription)).toBe(0)
		expect(inscriptionResolver.projections.revealWitnessIndex(inscription)).toBe(0)
		expect(inscriptionResolver.projections.payloadHex(inscription)).toBeTruthy()

		const runestone = await runestoneResolver.resolve.TransactionOutputIndex.resolve({
			$transaction: entitySelector,
			outputIndex: 0,
		})
		expect(runestoneResolver.projections.payloadHex(runestone)).toBe('020100')
		expect(runestoneResolver.projections.isCenotaph(runestone)).toBe(false)
	})

	it('indexes multi-envelope reveal inscriptions and LEB128 Cenotaph-tag runestones', async () => {
		const txId = 'c'.repeat(64)
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
		getRawTransaction.mockResolvedValue({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 300,
			vsize: 150,
			weight: 600,
			vin: [{
				txid: 'd'.repeat(64),
				vout: 0,
				scriptSig: {
					asm: '',
				},
				sequence: 0xffffffff,
				txinwitness: [
					helloWorldInscriptionHex + secondInscriptionHex,
				],
			}],
			vout: [
				{
					value: 0,
					n: 0,
					scriptPubKey: {
						asm: 'OP_RETURN OP_13',
						hex: '6a5d037e0000',
						type: 'nulldata',
					},
				},
			],
		})

		const entitySelector = {
			$network: network,
			txId,
		}
		const transaction = await transactionResolver.resolve.NetworkTxId.resolve(entitySelector)
		expect(transactionResolver.projections.$$bitcoinOrdinalInscriptions(transaction)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					inscriptionId: `${txId}i0`,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					inscriptionId: `${txId}i1`,
				},
			},
		])

		const inscriptionResolver = bitcoinCoreResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.BitcoinOrdinalInscription
		))
		const runestoneResolver = bitcoinCoreResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.BitcoinRunestone
		))
		if (inscriptionResolver == null || runestoneResolver == null)
			throw new Error('BitcoinCore-JsonRpc missing Ordinals/Runes entity resolvers')

		const second = await inscriptionResolver.resolve.NetworkInscriptionId.resolve({
			$network: network,
			inscriptionId: `${txId}i1`,
		})
		expect(inscriptionResolver.projections.inscriptionIndex(second)).toBe(1)
		expect(inscriptionResolver.projections.contentType(second)).toBe('text/plain')
		expect(inscriptionResolver.projections.bodyHex(second)).toBe('4869')

		const runestone = await runestoneResolver.resolve.TransactionOutputIndex.resolve({
			$transaction: entitySelector,
			outputIndex: 0,
		})
		expect(runestoneResolver.projections.payloadHex(runestone)).toBe('7e0000')
		expect(runestoneResolver.projections.isCenotaph(runestone)).toBe(true)
	})
})

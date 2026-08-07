import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { entityFieldAddressKey, EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZcashShieldedActionKind } from '$/schema/ZcashShieldedActionKind.ts'
import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPoolKind.ts'
import { Source } from '$/sources/Source.ts'

const getTreeState = vi.fn()
const getRawTransaction = vi.fn()
const getBlock = vi.fn()
const getBlockCount = vi.fn()
const getBlockHash = vi.fn()
const getMempoolInfo = vi.fn()
const getTransparentAddressUtxos = vi.fn()

vi.mock('$/sources/Zcashd/JsonRpc/queries.ts', () => ({
	getTreeState,
	getRawTransaction,
	getBlock,
	getBlockCount,
	getBlockHash,
	getMempoolInfo,
	getTransparentAddressUtxos,
}))

const { default: zcashdResolvers } = await import('$/resolvers/Zcashd-JsonRpc.ts')

const shieldedBlockResolver = zcashdResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoBlock
	&& '$$zcashShieldedPoolStates' in resolver.projections
))

const utxoBlockResolver = zcashdResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoBlock
	&& 'hash' in resolver.projections
))

const networkBlocksResolver = zcashdResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Utxo' in resolver.projections
	&& '$$blocks' in resolver.projections.Utxo
	&& typeof resolver.projections.Utxo.$$blocks === 'object'
	&& 'select' in resolver.projections.Utxo.$$blocks
))

const networkTimestampResolver = zcashdResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network_Timestamp
))

const networkTimestampsResolver = zcashdResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& '$$timestamps' in resolver.projections
))

const addressOutputsResolver = zcashdResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress
	&& '$$outputs' in resolver.projections
))

const addressTimestampResolver = zcashdResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress_Timestamp
))

const transactionResolver = zcashdResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoTransaction
))

const inputResolver = zcashdResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoInput
))

const outputResolver = zcashdResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoOutput
))

const shieldedActionResolver = zcashdResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.ZcashShieldedAction
))

const shieldedPoolStateResolver = zcashdResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.ZcashShieldedPoolBlockState
))

if (shieldedBlockResolver == null)
	throw new Error('Zcashd-JsonRpc spec missing shielded UtxoBlock resolver')

if (utxoBlockResolver == null || networkBlocksResolver == null)
	throw new Error('Zcashd-JsonRpc spec missing UTXO block / network list resolvers')

if (networkTimestampResolver == null || networkTimestampsResolver == null)
	throw new Error('Zcashd-JsonRpc spec missing network tip observation resolvers')

if (addressOutputsResolver == null || addressTimestampResolver == null)
	throw new Error('Zcashd-JsonRpc spec missing address UTXO resolvers')

if (transactionResolver == null)
	throw new Error('Zcashd-JsonRpc spec missing UtxoTransaction resolver')

if (inputResolver == null || outputResolver == null)
	throw new Error('Zcashd-JsonRpc spec missing transparent input/output resolver')

if (shieldedActionResolver == null || shieldedPoolStateResolver == null)
	throw new Error('Zcashd-JsonRpc spec missing shielded resolvers')

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

const network = {
	caip2: networkBySlug.zcash.caip2,
}

const blockHash = 'a'.repeat(64)
const parentHash = 'b'.repeat(64)

const tipBlock = {
	hash: blockHash,
	height: 2_800_000,
	version: 4,
	versionHex: '00000004',
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

describe('Zcashd block selector ownership', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('uses height and hash only for their exact selector arms', async () => {
		const heightSelector = {
			$network: network,
			height: 2_000_000n,
		}
		getTreeState.mockResolvedValueOnce({
			height: Number(heightSelector.height),
			hash: 'height-response-hash',
			sapling: {
				commitments: 'sapling-tree',
			},
			orchard: {
				commitments: 'orchard-tree',
			},
		})
		const heightSnapshot = await shieldedBlockResolver.resolve.NetworkHeight.resolve(
			heightSelector,
			resolverContext
		)
		expect(getTreeState).toHaveBeenCalledWith({
			block: Number(heightSelector.height),
		})
		expect(shieldedBlockResolver.projections.$$zcashShieldedPoolStates(heightSnapshot)).toHaveLength(2)

		const hashSelector = {
			...heightSelector,
			hash: 'zcash-block-hash',
		}
		getTreeState.mockResolvedValueOnce({
			height: Number(hashSelector.height),
			hash: hashSelector.hash,
		})
		const hashSnapshot = await shieldedBlockResolver.resolve.NetworkHeightHash.resolve(
			hashSelector,
			resolverContext
		)
		expect(getTreeState).toHaveBeenLastCalledWith({
			block: hashSelector.hash,
		})
		expect(shieldedBlockResolver.projections.$$zcashShieldedPoolStates(hashSnapshot)
			.map((state) => state[EntityMetaKey.Selector].$block)
		).toEqual([
			hashSelector,
			hashSelector,
		])
	})

	it('rejects height and hash identity mismatches independently', async () => {
		getTreeState.mockResolvedValueOnce({
			height: 2_000_001,
			hash: 'height-response-hash',
		})
		await expect(shieldedBlockResolver.resolve.NetworkHeight.resolve({
			$network: network,
			height: 2_000_000n,
		}, resolverContext)).rejects.toThrow('returned a different block')

		getTreeState.mockResolvedValueOnce({
			height: 2_000_000,
			hash: 'different-hash',
		})
		await expect(shieldedBlockResolver.resolve.NetworkHeightHash.resolve({
			$network: network,
			height: 2_000_000n,
			hash: 'zcash-block-hash',
		}, resolverContext)).rejects.toThrow('returned a different block')
	})

	it('rejects invalid pool/action identities before provider lookup', async () => {
		await expect(shieldedActionResolver.resolve.TransactionPoolActionKindIndexInTransaction.resolve({
			$transaction: {
				$network: {
					slug: networkBySlug.zcash.slug,
				},
				txId: 'transaction-id',
			},
			pool: ZcashShieldedPoolKind.Sprout,
			actionKind: ZcashShieldedActionKind.Action,
			indexInTransaction: 0,
		}, resolverContext)).rejects.toThrow('invalid sprout/action shielded action')
		expect(getRawTransaction).not.toHaveBeenCalled()
	})

	it('rejects tree state returned for a different selected block', async () => {
		getTreeState.mockResolvedValueOnce({
			hash: 'different-block-hash',
			height: 2_800_001,
			time: 1_750_000_000,
		})
		await expect(shieldedPoolStateResolver.resolve.BlockPool.resolve({
			$block: {
				$network: {
					slug: networkBySlug.zcash.slug,
				},
				height: 2_800_000n,
				hash: 'selected-block-hash',
			},
			$pool: {
				$network: {
					slug: networkBySlug.zcash.slug,
				},
				pool: ZcashShieldedPoolKind.Sapling,
			},
		}, resolverContext)).rejects.toThrow('returned a different block')
	})
})

describe('Zcashd transparent UTXO', () => {
	beforeEach(() => {
		getRawTransaction.mockReset()
		getBlock.mockReset()
		getBlockCount.mockReset()
		getBlockHash.mockReset()
		getMempoolInfo.mockReset()
		getTransparentAddressUtxos.mockReset()
	})

	it('projects transparent vin/vout selectors beside shielded actions', async () => {
		const txId = 'z'.repeat(64)
		getRawTransaction.mockResolvedValueOnce({
			txid: txId,
			hash: txId,
			version: 5,
			locktime: 0,
			expiryheight: 0,
			size: 300,
			vsize: 250,
			vin: [{
				txid: 'a'.repeat(64),
				vout: 0,
				scriptSig: {
					asm: 'input',
				},
				sequence: 1,
			}],
			vout: [{
				value: 0.5,
				n: 0,
				scriptPubKey: {
					asm: 'OP_DUP',
					hex: '76a914',
					type: 'pubkeyhash',
					address: 't1Example',
				},
			}],
			vShieldedSpend: [],
			vShieldedOutput: [],
		})
		const entitySelector = {
			$network: network,
			txId,
		}
		const transaction = await transactionResolver.resolve.NetworkTxId.resolve(
			entitySelector,
			resolverContext
		)
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
		expect(transactionResolver.projections.isCoinbase(transaction)).toBe(false)
	})

	it('resolves transparent input and output fields from getrawtransaction', async () => {
		const txId = 'b'.repeat(64)
		getRawTransaction.mockResolvedValue({
			txid: txId,
			hash: txId,
			version: 5,
			locktime: 0,
			expiryheight: 0,
			size: 200,
			vin: [{
				txid: 'c'.repeat(64),
				vout: 3,
				scriptSig: {
					asm: 'spent',
				},
				sequence: 0xffffffff,
			}],
			vout: [{
				value: 1.25,
				n: 0,
				scriptPubKey: {
					asm: 'OP_CHECKSIG',
					hex: 'ac',
					type: 'pubkeyhash',
					address: 't1Transparent',
				},
			}],
		})
		const $transaction = {
			$network: network,
			txId,
		}
		const input = await inputResolver.resolve.TransactionIndexInTransaction.resolve({
			$transaction,
			indexInTransaction: 0,
		}, resolverContext)
		const output = await outputResolver.resolve.TransactionIndexInTransaction.resolve({
			$transaction,
			indexInTransaction: 0,
		}, resolverContext)
		expect(inputResolver.projections.$spentOutput(input)).toEqual({
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: network,
					txId: 'c'.repeat(64),
				},
				indexInTransaction: 3,
			},
		})
		expect(outputResolver.projections.valueSats(output)).toBe(125_000_000n)
		expect(outputResolver.projections.$address(output)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				address: 't1Transparent',
			},
		})
	})

	it('projects NetworkHeight UTXO block tip fields and Network.Utxo.$$blocks', async () => {
		getBlockHash.mockResolvedValue(blockHash)
		getBlock.mockResolvedValue(tipBlock)
		getBlockCount.mockResolvedValueOnce(5)

		const block = await utxoBlockResolver.resolve.NetworkHeight.resolve({
			$network: network,
			height: 2_800_000n,
		}, resolverContext)
		expect(utxoBlockResolver.projections.hash(block)).toBe(blockHash)
		expect(utxoBlockResolver.projections.timestampMs(block)).toBe(1_750_000_000_000)
		expect(utxoBlockResolver.projections.$$transactions(block)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				txId: 'd'.repeat(64),
			},
		}])

		getBlockHash
			.mockResolvedValueOnce('1'.repeat(64))
			.mockResolvedValueOnce('0'.repeat(64))
		const list = await networkBlocksResolver.resolve.Slug.resolve(network, resolverContext)
		expect(networkBlocksResolver.projections.Utxo.$$blocks.select(list)).toHaveLength(2)
		expect(networkBlocksResolver.projections.Utxo.$$blocks.resolveCount(list)).toBe(6n)
	})

	it('projects address $$outputs and tip balance observations from scantxoutset', async () => {
		const address = `t1${'A'.repeat(33)}`
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
			source: Source.Zcashd_JsonRpc,
		}, resolverContext)
		expect(addressTimestampResolver.projections.balanceSats(observation)).toBe(50_000_000n)
		expect(addressTimestampResolver.projections.unspentOutputCount(observation)).toBe(1)
	})

	it('projects Network_Timestamp tip fields from block tip + getmempoolinfo', async () => {
		getBlockCount.mockResolvedValue(2_800_000)
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

		const tip = await networkTimestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: network,
			timestampMs: 1_700_000_000_000,
			source: Source.Zcashd_JsonRpc,
		}, resolverContext)

		expect(networkTimestampResolver.projections.Utxo.bestBlockHeight(tip)).toBe(2_800_000n)
		expect(networkTimestampResolver.projections.Utxo.bestBlockHash(tip)).toBe(blockHash)
		expect(networkTimestampResolver.projections.Utxo.bestBlockTimeMs(tip)).toBe(1_750_000_000_000)
		expect(networkTimestampResolver.projections.Utxo.blockCount(tip)).toBe(2_800_001n)
		expect(networkTimestampResolver.projections.Utxo.mempoolTransactionCount(tip)).toBe(42)
		expect(networkTimestampResolver.projections.Utxo.mempoolSizeBytes(tip)).toBe(12_345n)

		const timestamps = await networkTimestampsResolver.resolve.Slug.resolve(network, resolverContext)
		expect(networkTimestampsResolver.projections.$$timestamps(timestamps)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					timestampMs: expect.any(Number),
					source: Source.Zcashd_JsonRpc,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHeight')]: 2_800_000n,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHash')]: blockHash,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockTimeMs')]: 1_750_000_000_000,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'blockCount')]: 2_800_001n,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolTransactionCount')]: 42,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolSizeBytes')]: 12_345n,
				},
			},
		])
	})

	it('fails closed on unsupported networks before transport', async () => {
		await expect(transactionResolver.resolve.NetworkTxId.resolve({
			$network: {
				slug: networkBySlug.bitcoin.slug,
			},
			txId: 'c'.repeat(64),
		}, resolverContext)).rejects.toThrow('Zcashd_JsonRpc: unsupported network')

		await expect(utxoBlockResolver.resolve.NetworkHeightHash.resolve({
			$network: {
				slug: networkBySlug.bitcoin.slug,
			},
			height: 1n,
			hash: blockHash,
		}, resolverContext)).rejects.toThrow('Zcashd_JsonRpc: unsupported network')
	})
})

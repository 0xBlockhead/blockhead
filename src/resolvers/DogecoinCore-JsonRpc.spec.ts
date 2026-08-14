import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { entityFieldAddressKey, EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/DogecoinCore/bindings.ts'
import { Source } from '$/sources/Source.ts'

const getBlock = vi.fn()
const getRawTransaction = vi.fn()
const getBlockCount = vi.fn()
const getBlockHash = vi.fn()
const getMempoolInfo = vi.fn()
const getTransparentAddressUtxos = vi.fn()

vi.mock('$/sources/DogecoinCore/JsonRpc/queries.ts', () => ({
	getBlock,
	getRawTransaction,
	getBlockCount,
	getBlockHash,
	getMempoolInfo,
	getTransparentAddressUtxos,
}))

const { default: dogecoinCoreResolvers } = await import('$/resolvers/DogecoinCore-JsonRpc.ts')

const dogecoinMainnetBinding = bindings[Source.DogecoinCore_JsonRpc][0]

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

const blockSelector = {
	$network: {
		slug: networkBySlug.dogecoin.slug,
	},
	height: 5_000_000n,
	hash: blockHash,
}

const auxPowSelector = {
	$block: blockSelector,
}

const parentMerkleRootWire = Array.from(
	{ length: 32 },
	(_, byteIndex) => byteIndex.toString(16).padStart(2, '0')
).join('')

const auxPowBlock = {
	hash: blockHash,
	height: 5_000_000,
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
	auxpow: {
		tx: {
			txid: 'e'.repeat(64),
			hash: 'e'.repeat(64),
			version: 1,
			size: 1,
			vsize: 1,
			weight: 4,
			locktime: 0,
			vin: [],
			vout: [],
		},
		index: 2,
		chainindex: 7,
		merklebranch: [
			'coinbase-branch-a',
			'coinbase-branch-b',
		],
		chainmerklebranch: [
			'chain-branch-a',
		],
		parentblock: [
			'01000000',
			'00'.repeat(32),
			parentMerkleRootWire,
			'00000000',
			'00000000',
			'78563412',
		].join(''),
	},
}

const auxPowResolver = dogecoinCoreResolvers.resolvers.find((
	resolver
): resolver is Extract<
	typeof dogecoinCoreResolvers.resolvers[number],
	{ entityType: EntityType.DogecoinBlockAuxPow }
> => resolver.entityType === EntityType.DogecoinBlockAuxPow)

const branchResolver = dogecoinCoreResolvers.resolvers.find((
	resolver
): resolver is Extract<
	typeof dogecoinCoreResolvers.resolvers[number],
	{ entityType: EntityType.DogecoinAuxPowMerkleBranch }
> => resolver.entityType === EntityType.DogecoinAuxPowMerkleBranch)

const parentHeaderResolver = dogecoinCoreResolvers.resolvers.find((
	resolver
): resolver is Extract<
	typeof dogecoinCoreResolvers.resolvers[number],
	{ entityType: EntityType.DogecoinAuxPowParentBlockHeader }
> => resolver.entityType === EntityType.DogecoinAuxPowParentBlockHeader)

const blockResolver = dogecoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoBlock
	&& 'NetworkHeight' in resolver.resolve
))

const networkBlocksResolver = dogecoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Utxo' in resolver.projections
	&& '$$blocks' in resolver.projections.Utxo
	&& typeof resolver.projections.Utxo.$$blocks === 'object'
	&& 'select' in resolver.projections.Utxo.$$blocks
))

const addressOutputsResolver = dogecoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress
	&& '$$outputs' in resolver.projections
))

const addressTimestampsResolver = dogecoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress
	&& '$$timestamps' in resolver.projections
))

const networkTimestampResolver = dogecoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network_Timestamp
))

const networkTimestampsResolver = dogecoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& '$$timestamps' in resolver.projections
))

if (auxPowResolver == null || branchResolver == null || parentHeaderResolver == null)
	throw new Error('DogecoinCore-JsonRpc spec missing AuxPoW resolvers')

if (blockResolver == null || networkBlocksResolver == null)
	throw new Error('DogecoinCore-JsonRpc spec missing UTXO block / network list resolvers')

if (addressOutputsResolver == null || addressTimestampsResolver == null)
	throw new Error('DogecoinCore-JsonRpc spec missing address UTXO resolvers')

if (networkTimestampResolver == null || networkTimestampsResolver == null)
	throw new Error('DogecoinCore-JsonRpc spec missing network tip observation resolvers')

describe('Dogecoin Core AuxPoW resolvers', () => {
	beforeEach(() => {
		getBlock.mockReset()
	})

	it('materializes the parent and both branch identities from an AuxPoW block', async () => {
		getBlock.mockResolvedValueOnce(auxPowBlock)

		const auxPow = await auxPowResolver.resolve['Block'].resolve(
			{
				$block: blockSelector,
			},
			resolverContext
		)

		expect(getBlock).toHaveBeenCalledWith({
			blockHash: blockSelector.hash,
		})
		expect(auxPowResolver.projections.$parentBlockHeader(auxPow)).toEqual({
			[EntityMetaKey.Selector]: {
				$auxPow: auxPowSelector,
			},
		})
		expect(auxPowResolver.projections.$coinbaseBranch(auxPow)).toEqual({
			[EntityMetaKey.Selector]: {
				$auxPow: auxPowSelector,
				branchKind: 'coinbase',
			},
		})
		expect(auxPowResolver.projections.$chainBranch(auxPow)).toEqual({
			[EntityMetaKey.Selector]: {
				$auxPow: auxPowSelector,
				branchKind: 'chain',
			},
		})
	})

	it('maps the provider-owned coinbase and chain Merkle branches', async () => {
		getBlock
			.mockResolvedValueOnce(auxPowBlock)
			.mockResolvedValueOnce(auxPowBlock)

		const coinbaseBranch = await branchResolver.resolve[
			'AuxPowBranchKind'
		].resolve(
			{
				$auxPow: auxPowSelector,
				branchKind: 'coinbase',
			},
			resolverContext
		)
		const chainBranch = await branchResolver.resolve[
			'AuxPowBranchKind'
		].resolve(
			{
				$auxPow: auxPowSelector,
				branchKind: 'chain',
			},
			resolverContext
		)

		expect(branchResolver.projections.branchHashes(coinbaseBranch)).toEqual([
			'coinbase-branch-a',
			'coinbase-branch-b',
		])
		expect(branchResolver.projections.index(coinbaseBranch)).toBe(2)
		expect(branchResolver.projections.branchHashes(chainBranch)).toEqual([
			'chain-branch-a',
		])
		expect(branchResolver.projections.index(chainBranch)).toBe(7)
	})

	it('decodes the parent header Merkle root and little-endian nonce', async () => {
		getBlock.mockResolvedValueOnce(auxPowBlock)

		const parentHeader = await parentHeaderResolver.resolve[
			'AuxPow'
		].resolve(
			{
				$auxPow: auxPowSelector,
			},
			resolverContext
		)

		expect(parentHeaderResolver.projections.merkleRoot(parentHeader)).toBe(
			Array.from(
				{ length: 32 },
				(_, byteIndex) => (31 - byteIndex).toString(16).padStart(2, '0')
			).join('')
		)
		expect(parentHeaderResolver.projections.nonce(parentHeader)).toBe(0x12345678n)
	})

	it('rejects non-AuxPoW blocks and non-Dogecoin parents', async () => {
		getBlock.mockResolvedValueOnce({
			...auxPowBlock,
			auxpow: undefined,
		})

		await expect(auxPowResolver.resolve['Block'].resolve(
			{
				$block: blockSelector,
			},
			resolverContext
		)).rejects.toThrow('does not contain AuxPoW')

		await expect(auxPowResolver.resolve['Block'].resolve(
			{
				$block: {
					...blockSelector,
					$network: {
						slug: networkBySlug.bitcoin.slug,
					},
				},
			},
			resolverContext
		)).rejects.toThrow('unsupported Dogecoin network')
		expect(getBlock).toHaveBeenCalledTimes(1)
	})
})

const transactionResolver = dogecoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoTransaction
))
const inputResolver = dogecoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoInput
))
const outputResolver = dogecoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoOutput
))

if (transactionResolver == null)
	throw new Error('DogecoinCore-JsonRpc spec missing UtxoTransaction resolver')

if (inputResolver == null || outputResolver == null)
	throw new Error('DogecoinCore-JsonRpc spec missing child input/output resolver')

describe('DogecoinCore UTXO', () => {
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
					address: 'DExampleAddress',
				},
			}],
		})
		const entitySelector = {
			$network: {
				slug: networkBySlug.dogecoin.slug,
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
					address: 'DExampleAddress',
				},
			}],
		})
		const $transaction = {
			$network: {
				slug: networkBySlug.dogecoin.slug,
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
				address: 'DExampleAddress',
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
			...auxPowBlock,
			hash: '1'.repeat(64),
			height: 5,
			auxpow: undefined,
			tx: ['3'.repeat(64)],
		})

		const network = {
			slug: networkBySlug.dogecoin.slug,
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
		expect(dogecoinMainnetBinding).toBeTruthy()
	})

	it('projects address $$outputs and tip balance observations from scantxoutset', async () => {
		const address = 'DExampleAddress0123456789ABCDEF'
		const network = {
			slug: networkBySlug.dogecoin.slug,
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
		expect(dogecoinCoreResolvers.resolvers.some((resolver) => (
			resolver.entityType === EntityType.UtxoAddress_Timestamp
		))).toBe(false)
	})

	it('projects Network_Timestamp tip fields from block tip + getmempoolinfo', async () => {
		const network = {
			slug: networkBySlug.dogecoin.slug,
		}
		getBlockCount.mockResolvedValue(5_000_000)
		getBlockHash.mockResolvedValue(blockHash)
		getBlock.mockResolvedValue({
			...auxPowBlock,
			auxpow: undefined,
		})
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
			source: Source.DogecoinCore_JsonRpc,
		}, resolverContext)).rejects.toThrow('no network observation at 1700000000000')

		const timestamps = await networkTimestampsResolver.resolve.Slug.resolve(network, resolverContext)
		expect(networkTimestampsResolver.projections.$$timestamps(timestamps)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					timestampMs: expect.any(Number),
					source: Source.DogecoinCore_JsonRpc,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHeight')]: 5_000_000n,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHash')]: blockHash,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockTimeMs')]: 1_750_000_000_000,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'blockCount')]: 5_000_001n,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolTransactionCount')]: 42,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolSizeBytes')]: 12_345n,
				},
			},
		])
	})
})

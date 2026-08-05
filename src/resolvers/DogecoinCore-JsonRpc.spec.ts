import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/DogecoinCore/bindings.ts'
import { Source } from '$/sources/Source.ts'

const getBlock = vi.fn()
const getRawTransaction = vi.fn()

vi.mock('$/sources/DogecoinCore/JsonRpc/queries.ts', () => ({
	getBlock,
	getRawTransaction,
}))

const { default: dogecoinCoreResolvers } = await import('$/resolvers/DogecoinCore-JsonRpc.ts')

const dogecoinMainnetBinding = bindings[Source.DogecoinCore_JsonRpc][0]

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const blockSelector = {
	$network: {
		slug: networkBySlug.dogecoin.slug,
	},
	height: 5_000_000n,
	hash: 'dogecoin-block-hash',
}

const auxPowSelector = {
	$block: blockSelector,
}

const parentMerkleRootWire = Array.from(
	{ length: 32 },
	(_, byteIndex) => byteIndex.toString(16).padStart(2, '0')
).join('')

const auxPowBlock = {
	auxpow: {
		tx: {
			txid: 'coinbase-transaction',
			hash: 'coinbase-transaction',
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

if (auxPowResolver == null || branchResolver == null || parentHeaderResolver == null)
	throw new Error('DogecoinCore-JsonRpc spec missing AuxPoW resolvers')

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
		getBlock.mockResolvedValueOnce({})

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
})

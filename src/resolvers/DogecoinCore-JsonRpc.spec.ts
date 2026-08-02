import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/DogecoinCore/bindings.ts'
import { Source } from '$/sources/Source.ts'

const getBlock = vi.fn()

vi.mock('$/sources/DogecoinCore/JsonRpc/queries.ts', () => ({
	getBlock,
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

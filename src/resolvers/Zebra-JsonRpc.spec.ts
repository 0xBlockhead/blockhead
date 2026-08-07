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
const getTransparentAddressUtxos = vi.fn()

vi.mock('$/sources/Zebra/JsonRpc/queries.ts', () => ({
	getBlock,
	getRawTransaction,
	getBlockCount,
	getBlockHash,
	getMempoolInfo,
	getTransparentAddressUtxos,
}))

const { default: zebraResolvers } = await import('$/resolvers/Zebra-JsonRpc.ts')

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

const blockResolver = zebraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoBlock
	&& 'NetworkHeight' in resolver.resolve
))

const networkBlocksResolver = zebraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Utxo' in resolver.projections
	&& '$$blocks' in resolver.projections.Utxo
	&& typeof resolver.projections.Utxo.$$blocks === 'object'
	&& 'select' in resolver.projections.Utxo.$$blocks
))

const addressOutputsResolver = zebraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress
	&& '$$outputs' in resolver.projections
))

const addressTimestampResolver = zebraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress_Timestamp
))

const networkTimestampResolver = zebraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network_Timestamp
))

const networkTimestampsResolver = zebraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& '$$timestamps' in resolver.projections
))

const transactionResolver = zebraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoTransaction
))

if (blockResolver == null || networkBlocksResolver == null)
	throw new Error('Zebra-JsonRpc spec missing UTXO block / network list resolvers')

if (addressOutputsResolver == null || addressTimestampResolver == null)
	throw new Error('Zebra-JsonRpc spec missing address UTXO resolvers')

if (networkTimestampResolver == null || networkTimestampsResolver == null)
	throw new Error('Zebra-JsonRpc spec missing network tip observation resolvers')

if (transactionResolver == null)
	throw new Error('Zebra-JsonRpc spec missing UtxoTransaction resolver')

describe('Zebra UTXO tip leftovers', () => {
	beforeEach(() => {
		getRawTransaction.mockReset()
		getBlock.mockReset()
		getBlockCount.mockReset()
		getBlockHash.mockReset()
		getMempoolInfo.mockReset()
		getTransparentAddressUtxos.mockReset()
	})

	it('projects NetworkHeight and NetworkHeightHash UTXO block fields', async () => {
		const network = {
			slug: networkBySlug.zcash.slug,
		}
		getBlockHash.mockResolvedValue(blockHash)
		getBlock.mockResolvedValue(tipBlock)

		const byHeight = await blockResolver.resolve.NetworkHeight.resolve({
			$network: network,
			height: 2_800_000n,
		}, resolverContext)
		expect(blockResolver.projections.hash(byHeight)).toBe(blockHash)
		expect(blockResolver.projections.$parent(byHeight)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				height: 2_799_999n,
				hash: parentHash,
			},
		})

		const byHash = await blockResolver.resolve.NetworkHeightHash.resolve({
			$network: network,
			height: 2_800_000n,
			hash: blockHash,
		}, resolverContext)
		expect(blockResolver.projections.transactionCount(byHash)).toBe(1)
		expect(getBlock).toHaveBeenCalledTimes(2)
	})

	it('projects Network.Utxo.$$blocks tip walk with authoritative resolveCount', async () => {
		const network = {
			slug: networkBySlug.zcash.slug,
		}
		getBlockCount.mockResolvedValueOnce(5)
		getBlockHash
			.mockResolvedValueOnce('1'.repeat(64))
			.mockResolvedValueOnce('0'.repeat(64))

		const list = await networkBlocksResolver.resolve.Slug.resolve(network, resolverContext)
		expect(networkBlocksResolver.projections.Utxo.$$blocks.select(list)).toEqual([
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
					hash: '0'.repeat(64),
				},
			},
		])
		expect(networkBlocksResolver.projections.Utxo.$$blocks.resolveCount(list)).toBe(6n)
	})

	it('projects address $$outputs and tip balance observations from getaddressutxos', async () => {
		const address = `t1${'A'.repeat(33)}`
		const network = {
			slug: networkBySlug.zcash.slug,
		}
		getTransparentAddressUtxos.mockResolvedValue({
			utxos: [{
				address,
				txid: '4'.repeat(64),
				height: 2_800_000,
				outputIndex: 1,
				script: '76a91400',
				satoshis: 50_000_000,
			}],
			hash: blockHash,
			height: 2_800_001,
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
			source: Source.Zebra_JsonRpc,
		}, resolverContext)
		expect(addressTimestampResolver.projections.balanceSats(observation)).toBe(50_000_000n)
		expect(addressTimestampResolver.projections.unspentOutputCount(observation)).toBe(1)
	})

	it('projects Network_Timestamp tip fields from block tip + getmempoolinfo', async () => {
		const network = {
			slug: networkBySlug.zcash.slug,
		}
		getBlockCount.mockResolvedValue(2_800_000)
		getBlockHash.mockResolvedValue(blockHash)
		getBlock.mockResolvedValue(tipBlock)
		getMempoolInfo.mockResolvedValue({
			loaded: true,
			size: 17,
			bytes: 9_001,
			usage: 10_000,
			total_fee: 0.05,
			maxmempool: 300_000_000,
			mempoolminfee: 0.00001,
			minrelaytxfee: 0.00001,
		})

		const tip = await networkTimestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: network,
			timestampMs: 1_700_000_000_000,
			source: Source.Zebra_JsonRpc,
		}, resolverContext)

		expect(networkTimestampResolver.projections.Utxo.bestBlockHeight(tip)).toBe(2_800_000n)
		expect(networkTimestampResolver.projections.Utxo.bestBlockHash(tip)).toBe(blockHash)
		expect(networkTimestampResolver.projections.Utxo.bestBlockTimeMs(tip)).toBe(1_750_000_000_000)
		expect(networkTimestampResolver.projections.Utxo.blockCount(tip)).toBe(2_800_001n)
		expect(networkTimestampResolver.projections.Utxo.mempoolTransactionCount(tip)).toBe(17)
		expect(networkTimestampResolver.projections.Utxo.mempoolSizeBytes(tip)).toBe(9_001n)

		const timestamps = await networkTimestampsResolver.resolve.Slug.resolve(network, resolverContext)
		expect(networkTimestampsResolver.projections.$$timestamps(timestamps)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					timestampMs: expect.any(Number),
					source: Source.Zebra_JsonRpc,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHeight')]: 2_800_000n,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHash')]: blockHash,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockTimeMs')]: 1_750_000_000_000,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'blockCount')]: 2_800_001n,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolTransactionCount')]: 17,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolSizeBytes')]: 9_001n,
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
		}, resolverContext)).rejects.toThrow('Zebra_JsonRpc: unsupported Zcash network')

		await expect(blockResolver.resolve.NetworkHeightHash.resolve({
			$network: {
				slug: networkBySlug.bitcoin.slug,
			},
			height: 1n,
			hash: blockHash,
		}, resolverContext)).rejects.toThrow('Zebra_JsonRpc: unsupported Zcash network')
	})
})

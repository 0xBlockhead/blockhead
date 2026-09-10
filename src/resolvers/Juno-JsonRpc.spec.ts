import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createResolverContext } from '../../tests/resolverContext.ts'

import { EntityMetaKey } from '$/schema/$schema.ts'

const getBlockHashAndNumber = vi.hoisted(() => vi.fn())
const getBlockWithTxHashes = vi.hoisted(() => vi.fn())
const getChainId = vi.hoisted(() => vi.fn())
const getClass = vi.hoisted(() => vi.fn())
const getClassHashAt = vi.hoisted(() => vi.fn())
const getNonce = vi.hoisted(() => vi.fn())
const getSpecVersion = vi.hoisted(() => vi.fn())
const getStorageAt = vi.hoisted(() => vi.fn())
const getSyncing = vi.hoisted(() => vi.fn())
const getTransactionByHash = vi.hoisted(() => vi.fn())
const getTransactionReceipt = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Juno/JsonRpc/queries.ts', () => ({
	getBlockHashAndNumber,
	getBlockWithTxHashes,
	getChainId,
	getClass,
	getClassHashAt,
	getNonce,
	getSpecVersion,
	getStorageAt,
	getSyncing,
	getTransactionByHash,
	getTransactionReceipt,
}))

const { default: juno } = await import('$/resolvers/Juno-JsonRpc.ts')
const network = { slug: 'starknet' }
const starknetNetwork = { $network: network }
const context = {
	...createResolverContext(),
	pagination: {
		limit: 2,
	},
}

const resolver = (entityType: string, predicate: (candidate: (typeof juno.resolvers)[number]) => boolean) => {
	const found = juno.resolvers.find((candidate) => candidate.entityType === entityType && predicate(candidate))
	if (found == null)
		throw new Error(`missing Juno resolver ${entityType}`)
	return found
}

const block = {
	block_hash: '0xabc',
	parent_hash: '0xdef',
	block_number: 12,
	new_root: '0x123',
	timestamp: 1_700_000_000,
	sequencer_address: '0x456',
	l1_gas_price: { price_in_wei: '0x10' },
	l1_data_gas_price: { price_in_wei: '0x11' },
	transactions: ['0x789'],
}

beforeEach(() => {
	vi.clearAllMocks()
	getBlockHashAndNumber.mockResolvedValue({ block_hash: block.block_hash, block_number: block.block_number })
	getBlockWithTxHashes.mockResolvedValue(block)
	getChainId.mockResolvedValue('0x534e5f4d41494e')
	getClass.mockResolvedValue({ sierra_program: ['0x1'], contract_class_version: '1.0.0' })
	getClassHashAt.mockResolvedValue('0x22')
	getNonce.mockResolvedValue('0x1')
	getSpecVersion.mockResolvedValue('0.7.1')
	getStorageAt.mockResolvedValue('0x33')
	getSyncing.mockResolvedValue(false)
})

describe('Juno Starknet JSON-RPC resolver', () => {
	it('materializes the network snapshot at the provider block timestamp', async () => {
		const networkResolver = resolver('StarknetNetwork', (candidate) => 'Network' in candidate.resolve)
		const snapshot = await networkResolver.resolve.Network.resolve({ $network: network }, context)

		expect(snapshot.chainId).toBe('0x534e5f4d41494e')
		expect(snapshot.$$timestamps[0][EntityMetaKey.Selector]).toMatchObject({
			timestampMs: 1_700_000_000_000,
			source: 'Juno_JsonRpc',
		})
		expect(getBlockWithTxHashes).toHaveBeenCalledWith('latest')
	})

	it('resolves block-by-number and rejects an upstream identity mismatch', async () => {
		const blockResolver = resolver('StarknetBlock', (candidate) => 'NetworkBlockNumber' in candidate.resolve)
		const selector = { $network: starknetNetwork, blockNumber: 12n }
		const fields = await blockResolver.resolve.NetworkBlockNumber.resolve(selector, context)
		expect(fields.blockNumber).toBe(12n)
		expect(fields.timestampMs).toBe(1_700_000_000_000)

		getBlockWithTxHashes.mockResolvedValueOnce({ ...block, block_number: 13 })
		await expect(blockResolver.resolve.NetworkBlockNumber.resolve(selector, context)).rejects.toThrow('block number mismatch')
	})

	it('rejects malformed selectors before provider I/O', async () => {
		const blockResolver = resolver('StarknetBlock', (candidate) => 'NetworkBlockHash' in candidate.resolve)
		await expect(blockResolver.resolve.NetworkBlockHash.resolve({
			$network: starknetNetwork,
			blockNumber: 12n,
			blockHash: 'not-a-felt',
		}, context)).rejects.toThrow('malformed block hash')
		expect(getBlockWithTxHashes).not.toHaveBeenCalled()

		const classResolver = resolver('StarknetClass', () => true)
		await expect(classResolver.resolve.NetworkClassHash.resolve({
			$network: starknetNetwork,
			classHash: 'not-a-felt',
		}, context)).rejects.toThrow('malformed class hash')
	})

	it('propagates upstream failures instead of converting them to empty rows', async () => {
		const contractResolver = resolver('StarknetContract', () => true)
		getClassHashAt.mockRejectedValue(new Error('JSON-RPC starknet_getClassHashAt: unavailable'))
		await expect(contractResolver.resolve.NetworkAddress.resolve({
			$network: starknetNetwork,
			address: '0x1',
		}, context)).rejects.toThrow('unavailable')

		const storageResolver = resolver('StarknetStorageEntry', () => true)
		getStorageAt.mockRejectedValue(new Error('Juno_JsonRpc: credential rejected'))
		await expect(storageResolver.resolve.ContractStorageKey.resolve({
			$contract: { $network: starknetNetwork, address: '0x1' },
			storageKey: '0x2',
		}, context)).rejects.toThrow('credential rejected')
	})

	it('rejects a non-Starknet selector as inapplicable', async () => {
		const contractResolver = resolver('StarknetContract', () => true)
		await expect(contractResolver.resolve.NetworkAddress.resolve({
			$network: { $network: { slug: 'ethereum' } },
			address: '0x1',
		}, context)).rejects.toThrow('unsupported network')
		expect(getBlockHashAndNumber).not.toHaveBeenCalled()
	})
})

import { beforeEach, expect, it, vi } from 'vitest'

import bindings from '$/sources/Juno/bindings.ts'
import { Source } from '$/sources/Source.ts'

const jsonRpc2 = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const { default: queries } = await import('$/sources/Juno/JsonRpc/queries.ts')
const binding = bindings[Source.Juno_JsonRpc][0]

beforeEach(() => {
	jsonRpc2.mockReset()
	jsonRpc2.mockResolvedValue({})
})

it('forwards Starknet positional requests through the Juno binding', async () => {
	await queries.getBlockWithTxHashes({ block_number: 42 })
	await queries.getBlockTransactionCount({ block_number: 42 })
	await queries.getStateUpdate('latest')
	await queries.getStateUpdate('latest', ['0x1', '0x2'])
	await queries.getNonce({ block_hash: '0xabc' }, '0xcontract')
	await queries.getClassHashAt('latest', '0xcontract')
	await queries.getClass('pending', '0xclass')
	await queries.getClassAt('latest', '0xcontract')
	await queries.getStorageAt('0xcontract', '0xslot', 'latest')
	await queries.getTransactionByBlockIdAndIndex({ block_number: 42 }, 3)
	await queries.getEvents({
		from_block: { block_number: 40 },
		to_block: { block_number: 42 },
		chunk_size: 10,
	})

	expect(jsonRpc2.mock.calls).toEqual([
		[binding, 'starknet_getBlockWithTxHashes', [{ block_number: 42 }]],
		[binding, 'starknet_getBlockTransactionCount', [{ block_number: 42 }]],
		[binding, 'starknet_getStateUpdate', ['latest']],
		[binding, 'starknet_getStateUpdate', ['latest', ['0x1', '0x2']]],
		[binding, 'starknet_getNonce', [{ block_hash: '0xabc' }, '0xcontract']],
		[binding, 'starknet_getClassHashAt', ['latest', '0xcontract']],
		[binding, 'starknet_getClass', ['pending', '0xclass']],
		[binding, 'starknet_getClassAt', ['latest', '0xcontract']],
		[binding, 'starknet_getStorageAt', ['0xcontract', '0xslot', 'latest']],
		[binding, 'starknet_getTransactionByBlockIdAndIndex', [{ block_number: 42 }, 3]],
		[binding, 'starknet_getEvents', [{
			from_block: { block_number: 40 },
			to_block: { block_number: 42 },
			chunk_size: 10,
		}]],
	])
})

it('preserves object parameters for transaction-hash requests', async () => {
	await queries.getTransactionByHash('0xtransaction')
	await queries.getTransactionReceipt('0xtransaction')

	expect(jsonRpc2.mock.calls).toEqual([
		[binding, 'starknet_getTransactionByHash', {
			transaction_hash: '0xtransaction',
		}],
		[binding, 'starknet_getTransactionReceipt', {
			transaction_hash: '0xtransaction',
		}],
	])
})

it('forwards parameterless reads and propagates malformed envelopes', async () => {
	await queries.getSpecVersion()
	await queries.getBlockNumber()
	await queries.getChainId()
	await queries.getSyncing()
	await queries.getBlockHashAndNumber()

	expect(jsonRpc2.mock.calls).toEqual([
		[binding, 'starknet_specVersion'],
		[binding, 'starknet_blockNumber'],
		[binding, 'starknet_chainId'],
		[binding, 'starknet_syncing'],
		[binding, 'starknet_blockHashAndNumber'],
	])

	const failure = new Error('invalid Starknet block response envelope')
	jsonRpc2.mockRejectedValueOnce(failure)
	await expect(queries.getBlockWithTxHashes('latest')).rejects.toBe(failure)
})

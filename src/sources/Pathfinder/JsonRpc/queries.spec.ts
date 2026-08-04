import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Pathfinder/bindings.ts'
import { Source } from '$/sources/Source.ts'

const jsonRpc2 = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const { default: {
	getBlockHashAndNumber,
	getBlockWithTxHashes,
	getClassHashAt,
	getEvents,
	getNonce,
	getStorageAt,
	getTransactionByHash,
	getTransactionReceipt,
} } = await import('$/sources/Pathfinder/JsonRpc/queries.ts')

const binding = bindings[Source.Pathfinder][0]

describe('Pathfinder Starknet JSON-RPC transport', () => {
	beforeEach(() => {
		jsonRpc2.mockReset()
	})

	it('uses the accepted head for exact account state reads', async () => {
		jsonRpc2
			.mockResolvedValueOnce({
				block_hash: '0xabc',
				block_number: 900_000,
			})
			.mockResolvedValueOnce('0x7')
			.mockResolvedValueOnce('0x123')

		await expect(getBlockHashAndNumber()).resolves.toEqual({
			block_hash: '0xabc',
			block_number: 900_000,
		})
		await expect(getNonce({ block_number: 900_000 }, '0xabc')).resolves.toBe('0x7')
		await expect(getClassHashAt({ block_number: 900_000 }, '0xabc')).resolves.toBe('0x123')

		expect(jsonRpc2.mock.calls).toEqual([
			[binding, 'starknet_blockHashAndNumber'],
			[
				binding,
				'starknet_getNonce',
				[
					{ block_number: 900_000 },
					'0xabc',
				],
			],
			[
				binding,
				'starknet_getClassHashAt',
				[
					{ block_number: 900_000 },
					'0xabc',
				],
			],
		])
	})

	it('passes address filters and opaque continuation tokens without rewriting them', async () => {
		jsonRpc2.mockResolvedValueOnce({
			events: [],
		})

		await expect(getEvents({
			address: '0xabc',
			chunk_size: 25,
			continuation_token: 'opaque/provider+token',
		})).resolves.toEqual({
			events: [],
		})
		expect(jsonRpc2).toHaveBeenCalledWith(
			binding,
			'starknet_getEvents',
			[{
				address: '0xabc',
				chunk_size: 25,
				continuation_token: 'opaque/provider+token',
			}]
		)
	})

	it('exposes block, storage, and transaction methods with hard-fail JSON-RPC transport', async () => {
		jsonRpc2
			.mockResolvedValueOnce({
				status: 'ACCEPTED_ON_L2',
				block_hash: '0xb10c',
				parent_hash: '0xb109',
				block_number: 12,
				new_root: '0x1',
				timestamp: 1_700_000_000,
				sequencer_address: '0x2',
				transactions: ['0xaa'],
			})
			.mockResolvedValueOnce('0x55')
			.mockResolvedValueOnce({
				transaction_hash: '0xaa',
				type: 'INVOKE',
				sender_address: '0xabc',
			})
			.mockResolvedValueOnce({
				transaction_hash: '0xaa',
				actual_fee: {
					amount: '0x3',
					unit: 'WEI',
				},
				finality_status: 'ACCEPTED_ON_L2',
				execution_status: 'SUCCEEDED',
				messages_sent: [],
				events: [],
				block_number: 12,
			})
			.mockRejectedValueOnce(new Error('JSON-RPC starknet_getStorageAt: Contract not found'))

		await expect(getBlockWithTxHashes({ block_number: 12 })).resolves.toMatchObject({
			block_hash: '0xb10c',
			block_number: 12,
		})
		await expect(getStorageAt('0xabc', '0x1', { block_number: 12 })).resolves.toBe('0x55')
		await expect(getTransactionByHash('0xaa')).resolves.toMatchObject({
			type: 'INVOKE',
		})
		await expect(getTransactionReceipt('0xaa')).resolves.toMatchObject({
			block_number: 12,
		})
		await expect(getStorageAt('0xdead', '0x1', 'latest')).rejects.toThrow('Contract not found')

		expect(jsonRpc2.mock.calls).toEqual([
			[
				binding,
				'starknet_getBlockWithTxHashes',
				[{ block_number: 12 }],
			],
			[
				binding,
				'starknet_getStorageAt',
				[
					'0xabc',
					'0x1',
					{ block_number: 12 },
				],
			],
			[
				binding,
				'starknet_getTransactionByHash',
				{ transaction_hash: '0xaa' },
			],
			[
				binding,
				'starknet_getTransactionReceipt',
				{ transaction_hash: '0xaa' },
			],
			[
				binding,
				'starknet_getStorageAt',
				[
					'0xdead',
					'0x1',
					'latest',
				],
			],
		])
	})
})

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'

const jsonRpc2 = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const {
	getBlockHashAndNumber,
	getClassHashAt,
	getEvents,
	getNonce,
} = await import('$/sources/Starknet/JsonRpc/queries.ts')

const binding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((candidate) => (
		candidate.source === Source.Starknet_JsonRpc
		&& candidate.target.kind === SourceTargetKind.NetworkSlug
		&& candidate.target.key === 'starknet'
	))

if (binding == null)
	throw new Error('Starknet_JsonRpc spec missing Starknet mainnet source binding')

describe('Starknet JSON-RPC account transport', () => {
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

		await expect(getBlockHashAndNumber(binding)).resolves.toEqual({
			block_hash: '0xabc',
			block_number: 900_000,
		})
		await expect(getNonce(binding, { block_number: 900_000 }, '0xabc')).resolves.toBe('0x7')
		await expect(getClassHashAt(binding, { block_number: 900_000 }, '0xabc')).resolves.toBe('0x123')

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

		await expect(getEvents(binding, {
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
})

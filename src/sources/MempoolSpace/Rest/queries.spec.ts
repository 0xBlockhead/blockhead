import { beforeEach, describe, expect, it, vi } from 'vitest'

import lightningBindings from '$/sources/LightningMempoolSpace/bindings.ts'
import bindings from '$/sources/MempoolSpace/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: {
		endpoints: {
			locator: string
		}[]
	}) => binding.endpoints[0]?.locator,
	sourceGetJson,
}))

const {
	getBlock,
	getBlockHashByHeight,
	getAddressUtxos,
	getRecommendedFees,
} = await import('$/sources/MempoolSpace/Rest/queries.ts')

const binding = bindings[Source.MempoolSpace_Rest][0]

describe('mempool.space Bitcoin REST binding', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
		sourceGetJson.mockResolvedValue({})
	})

	it('preserves the Bitcoin API prefix and does not recover binding identity from the shared origin', async () => {
		await getBlock('block/hash')
		await getRecommendedFees()

		expect(binding).not.toBe(
			lightningBindings[Source.LightningMempoolSpace_Rest][0]
		)
		expect(sourceGetJson.mock.calls).toEqual([
			[
				binding,
				'https://mempool.space/api/block/block%2Fhash',
			],
			[
				binding,
				'https://mempool.space/api/v1/fees/recommended',
			],
		])
	})

	it('resolves block hash by height and address UTXOs on hard-fail paths', async () => {
		sourceGetJson
			.mockResolvedValueOnce('a'.repeat(64))
			.mockResolvedValueOnce([
				{
					txid: 'b'.repeat(64),
					vout: 1,
					status: {
						confirmed: true,
					},
					value: 1000,
				},
			])

		await expect(getBlockHashByHeight(840_000n)).resolves.toBe('a'.repeat(64))
		await expect(getAddressUtxos('bc1qexample')).resolves.toHaveLength(1)

		expect(sourceGetJson.mock.calls).toEqual([
			[
				binding,
				'https://mempool.space/api/block-height/840000',
			],
			[
				binding,
				'https://mempool.space/api/address/bc1qexample/utxo',
			],
		])
	})
})

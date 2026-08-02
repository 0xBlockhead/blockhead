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
})

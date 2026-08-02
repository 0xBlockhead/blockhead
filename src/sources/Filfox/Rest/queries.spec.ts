import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Filfox/bindings.ts'
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
	getOverview,
} = await import('$/sources/Filfox/Rest/queries.ts')

const binding = bindings[Source.Filfox_Rest][0]

describe('Filfox REST binding path', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
		sourceGetJson.mockResolvedValue({})
	})

	it('appends the API-family prefix to the canonical global binding', async () => {
		await getBlock({
			blockCid: 'bafy-block',
		})
		await getOverview()

		expect(sourceGetJson.mock.calls).toEqual([
			[
				binding,
				'https://filfox.info/api/v1/block/bafy-block',
			],
			[
				binding,
				'https://filfox.info/api/v1/overview',
			],
		])
	})
})

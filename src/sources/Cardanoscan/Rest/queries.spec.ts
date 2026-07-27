import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Cardanoscan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceDelivery,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const { query } = await import('$/sources/Cardanoscan/Rest/queries.ts')

const binding = bindings[Source.Cardanoscan_Rest]

describe('Cardanoscan public REST transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('uses the exact binding-owned public endpoint', async () => {
		sourceGetJson.mockResolvedValueOnce({
			status: 'ok',
		})

		await expect(query(binding, '/api/v1/block')).resolves.toEqual({
			status: 'ok',
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://api.cardanoscan.io/api/v1/block'
		)
	})
})

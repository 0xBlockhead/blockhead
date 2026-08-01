import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { ApiFamily } from '$/sources/SourceBinding.ts'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const queries = await import('$/sources/Nodely/Rest/queries.ts')

describe('Nodely REST operations', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it('uses the Algod binding for node status', async () => {
		getJson.mockResolvedValue({})

		await queries.getAlgodStatus()

		expect(getJson).toHaveBeenCalledWith(
			expect.objectContaining({
				apiFamily: ApiFamily.AlgodRestApi,
			}),
			'/v2/status'
		)
	})

	it('uses the Indexer binding for indexer health', async () => {
		getJson.mockResolvedValue({})

		await queries.getIndexerHealth()

		expect(getJson).toHaveBeenCalledWith(
			expect.objectContaining({
				apiFamily: ApiFamily.AlgorandIndexerRestApi,
			}),
			'/health'
		)
	})

	it('exports only endpoint-specific operations', () => {
		expect(Object.keys(queries).sort()).toEqual([
			'getAlgodStatus',
			'getIndexerHealth',
		])
	})
})

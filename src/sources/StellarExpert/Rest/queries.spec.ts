import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/StellarExpert/bindings.ts'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const queries = await import('$/sources/StellarExpert/Rest/queries.ts')
const {
	getAllAssets,
	getTimestampFromSequence,
} = queries
const binding = bindings[Source.StellarExpert]

describe('StellarExpert OpenAPI operations', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it('queries the asset catalog with documented search, ordering, and paging parameters', async () => {
		getJson.mockResolvedValue({
			_embedded: {
				records: [],
			},
		})

		await getAllAssets({
			network: 'public',
			search: 'dollar',
			sort: 'rating',
			order: 'desc',
			limit: 25,
			cursor: 10,
		})

		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/explorer/public/asset?search=dollar&sort=rating&order=desc&limit=25&cursor=10'
		)
	})

	it('omits an empty asset query instead of emitting a meaningless suffix', async () => {
		getJson.mockResolvedValue({})

		await getAllAssets({ network: 'testnet' })

		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/explorer/testnet/asset'
		)
	})

	it('queries a ledger close timestamp by exact sequence', async () => {
		getJson.mockResolvedValue({
			sequence: 42_431_435,
			timestamp: 1_661_781_078,
			date: '2022-08-29T13:51:18.000Z',
		})

		await getTimestampFromSequence({
			network: 'public',
			sequence: 42_431_435,
		})

		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/explorer/public/ledger/timestamp-from-sequence?sequence=42431435'
		)
	})

	it('exports only product-relevant endpoint operations', () => {
		expect(Object.keys(queries).sort()).toEqual([
			'getAllAssets',
			'getTimestampFromSequence',
		])
	})
})

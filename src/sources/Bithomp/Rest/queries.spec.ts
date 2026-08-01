import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Bithomp/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://bithomp.com/api/v2/',
	sourceFetch,
}))

const queries = await import('$/sources/Bithomp/Rest/queries.ts')
const { getAccount } = queries

describe('Bithomp account operation', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('requests schema-defined XRPL account observations through the canonical binding', async () => {
		sourceFetch.mockResolvedValue(new Response(JSON.stringify({
			address: 'rAccount',
			ledgerInfo: {
				ledger: 98_765_432,
				ledgerTimestamp: 1_784_783_358,
				balance: '900719925474099312345',
				ownerCount: 3,
				sequence: 42,
			},
		})))

		await expect(getAccount(
			{
				PUBLIC_BITHOMP_API_KEY: 'configured token',
			},
			{
				address: 'rAccount/with path',
			}
		)).resolves.toMatchObject({
			ledgerInfo: {
				balance: '900719925474099312345',
			},
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			bindings[Source.Bithomp],
			'https://bithomp.com/api/v2/address/rAccount%2Fwith%20path?ledgerInfo=true',
			{
				headers: {
					'x-bithomp-token': 'configured token',
				},
			}
		)
	})

	it('exports only the endpoint-specific operation', () => {
		expect(Object.keys(queries)).toEqual(['getAccount'])
	})
})

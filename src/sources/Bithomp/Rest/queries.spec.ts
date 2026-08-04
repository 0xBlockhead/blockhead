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
const {
	getAccount,
	getAmm,
} = queries

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
			bindings[Source.Bithomp][0],
			'https://bithomp.com/api/v2/address/rAccount%2Fwith%20path?ledgerInfo=true',
			{
				headers: {
					'x-bithomp-token': 'configured token',
				},
			}
		)
	})

	it('hard-fails non-OK HTTP instead of soft-emptying', async () => {
		sourceFetch.mockResolvedValue(new Response('upstream', { status: 503 }))

		await expect(getAccount(
			{
				PUBLIC_BITHOMP_API_KEY: 'configured token',
			},
			{
				address: 'rAccount',
			}
		)).rejects.toThrow(/503/)
	})
})

describe('Bithomp AMM operation', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('requests schema-defined AMM pool observations by account id', async () => {
		sourceFetch.mockResolvedValue(new Response(JSON.stringify({
			account: 'rAmmAccount',
			amount: '13820630640',
			amount2: {
				currency: '7853504543544152000000000000000000000000',
				issuer: 'rh5jzTCdMRCVjQ7LT6zucjezC47KATkuvv',
				value: '173068.8207730273',
			},
			updatedAt: 1_713_700_900,
			updatedLedgerIndex: 87_461_194,
			tradingFee: 290,
		})))

		await expect(getAmm(
			{
				PUBLIC_BITHOMP_API_KEY: 'configured token',
			},
			{
				id: 'rAmm/with path',
			}
		)).resolves.toMatchObject({
			account: 'rAmmAccount',
			amount: '13820630640',
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			bindings[Source.Bithomp][0],
			'https://bithomp.com/api/v2/amm/rAmm%2Fwith%20path',
			{
				headers: {
					'x-bithomp-token': 'configured token',
				},
			}
		)
	})

	it('hard-fails non-OK HTTP instead of soft-emptying', async () => {
		sourceFetch.mockResolvedValue(new Response('missing', { status: 404 }))

		await expect(getAmm(
			{
				PUBLIC_BITHOMP_API_KEY: 'configured token',
			},
			{
				id: 'rAmmAccount',
			}
		)).rejects.toThrow(/404/)
	})
})

describe('Bithomp Rest query surface', () => {
	it('exports only the modeled endpoint operations', () => {
		expect(Object.keys(queries).sort()).toEqual([
			'getAccount',
			'getAmm',
		])
	})
})

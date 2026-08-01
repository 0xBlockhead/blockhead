import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Mintscan/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://apis.mintscan.io',
	sourceFetch,
}))

const queries = await import('$/sources/Mintscan/Rest/queries.ts')
const {
	getAccount,
	getLatestBlock,
} = queries

const publicEnv = {
	PUBLIC_MINTSCAN_API_KEY: 'configured token',
}

describe('Mintscan Cosmos LCD proxy operations', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
		sourceFetch.mockResolvedValue(new Response('{}'))
	})

	it.each([
		{
			query: () => getAccount(publicEnv, {
				network: 'cosmos/path',
				address: 'cosmos1account/path',
			}),
			url: 'https://apis.mintscan.io/cosmos%2Fpath/lcd/cosmos/auth/v1beta1/accounts/cosmos1account%2Fpath',
		},
		{
			query: () => getLatestBlock(publicEnv, {
				network: 'cosmos/path',
			}),
			url: 'https://apis.mintscan.io/cosmos%2Fpath/lcd/cosmos/base/tendermint/v1beta1/blocks/latest',
		},
	])('queries the named LCD operation through the canonical binding', async ({ query, url }) => {
		await query()

		expect(sourceFetch).toHaveBeenCalledWith(
			bindings[Source.Mintscan],
			url,
			{
				headers: {
					Authorization: 'Bearer configured token',
				},
			}
		)
	})

	it('requires the documented bearer token', async () => {
		await expect(getLatestBlock({}, {
			network: 'cosmos',
		})).rejects.toThrow('Missing or empty required env: PUBLIC_MINTSCAN_API_KEY')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('exports only endpoint-specific operations', () => {
		expect(Object.keys(queries).sort()).toEqual([
			'getAccount',
			'getLatestBlock',
		])
	})
})

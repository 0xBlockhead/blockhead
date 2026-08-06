import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/TronGrid/bindings.ts'
import { SourceDelivery } from '$/sources/SourceBinding.ts'

const {
	sourceFetch,
	sourceGetJson,
} = vi.hoisted(() => ({
	sourceFetch: vi.fn(),
	sourceGetJson: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceFetch,
	sourceGetJson,
}))

const {
	getAccountTransactions,
	getBlockByNumber,
} = await import('$/sources/TronGrid/Rest/queries.ts')

const binding = bindings[Source.TronGrid_Rest][0]

it('routes POST and GET reads through the declared HTTP proxy binding', async () => {
	sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
		blockID: 'block-id',
		block_header: {
			raw_data: {
				number: 7,
				timestamp: 1_720_000_000_000,
			},
		},
	})))
	sourceGetJson.mockResolvedValueOnce({
		data: [{
			txID: 'tx-id',
		}],
	})
	expect(binding.delivery).toBe(SourceDelivery.HttpProxy)

	await getBlockByNumber({
		height: 7n,
	})
	await getAccountTransactions({
		address: 'Taccount',
		limit: 25,
	})

	expect(sourceFetch).toHaveBeenCalledWith(
		binding,
		'https://api.trongrid.io/wallet/getblockbynum',
		expect.objectContaining({
			method: 'POST',
		})
	)
	expect(sourceGetJson).toHaveBeenCalledWith(
		binding,
		'https://api.trongrid.io/v1/accounts/Taccount/transactions?limit=25'
	)
})

describe('TronGrid / TronNodeRest arktype envelopes', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('accepts block and account-transaction envelopes', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			blockID: 'block-id',
			block_header: {
				raw_data: {
					number: 7,
					timestamp: 1_720_000_000_000,
				},
			},
			transactions: [{
				txID: 'tx-id',
				raw_data: {
					timestamp: 1_720_000_000_000,
				},
			}],
		})))
		sourceGetJson.mockResolvedValueOnce({
			data: [{
				txID: 'tx-id',
				ret: [{
					contractRet: 'SUCCESS',
				}],
			}],
		})

		await expect(getBlockByNumber({
			height: 7n,
		})).resolves.toMatchObject({
			blockID: 'block-id',
		})
		await expect(getAccountTransactions({
			address: 'Taccount',
			limit: 1,
		})).resolves.toMatchObject({
			data: [{
				txID: 'tx-id',
			}],
		})
	})

	it('fail-closes malformed block and account-transaction envelopes', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			block_header: {
				raw_data: {
					number: -1,
				},
			},
		})))
		sourceGetJson.mockResolvedValueOnce({
			data: [{
				ret: [{
					fee: -1,
				}],
			}],
		})

		await expect(getBlockByNumber({
			height: 7n,
		})).rejects.toThrow('invalid block response envelope')
		await expect(getAccountTransactions({
			address: 'Taccount',
			limit: 1,
		})).rejects.toThrow('invalid account transactions response envelope')
	})
})

import { expect, it, vi } from 'vitest'

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
	sourceFetch.mockResolvedValueOnce(new Response('{}'))
	sourceGetJson.mockResolvedValueOnce({ data: [] })
	expect(binding.delivery).toBe(SourceDelivery.HttpProxy)

	await getBlockByNumber({
		binding,
		height: 7n,
	})
	await getAccountTransactions({
		binding,
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

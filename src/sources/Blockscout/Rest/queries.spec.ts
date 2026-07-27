import { afterEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Blockscout/bindings.ts'
import {
	getStats,
	getUserOperationsPage,
} from '$/sources/Blockscout/Rest/queries.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceOperationGroup,
} from '$/sources/SourceBinding.ts'

const ethereumBlockscoutRestV2Binding = bindings[Source.Blockscout_Rest].find((binding) => (
	binding.target.key === '1'
	&& binding.operationGroups.includes(SourceOperationGroup.BlockscoutAccountAbstraction)
))

if (ethereumBlockscoutRestV2Binding == null)
	throw new Error('Blockscout REST spec missing Ethereum account-abstraction binding')

describe('Blockscout account-abstraction queries', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('routes stats through the registered browser HTTP proxy binding', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({
			gas_price_updated_at: '2026-07-16T09:30:43.020427Z',
			gas_prices: {
				slow: 0.12,
				average: 0.23,
				fast: 1.61,
			},
		}), {
			headers: {
				'content-type': 'application/json',
			},
		}))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})
		await expect(getStats({
			binding: ethereumBlockscoutRestV2Binding,
		})).resolves.toMatchObject({
			gas_prices: {
				slow: 0.12,
				average: 0.23,
				fast: 1.61,
			},
		})
		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringMatching(/^\/api-proxy\/.+\/0\/https%3A%2F%2Feth\.blockscout\.com%2Fapi%2Fv2%2Fstats$/),
			expect.objectContaining({
				signal: expect.any(AbortSignal),
			})
		)
	})

	it('rejects Blockscout error envelopes before reading paginated rows', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
			error: 'account abstraction disabled',
			items: [],
		}), {
			headers: {
				'content-type': 'application/json',
			},
		}))

		await expect(getUserOperationsPage({
			binding: ethereumBlockscoutRestV2Binding,
			limit: 3,
		})).rejects.toThrow(
			'Blockscout GET /proxy/account-abstraction/operations: account abstraction disabled'
		)
	})

	it('returns paginated rows when the Blockscout envelope has no error payload', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
			items: [
				{
					hash: '0x1234',
					status: true,
				},
			],
			next_page_params: {
				page: 2,
			},
		}), {
			headers: {
				'content-type': 'application/json',
			},
		}))

		await expect(getUserOperationsPage({
			binding: ethereumBlockscoutRestV2Binding,
			limit: 3,
		})).resolves.toEqual([
			{
				hash: '0x1234',
				status: true,
			},
		])
	})
})

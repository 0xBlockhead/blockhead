import { afterEach, describe, expect, it, vi } from 'vitest'

import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import {
	getStats,
	getUserOperationsPage,
} from '$/sources/Blockscout/Rest/queries.ts'
import { ApiFamily, SourceEndpointKind } from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'

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
		const binding = sourceProviderDefinitions
			.flatMap((provider) => provider.bindings)
			.find((candidate) => (
				candidate.source === Source.Blockscout_Rest
				&& candidate.apiFamily === ApiFamily.BlockscoutRestV2
				&& candidate.endpoints.some((endpoint) => (
					endpoint.endpointKind === SourceEndpointKind.HttpUrl
					&& endpoint.origin === 'https://eth.blockscout.com'
				))
			))
		if (binding == null || binding.proxyId == null)
			throw new Error('Ethereum Blockscout REST-v2 proxy binding is not registered')

		await expect(getStats({
			explorerOrigin: 'https://eth.blockscout.com',
		})).resolves.toMatchObject({
			gas_prices: {
				slow: 0.12,
				average: 0.23,
				fast: 1.61,
			},
		})
		expect(fetchMock).toHaveBeenCalledWith(
			`/api-proxy/${encodeURIComponent(binding.proxyId)}/0/${encodeURIComponent('https://eth.blockscout.com/api/v2/stats')}`,
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
			explorerOrigin: 'https://eth.blockscout.com',
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
			explorerOrigin: 'https://eth.blockscout.com',
			limit: 3,
		})).resolves.toEqual([
			{
				hash: '0x1234',
				status: true,
			},
		])
	})
})

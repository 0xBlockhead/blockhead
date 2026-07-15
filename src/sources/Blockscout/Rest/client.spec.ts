import { afterEach, describe, expect, it, vi } from 'vitest'

import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { getJson } from '$/sources/Blockscout/Rest/client.ts'
import { ApiFamily, SourceDelivery, SourceEndpointKind } from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'

describe('Blockscout REST client delivery', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('uses the registered REST-v2 binding and its HTTP proxy identity', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ items: [] }), {
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

		await expect(getJson({
			explorerOrigin: 'https://eth.blockscout.com',
			path: '/transactions/0x1234/logs',
		})).resolves.toEqual({ items: [] })

		expect(binding.delivery).toBe(SourceDelivery.HttpProxy)
		expect(fetchMock).toHaveBeenCalledOnce()
		expect(fetchMock).toHaveBeenCalledWith(
			`/api-proxy/${encodeURIComponent(binding.proxyId)}/0/${encodeURIComponent('https://eth.blockscout.com/api/v2/transactions/0x1234/logs')}`,
			expect.objectContaining({
				headers: {
					accept: 'application/json',
				},
				signal: expect.any(AbortSignal),
			})
		)
	})
})

import { afterEach, describe, expect, it, vi } from 'vitest'

import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { primalPost } from '$/sources/Primal/Rest/client.ts'
import { Source } from '$/sources/Source.ts'
import { SourceDelivery } from '$/sources/SourceBinding.ts'

describe('primalPost', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('uses the registered proxy binding and serializes typed POST bodies', async () => {
		vi.stubGlobal('window', {})
		vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
			const binding = sourceProviderDefinitions
				.flatMap((provider) => provider.bindings)
				.find(({ source }) => source === Source.Primal_Rest)
			if (binding == null || binding.proxyId == null)
				throw new Error('Primal REST proxy binding is not registered')

			expect(binding.delivery).toBe(SourceDelivery.HttpProxy)
			expect(String(input)).toBe(
				`/api-proxy/${encodeURIComponent(binding.proxyId)}/0/${encodeURIComponent('https://api.primal.net/v1/search/events')}`
			)
			expect(init?.method).toBe('POST')
			expect(init?.headers).toEqual({
				Accept: 'application/json',
				'Content-Type': 'application/json',
			})
			expect(init?.body).toBe(JSON.stringify({
				query: 'nostr',
				kinds: [
					1,
					30023,
				],
				limit: 2,
			}))
			return new Response(JSON.stringify([]), {
				headers: {
					'content-type': 'application/json',
				},
			})
		})

		await expect(primalPost('/search/events', {
			query: 'nostr',
			kinds: [
				1,
				30023,
			],
			limit: 2,
		})).resolves.toEqual([])
	})
})

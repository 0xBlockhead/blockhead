import { afterEach, describe, expect, it, vi } from 'vitest'

import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { listTopProfiles } from '$/sources/NostrBand/Rest/queries.ts'
import { Source } from '$/sources/Source.ts'
import { SourceDelivery } from '$/sources/SourceBinding.ts'

describe('NostrBand REST client delivery', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('uses its registered HTTP proxy binding in the browser', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({
			profiles: [],
		}), {
			headers: {
				'content-type': 'application/json',
			},
		}))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})
		const binding = sourceProviderDefinitions
			.flatMap((provider) => provider.bindings)
			.find(({ source }) => source === Source.NostrBand_Rest)
		if (binding == null || binding.proxyId == null)
			throw new Error('NostrBand REST proxy binding is not registered')

		await expect(listTopProfiles(20)).resolves.toEqual({ profiles: [] })

		expect(binding.delivery).toBe(SourceDelivery.HttpProxy)
		expect(fetchMock).toHaveBeenCalledWith(
			`/api-proxy/${encodeURIComponent(binding.proxyId)}/0/${encodeURIComponent('https://api.nostr.band/v0/stats/profile/list?limit=20')}`,
			expect.objectContaining({
				signal: expect.any(AbortSignal),
			})
		)
	})
})

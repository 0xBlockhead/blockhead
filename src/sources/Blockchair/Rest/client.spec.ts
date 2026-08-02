import { afterEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Blockchair/bindings.ts'
import blockchair from '$/sources/Blockchair/index.ts'
import { indexSourceProviders } from '$/sources/$sources.ts'
import { getBlockchairJson } from '$/sources/Blockchair/Rest/client.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceDelivery,
	SourceTargetKind,
	sourceBindingId,
} from '$/sources/SourceBinding.ts'

const binding = bindings[Source.Blockchair_Rest][0]

describe('Blockchair REST client delivery', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('uses the registered HttpProxy binding without coupling to its generated identity', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ data: [] }), {
			headers: {
				'content-type': 'application/json',
			},
		}))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(getBlockchairJson({
			path: '/bitcoin/blocks',
			searchParams: {
				limit: 16,
			},
			options: {
				apiKey: 'public key',
			},
		})).resolves.toEqual({ data: [] })

		expect(binding.delivery).toBe(SourceDelivery.HttpProxy)
		expect(fetchMock).toHaveBeenCalledOnce()
		expect(fetchMock).toHaveBeenCalledWith(
			`/api-proxy/${encodeURIComponent(sourceBindingId(binding))}/0/${encodeURIComponent('https://api.blockchair.com/bitcoin/blocks?limit=16&key=public+key')}`,
			expect.objectContaining({
				signal: expect.any(AbortSignal),
			})
		)
	})

	it('keeps the source disabled until its public credential is configured', () => {
		expect(indexSourceProviders([blockchair], {}).enabledSources.has(Source.Blockchair_Rest)).toBe(false)
		expect(indexSourceProviders([blockchair], {
			PUBLIC_BLOCKCHAIR_API_KEY: 'configured',
		}).enabledSources.has(Source.Blockchair_Rest)).toBe(true)
	})
})

import { afterEach, describe, expect, it, vi } from 'vitest'

import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { indexSourceProviders } from '$/sources/$sources.ts'
import { getBlockchairJson } from '$/sources/Blockchair/Rest/client.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceDelivery,
	SourceTargetKind,
} from '$/sources/SourceBinding.ts'

const binding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((candidate) => (
		candidate.source === Source.Blockchair_Rest
		&& candidate.target.kind === SourceTargetKind.Global
		&& candidate.target.key === 'blockchair'
	))

if (binding == null || binding.proxyId == null)
	throw new Error('Blockchair REST proxy binding is not registered')

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
			`/api-proxy/${encodeURIComponent(binding.proxyId)}/0/${encodeURIComponent('https://api.blockchair.com/bitcoin/blocks?limit=16&key=public+key')}`,
			expect.objectContaining({
				signal: expect.any(AbortSignal),
			})
		)
	})

	it('keeps the source disabled until its public credential is configured', () => {
		expect(indexSourceProviders(sourceProviderDefinitions, {}).enabledSources.has(Source.Blockchair_Rest)).toBe(false)
		expect(indexSourceProviders(sourceProviderDefinitions, {
			PUBLIC_BLOCKCHAIR_API_KEY: 'configured',
		}).enabledSources.has(Source.Blockchair_Rest)).toBe(true)
	})
})

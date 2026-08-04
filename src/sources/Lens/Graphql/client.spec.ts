import { afterEach, beforeEach, expect, it, vi } from 'vitest'

import { indexSourceProviders } from '$/sources/$sources.ts'
import bindings from '$/sources/Lens/bindings.ts'
import lensProvider from '$/sources/Lens/index.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId, SourceDelivery } from '$/sources/SourceBinding.ts'

const { queryLatestPosts } = await import('$/sources/Lens/Graphql/queries.ts')

const binding = bindings[Source.Lens_Graphql][0]

const fetchMock = vi.fn<typeof fetch>()

beforeEach(() => {
	fetchMock.mockReset()
	fetchMock.mockResolvedValue(new Response(JSON.stringify({
		data: {
			posts: {
				items: [],
				pageInfo: {
					prev: null,
					next: null,
				},
			},
		},
	}), {
		headers: {
			'content-type': 'application/json',
		},
	}))
	vi.stubGlobal('fetch', fetchMock)
	vi.stubGlobal('window', {})
})

afterEach(() => {
	vi.unstubAllGlobals()
})

it('sends a bounded latest-post query through the canonical binding delivery', async () => {
	await expect(queryLatestPosts('FIFTY')).resolves.toEqual({
		posts: {
			items: [],
			pageInfo: {
				prev: null,
				next: null,
			},
		},
	})

	expect(binding.delivery).toBe(SourceDelivery.BrowserDirect)
	expect(binding.credentials).toEqual([])
	expect(fetchMock).toHaveBeenCalledTimes(1)
	expect(fetchMock.mock.calls[0][0]).toBe('https://api.lens.xyz/graphql')
	const init = fetchMock.mock.calls[0][1]
	expect(JSON.parse(String(init?.body)).variables).toEqual({
		pageSize: 'FIFTY',
	})
	expect(init?.headers).not.toHaveProperty('x-lens-app')
	expect(init?.signal).toBeInstanceOf(AbortSignal)
})

it('keeps the anonymous browser source enabled without configuration', () => {
	expect(indexSourceProviders([lensProvider], {}, new Set([
		sourceBindingId(binding),
	])).enabledSources.has(Source.Lens_Graphql)).toBe(true)
})

it('fails closed on GraphQL errors instead of returning partial data', async () => {
	fetchMock.mockResolvedValue(new Response(JSON.stringify({
		data: {
			posts: {
				items: [],
			},
		},
		errors: [{
			message: 'query rejected',
		}],
	}), {
		headers: {
			'content-type': 'application/json',
		},
	}))

	await expect(queryLatestPosts()).rejects.toThrow(
		'Lens_Graphql: query rejected'
	)
})

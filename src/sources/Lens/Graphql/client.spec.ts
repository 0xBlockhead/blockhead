import { afterEach, beforeEach, expect, it, vi } from 'vitest'

import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { indexSourceProviders } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceEndpointKind,
} from '$/sources/SourceBinding.ts'

const { queryLatestPosts } = await import('$/sources/Lens/Graphql/queries.ts')

const binding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((candidate) => (
		candidate.source === Source.Lens_Graphql
		&& candidate.apiFamily === ApiFamily.GraphqlHttp
		&& candidate.endpoints.some((endpoint) => (
			endpoint.endpointKind === SourceEndpointKind.HttpUrl
			&& endpoint.locator === 'https://api.lens.xyz/graphql'
		))
	))

if (binding == null)
	throw new Error('Lens GraphQL binding is not registered')

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
	await expect(queryLatestPosts({}, 'FIFTY')).resolves.toEqual({
		posts: {
			items: [],
			pageInfo: {
				prev: null,
				next: null,
			},
		},
	})

	expect(binding.delivery).toBe(SourceDelivery.BrowserDirect)
	expect(fetchMock).toHaveBeenCalledTimes(1)
	expect(fetchMock.mock.calls[0][0]).toBe('https://api.lens.xyz/graphql')
	const init = fetchMock.mock.calls[0][1]
	expect(JSON.parse(String(init?.body)).variables).toEqual({
		pageSize: 'FIFTY',
	})
	expect(init?.headers).not.toHaveProperty('x-lens-app')
	expect(init?.signal).toBeInstanceOf(AbortSignal)
})

it('includes configured app identity without exposing an empty header', async () => {
	await queryLatestPosts({
		PUBLIC_LENS_API_KEY: ' lens-app ',
	})

	expect(fetchMock.mock.calls[0][1]?.headers).toHaveProperty('x-lens-app', 'lens-app')
})

it('keeps the source disabled until its public app credential is configured', () => {
	expect(indexSourceProviders(sourceProviderDefinitions, {}).enabledSources.has(Source.Lens_Graphql)).toBe(false)
	expect(indexSourceProviders(sourceProviderDefinitions, {
		PUBLIC_LENS_API_KEY: 'configured',
	}).enabledSources.has(Source.Lens_Graphql)).toBe(true)
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

	await expect(queryLatestPosts({})).rejects.toThrow(
		'Lens_Graphql: query rejected'
	)
})

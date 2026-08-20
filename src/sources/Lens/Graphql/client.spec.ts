import { afterEach, beforeEach, expect, it, vi } from 'vitest'

import bindings from '$/sources/Lens/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Lens_Graphql][0]
const { lensQueries } = await import('$/sources/Lens/Graphql/queries.ts')
const { queryLatestPosts } = lensQueries

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

it('sends bounded anonymous queries and fails closed on GraphQL errors', async () => {
	await expect(queryLatestPosts('FIFTY')).resolves.toEqual({
		posts: {
			items: [],
			pageInfo: {
				prev: null,
				next: null,
			},
		},
	})

	expect(fetchMock).toHaveBeenCalledTimes(1)
	expect(fetchMock.mock.calls[0][0]).toBe('https://api.lens.xyz/graphql')
	const init = fetchMock.mock.calls[0][1]
	expect(JSON.parse(String(init?.body)).variables).toEqual({
		pageSize: 'FIFTY',
	})
	expect(init?.headers).not.toHaveProperty('x-lens-app')
	expect(init?.signal).toBeInstanceOf(AbortSignal)

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
	expect(fetchMock).toHaveBeenCalledTimes(2)
})

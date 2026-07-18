import { beforeEach, expect, it, vi } from 'vitest'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/lib/http.ts', () => ({ getJson }))

const { queryLatestPosts } = await import('$/sources/Lens/Graphql/queries.ts')

beforeEach(() => {
	getJson.mockReset()
	getJson.mockResolvedValue({
		data: {
			posts: {
				items: [],
			},
		},
	})
})

it('sends a bounded latest-post query through the declared browser origin', async () => {
	await expect(queryLatestPosts({}, 'FIFTY')).resolves.toEqual({
		posts: {
			items: [],
		},
	})

	expect(getJson).toHaveBeenCalledTimes(1)
	expect(getJson.mock.calls[0][0]).toBe('https://api.lens.xyz/graphql')
	expect(getJson.mock.calls[0][1].origins).toEqual([{
		origin: 'https://api.lens.xyz',
		corsEnabled: true,
	}])
	expect(JSON.parse(getJson.mock.calls[0][1].init.body).variables).toEqual({
		pageSize: 'FIFTY',
	})
	expect(getJson.mock.calls[0][1].init.headers).not.toHaveProperty('x-lens-app')
})

it('includes configured app identity without exposing an empty header', async () => {
	await queryLatestPosts({
		PUBLIC_LENS_API_KEY: ' lens-app ',
	})

	expect(getJson.mock.calls[0][1].init.headers['x-lens-app']).toBe('lens-app')
})

it('fails closed on GraphQL errors instead of returning partial data', async () => {
	getJson.mockResolvedValue({
		data: {
			posts: {
				items: [],
			},
		},
		errors: [{
			message: 'query rejected',
		}],
	})

	await expect(queryLatestPosts({})).rejects.toThrow(
		'Lens_Graphql: query rejected'
	)
})

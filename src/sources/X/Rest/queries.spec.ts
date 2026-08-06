import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: { endpoints: { locator: string }[] }) => binding.endpoints[0].locator,
	sourceFetch,
}))

const {
	getTweet,
	getUser,
	getUserByUsername,
	listUserTweets,
	searchRecentTweets,
} = await import('$/sources/X/Rest/queries.ts')

const publicEnv = {
	PUBLIC_X_API_BEARER: 'bearer',
}

beforeEach(() => {
	sourceFetch.mockReset()
})

describe('X Rest arktype envelopes', () => {
	it('accepts valid user / tweet / list envelopes', async () => {
		sourceFetch
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({
					data: {
						id: '1',
						username: 'fixture',
						public_metrics: { followers_count: 0 },
					},
				}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({
					data: {
						id: '1',
						username: 'fixture',
					},
				}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({
					data: {
						id: '189',
						text: 'hi',
						public_metrics: { like_count: 0 },
					},
				}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({
					data: [{ id: '189', author_id: '1' }],
					meta: { next_token: 'opaque/+%' },
				}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({
					data: [{ id: '190' }],
					includes: {
						users: [{ id: '1', username: 'fixture' }],
					},
				}),
			})

		await expect(getUser(publicEnv, '1')).resolves.toMatchObject({
			data: { id: '1', username: 'fixture' },
		})
		await expect(getUserByUsername(publicEnv, 'fixture')).resolves.toMatchObject({
			data: { id: '1' },
		})
		await expect(getTweet(publicEnv, '189')).resolves.toMatchObject({
			data: { id: '189' },
		})
		await expect(listUserTweets(publicEnv, '1', 25)).resolves.toMatchObject({
			meta: { next_token: 'opaque/+%' },
		})
		await expect(searchRecentTweets(publicEnv, 10)).resolves.toMatchObject({
			includes: {
				users: [{ id: '1' }],
			},
		})

		expect(sourceFetch.mock.calls[1][1]).toContain(
			'/2/users/by/username/fixture?'
		)
	})

	it('fails closed on malformed envelopes', async () => {
		sourceFetch.mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ data: 'not-an-object' }),
		})

		await expect(getUser(publicEnv, '1')).rejects.toThrow(
			'X_Rest: invalid user response envelope'
		)
		await expect(getUserByUsername(publicEnv, 'fixture')).rejects.toThrow(
			'X_Rest: invalid user-by-username response envelope'
		)
		await expect(getTweet(publicEnv, '189')).rejects.toThrow(
			'X_Rest: invalid tweet response envelope'
		)

		sourceFetch.mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ data: { id: 1 } }),
		})
		await expect(listUserTweets(publicEnv, '1', 10)).rejects.toThrow(
			'X_Rest: invalid user-tweets response envelope'
		)
		await expect(searchRecentTweets(publicEnv, 10)).rejects.toThrow(
			'X_Rest: invalid search-recent response envelope'
		)
	})
})

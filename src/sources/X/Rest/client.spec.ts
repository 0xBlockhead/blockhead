import { beforeEach, expect, it, vi } from 'vitest'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/lib/http.ts', () => ({ getJson }))

const {
	listUserTweets,
	searchRecentTweets,
} = await import('$/sources/X/Rest/queries.ts')

beforeEach(() => {
	getJson.mockReset()
	getJson.mockResolvedValue({ data: [] })
})

it('uses the proxied X origin with the configured bearer', async () => {
	await listUserTweets({
		PUBLIC_X_API_BEARER: 'bearer',
	}, 'user/with reserved', 25)

	expect(getJson).toHaveBeenCalledTimes(1)
	expect(getJson.mock.calls[0][0]).toContain(
		'https://api.x.com/2/users/user%2Fwith%20reserved/tweets?'
	)
	expect(getJson.mock.calls[0][1].origins).toEqual([{
		origin: 'https://api.x.com',
		corsEnabled: false,
	}])
	expect(getJson.mock.calls[0][1].init.headers.Authorization).toBe('Bearer bearer')
	expect(new URL(getJson.mock.calls[0][0]).searchParams.get('max_results')).toBe('25')
})

it('clamps bounded windows and fails closed without provider authentication', async () => {
	await searchRecentTweets({
		PUBLIC_X_API_BEARER: 'bearer',
	}, 500)
	expect(new URL(getJson.mock.calls[0][0]).searchParams.get('max_results')).toBe('100')

	await expect(searchRecentTweets({}, 10)).rejects.toThrow(
		'Missing or empty required env: PUBLIC_X_API_BEARER'
	)
})

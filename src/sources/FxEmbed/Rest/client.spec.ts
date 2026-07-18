import { beforeEach, expect, it, vi } from 'vitest'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/lib/http.ts', () => ({ getJson }))

const {
	getUser,
	getUserStatuses,
	searchStatuses,
} = await import('$/sources/FxEmbed/Rest/queries.ts')

beforeEach(() => {
	getJson.mockReset()
	getJson.mockResolvedValue({ results: [] })
})

it('uses the proxied FxEmbed origin and preserves profile identity encoding', async () => {
	await getUser('123')
	await getUser('@alice/example')

	expect(getJson.mock.calls[0][0]).toBe(
		'https://api.fxtwitter.com/2/profile/id%3A123'
	)
	expect(getJson.mock.calls[1][0]).toBe(
		'https://api.fxtwitter.com/2/profile/%40alice%2Fexample'
	)
	for (const [, options] of getJson.mock.calls)
		expect(options.origins).toEqual([{
			origin: 'https://api.fxtwitter.com',
			corsEnabled: false,
		}])
})

it('clamps bounded search and profile windows without inventing continuation', async () => {
	await searchStatuses(500)
	await getUserStatuses('alice', 0)

	expect(new URL(getJson.mock.calls[0][0]).searchParams.get('count')).toBe('100')
	expect(new URL(getJson.mock.calls[1][0]).searchParams.get('count')).toBe('1')
	expect(new URL(getJson.mock.calls[0][0]).searchParams.has('cursor')).toBe(false)
	expect(new URL(getJson.mock.calls[1][0]).searchParams.has('cursor')).toBe(false)
})

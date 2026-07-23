import { beforeEach, expect, it, vi } from 'vitest'

import { SourceDelivery } from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({ sourceGetJson }))

const {
	getUser,
	getUserStatuses,
	searchStatuses,
} = await import('$/sources/FxEmbed/Rest/queries.ts')

beforeEach(() => {
	sourceGetJson.mockReset()
	sourceGetJson.mockResolvedValue({ results: [] })
})

it('uses the proxied FxEmbed origin and preserves profile identity encoding', async () => {
	await getUser('123')
	await getUser('@alice/example')

	expect(sourceGetJson.mock.calls[0][0]).toMatchObject({
		source: Source.X_FxEmbed_Rest,
		delivery: SourceDelivery.HttpProxy,
		proxyId: expect.stringMatching(/^X_FxEmbed_Rest-/),
	})
	expect(sourceGetJson.mock.calls[0][1]).toBe(
		'https://api.fxtwitter.com/2/profile/id%3A123'
	)
	expect(sourceGetJson.mock.calls[1][1]).toBe(
		'https://api.fxtwitter.com/2/profile/%40alice%2Fexample'
	)
})

it('clamps bounded search and profile windows without inventing continuation', async () => {
	await searchStatuses(500)
	await getUserStatuses('alice', 0)

	expect(new URL(sourceGetJson.mock.calls[0][1]).searchParams.get('count')).toBe('100')
	expect(new URL(sourceGetJson.mock.calls[1][1]).searchParams.get('count')).toBe('1')
	expect(new URL(sourceGetJson.mock.calls[0][1]).searchParams.has('cursor')).toBe(false)
	expect(new URL(sourceGetJson.mock.calls[1][1]).searchParams.has('cursor')).toBe(false)
})

it('rejects FxEmbed application failures returned through successful HTTP transport', async () => {
	sourceGetJson.mockResolvedValueOnce({
		code: 404,
		message: 'Post not found',
	})

	await expect(searchStatuses(10)).rejects.toThrow('Post not found')
})

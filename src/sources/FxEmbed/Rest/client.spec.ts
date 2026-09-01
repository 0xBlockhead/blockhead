import { beforeEach, expect, it, vi } from 'vitest'

import bindings from '$/sources/FxEmbed/bindings.ts'
import { Source } from '$/sources/Source.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

const {
	firstHttpUrlForBinding,
	sourceGetJson,
} = vi.hoisted(() => ({
	firstHttpUrlForBinding: vi.fn(
		(binding: SourceBinding) => binding.endpoints[0]?.locator
	),
	sourceGetJson: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding,
	sourceGetJson,
}))

const {
	getStatus,
	getUser,
	getUserStatuses,
	searchStatuses,
} = await import('$/sources/FxEmbed/Rest/queries.ts')

const fxEmbedRestBinding = bindings[Source.X_FxEmbed_Rest][0]

beforeEach(() => {
	firstHttpUrlForBinding.mockClear()
	sourceGetJson.mockReset()
	sourceGetJson.mockResolvedValue({ results: [] })
})

it('preserves FxEmbed identities, bounds, empty results, and application failures', async () => {
	await getUser('123')
	await getUser('@alice/example')
	await getStatus('status/+ %=id')

	expect(sourceGetJson.mock.calls[0][0]).toBe(fxEmbedRestBinding)
	expect(sourceGetJson.mock.calls[0][1]).toBe(
		'https://api.fxtwitter.com/2/profile/id%3A123'
	)
	expect(sourceGetJson.mock.calls[1][1]).toBe(
		'https://api.fxtwitter.com/2/profile/%40alice%2Fexample'
	)
	expect(sourceGetJson.mock.calls[2][1]).toBe(
		'https://api.fxtwitter.com/2/status/status%2F%2B%20%25%3Did'
	)
})

it('clamps bounded windows, preserves cursors, and handles application results', async () => {
	await searchStatuses(500, 'search/+ %=cursor')
	await getUserStatuses('alice', 0, 'profile/+ %=cursor')

	expect(new URL(sourceGetJson.mock.calls[0][1]).searchParams.get('count')).toBe('100')
	expect(new URL(sourceGetJson.mock.calls[1][1]).searchParams.get('count')).toBe('1')
	expect(new URL(sourceGetJson.mock.calls[0][1]).searchParams.get('cursor')).toBe('search/+ %=cursor')
	expect(new URL(sourceGetJson.mock.calls[1][1]).searchParams.get('cursor')).toBe('profile/+ %=cursor')
	expect(sourceGetJson.mock.calls[0][2]).toEqual([404])
	expect(sourceGetJson.mock.calls[1][2]).toEqual([])

	sourceGetJson.mockResolvedValueOnce({
		code: 404,
		results: [],
	})

	expect(await searchStatuses(10)).toEqual({
		code: 404,
		results: [],
	})

	sourceGetJson.mockResolvedValueOnce({
		code: 500,
		message: 'Upstream failed',
	})

	await expect(searchStatuses(10)).rejects.toThrow('Upstream failed')
})

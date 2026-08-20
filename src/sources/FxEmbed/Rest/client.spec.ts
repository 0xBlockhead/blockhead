import { beforeEach, expect, it, vi } from 'vitest'

import bindings from '$/sources/FxEmbed/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

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

it('uses the generated FxEmbed OpenAPI contract', () => {
	expect(fxEmbedRestBinding.apiFamily).toBe(ApiFamily.OpenApiHttp)
	expect(fxEmbedRestBinding.artifacts.map(({ kind }) => kind)).toEqual([
		SourceArtifactKind.GenerationManifest,
		SourceArtifactKind.OpenApiSpec,
		SourceArtifactKind.OpenApiTypes,
	])
})

it('uses the proxied FxEmbed origin and preserves profile identity encoding', async () => {
	await getUser('123')
	await getUser('@alice/example')

	expect(sourceGetJson.mock.calls[0][0]).toBe(fxEmbedRestBinding)
	expect(sourceGetJson.mock.calls[0][1]).toBe(
		'https://api.fxtwitter.com/2/profile/id%3A123'
	)
	expect(sourceGetJson.mock.calls[1][1]).toBe(
		'https://api.fxtwitter.com/2/profile/%40alice%2Fexample'
	)
})

it('clamps bounded windows and preserves opaque continuation tokens', async () => {
	await searchStatuses(500, 'search/+ %=cursor')
	await getUserStatuses('alice', 0, 'profile/+ %=cursor')

	expect(new URL(sourceGetJson.mock.calls[0][1]).searchParams.get('count')).toBe('100')
	expect(new URL(sourceGetJson.mock.calls[1][1]).searchParams.get('count')).toBe('1')
	expect(new URL(sourceGetJson.mock.calls[0][1]).searchParams.get('cursor')).toBe('search/+ %=cursor')
	expect(new URL(sourceGetJson.mock.calls[1][1]).searchParams.get('cursor')).toBe('profile/+ %=cursor')
	expect(sourceGetJson.mock.calls[0][2]).toEqual([404])
	expect(sourceGetJson.mock.calls[1][2]).toEqual([])
})

it('returns the documented empty search result response', async () => {
	sourceGetJson.mockResolvedValueOnce({
		code: 404,
		results: [],
	})

	expect(await searchStatuses(10)).toEqual({
		code: 404,
		results: [],
	})
})

it('rejects FxEmbed application failures returned through successful HTTP transport', async () => {
	sourceGetJson.mockResolvedValueOnce({
		code: 500,
		message: 'Upstream failed',
	})

	await expect(searchStatuses(10)).rejects.toThrow('Upstream failed')
})

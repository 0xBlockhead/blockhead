import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { farcasterGet } from '$/sources/Farcaster/Rest/client.ts'
import bindings from '$/sources/Farcaster/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'

const farcasterBinding = bindings[Source.Farcaster_Rest]

afterEach(() => {
	vi.unstubAllGlobals()
})

describe('Farcaster REST binding authority', () => {
	it('routes client and web APIs through their declared proxy endpoints', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockImplementation(async () => new Response('{}'))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await farcasterGet('/v2/all-channels', {
			limit: 100,
		})
		await farcasterGet('/~api/v2/user-thread-casts', {
			username: 'alice',
		})

		expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
			`/api-proxy/${encodeURIComponent(sourceBindingId(farcasterBinding))}/0/https%3A%2F%2Fapi.farcaster.xyz%2Fv2%2Fall-channels%3Flimit%3D100`,
			`/api-proxy/${encodeURIComponent(sourceBindingId(farcasterBinding))}/1/https%3A%2F%2Ffarcaster.xyz%2F~api%2Fv2%2Fuser-thread-casts%3Fusername%3Dalice`,
		])
	})
})

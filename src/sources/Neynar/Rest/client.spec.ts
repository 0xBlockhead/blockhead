import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { neynarFetch } from '$/sources/Neynar/Rest/client.ts'
import bindings from '$/sources/Neynar/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'

const neynarBinding = bindings[Source.Neynar_Rest][0]

afterEach(() => {
	vi.unstubAllGlobals()
})

describe('Neynar REST binding authority', () => {
	it('keeps anonymous reads inert and routes authenticated reads', async () => {
		const fetchMock = vi.fn<typeof fetch>()
		vi.stubGlobal('fetch', fetchMock)

		await expect(neynarFetch({}, '/v2/farcaster/feed/')).resolves.toBeUndefined()
		expect(fetchMock).not.toHaveBeenCalled()

		fetchMock.mockResolvedValue(new Response('{}'))
		vi.stubGlobal('window', {})

		await neynarFetch(
			{
				PUBLIC_NEYNAR_API_KEY: 'test-key',
			},
			'/v2/farcaster/feed/?feed_type=filter'
		)

		expect(fetchMock).toHaveBeenCalledWith(
			`/api-proxy/${encodeURIComponent(sourceBindingId(neynarBinding))}/0/https%3A%2F%2Fapi.neynar.com%2Fv2%2Ffarcaster%2Ffeed%2F%3Ffeed_type%3Dfilter`,
			expect.objectContaining({
				headers: expect.objectContaining({
					'x-api-key': 'test-key',
				}),
			})
		)
	})
})

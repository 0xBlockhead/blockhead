import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Dune/bindings.ts'
import { duneFetch } from '$/sources/Dune/Rest/client.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'

const duneRestBinding = bindings[Source.Dune_Rest][0]
const publicEnv = {
	PUBLIC_DUNE_API_KEY: 'test-dune-key',
}

describe('Dune REST client', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('routes authenticated reads and fails closed for upstream and credential errors', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ ok: true }))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(duneFetch(publicEnv, '/api/v1/usage')).resolves.toEqual({ ok: true })

		expect(fetchMock).toHaveBeenCalledOnce()
		expect(fetchMock).toHaveBeenCalledWith(
			`/api-proxy/${encodeURIComponent(sourceBindingId(duneRestBinding))}/0/${encodeURIComponent('https://api.dune.com/api/v1/usage')}`,
			expect.objectContaining({
				headers: expect.objectContaining({
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'X-DUNE-API-KEY': 'test-dune-key',
				}),
				signal: expect.any(AbortSignal),
			})
		)

		fetchMock.mockReset()
		fetchMock
			.mockResolvedValueOnce(new Response('missing', { status: 404 }))
			.mockResolvedValueOnce(new Response('upstream', { status: 500 }))

		await expect(duneFetch(publicEnv, '/api/v1/query/1')).rejects.toThrow(/404/)
		await expect(duneFetch(publicEnv, '/api/v1/query/1')).rejects.toThrow(/500/)

		fetchMock.mockClear()
		await expect(duneFetch({}, '/api/v1/usage')).rejects.toThrow('PUBLIC_DUNE_API_KEY')
		expect(fetchMock).not.toHaveBeenCalled()
	})
})

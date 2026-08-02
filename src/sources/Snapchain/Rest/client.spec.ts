import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { snapchainGet } from '$/sources/Snapchain/Rest/client.ts'
import bindings from '$/sources/Snapchain/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'

const snapchainBinding = bindings[Source.Snapchain_Rest][0]

afterEach(() => {
	vi.unstubAllGlobals()
})

describe('Snapchain REST binding authority', () => {
	it('routes reads through the canonical declared proxy endpoint without fallback', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response('{}'))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await snapchainGet('/v1/castById', {
			fid: 1,
			hash: '0x1234',
		})

		expect(fetchMock).toHaveBeenCalledOnce()
		expect(fetchMock.mock.calls[0]?.[0]).toBe(
			`/api-proxy/${encodeURIComponent(sourceBindingId(snapchainBinding))}/0/${encodeURIComponent(`${snapchainBinding.endpoints[0].locator}/v1/castById?fid=1&hash=0x1234`)}`
		)
	})
})

import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/FourByteDirectory/bindings.ts'
import {
	getEventEntries,
	getFunctionEntries,
} from '$/sources/FourByteDirectory/Rest/queries.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.FourByteDirectory_Rest][0]
const jsonResponse = (body: unknown) => (
	new Response(JSON.stringify(body), {
		headers: {
			'content-type': 'application/json',
		},
	})
)

describe('4byte.directory REST product queries', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('queries function and event signatures through its own source binding', async () => {
		const fetchMock = vi.fn<typeof fetch>()
			.mockResolvedValueOnce(jsonResponse({
				results: [{ text_signature: 'transfer(address,uint256)' }],
			}))
			.mockResolvedValueOnce(jsonResponse({
				results: [{ text_signature: 'transfer(address,uint256)' }],
			}))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(getFunctionEntries({
			hex: '0xA9059CBB',
		})).resolves.toEqual([{ text_signature: 'transfer(address,uint256)' }])
		await expect(getEventEntries({
			hex: '0xDDf252ad',
		})).resolves.toEqual([{ text_signature: 'transfer(address,uint256)' }])

		expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
			expect.stringMatching(/FourByteDirectory_Rest|fourbyte/i),
			expect.stringMatching(/FourByteDirectory_Rest|fourbyte/i),
		])
	})

	it('fails closed when the provider omits its results envelope', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ count: 0 }))

		await expect(getFunctionEntries({
			hex: '0xa9059cbb',
		})).rejects.toThrow('invalid signatures list response envelope')
	})
})

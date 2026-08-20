import { describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/DogecoinDips/bindings.ts'
import { Source } from '$/sources/Source.ts'

const httpRuntime = vi.hoisted(() => ({
	sourceGetJson: vi.fn(),
	sourceGetText: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', () => httpRuntime)

const {
	getContents,
	getMediaWikiText,
} = await import('$/sources/DogecoinDips/Github/queries.ts')

const binding = bindings[Source.DogecoinDips_Github][0]

describe('Dogecoin DIPs GitHub queries', () => {
	it('reads representative DIP documents and rejects unsafe coordinates', async () => {
		httpRuntime.sourceGetJson.mockResolvedValueOnce([])
		httpRuntime.sourceGetText.mockResolvedValueOnce('DIP')

		await getContents()
		await expect(getMediaWikiText({
			number: 70,
		})).resolves.toBe('DIP')

		expect(httpRuntime.sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://api.github.com/repos/dogecoin/dips/contents/?ref=master'
		)
		expect(httpRuntime.sourceGetText).toHaveBeenCalledWith(
			binding,
			'https://raw.githubusercontent.com/dogecoin/dips/master/dip-0070.mediawiki'
		)

		vi.clearAllMocks()
		expect(() => getMediaWikiText({
			number: 0,
		})).toThrow('DIP number must be a positive safe integer')
		expect(() => getMediaWikiText({
			number: Number.MAX_SAFE_INTEGER + 1,
		})).toThrow('DIP number must be a positive safe integer')
		expect(httpRuntime.sourceGetText).not.toHaveBeenCalled()
	})
})

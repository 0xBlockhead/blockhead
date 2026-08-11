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
	it('uses the registered binding endpoint and repository target', async () => {
		httpRuntime.sourceGetJson.mockResolvedValueOnce([])

		await getContents()

		expect(httpRuntime.sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://api.github.com/repos/dogecoin/dips/contents/?ref=master'
		)
	})

	it('constructs the selected DIP path under the binding-owned repository', async () => {
		httpRuntime.sourceGetText.mockResolvedValueOnce('DIP')

		await getMediaWikiText({
			number: 70,
		})

		expect(httpRuntime.sourceGetText).toHaveBeenCalledWith(
			binding,
			'https://raw.githubusercontent.com/dogecoin/dips/master/dip-0070.mediawiki'
		)
	})

	it('rejects unsafe DIP coordinates before requesting GitHub', () => {
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

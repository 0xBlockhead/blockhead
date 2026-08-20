import { expect, it, vi } from 'vitest'

import bindings from '$/sources/NearNeps/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())
const sourceGetText = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceGetJson,
	sourceGetText,
}))

const {
	getContents,
	getMarkdownText,
} = await import('$/sources/NearNeps/Github/queries.ts')
const binding = bindings[Source.NearNeps_Github][0]

it('reads representative NEP documents and rejects unsafe coordinates', async () => {
	sourceGetJson.mockResolvedValueOnce([])
	sourceGetText.mockResolvedValueOnce('# NEP 171')

	await expect(getContents()).resolves.toEqual([])
	await expect(getMarkdownText({
		number: 171,
	})).resolves.toBe('# NEP 171')

	expect(sourceGetJson).toHaveBeenCalledWith(
		binding,
		'https://api.github.com/repos/near/NEPs/contents/neps?ref=master'
	)
	expect(sourceGetText).toHaveBeenCalledWith(
		binding,
		'https://raw.githubusercontent.com/near/NEPs/master/neps/nep-0171.md'
	)

	vi.clearAllMocks()
	expect(() => getMarkdownText({
		number: 0,
	})).toThrow('NEP number must be a positive safe integer')
	expect(() => getMarkdownText({
		number: Number.MAX_SAFE_INTEGER + 1,
	})).toThrow('NEP number must be a positive safe integer')

	expect(sourceGetText).not.toHaveBeenCalled()
})

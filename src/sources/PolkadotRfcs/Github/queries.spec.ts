import { expect, it, vi } from 'vitest'

import bindings from '$/sources/PolkadotRfcs/bindings.ts'
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
} = await import('$/sources/PolkadotRfcs/Github/queries.ts')
const binding = bindings[Source.PolkadotRfcs_Github][0]

it('reads representative RFC documents and rejects unsafe coordinates', async () => {
	sourceGetJson.mockResolvedValueOnce([])
	sourceGetText.mockResolvedValueOnce('# RFC 42')

	await expect(getContents()).resolves.toEqual([])
	await expect(getMarkdownText({
		number: 42,
	})).resolves.toBe('# RFC 42')

	expect(sourceGetJson).toHaveBeenCalledWith(
		binding,
		'https://api.github.com/repos/polkadot-fellows/RFCs/contents/text?ref=main'
	)
	expect(sourceGetText).toHaveBeenCalledWith(
		binding,
		'https://raw.githubusercontent.com/polkadot-fellows/RFCs/main/text/0042.md'
	)

	vi.clearAllMocks()
	expect(() => getMarkdownText({
		number: 0,
	})).toThrow('RFC number must be a positive safe integer')
	expect(() => getMarkdownText({
		number: Number.MAX_SAFE_INTEGER + 1,
	})).toThrow('RFC number must be a positive safe integer')

	expect(sourceGetText).not.toHaveBeenCalled()
})

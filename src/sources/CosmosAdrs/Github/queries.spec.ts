import { expect, it, vi } from 'vitest'

import bindings from '$/sources/CosmosAdrs/bindings.ts'
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
} = await import('$/sources/CosmosAdrs/Github/queries.ts')
const binding = bindings[Source.CosmosAdrs_Github][0]

it('reads representative ADR documents and rejects unsafe coordinates', async () => {
	sourceGetJson.mockResolvedValueOnce([])
	sourceGetText.mockResolvedValueOnce('# ADR 007')

	await expect(getContents()).resolves.toEqual([])
	await expect(getMarkdownText({
		number: 7,
	})).resolves.toBe('# ADR 007')

	expect(sourceGetJson).toHaveBeenCalledWith(
		binding,
		'https://api.github.com/repos/cosmos/cosmos-sdk/contents/docs/architecture?ref=main'
	)
	expect(sourceGetText).toHaveBeenCalledWith(
		binding,
		'https://raw.githubusercontent.com/cosmos/cosmos-sdk/main/docs/architecture/adr-007.md'
	)

	vi.clearAllMocks()
	expect(() => getMarkdownText({
		number: 0,
	})).toThrow('ADR number must be a positive safe integer')
	expect(() => getMarkdownText({
		number: Number.MAX_SAFE_INTEGER + 1,
	})).toThrow('ADR number must be a positive safe integer')

	expect(sourceGetText).not.toHaveBeenCalled()
})

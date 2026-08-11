import { beforeEach, expect, it, vi } from 'vitest'

import bindings from '$/sources/FilecoinFips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceDelivery } from '$/sources/SourceBinding.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())
const sourceGetText = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceGetJson,
	sourceGetText,
}))

const {
	getContents,
	getContentsUrl,
	getMarkdownText,
	getMarkdownUrl,
} = await import('$/sources/FilecoinFips/Github/queries.ts')
const binding = bindings[Source.FilecoinFips_Github][0]

beforeEach(() => {
	sourceGetJson.mockReset()
	sourceGetText.mockReset()
})

it('uses the declared public GitHub binding and exact FIP path', async () => {
	sourceGetJson.mockResolvedValueOnce([])
	sourceGetText.mockResolvedValueOnce('# FIP 42')

	expect(getContentsUrl()).toBe(
		'https://api.github.com/repos/filecoin-project/FIPs/contents/FIPS?ref=master'
	)
	expect(getMarkdownUrl({
		number: 42,
	})).toBe('https://raw.githubusercontent.com/filecoin-project/FIPs/master/FIPS/fip-0042.md')
	await expect(getContents()).resolves.toEqual([])
	await expect(getMarkdownText({
		number: 42,
	})).resolves.toBe('# FIP 42')

	expect(binding.delivery).toBe(SourceDelivery.BrowserDirect)
	expect(binding.credentials).toEqual([])
	expect(sourceGetJson).toHaveBeenCalledWith(
		binding,
		'https://api.github.com/repos/filecoin-project/FIPs/contents/FIPS?ref=master'
	)
	expect(sourceGetText).toHaveBeenCalledWith(
		binding,
		'https://raw.githubusercontent.com/filecoin-project/FIPs/master/FIPS/fip-0042.md'
	)
})

it('rejects unsafe or unscoped FIP document numbers before requesting GitHub', () => {
	expect(() => getMarkdownText({
		number: 0,
	})).toThrow('FIP number must be a positive safe integer')
	expect(() => getMarkdownText({
		number: Number.MAX_SAFE_INTEGER + 1,
	})).toThrow('FIP number must be a positive safe integer')

	expect(sourceGetText).not.toHaveBeenCalled()
})

import { readFileSync } from 'node:fs'

import { compile } from 'svelte/compiler'
import { describe, expect, it } from 'vitest'

const source = readFileSync(
	new URL('./+page.svelte', import.meta.url),
	'utf8'
)
const resultSource = readFileSync(
	new URL('./CalldataSignatureResult.svelte', import.meta.url),
	'utf8'
)

describe('calldata decoder resource ownership', () => {
	it('decodes only from ready signature resources and renders empty and failed states explicitly', () => {
		expect(compile(source, {
			filename: '+page.svelte',
			generate: 'client',
		}).warnings).toEqual([])
		expect(compile(resultSource, {
			filename: 'CalldataSignatureResult.svelte',
			generate: 'client',
		}).warnings).toEqual([])
		expect(source).not.toMatch(/(?:selectorEntity|topicEntity)\.signatures\.current/)
		expect(source.match(/<CalldataSignatureResult/g)).toHaveLength(2)
		expect(source).toContain('resource={selectorEntity.signatures}')
		expect(source).toContain('resource={topicEntity.signatures}')
		expect(source.match(/{#snippet Address\(address\)}/g)).toHaveLength(2)
		expect(source).toContain('<EvmAccountView')
		expect(resultSource).toContain('{#snippet children(signatures)}')
		expect(resultSource).toContain('decodeCalldataWithSignature(')
		expect(resultSource).toContain('decodeEventDataWithSignature(')
	})
})

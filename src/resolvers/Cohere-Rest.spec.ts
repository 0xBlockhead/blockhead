import { expect, it } from 'vitest'
import bindings from '$/sources/Cohere/bindings.ts'
import { Source } from '$/sources/Source.ts'

it('preserves Cohere REST provenance on its executable binding', () => {
	expect(bindings[Source.Cohere_Rest]).toHaveLength(1)
	expect(bindings[Source.Cohere_Rest][0].source).toBe(Source.Cohere_Rest)
})

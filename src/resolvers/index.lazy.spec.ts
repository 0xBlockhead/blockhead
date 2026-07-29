import { expect, it } from 'vitest'

import { loadResolvers } from '$/resolvers/index.ts'
import { Source } from '$/sources/Source.ts'


it('loads only enabled resolver modules in canonical APP order', async () => {
	await expect(loadResolvers(new Set([
		Source.Local_Internal,
		Source.Constants_Internal,
	]))).resolves.toMatchObject([
		{ source: Source.Constants_Internal },
		{ source: Source.Local_Internal },
	])
})

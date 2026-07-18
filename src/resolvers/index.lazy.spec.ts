import { expect, it } from 'vitest'

import constantsResolver from '$/resolvers/Constants.ts'
import {
	loadResolverEntries,
	loadResolvers,
} from '$/resolvers/index.ts'
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

it('rejects an executed loader whose module source disagrees with its APP entry', async () => {
	await expect(loadResolverEntries([
		[Source.Local_Internal, async () => ({ default: constantsResolver })],
	], new Set([Source.Local_Internal]))).rejects.toThrow(
		`Resolver module source mismatch: expected ${Source.Local_Internal}, received ${Source.Constants_Internal}`
	)
})

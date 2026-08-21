import { expect, it } from 'vitest'

import { loadResolvers } from '$/resolvers/index.ts'
import { Source } from '$/sources/Source.ts'


it('loads only enabled resolver modules in canonical APP order', { timeout: 60_000 }, async () => {
	await expect(loadResolvers(new Set([
		Source.Local_Internal,
		Source.Constants_Internal,
		Source.ZcashLightwalletd_Grpc,
	]))).resolves.toMatchObject([
		{ source: Source.Constants_Internal },
		{ source: Source.Local_Internal },
		{ source: Source.ZcashLightwalletd_Grpc },
	])
})

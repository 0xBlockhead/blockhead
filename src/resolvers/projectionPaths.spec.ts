import {
	describe,
	expect,
	it,
} from 'vitest'

import { validateResolverDefinitions } from '$/resolvers/$resolvers.ts'
import { loadResolvers } from '$/resolvers/index.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'


describe('resolver projection paths', () => {
	it('has no unknown projection path or unknown entity mismatches', async () => {
		const modules = await loadResolvers(new Set(Object.values(Source)))
		const errors: string[] = []
		for (const mod of modules) {
			try {
				validateResolverDefinitions(
					schema,
					mod.resolvers.map((resolver) => ({
						...resolver,
						source: mod.source,
					}))
				)
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error)
				if (
					message.includes('unknown projection path')
					|| message.includes('unknown entity')
					|| message.includes('unknown selector')
				)
					errors.push(`${mod.source}: ${message}`)
			}
		}
		expect(errors).toEqual([])
	}, 180_000)
})

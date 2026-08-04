import {
	describe,
	expect,
	it,
} from 'vitest'

import { Source } from '$/sources/Source.ts'

const { default: morphoGraphql } = await import('$/resolvers/Morpho-Graphql.ts')

describe('Morpho GraphQL resolver module', () => {
	it('registers the source pending APP Network facet wiring', () => {
		expect(morphoGraphql.source).toBe(Source.Morpho_Graphql)
		expect(morphoGraphql.resolvers).toEqual([])
	})
})

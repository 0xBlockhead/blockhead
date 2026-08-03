// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const cashuMintRestSources = [
	Source.CashuMint_Rest,
] as const

export default entity({
	entityType: EntityType.CashuMint,
	labels: {
		singular: 'Cashu mint',
		plural: 'Cashu mints',
	},
})({
	mintUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$keysets: {
		entityType: EntityType.CashuKeyset,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: cashuMintRestSources,
	},
	$$timestamps: {
		entityType: EntityType.CashuMint_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: cashuMintRestSources,
	},
})({
	selectors: {
		MintUrl: [
			'mintUrl',
		],
	},
})

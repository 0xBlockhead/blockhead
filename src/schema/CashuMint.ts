// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CashuMint,
	labels: {
		singular: 'Cashu mint',
		plural: 'Cashu mints',
	},
})({
	mintUrl: {
		label: 'mint URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$keysets: {
		label: 'keysets',
		entityType: EntityType.CashuKeyset,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.CashuMint_Rest,
		],
	},
	$$timestamps: {
		label: 'Observations',
		entityType: EntityType.CashuMint_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.CashuMint_Rest,
		],
	},
})({
	selectors: {
		MintUrl: [
			'mintUrl',
		],
	},
})

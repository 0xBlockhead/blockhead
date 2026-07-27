// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$keysets: {
		label: 'keysets',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CashuKeyset,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.CashuMint_Rest,
		],
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
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

// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'

export default entity({
	entityType: EntityType.CashuMint,
	labels: {
		singular: 'Cashu mint',
		plural: 'Cashu mints',
	},
})({
	mintUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	$$keysets: {
		entityType: EntityType.CashuKeyset,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.CashuMint_Rest,
		],
	},
	$$timestamps: {
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

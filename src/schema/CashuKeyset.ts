// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CashuKeyset,
	labels: {
		singular: 'Cashu keyset',
		plural: 'Cashu keysets',
	},
})({
	$mint: {
		entityType: EntityType.CashuMint,
		cardinality: EntityFieldCardinality.One,
	},
	keysetId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	unit: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CashuMint_Rest,
		],
	},
	keysByAmountJson: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CashuMint_Rest,
		],
	},
	$$timestamps: {
		entityType: EntityType.CashuKeyset_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.CashuMint_Rest,
		],
	},
})({
	selectors: {
		CashuMintKeysetId: [
			'$mint',
			'keysetId',
		],
	},
})

// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		label: 'mint',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CashuMint,
		cardinality: EntityFieldCardinality.One,
	},
	keysetId: {
		label: 'keyset ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	unit: {
		label: 'unit',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CashuMint_Rest,
		],
	},
	keysByAmountJson: {
		label: 'keys by amount JSON',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CashuMint_Rest,
		],
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
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

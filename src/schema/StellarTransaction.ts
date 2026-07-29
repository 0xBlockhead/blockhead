// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.StellarTransaction,
	labels: {
		singular: 'stellar transaction',
		plural: 'stellar transactions',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		label: 'Hash',
		description: 'The hash that identifies this object in its protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sourceAccount: {
		label: 'source account',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.StellarTransaction_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$operations: {
		label: 'operations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.StellarOperation,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkHash: [
			'$network',
			'hash',
		],
	},
})

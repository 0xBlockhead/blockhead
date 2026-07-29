// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TezosBigMapKey,
	labels: {
		singular: 'tezos big map key',
		plural: 'tezos big map keys',
	},
})({
	$bigMap: {
		label: 'big map',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TezosBigMap,
		cardinality: EntityFieldCardinality.One,
	},
	keyHash: {
		label: 'key hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$updates: {
		label: 'updates',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosBigMapDiff,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosBigMapKey_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		BigMapKeyHash: [
			'$bigMap',
			'keyHash',
		],
	},
})

// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.TezosBigMap,
		cardinality: EntityFieldCardinality.One,
	},
	keyHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$updates: {
		entityType: EntityType.TezosBigMapDiff,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
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

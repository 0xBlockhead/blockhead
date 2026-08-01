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
		label: 'big map',
		entityType: EntityType.TezosBigMap,
		cardinality: EntityFieldCardinality.One,
	},
	keyHash: {
		label: 'key hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$updates: {
		label: 'updates',
		entityType: EntityType.TezosBigMapDiff,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
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

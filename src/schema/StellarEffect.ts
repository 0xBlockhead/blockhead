// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.StellarEffect,
	labels: {
		singular: 'stellar effect',
		plural: 'stellar effects',
	},
})({
	$network: {
		entityType: EntityType.StellarNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	effectId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	effectType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	account: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	body: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkEffectId: [
			'$network',
			'effectId',
		],
	},
})

// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BalancerPoolAprItem,
	labels: {
		singular: 'Balancer pool APR item',
		plural: 'Balancer pool APR items',
	},
	description: 'One titled APR component on a Balancer pool snapshot (dynamicData.aprItems).',
})({
	$pool: {
		entityType: EntityType.BalancerPool,
		cardinality: EntityFieldCardinality.One,
	},
	title: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	aprType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	apr: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
})({
	selectors: {
		PoolTitleAprType: [
			'$pool',
			'title',
			'aprType',
		],
	},
})

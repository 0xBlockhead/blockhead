// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CosmosModule,
	labels: {
		singular: 'Cosmos module',
		plural: 'Cosmos modules',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	moduleName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$authority: {
		entityType: EntityType.CosmosAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkModuleName: [
			'$network',
			'moduleName',
		],
	},
})

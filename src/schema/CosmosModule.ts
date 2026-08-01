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
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	moduleName: {
		label: 'Module name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$authority: {
		label: 'Authority',
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

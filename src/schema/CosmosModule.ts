// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CosmosModuleSelector {
	NetworkModuleName = 'NetworkModuleName',
}
export const CosmosModule = entity({
	entityType: EntityType.CosmosModule,
	label: 'Cosmos module',
	labelPlural: 'Cosmos modules',
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	moduleName: {
		label: 'Module name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$authority: {
		label: 'Authority',
		type: EntityFieldType.EntityReference,
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

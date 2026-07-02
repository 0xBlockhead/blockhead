// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CosmosModuleSelector {
	NetworkModuleName = 'NetworkModuleName',
}
export default {
	entityType: EntityType.CosmosModule,
	label: 'Cosmos module',
	labelPlural: 'Cosmos modules',
	selectors: [
		{
			name: CosmosModuleSelector.NetworkModuleName,
			fields: [
				'$network',
				'moduleName',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'moduleName',
				label: 'Module name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$authority',
				label: 'Authority',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.CosmosAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

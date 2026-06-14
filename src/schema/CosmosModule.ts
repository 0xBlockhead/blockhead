import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum CosmosModuleSelector {
	NetworkModuleName = 'networkModuleName',
}

export default {
	entityType: EntityType.CosmosModule,

	label: 'Cosmos Module',
	labelPlural: 'Cosmos Modules',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'moduleName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$authority',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

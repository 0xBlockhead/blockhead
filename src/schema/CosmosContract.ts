import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum CosmosContractSelector {
	NetworkAddress = 'networkAddress',
}

export default {
	entityType: EntityType.CosmosContract,

	label: 'CosmWasm Contract',
	labelPlural: 'CosmWasm Contracts',

	selectors: [
		{
			name: CosmosContractSelector.NetworkAddress,
			fields: [
				'$network',
				'address',
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
			name: 'address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'codeId',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$creator',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$admin',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

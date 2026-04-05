import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export enum BridgeRouteTag {
	Best = 'BEST',
	Cheapest = 'CHEAPEST',
	Fastest = 'FASTEST',
	Recommended = 'RECOMMENDED',
}

export default {
	entityType: EntityType.BridgeRoute,

	label: 'Bridge Route',

	id: type({
		id: 'string',
	}),

	fields: [
		{
			name: '$$steps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BridgeRouteStep,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$fromNetwork',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$toNetwork',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'fromAmount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'toAmount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'toAmountMin',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'gasCostUsd',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'estimatedDurationSeconds',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'tags',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(BridgeRouteTag).array(),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

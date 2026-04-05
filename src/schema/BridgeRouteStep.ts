import { type } from 'arktype'
import BridgeRoute from '$/schema/BridgeRoute.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export default {
	entityType: EntityType.BridgeRouteStep,

	label: 'Bridge Route Step',

	id: type({
		$route: BridgeRoute.id,
		index: 'number',
	}),

	fields: [
		{
			name: 'stepType',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tool',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$fromNetwork',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$toNetwork',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$fromToken',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CoinInstance,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$toToken',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CoinInstance,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

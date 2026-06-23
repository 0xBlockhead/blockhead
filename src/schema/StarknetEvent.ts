import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum StarknetEventSelector {
	TransactionEventIndex = '$transaction+eventIndex',
}
export default {
	entityType: EntityType.StarknetEvent,
	label: 'starknet event',
	labelPlural: 'starknet events',
	selectors: [
		{
			name: StarknetEventSelector.TransactionEventIndex,
			fields: [
				'$transaction',
				'eventIndex',
			],
		},
	],
	fields: [
		{
			name: '$transaction',
			label: 'transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StarknetTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'eventIndex',
			label: 'event index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$fromContract',
			label: 'from contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StarknetContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'keys',
			label: 'keys',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'data',
			label: 'data',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

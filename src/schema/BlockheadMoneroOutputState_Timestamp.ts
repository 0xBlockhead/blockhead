import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadMoneroOutputState_TimestampSelector {
	OutputStateTimestampMsSource = '$outputState+timestampMs+source',
}
export default {
	entityType: EntityType.BlockheadMoneroOutputState_Timestamp,
	label: 'blockhead monero output state timestamp',
	labelPlural: 'blockhead monero output state observations',
	selectors: [
		{
			name: BlockheadMoneroOutputState_TimestampSelector.OutputStateTimestampMsSource,
			fields: [
				'$outputState',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$outputState',
			label: 'output state',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadMoneroOutputState,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'spent',
			label: 'spent',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'unlocked',
			label: 'unlocked',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'confirmations',
			label: 'confirmations',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'exportHeight',
			label: 'export height',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lastCheckedAt',
			label: 'last checked AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

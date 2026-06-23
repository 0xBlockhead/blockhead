import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum ElementsPeg_TimestampSelector {
	PegTimestampMsSource = '$peg+timestampMs+source',
}
export default {
	entityType: EntityType.ElementsPeg_Timestamp,
	label: 'elements peg timestamp',
	labelPlural: 'elements peg observations',
	selectors: [
		{
			name: ElementsPeg_TimestampSelector.PegTimestampMsSource,
			fields: [
				'$peg',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$peg',
			label: 'peg',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ElementsPeg,
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
			name: 'status',
			label: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
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
			name: 'observedBitcoinHeight',
			label: 'observed Bitcoin height',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'observedElementsHeight',
			label: 'observed elements height',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

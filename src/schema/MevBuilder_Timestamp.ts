import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum MevBuilder_TimestampSelector {
	BuilderTimestampMsSource = '$builder+timestampMs+source',
}
export default {
	entityType: EntityType.MevBuilder_Timestamp,
	label: 'mev builder timestamp',
	labelPlural: 'mev builder observations',
	selectors: [
		{
			name: MevBuilder_TimestampSelector.BuilderTimestampMsSource,
			fields: [
				'$builder',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$builder',
			label: 'builder',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MevBuilder,
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
			name: 'deliveredPayloadCount',
			label: 'delivered payload count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'deliveredValueWei',
			label: 'delivered value wei',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'relayCount',
			label: 'relay count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'windowStartSlot',
			label: 'window start slot',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'windowEndSlot',
			label: 'window end slot',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sampleLimit',
			label: 'sample limit',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

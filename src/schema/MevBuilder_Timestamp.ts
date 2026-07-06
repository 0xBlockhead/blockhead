// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum MevBuilder_TimestampSelector {
	BuilderTimestampMsSource = 'BuilderTimestampMsSource',
}
export default {
	entityType: EntityType.MevBuilder_Timestamp,
	label: 'MEV builder timestamp',
	labelPlural: 'MEV builder observations',
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
			label: 'Builder',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MevBuilder,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'deliveredPayloadCount',
			label: 'Delivered payload count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'deliveredValueWei',
			label: 'Delivered value',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'relayCount',
			label: 'Relay count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'windowStartSlot',
			label: 'Window start slot',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'windowEndSlot',
			label: 'Window end slot',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sampleLimit',
			label: 'Sample limit',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum MevRelay_TimestampSelector {
	RelayTimestampMsSource = 'RelayTimestampMsSource',
}
export default {
	entityType: EntityType.MevRelay_Timestamp,
	label: 'MEV relay timestamp',
	labelPlural: 'MEV relay observations',
	selectors: [
		{
			name: MevRelay_TimestampSelector.RelayTimestampMsSource,
			fields: [
				'$relay',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$relay',
				label: 'Relay',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.MevRelay,
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
				name: 'reachable',
				label: 'Reachable',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'statusCode',
				label: 'Status code',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'deliveredPayloadSampleCount',
				label: 'Delivered payload sample count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'builderSampleCount',
				label: 'Builder sample count',
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
		{
				name: 'error',
				label: 'Error',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

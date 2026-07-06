// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum LightningChannel_TimestampSelector {
	ChannelTimestampMsSource = 'ChannelTimestampMsSource',
}
export default {
	entityType: EntityType.LightningChannel_Timestamp,
	label: 'Lightning channel timestamp',
	labelPlural: 'Lightning channel observations',
	selectors: [
		{
			name: LightningChannel_TimestampSelector.ChannelTimestampMsSource,
			fields: [
				'$channel',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$channel',
			label: 'Channel',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LightningChannel,
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
			name: 'status',
			label: 'Status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.LightningLnd_Rest,
			],
		},
		{
			name: 'capacitySats',
			label: 'Capacity sats',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.LightningLnd_Rest,
			],
		},
		{
			name: 'feeRatePpm',
			label: 'Fee rate ppm',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
			],
		},
		{
			name: 'updatedAtMs',
			label: 'Updated',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.LightningLnd_Rest,
			],
		},
		{
			name: 'closingTransactionId',
			label: 'Closing transaction ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.LightningLnd_Rest,
			],
		},
		{
			name: 'closingFeeSats',
			label: 'Closing fee sats',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.LightningLnd_Rest,
			],
		},
		{
			name: 'closingReason',
			label: 'Closing reason',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.LightningLnd_Rest,
			],
		},
		{
			name: 'closedAtMs',
			label: 'Closed',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.LightningLnd_Rest,
			],
		},
	],
} as const satisfies EntityDefinition

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum BlockheadLightningPayment_TimestampSelector {
	PaymentTimestampMsSource = 'PaymentTimestampMsSource',
}
export default {
	entityType: EntityType.BlockheadLightningPayment_Timestamp,
	label: 'Lightning payment timestamp',
	labelPlural: 'Lightning payment observations',
	selectors: [
		{
			name: BlockheadLightningPayment_TimestampSelector.PaymentTimestampMsSource,
			fields: [
				'$payment',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$payment',
				label: 'Payment',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadLightningPayment,
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
					Source.LightningLnd_Rest,
				],
		},
		{
				name: 'feeMsat',
				label: 'Fee msat',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.LightningLnd_Rest,
				],
		},
		{
				name: 'failureReason',
				label: 'Failure reason',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.LightningLnd_Rest,
				],
		},
		{
				name: 'preimage',
				label: 'Preimage',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.LightningLnd_Rest,
				],
		},
	],
} as const satisfies EntityDefinition

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum BlockheadLightningInvoice_TimestampSelector {
	InvoiceTimestampMsSource = 'InvoiceTimestampMsSource',
}
export default {
	entityType: EntityType.BlockheadLightningInvoice_Timestamp,
	label: 'Lightning invoice timestamp',
	labelPlural: 'Lightning invoice observations',
	selectors: [
		{
			name: BlockheadLightningInvoice_TimestampSelector.InvoiceTimestampMsSource,
			fields: [
				'$invoice',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$invoice',
			label: 'Invoice',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadLightningInvoice,
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
			name: 'state',
			label: 'State',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningLnd_Rest,
			],
		},
		{
			name: 'amountPaidMsat',
			label: 'Amount paid msat',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningLnd_Rest,
			],
		},
		{
			name: 'settledAtMs',
			label: 'Settled',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningLnd_Rest,
			],
		},
		{
			name: 'settleIndex',
			label: 'Settle index',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningLnd_Rest,
			],
		},
	],
} as const satisfies EntityDefinition

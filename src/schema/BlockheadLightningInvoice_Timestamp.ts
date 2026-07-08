// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum BlockheadLightningInvoice_TimestampSelector {
	InvoiceTimestampMsSource = 'InvoiceTimestampMsSource',
}
export const BlockheadLightningInvoice_Timestamp = entity({
	entityType: EntityType.BlockheadLightningInvoice_Timestamp,
	label: 'Lightning invoice timestamp',
	labelPlural: 'Lightning invoice observations',
})({
	$invoice: {
		label: 'Invoice',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadLightningInvoice,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	state: {
		label: 'State',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningLnd_Rest,
		],
	},
	amountPaidMsat: {
		label: 'Amount paid msat',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningLnd_Rest,
		],
	},
	settledAtMs: {
		label: 'Settled',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningLnd_Rest,
		],
	},
	settleIndex: {
		label: 'Settle index',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningLnd_Rest,
		],
	},
})({
	selectors: {
		InvoiceTimestampMsSource: [
			'$invoice',
			'timestampMs',
			'source',
		],
	},
})

import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadLightningInvoice_TimestampSelector {
	InvoiceTimestampMsSource = '$invoice+timestampMs+source',
}
export default {
	entityType: EntityType.BlockheadLightningInvoice_Timestamp,
	label: 'blockhead Lightning invoice timestamp',
	labelPlural: 'blockhead Lightning invoice observations',
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
			label: 'invoice',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadLightningInvoice,
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
			name: 'state',
			label: 'state',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'amountPaidMsat',
			label: 'amount paid msat',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'settledAtMs',
			label: 'settled AT ms',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'settleIndex',
			label: 'settle index',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

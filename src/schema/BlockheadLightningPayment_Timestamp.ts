import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadLightningPayment_TimestampSelector {
	PaymentTimestampMsSource = '$payment+timestampMs+source',
}
export default {
	entityType: EntityType.BlockheadLightningPayment_Timestamp,
	label: 'blockhead Lightning payment timestamp',
	labelPlural: 'blockhead Lightning payment observations',
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
			label: 'payment',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadLightningPayment,
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
			name: 'feeMsat',
			label: 'fee msat',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'failureReason',
			label: 'failure reason',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'preimage',
			label: 'preimage',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum KaspaAddress_TimestampSelector {
	AddressTimestampMsSource = 'AddressTimestampMsSource',
}
export default {
	entityType: EntityType.KaspaAddress_Timestamp,
	label: 'kaspa address timestamp',
	labelPlural: 'kaspa address observations',
	selectors: [
		{
			name: KaspaAddress_TimestampSelector.AddressTimestampMsSource,
			fields: [
				'$address',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$address',
			label: 'Address',
			description: 'The address or account identifier used by the source protocol.',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.KaspaAddress,
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
			name: 'balanceSompi',
			label: 'balance sompi',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'utxoCount',
			label: 'UTXO count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transactionCount',
			label: 'transaction count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

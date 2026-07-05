// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StellarTrustline_TimestampSelector {
	TrustlineTimestampMsSource = 'TrustlineTimestampMsSource',
}
export default {
	entityType: EntityType.StellarTrustline_Timestamp,
	label: 'stellar trustline timestamp',
	labelPlural: 'stellar trustline observations',
	selectors: [
		{
			name: StellarTrustline_TimestampSelector.TrustlineTimestampMsSource,
			fields: [
				'$trustline',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$trustline',
				label: 'trustline',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.StellarTrustline,
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
				name: 'ledgerSequence',
				label: 'ledger sequence',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'balance',
				label: 'balance',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'limit',
				label: 'limit',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'buyingLiabilities',
				label: 'buying liabilities',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'sellingLiabilities',
				label: 'selling liabilities',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'authorized',
				label: 'authorized',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'authorizedToMaintainLiabilities',
				label: 'authorized to maintain liabilities',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'clawbackEnabled',
				label: 'clawback enabled',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

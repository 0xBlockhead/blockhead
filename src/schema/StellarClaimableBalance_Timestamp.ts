// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StellarClaimableBalance_TimestampSelector {
	ClaimableBalanceTimestampMsSource = 'ClaimableBalanceTimestampMsSource',
}
export default {
	entityType: EntityType.StellarClaimableBalance_Timestamp,
	label: 'stellar claimable balance timestamp',
	labelPlural: 'stellar claimable balance observations',
	selectors: [
		{
			name: StellarClaimableBalance_TimestampSelector.ClaimableBalanceTimestampMsSource,
			fields: [
				'$claimableBalance',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$claimableBalance',
			label: 'claimable balance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StellarClaimableBalance,
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
			name: '$asset',
			label: 'asset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StellarAsset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'amount',
			label: 'amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sponsor',
			label: 'sponsor',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'claimants',
			label: 'claimants',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$claimedByTransaction',
			label: 'claimed by transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StellarTransaction,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'deleted',
			label: 'deleted',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

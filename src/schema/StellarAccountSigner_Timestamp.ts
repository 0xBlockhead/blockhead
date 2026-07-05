// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StellarAccountSigner_TimestampSelector {
	SignerTimestampMsSource = 'SignerTimestampMsSource',
}
export default {
	entityType: EntityType.StellarAccountSigner_Timestamp,
	label: 'stellar account signer timestamp',
	labelPlural: 'stellar account signer observations',
	selectors: [
		{
			name: StellarAccountSigner_TimestampSelector.SignerTimestampMsSource,
			fields: [
				'$signer',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$signer',
				label: 'signer',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.StellarAccountSigner,
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
				name: 'weight',
				label: 'weight',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
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
				name: 'active',
				label: 'active',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

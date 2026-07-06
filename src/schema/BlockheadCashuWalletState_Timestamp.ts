// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadCashuWalletState_TimestampSelector {
	WalletStateTimestampMsSource = 'WalletStateTimestampMsSource',
}
export default {
	entityType: EntityType.BlockheadCashuWalletState_Timestamp,
	label: 'blockhead Cashu wallet state timestamp',
	labelPlural: 'blockhead Cashu wallet state observations',
	selectors: [
		{
			name: BlockheadCashuWalletState_TimestampSelector.WalletStateTimestampMsSource,
			fields: [
				'$walletState',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$walletState',
			label: 'wallet state',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadCashuWalletState,
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
			name: 'balance',
			label: 'balance',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'proofCount',
			label: 'proof count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'unspentProofCount',
			label: 'unspent proof count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'pendingProofCount',
			label: 'pending proof count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'spentProofCount',
			label: 'spent proof count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'activeKeysetCount',
			label: 'active keyset count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'pendingMintQuoteCount',
			label: 'pending mint quote count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'pendingMeltQuoteCount',
			label: 'pending melt quote count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tokenCount',
			label: 'token count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lastSyncedAt',
			label: 'last synced AT',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

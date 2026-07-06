// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadCashuMeltQuoteSelector {
	MintMethodQuoteId = 'MintMethodQuoteId',
}
export default {
	entityType: EntityType.BlockheadCashuMeltQuote,
	label: 'blockhead Cashu melt quote',
	labelPlural: 'blockhead Cashu melt quotes',
	selectors: [
		{
			name: BlockheadCashuMeltQuoteSelector.MintMethodQuoteId,
			fields: [
				'$mint',
				'method',
				'quoteId',
			],
		},
	],
	fields: [
		{
			name: '$mint',
			label: 'mint',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CashuMint,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'method',
			label: 'method',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'quoteId',
			label: 'quote ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'request',
			label: 'request',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'amount',
			label: 'amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'unit',
			label: 'unit',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'feeReserve',
			label: 'fee reserve',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$walletState',
			label: 'wallet state',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadCashuWalletState,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$inputProofs',
			label: 'input proofs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadCashuProof,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadCashuMeltQuote_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

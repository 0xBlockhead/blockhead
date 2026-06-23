import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadCashuMintQuoteSelector {
	MintMethodQuoteId = '$mint+method+quoteId',
}
export default {
	entityType: EntityType.BlockheadCashuMintQuote,
	label: 'blockhead Cashu mint quote',
	labelPlural: 'blockhead Cashu mint quotes',
	selectors: [
		{
			name: BlockheadCashuMintQuoteSelector.MintMethodQuoteId,
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
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'quoteId',
			label: 'quote ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'request',
			label: 'request',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'unit',
			label: 'unit',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'amount',
			label: 'amount',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
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
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadCashuMintQuote_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadCashuWalletStateSelector {
	WalletIdMintUrlUnit = 'walletId+mintUrl+unit',
}
export default {
	entityType: EntityType.BlockheadCashuWalletState,
	label: 'blockhead Cashu wallet state',
	labelPlural: 'blockhead Cashu wallet states',
	selectors: [
		{
			name: BlockheadCashuWalletStateSelector.WalletIdMintUrlUnit,
			fields: [
				'walletId',
				'mintUrl',
				'unit',
			],
		},
	],
	fields: [
		{
			name: 'walletId',
			label: 'wallet ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$wallet',
			label: 'wallet',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadWallet,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$mint',
			label: 'mint',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CashuMint,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'unit',
			label: 'unit',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadCashuWalletState_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$proofs',
			label: 'proofs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadCashuProof,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$tokens',
			label: 'tokens',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadCashuToken,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$mintQuotes',
			label: 'mint quotes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadCashuMintQuote,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$meltQuotes',
			label: 'melt quotes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadCashuMeltQuote,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

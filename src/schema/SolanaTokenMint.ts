import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum SolanaTokenMintSelector {
	NetworkMintAddress = 'networkMintAddress',
}
export default {
	entityType: EntityType.SolanaTokenMint,
	label: 'solana token mint',
	labelPlural: 'solana token mints',
	selectors: [
		{
			name: SolanaTokenMintSelector.NetworkMintAddress,
			fields: [
				'$network',
				'mintAddress',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'mintAddress',
			label: 'mint address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$tokenAccounts',
			label: 'token accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaTokenAccount,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaTokenMint_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

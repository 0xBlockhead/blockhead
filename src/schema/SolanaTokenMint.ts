// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SolanaTokenMintSelector {
	NetworkMintAddress = 'NetworkMintAddress',
}
export default {
	entityType: EntityType.SolanaTokenMint,
	label: 'solana token mint',
	labelPlural: 'Solana token mints',
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
			label: 'Network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'mintAddress',
			label: 'Mint address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'supply',
			label: 'Supply',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'decimals',
			label: 'Decimals',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaTokenMint_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$tokenAccounts',
			label: 'Token accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaTokenAccount,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

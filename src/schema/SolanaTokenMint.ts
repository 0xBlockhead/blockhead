// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SolanaTokenMintSelector {
	NetworkMintAddress = 'NetworkMintAddress',
}
export const SolanaTokenMint = entity({
	entityType: EntityType.SolanaTokenMint,
	labels: {
		singular: 'solana token mint',
		plural: 'Solana token mints',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	mintAddress: {
		label: 'Mint address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	supply: {
		label: 'Supply',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	decimals: {
		label: 'Decimals',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SolanaTokenMint_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokenAccounts: {
		label: 'Token accounts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SolanaTokenAccount,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkMintAddress: [
			'$network',
			'mintAddress',
		],
	},
})

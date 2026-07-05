// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SolanaTokenAccountSelector {
	NetworkTokenAccountPubkey = 'NetworkTokenAccountPubkey',
}
export default {
	entityType: EntityType.SolanaTokenAccount,
	label: 'solana token account',
	labelPlural: 'Solana token accounts',
	selectors: [
		{
			name: SolanaTokenAccountSelector.NetworkTokenAccountPubkey,
			fields: [
				'$network',
				'tokenAccountPubkey',
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
				name: 'tokenAccountPubkey',
				label: 'Token account public key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$account',
				label: 'Account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.SolanaAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$mint',
				label: 'Mint',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.SolanaTokenMint,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$owner',
				label: 'Owner',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.SolanaAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$delegate',
				label: 'Delegate',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.SolanaAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$closeAuthority',
				label: 'Close authority',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.SolanaAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SolanaTokenAccount_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

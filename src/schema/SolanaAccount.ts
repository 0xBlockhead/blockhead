// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SolanaAccountSelector {
	NetworkPubkey = 'NetworkPubkey',
}
export default {
	entityType: EntityType.SolanaAccount,
	label: 'solana account',
	labelPlural: 'Solana accounts',
	selectors: [
		{
			name: SolanaAccountSelector.NetworkPubkey,
			fields: [
				'$network',
				'pubkey',
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
				name: 'pubkey',
				label: 'Public key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'lamports',
				label: 'Lamports',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'rentEpoch',
				label: 'Rent epoch',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'executable',
				label: 'Executable',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'dataEncoding',
				label: 'Data encoding',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$ownerProgram',
				label: 'Owner program',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.SolanaProgram,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
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

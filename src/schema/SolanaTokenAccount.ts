import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum SolanaTokenAccountSelector {
	NetworkTokenAccountPubkey = '$network+tokenAccountPubkey',
}
export default {
	entityType: EntityType.SolanaTokenAccount,
	label: 'solana token account',
	labelPlural: 'solana token accounts',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'tokenAccountPubkey',
			label: 'token account public key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$account',
			label: 'account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SolanaAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$mint',
			label: 'mint',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SolanaTokenMint,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$owner',
			label: 'owner',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SolanaAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$delegate',
			label: 'delegate',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SolanaAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$closeAuthority',
			label: 'close authority',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SolanaAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaTokenAccount_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

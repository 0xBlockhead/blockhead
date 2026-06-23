import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum SolanaAccountSelector {
	NetworkPubkey = 'networkPubkey',
}
export default {
	entityType: EntityType.SolanaAccount,
	label: 'solana account',
	labelPlural: 'solana accounts',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'pubkey',
			label: 'public key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$ownerProgram',
			label: 'owner program',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SolanaProgram,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaAccount_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$tokenAccounts',
			label: 'token accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaTokenAccount,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

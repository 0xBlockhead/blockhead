// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SolanaAccountSelector {
	NetworkPubkey = 'NetworkPubkey',
}
export const SolanaAccount = entity({
	entityType: EntityType.SolanaAccount,
	label: 'solana account',
	labelPlural: 'Solana accounts',
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	pubkey: {
		label: 'Public key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	lamports: {
		label: 'Lamports',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rentEpoch: {
		label: 'Rent epoch',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	executable: {
		label: 'Executable',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	dataEncoding: {
		label: 'Data encoding',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$ownerProgram: {
		label: 'Owner program',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SolanaProgram,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SolanaAccount_Timestamp,
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
		NetworkPubkey: [
			'$network',
			'pubkey',
		],
	},
})

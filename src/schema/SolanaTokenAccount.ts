// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SolanaTokenAccount,
	labels: {
		singular: 'solana token account',
		plural: 'Solana token accounts',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	tokenAccountPubkey: {
		label: 'Token account public key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$account: {
		label: 'Account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SolanaAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$mint: {
		label: 'Mint',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SolanaTokenMint,
		cardinality: EntityFieldCardinality.One,
	},
	$owner: {
		label: 'Owner',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SolanaAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$delegate: {
		label: 'Delegate',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SolanaAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$closeAuthority: {
		label: 'Close authority',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SolanaAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SolanaTokenAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkTokenAccountPubkey: [
			'$network',
			'tokenAccountPubkey',
		],
	},
})

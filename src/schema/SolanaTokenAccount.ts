// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	tokenAccountPubkey: {
		label: 'Token account public key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$account: {
		label: 'Account',
		entityType: EntityType.SolanaAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$mint: {
		label: 'Mint',
		entityType: EntityType.SolanaTokenMint,
		cardinality: EntityFieldCardinality.One,
	},
	$owner: {
		label: 'Owner',
		entityType: EntityType.SolanaAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$delegate: {
		label: 'Delegate',
		entityType: EntityType.SolanaAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$closeAuthority: {
		label: 'Close authority',
		entityType: EntityType.SolanaAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
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

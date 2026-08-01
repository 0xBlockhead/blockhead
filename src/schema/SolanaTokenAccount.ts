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
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	tokenAccountPubkey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$account: {
		entityType: EntityType.SolanaAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$mint: {
		entityType: EntityType.SolanaTokenMint,
		cardinality: EntityFieldCardinality.One,
	},
	$owner: {
		entityType: EntityType.SolanaAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$delegate: {
		entityType: EntityType.SolanaAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$closeAuthority: {
		entityType: EntityType.SolanaAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
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

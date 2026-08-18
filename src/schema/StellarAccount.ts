// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.StellarAccount,
	labels: {
		singular: 'stellar account',
		plural: 'stellar accounts',
	},
})({
	$network: {
		entityType: EntityType.StellarNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	accountId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$trustlines: {
		entityType: EntityType.StellarTrustline,
		cardinality: EntityFieldCardinality.Many,
	},
	$$offers: {
		entityType: EntityType.StellarOffer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$trades: {
		entityType: EntityType.StellarTrade,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		entityType: EntityType.StellarTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$operations: {
		entityType: EntityType.StellarOperation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$payments: {
		entityType: EntityType.StellarOperation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$signers: {
		entityType: EntityType.StellarAccountSigner,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		entityType: EntityType.StellarAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAccountId: [
			'$network',
			'accountId',
		],
	},
})

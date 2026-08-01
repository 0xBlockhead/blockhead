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
		label: 'network',
		entityType: EntityType.StellarNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	accountId: {
		label: 'account ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$trustlines: {
		label: 'trustlines',
		entityType: EntityType.StellarTrustline,
		cardinality: EntityFieldCardinality.Many,
	},
	$$offers: {
		label: 'offers',
		entityType: EntityType.StellarOffer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$trades: {
		label: 'trades',
		entityType: EntityType.StellarTrade,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		entityType: EntityType.StellarTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$signers: {
		label: 'signers',
		entityType: EntityType.StellarAccountSigner,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
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

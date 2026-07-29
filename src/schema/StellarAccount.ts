// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	accountId: {
		label: 'account ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$trustlines: {
		label: 'trustlines',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.StellarTrustline,
		cardinality: EntityFieldCardinality.Many,
	},
	$$offers: {
		label: 'offers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.StellarOffer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$trades: {
		label: 'trades',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.StellarTrade,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.StellarTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$signers: {
		label: 'signers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.StellarAccountSigner,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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

// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.StellarOffer,
	labels: {
		singular: 'stellar offer',
		plural: 'stellar offers',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.StellarNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	offerId: {
		label: 'offer ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$seller: {
		label: 'seller',
		entityType: EntityType.StellarAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$sellingAsset: {
		label: 'selling asset',
		entityType: EntityType.StellarAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$buyingAsset: {
		label: 'buying asset',
		entityType: EntityType.StellarAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.StellarOffer_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$trades: {
		label: 'trades',
		entityType: EntityType.StellarTrade,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkOfferId: [
			'$network',
			'offerId',
		],
	},
})

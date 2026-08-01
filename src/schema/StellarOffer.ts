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
		entityType: EntityType.StellarNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	offerId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$seller: {
		entityType: EntityType.StellarAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$sellingAsset: {
		entityType: EntityType.StellarAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$buyingAsset: {
		entityType: EntityType.StellarAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.StellarOffer_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$trades: {
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

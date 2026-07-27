// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	offerId: {
		label: 'offer ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$seller: {
		label: 'seller',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$sellingAsset: {
		label: 'selling asset',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$buyingAsset: {
		label: 'buying asset',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.StellarOffer_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$trades: {
		label: 'trades',
		type: EntityFieldType.EntitiesReference,
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

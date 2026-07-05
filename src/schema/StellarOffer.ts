// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StellarOfferSelector {
	NetworkOfferId = 'NetworkOfferId',
}
export default {
	entityType: EntityType.StellarOffer,
	label: 'stellar offer',
	labelPlural: 'stellar offers',
	selectors: [
		{
			name: StellarOfferSelector.NetworkOfferId,
			fields: [
				'$network',
				'offerId',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.StellarNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'offerId',
				label: 'offer ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$seller',
				label: 'seller',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.StellarAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$sellingAsset',
				label: 'selling asset',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.StellarAsset,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$buyingAsset',
				label: 'buying asset',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.StellarAsset,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.StellarOffer_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$trades',
				label: 'trades',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.StellarTrade,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

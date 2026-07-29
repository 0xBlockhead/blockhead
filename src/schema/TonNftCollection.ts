// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TonNftCollection,
	labels: {
		singular: 'ton NFT collection',
		plural: 'ton NFT collections',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	collectionAddress: {
		label: 'collection address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$account: {
		label: 'account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TonAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$items: {
		label: 'items',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TonNftItem,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transfers: {
		label: 'transfers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TonNftTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TonNftCollection_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkCollectionAddress: [
			'$network',
			'collectionAddress',
		],
	},
})

// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	collectionAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$account: {
		entityType: EntityType.TonAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$items: {
		entityType: EntityType.TonNftItem,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transfers: {
		entityType: EntityType.TonNftTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
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

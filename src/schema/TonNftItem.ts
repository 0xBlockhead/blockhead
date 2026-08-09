// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TonNftItem,
	labels: {
		singular: 'ton NFT item',
		plural: 'ton NFT items',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	itemAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$collection: {
		entityType: EntityType.TonNftCollection,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	itemIndex: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$account: {
		entityType: EntityType.TonAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transfers: {
		entityType: EntityType.TonNftTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		entityType: EntityType.TonNftItem_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkItemAddress: [
			'$network',
			'itemAddress',
		],
		CollectionItemIndex: [
			'$collection',
			'itemIndex',
		],
	},
})

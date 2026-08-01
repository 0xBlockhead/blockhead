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
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	itemAddress: {
		label: 'item address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$collection: {
		label: 'collection',
		entityType: EntityType.TonNftCollection,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	itemIndex: {
		label: 'item index',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$account: {
		label: 'account',
		entityType: EntityType.TonAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transfers: {
		label: 'transfers',
		entityType: EntityType.TonNftTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
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

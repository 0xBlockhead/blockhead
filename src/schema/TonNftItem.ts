// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	itemAddress: {
		label: 'item address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$collection: {
		label: 'collection',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TonNftCollection,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	itemIndex: {
		label: 'item index',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$account: {
		label: 'account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TonAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
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

// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum PolkadotAssetSelector {
	NetworkAssetKindAssetId = 'NetworkAssetKindAssetId',
}
export const PolkadotAsset = entity({
	entityType: EntityType.PolkadotAsset,
	labels: {
		singular: 'Polkadot asset',
		plural: 'Polkadot assets',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	assetKind: {
		label: 'Asset kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	assetId: {
		label: 'Asset ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$balanceTimestamps: {
		label: 'Balance observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.PolkadotAssetBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'Asset observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.PolkadotAsset_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAssetKindAssetId: [
			'$network',
			'assetKind',
			'assetId',
		],
	},
})

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum PolkadotAssetSelector {
	NetworkAssetKindAssetId = 'NetworkAssetKindAssetId',
}
export default {
	entityType: EntityType.PolkadotAsset,
	label: 'Polkadot asset',
	labelPlural: 'Polkadot assets',
	selectors: [
		{
			name: PolkadotAssetSelector.NetworkAssetKindAssetId,
			fields: [
				'$network',
				'assetKind',
				'assetId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'Network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'assetKind',
			label: 'Asset kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'assetId',
			label: 'Asset ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$balanceTimestamps',
			label: 'Balance observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotAssetBalance_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'Asset observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotAsset_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

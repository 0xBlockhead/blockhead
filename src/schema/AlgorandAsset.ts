import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AlgorandAssetSelector {
	NetworkAssetId = '$network+assetId',
}
export default {
	entityType: EntityType.AlgorandAsset,
	label: 'algorand asset',
	labelPlural: 'algorand assets',
	selectors: [
		{
			name: AlgorandAssetSelector.NetworkAssetId,
			fields: [
				'$network',
				'assetId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AlgorandNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'assetId',
			label: 'asset ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'creator',
			label: 'creator',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$holdingRounds',
			label: 'holding rounds',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AlgorandAssetHolding_Round,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AlgorandAsset_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

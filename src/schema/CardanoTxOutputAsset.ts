import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CardanoTxOutputAssetSelector {
	OutputAsset = '$output+$asset',
}
export default {
	entityType: EntityType.CardanoTxOutputAsset,
	label: 'cardano transaction output asset',
	labelPlural: 'cardano transaction output assets',
	selectors: [
		{
			name: CardanoTxOutputAssetSelector.OutputAsset,
			fields: [
				'$output',
				'$asset',
			],
		},
	],
	fields: [
		{
			name: '$output',
			label: 'output',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CardanoTxOutput,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$asset',
			label: 'asset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CardanoNativeAsset,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'quantity',
			label: 'quantity',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition

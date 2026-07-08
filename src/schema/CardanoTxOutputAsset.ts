// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CardanoTxOutputAssetSelector {
	OutputAsset = 'OutputAsset',
}
export const CardanoTxOutputAsset = entity({
	entityType: EntityType.CardanoTxOutputAsset,
	label: 'cardano transaction output asset',
	labelPlural: 'cardano transaction output assets',
})({
	$output: {
		label: 'output',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CardanoTxOutput,
		cardinality: EntityFieldCardinality.One,
	},
	$asset: {
		label: 'asset',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CardanoNativeAsset,
		cardinality: EntityFieldCardinality.One,
	},
	quantity: {
		label: 'quantity',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		OutputAsset: [
			'$output',
			'$asset',
		],
	},
})

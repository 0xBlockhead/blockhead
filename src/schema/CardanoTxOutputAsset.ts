// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CardanoTxOutputAsset,
	labels: {
		singular: 'cardano transaction output asset',
		plural: 'cardano transaction output assets',
	},
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

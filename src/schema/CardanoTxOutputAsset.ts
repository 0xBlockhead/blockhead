// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.CardanoTxOutput,
		cardinality: EntityFieldCardinality.One,
	},
	$asset: {
		entityType: EntityType.CardanoNativeAsset,
		cardinality: EntityFieldCardinality.One,
	},
	quantity: {
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

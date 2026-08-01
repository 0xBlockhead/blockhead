// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SorobanWasm,
	labels: {
		singular: 'soroban Wasm',
		plural: 'soroban Wasm modules',
	},
})({
	$network: {
		entityType: EntityType.StellarNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	wasmHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.SorobanWasm_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$contracts: {
		entityType: EntityType.SorobanContract,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkWasmHash: [
			'$network',
			'wasmHash',
		],
	},
})

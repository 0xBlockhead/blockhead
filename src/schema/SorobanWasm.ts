// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SorobanWasmSelector {
	NetworkWasmHash = 'NetworkWasmHash',
}
export const SorobanWasm = entity({
	entityType: EntityType.SorobanWasm,
	labels: {
		singular: 'soroban Wasm',
		plural: 'soroban Wasm modules',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	wasmHash: {
		label: 'Wasm hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SorobanWasm_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$contracts: {
		label: 'contracts',
		type: EntityFieldType.EntitiesReference,
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

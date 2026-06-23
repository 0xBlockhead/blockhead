import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum SorobanWasmSelector {
	NetworkWasmHash = '$network+wasmHash',
}
export default {
	entityType: EntityType.SorobanWasm,
	label: 'soroban Wasm',
	labelPlural: 'soroban Wasms',
	selectors: [
		{
			name: SorobanWasmSelector.NetworkWasmHash,
			fields: [
				'$network',
				'wasmHash',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StellarNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'wasmHash',
			label: 'Wasm hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SorobanWasm_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$contracts',
			label: 'contracts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SorobanContract,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

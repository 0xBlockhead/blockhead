// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SorobanWasm_TimestampSelector {
	WasmLedgerSequenceSource = 'WasmLedgerSequenceSource',
}
export const SorobanWasm_Timestamp = entity({
	entityType: EntityType.SorobanWasm_Timestamp,
	labels: {
		singular: 'soroban Wasm timestamp',
		plural: 'soroban Wasm observations',
	},
})({
	$wasm: {
		label: 'Wasm',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SorobanWasm,
		cardinality: EntityFieldCardinality.One,
	},
	ledgerSequence: {
		label: 'ledger sequence',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	observedAtMs: {
		label: 'observed AT ms',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	wasmBytes: {
		label: 'Wasm bytes',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	byteLength: {
		label: 'byte length',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	interfaceVersion: {
		label: 'interface version',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	envMeta: {
		label: 'env meta',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	specEntries: {
		label: 'spec entries',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	found: {
		label: 'found',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		WasmLedgerSequenceSource: [
			'$wasm',
			'ledgerSequence',
			'source',
		],
	},
})

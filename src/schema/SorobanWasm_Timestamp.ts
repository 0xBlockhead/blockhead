// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SorobanWasm_TimestampSelector {
	WasmLedgerSequenceSource = 'WasmLedgerSequenceSource',
}
export default {
	entityType: EntityType.SorobanWasm_Timestamp,
	label: 'soroban Wasm timestamp',
	labelPlural: 'soroban Wasm observations',
	selectors: [
		{
			name: SorobanWasm_TimestampSelector.WasmLedgerSequenceSource,
			fields: [
				'$wasm',
				'ledgerSequence',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$wasm',
			label: 'Wasm',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SorobanWasm,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'ledgerSequence',
			label: 'ledger sequence',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'observedAtMs',
			label: 'observed AT ms',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'wasmBytes',
			label: 'Wasm bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'byteLength',
			label: 'byte length',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'interfaceVersion',
			label: 'interface version',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'envMeta',
			label: 'env meta',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'specEntries',
			label: 'spec entries',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'found',
			label: 'found',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SorobanContract_TimestampSelector {
	ContractLedgerSequenceSource = 'ContractLedgerSequenceSource',
}
export default {
	entityType: EntityType.SorobanContract_Timestamp,
	label: 'soroban contract timestamp',
	labelPlural: 'soroban contract observations',
	selectors: [
		{
			name: SorobanContract_TimestampSelector.ContractLedgerSequenceSource,
			fields: [
				'$contract',
				'ledgerSequence',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$contract',
			label: 'contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SorobanContract,
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
			name: 'wasmHash',
			label: 'Wasm hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$wasm',
			label: 'Wasm',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SorobanWasm,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'executableKind',
			label: 'executable kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lastModifiedLedger',
			label: 'last modified ledger',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'liveUntilLedger',
			label: 'live until ledger',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
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

// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SorobanContract_Timestamp,
	labels: {
		singular: 'soroban contract timestamp',
		plural: 'soroban contract observations',
	},
})({
	$contract: {
		label: 'contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SorobanContract,
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
	wasmHash: {
		label: 'Wasm hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$wasm: {
		label: 'Wasm',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SorobanWasm,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	executableKind: {
		label: 'executable kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastModifiedLedger: {
		label: 'last modified ledger',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	liveUntilLedger: {
		label: 'live until ledger',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
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
		ContractLedgerSequenceSource: [
			'$contract',
			'ledgerSequence',
			'source',
		],
	},
})

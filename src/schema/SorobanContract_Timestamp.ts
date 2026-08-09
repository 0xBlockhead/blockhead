// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.SorobanContract,
		cardinality: EntityFieldCardinality.One,
	},
	ledgerSequence: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	observedAtMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	wasmHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$wasm: {
		entityType: EntityType.SorobanWasm,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	executableKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastModifiedLedger: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	liveUntilLedger: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	found: {
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

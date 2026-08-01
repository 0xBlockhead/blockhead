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
		label: 'contract',
		entityType: EntityType.SorobanContract,
		cardinality: EntityFieldCardinality.One,
	},
	ledgerSequence: {
		label: 'ledger sequence',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	observedAtMs: {
		label: 'observed AT ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	wasmHash: {
		label: 'Wasm hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$wasm: {
		label: 'Wasm',
		entityType: EntityType.SorobanWasm,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	executableKind: {
		label: 'executable kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastModifiedLedger: {
		label: 'last modified ledger',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	liveUntilLedger: {
		label: 'live until ledger',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	found: {
		label: 'found',
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

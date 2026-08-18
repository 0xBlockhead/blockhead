// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.StellarLedger,
	labels: {
		singular: 'stellar ledger',
		plural: 'stellar ledgers',
	},
})({
	$network: {
		entityType: EntityType.StellarNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	sequence: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	closeTimeMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.StellarExpert,
		],
	},
	protocolVersion: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	operationCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	successfulTransactionCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	failedTransactionCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transactions: {
		entityType: EntityType.StellarTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$operations: {
		entityType: EntityType.StellarOperation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$effects: {
		entityType: EntityType.StellarEffect,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkSequence: [
			'$network',
			'sequence',
		],
	},
})

// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadAlgorandPendingTransaction,
	labels: {
		singular: 'blockhead algorand pending transaction',
		plural: 'blockhead algorand pending transactions',
	},
})({
	nodeId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	txId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	observedAtMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		entityType: EntityType.AlgorandNetwork,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Nodely,
		],
	},
	sender: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Nodely,
		],
	},
	transactionType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Nodely,
		],
	},
	fee: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Nodely,
		],
	},
	firstValidRound: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Nodely,
		],
	},
	lastValidRound: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Nodely,
		],
	},
	group: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Nodely,
		],
	},
	poolPriority: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Nodely,
		],
	},
	payload: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Nodely,
		],
	},
})({
	selectors: {
		NodeIdTxIdObservedAtMs: [
			'nodeId',
			'txId',
			'observedAtMs',
		],
	},
})

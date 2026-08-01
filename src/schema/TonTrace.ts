// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TonTrace,
	labels: {
		singular: 'ton trace',
		plural: 'ton traces',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	traceId: {
		label: 'trace ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$rootMessage: {
		label: 'root message',
		entityType: EntityType.TonMessage,
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	rootTransactionSelector: {
		label: 'root transaction selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	startedAtMs: {
		label: 'started AT ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.TonTrace_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		entityType: EntityType.TonTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$messages: {
		label: 'messages',
		entityType: EntityType.TonMessage,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkTraceIdSource: [
			'$network',
			'traceId',
			'source',
		],
		RootMessageSource: [
			'$rootMessage',
			'source',
		],
	},
})

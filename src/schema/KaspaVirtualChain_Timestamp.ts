// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.KaspaVirtualChain_Timestamp,
	labels: {
		singular: 'kaspa virtual chain timestamp',
		plural: 'kaspa virtual chain observations',
	},
})({
	$network: {
		entityType: EntityType.KaspaNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	startHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	minConfirmationCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	addedChainBlockHashes: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	removedChainBlockHashes: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	acceptedTransactionCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nextCheckpointHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkStartHashTimestampMsSource: [
			'$network',
			'startHash',
			'timestampMs',
			'source',
		],
	},
})

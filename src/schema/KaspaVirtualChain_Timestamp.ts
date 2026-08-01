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
		label: 'network',
		entityType: EntityType.KaspaNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	startHash: {
		label: 'start hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	minConfirmationCount: {
		label: 'min confirmation count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	addedChainBlockHashes: {
		label: 'added chain block hashes',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	removedChainBlockHashes: {
		label: 'removed chain block hashes',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	acceptedTransactionCount: {
		label: 'accepted transaction count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nextCheckpointHash: {
		label: 'next checkpoint hash',
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

// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.OracleFeed_Round,
	labels: {
		singular: 'oracle feed round',
		plural: 'oracle feed rounds',
	},
})({
	$oracleFeed: {
		label: 'oracle feed',
		entityType: EntityType.OracleFeed,
		cardinality: EntityFieldCardinality.One,
	},
	roundId: {
		label: 'round ID',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	$parentOracleFeed: {
		label: 'parent oracle feed',
		entityType: EntityType.OracleFeed,
		cardinality: EntityFieldCardinality.One,
	},
	answer: {
		label: 'answer',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	startedAtMs: {
		label: 'started AT ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	updatedAtMs: {
		label: 'updated AT ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	answeredInRound: {
		label: 'answered in round',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blockNumber: {
		label: 'Block number',
		description: 'The block height or number in its network.',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionHash: {
		label: 'transaction hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	logIndex: {
		label: 'log index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		OracleFeedRoundId: [
			'$oracleFeed',
			'roundId',
		],
	},
})

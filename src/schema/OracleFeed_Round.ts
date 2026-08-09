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
		entityType: EntityType.OracleFeed,
		cardinality: EntityFieldCardinality.One,
	},
	roundId: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	$parentOracleFeed: {
		entityType: EntityType.OracleFeed,
		cardinality: EntityFieldCardinality.One,
	},
	answer: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	startedAtMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	updatedAtMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	answeredInRound: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blockNumber: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	logIndex: {
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

// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum OracleFeed_RoundSelector {
	OracleFeedRoundId = 'OracleFeedRoundId',
}
export const OracleFeed_Round = entity({
	entityType: EntityType.OracleFeed_Round,
	label: 'oracle feed round',
	labelPlural: 'oracle feed rounds',
})({
	$oracleFeed: {
		label: 'oracle feed',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.OracleFeed,
		cardinality: EntityFieldCardinality.One,
	},
	roundId: {
		label: 'round ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	$parentOracleFeed: {
		label: 'parent oracle feed',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.OracleFeed,
		cardinality: EntityFieldCardinality.One,
	},
	answer: {
		label: 'answer',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	startedAtMs: {
		label: 'started AT ms',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	updatedAtMs: {
		label: 'updated AT ms',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	answeredInRound: {
		label: 'answered in round',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blockNumber: {
		label: 'Block number',
		description: 'The block height or number in its network.',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionHash: {
		label: 'transaction hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	logIndex: {
		label: 'log index',
		type: EntityFieldType.Primitive,
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

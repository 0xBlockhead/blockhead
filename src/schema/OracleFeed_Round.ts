// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum OracleFeed_RoundSelector {
	OracleFeedRoundId = 'OracleFeedRoundId',
}
export default {
	entityType: EntityType.OracleFeed_Round,
	label: 'oracle feed round',
	labelPlural: 'oracle feed rounds',
	selectors: [
		{
			name: OracleFeed_RoundSelector.OracleFeedRoundId,
			fields: [
				'$oracleFeed',
				'roundId',
			],
		},
	],
	fields: [
		{
				name: '$oracleFeed',
				label: 'oracle feed',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.OracleFeed,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'roundId',
				label: 'round ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$parentOracleFeed',
				label: 'parent oracle feed',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.OracleFeed,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'answer',
				label: 'answer',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'startedAtMs',
				label: 'started AT ms',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'updatedAtMs',
				label: 'updated AT ms',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'answeredInRound',
				label: 'answered in round',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetwork,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'blockNumber',
				label: 'Block number',
				description: 'The block height or number in its network.',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'transactionHash',
				label: 'transaction hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'logIndex',
				label: 'log index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

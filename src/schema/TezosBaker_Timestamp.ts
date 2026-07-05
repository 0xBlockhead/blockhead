// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TezosBaker_TimestampSelector {
	BakerLevelSource = 'BakerLevelSource',
}
export default {
	entityType: EntityType.TezosBaker_Timestamp,
	label: 'tezos baker timestamp',
	labelPlural: 'tezos baker observations',
	selectors: [
		{
			name: TezosBaker_TimestampSelector.BakerLevelSource,
			fields: [
				'$baker',
				'level',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$baker',
				label: 'baker',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TezosBaker,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'level',
				label: 'level',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'consensusKey',
				label: 'consensus key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'stakingBalanceMutez',
				label: 'staking balance mutez',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'delegatedBalanceMutez',
				label: 'delegated balance mutez',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'ownDelegatedBalanceMutez',
				label: 'own delegated balance mutez',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'votingPower',
				label: 'voting power',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'active',
				label: 'active',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

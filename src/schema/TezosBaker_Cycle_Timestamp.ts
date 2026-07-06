// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TezosBaker_Cycle_TimestampSelector {
	BakerCycleSource = 'BakerCycleSource',
}
export default {
	entityType: EntityType.TezosBaker_Cycle_Timestamp,
	label: 'tezos baker cycle timestamp',
	labelPlural: 'tezos baker cycle observations',
	selectors: [
		{
			name: TezosBaker_Cycle_TimestampSelector.BakerCycleSource,
			fields: [
				'$baker',
				'cycle',
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
			name: 'cycle',
			label: 'cycle',
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
			name: 'snapshotLevel',
			label: 'snapshot level',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
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
			name: 'expectedBlocks',
			label: 'expected blocks',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'producedBlocks',
			label: 'produced blocks',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'missedBlocks',
			label: 'missed blocks',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'expectedEndorsements',
			label: 'expected endorsements',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'missedEndorsements',
			label: 'missed endorsements',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'rewardsMutez',
			label: 'rewards mutez',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'feesMutez',
			label: 'fees mutez',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

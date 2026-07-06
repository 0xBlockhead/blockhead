// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum EigenLayerReward_TimestampSelector {
	EarnerRewardContextKeyTimestampMsSource = 'EarnerRewardContextKeyTimestampMsSource',
}
export default {
	entityType: EntityType.EigenLayerReward_Timestamp,
	label: 'eigen layer reward timestamp',
	labelPlural: 'eigen layer reward observations',
	selectors: [
		{
			name: EigenLayerReward_TimestampSelector.EarnerRewardContextKeyTimestampMsSource,
			fields: [
				'$earner',
				'rewardContextKey',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$earner',
			label: 'earner',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetworkAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'rewardContextKey',
			label: 'reward context key',
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
			name: '$strategy',
			label: 'strategy',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EigenLayerStrategy,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$operator',
			label: 'operator',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EigenLayerOperator,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$avs',
			label: 'AVS',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EigenLayerAvs,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'rewardToken',
			label: 'reward token',
			type: EntityFieldType.Primitive,
			primitiveType: (EvmAddress),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'rewardAmount',
			label: 'reward amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'cumulativeClaimed',
			label: 'cumulative claimed',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'merkleRoot',
			label: 'merkle root',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'claimProof',
			label: 'claim proof',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'proofRequested',
			label: 'proof requested',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

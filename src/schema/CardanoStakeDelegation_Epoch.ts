// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CardanoStakeDelegation_EpochSelector {
	StakeCredentialEpochSource = 'StakeCredentialEpochSource',
}
export default {
	entityType: EntityType.CardanoStakeDelegation_Epoch,
	label: 'cardano stake delegation epoch',
	labelPlural: 'cardano stake delegation epoches',
	selectors: [
		{
			name: CardanoStakeDelegation_EpochSelector.StakeCredentialEpochSource,
			fields: [
				'$stakeCredential',
				'epoch',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$stakeCredential',
			label: 'stake credential',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CardanoStakeCredential,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'epoch',
			label: 'epoch',
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
			name: '$stakePool',
			label: 'stake pool',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CardanoStakePool,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$drep',
			label: 'drep',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CardanoDRep,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'activeStake',
			label: 'active stake',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
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
			name: 'withdrawalAmount',
			label: 'withdrawal amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'registered',
			label: 'registered',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'deregistered',
			label: 'deregistered',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

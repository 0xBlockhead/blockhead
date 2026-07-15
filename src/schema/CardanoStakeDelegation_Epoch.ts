// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CardanoStakeDelegation_EpochSelector {
	StakeCredentialEpochSource = 'StakeCredentialEpochSource',
}
export const CardanoStakeDelegation_Epoch = entity({
	entityType: EntityType.CardanoStakeDelegation_Epoch,
	labels: {
		singular: 'cardano stake delegation epoch',
		plural: 'cardano stake delegation epoches',
	},
})({
	$stakeCredential: {
		label: 'stake credential',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CardanoStakeCredential,
		cardinality: EntityFieldCardinality.One,
	},
	epoch: {
		label: 'epoch',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$stakePool: {
		label: 'stake pool',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CardanoStakePool,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$drep: {
		label: 'drep',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CardanoDRep,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	activeStake: {
		label: 'active stake',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rewardAmount: {
		label: 'reward amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	withdrawalAmount: {
		label: 'withdrawal amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registered: {
		label: 'registered',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deregistered: {
		label: 'deregistered',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		StakeCredentialEpochSource: [
			'$stakeCredential',
			'epoch',
			'source',
		],
	},
})

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AvalancheDelegatorSelector {
	ValidatorTxId = 'ValidatorTxId',
}
export default {
	entityType: EntityType.AvalancheDelegator,
	label: 'avalanche delegator',
	labelPlural: 'avalanche delegators',
	selectors: [
		{
			name: AvalancheDelegatorSelector.ValidatorTxId,
			fields: [
				'$validator',
				'txId',
			],
		},
	],
	fields: [
		{
				name: '$validator',
				label: 'validator',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AvalancheValidator,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'txId',
				label: 'transaction ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'delegatorAddress',
				label: 'delegator address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'stakeAmountNavax',
				label: 'stake amount navax',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'startTimeMs',
				label: 'start time ms',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'endTimeMs',
				label: 'end time ms',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'rewardOwnerAddresses',
				label: 'reward owner addresses',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'potentialRewardNavax',
				label: 'potential reward navax',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

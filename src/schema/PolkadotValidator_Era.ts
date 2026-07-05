// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum PolkadotValidator_EraSelector {
	ValidatorEraIndexSource = 'ValidatorEraIndexSource',
}
export default {
	entityType: EntityType.PolkadotValidator_Era,
	label: 'polkadot validator era',
	labelPlural: 'polkadot validator eras',
	selectors: [
		{
			name: PolkadotValidator_EraSelector.ValidatorEraIndexSource,
			fields: [
				'$validator',
				'eraIndex',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$validator',
				label: 'validator',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.PolkadotValidator,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'eraIndex',
				label: 'era index',
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
				name: '$controller',
				label: 'controller',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.PolkadotAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'commissionPerBillion',
				label: 'commission per billion',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'totalStakePlancks',
				label: 'total stake plancks',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'ownStakePlancks',
				label: 'own stake plancks',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'nominatorStakePlancks',
				label: 'nominator stake plancks',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'nominatorCount',
				label: 'nominator count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'rewardPoints',
				label: 'reward points',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'active',
				label: 'active',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'slashed',
				label: 'slashed',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum PolkadotValidator_EraSelector {
	ValidatorEraIndexSource = 'ValidatorEraIndexSource',
}
export const PolkadotValidator_Era = entity({
	entityType: EntityType.PolkadotValidator_Era,
	labels: {
		singular: 'polkadot validator era',
		plural: 'polkadot validator eras',
	},
})({
	$validator: {
		label: 'validator',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.PolkadotValidator,
		cardinality: EntityFieldCardinality.One,
	},
	eraIndex: {
		label: 'era index',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$controller: {
		label: 'controller',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.PolkadotAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	commissionPerBillion: {
		label: 'commission per billion',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalStakePlancks: {
		label: 'total stake plancks',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ownStakePlancks: {
		label: 'own stake plancks',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nominatorStakePlancks: {
		label: 'nominator stake plancks',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nominatorCount: {
		label: 'nominator count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rewardPoints: {
		label: 'reward points',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	active: {
		label: 'active',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slashed: {
		label: 'slashed',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ValidatorEraIndexSource: [
			'$validator',
			'eraIndex',
			'source',
		],
	},
})

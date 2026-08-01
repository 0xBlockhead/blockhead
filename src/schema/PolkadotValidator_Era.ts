// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.PolkadotValidator_Era,
	labels: {
		singular: 'polkadot validator era',
		plural: 'polkadot validator eras',
	},
})({
	$validator: {
		label: 'validator',
		entityType: EntityType.PolkadotValidator,
		cardinality: EntityFieldCardinality.One,
	},
	eraIndex: {
		label: 'era index',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$controller: {
		label: 'controller',
		entityType: EntityType.PolkadotAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	commissionPerBillion: {
		label: 'commission per billion',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalStakePlancks: {
		label: 'total stake plancks',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ownStakePlancks: {
		label: 'own stake plancks',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nominatorStakePlancks: {
		label: 'nominator stake plancks',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nominatorCount: {
		label: 'nominator count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rewardPoints: {
		label: 'reward points',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	active: {
		label: 'active',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slashed: {
		label: 'slashed',
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

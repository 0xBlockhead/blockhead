// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AvalancheDelegator,
	labels: {
		singular: 'avalanche delegator',
		plural: 'avalanche delegators',
	},
})({
	$validator: {
		label: 'validator',
		entityType: EntityType.AvalancheValidator,
		cardinality: EntityFieldCardinality.One,
	},
	txId: {
		label: 'transaction ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	delegatorAddress: {
		label: 'delegator address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stakeAmountNavax: {
		label: 'stake amount navax',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	startTimeMs: {
		label: 'start time ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	endTimeMs: {
		label: 'end time ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rewardOwnerAddresses: {
		label: 'reward owner addresses',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	potentialRewardNavax: {
		label: 'potential reward navax',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ValidatorTxId: [
			'$validator',
			'txId',
		],
	},
})

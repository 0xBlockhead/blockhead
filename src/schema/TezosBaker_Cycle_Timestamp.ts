// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TezosBaker_Cycle_Timestamp,
	labels: {
		singular: 'tezos baker cycle timestamp',
		plural: 'tezos baker cycle observations',
	},
})({
	$baker: {
		label: 'baker',
		entityType: EntityType.TezosBaker,
		cardinality: EntityFieldCardinality.One,
	},
	cycle: {
		label: 'cycle',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	snapshotLevel: {
		label: 'snapshot level',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stakingBalanceMutez: {
		label: 'staking balance mutez',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	delegatedBalanceMutez: {
		label: 'delegated balance mutez',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	expectedBlocks: {
		label: 'expected blocks',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	producedBlocks: {
		label: 'produced blocks',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	missedBlocks: {
		label: 'missed blocks',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	expectedEndorsements: {
		label: 'expected endorsements',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	missedEndorsements: {
		label: 'missed endorsements',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rewardsMutez: {
		label: 'rewards mutez',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feesMutez: {
		label: 'fees mutez',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		BakerCycleSource: [
			'$baker',
			'cycle',
			'source',
		],
	},
})

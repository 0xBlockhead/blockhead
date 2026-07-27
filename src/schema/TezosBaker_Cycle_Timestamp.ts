// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TezosBaker,
		cardinality: EntityFieldCardinality.One,
	},
	cycle: {
		label: 'cycle',
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
	snapshotLevel: {
		label: 'snapshot level',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stakingBalanceMutez: {
		label: 'staking balance mutez',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	delegatedBalanceMutez: {
		label: 'delegated balance mutez',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	expectedBlocks: {
		label: 'expected blocks',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	producedBlocks: {
		label: 'produced blocks',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	missedBlocks: {
		label: 'missed blocks',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	expectedEndorsements: {
		label: 'expected endorsements',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	missedEndorsements: {
		label: 'missed endorsements',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rewardsMutez: {
		label: 'rewards mutez',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feesMutez: {
		label: 'fees mutez',
		type: EntityFieldType.Primitive,
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

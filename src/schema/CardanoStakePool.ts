// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const blockfrostRestSources = [
	Source.Blockfrost_Rest,
] as const

export default entity({
	entityType: EntityType.CardanoStakePool,
	labels: {
		singular: 'cardano stake pool',
		plural: 'cardano stake pools',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	poolId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	vrfKeyHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockfrostRestSources,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockfrostRestSources,
	},
	ticker: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockfrostRestSources,
	},
	description: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockfrostRestSources,
	},
	homepage: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockfrostRestSources,
	},
	$$timestamps: {
		entityType: EntityType.CardanoStakePool_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkPoolId: [
			'$network',
			'poolId',
		],
	},
})

// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const tronGridRestSources = [
	Source.TronGrid_Rest,
] as const

export default entity({
	entityType: EntityType.TronWitness_Timestamp,
	labels: {
		singular: 'tron witness timestamp',
		plural: 'tron witness observations',
	},
})({
	$witness: {
		entityType: EntityType.TronWitness,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	url: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestSources,
	},
	voteCount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestSources,
	},
	totalProduced: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestSources,
	},
	totalMissed: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestSources,
	},
	latestBlockHeight: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestSources,
	},
	latestSlotNumber: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestSources,
	},
	active: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestSources,
	},
})({
	selectors: {
		WitnessTimestampMsSource: [
			'$witness',
			'timestampMs',
			'source',
		],
	},
})

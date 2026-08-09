// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

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
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	url: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronGrid_Rest,
		],
	},
	voteCount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronGrid_Rest,
		],
	},
	totalProduced: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronGrid_Rest,
		],
	},
	totalMissed: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronGrid_Rest,
		],
	},
	latestBlockHeight: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronGrid_Rest,
		],
	},
	latestSlotNumber: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronGrid_Rest,
		],
	},
	active: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronGrid_Rest,
		],
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

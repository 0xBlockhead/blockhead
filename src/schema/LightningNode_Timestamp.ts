// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const lightningMempoolSpaceRestLightningLndRestSources = [
	Source.LightningMempoolSpace_Rest,
	Source.LightningLnd_Rest,
] as const
const lightningMempoolSpaceRestSources = [
	Source.LightningMempoolSpace_Rest,
] as const

export default entity({
	entityType: EntityType.LightningNode_Timestamp,
	labels: {
		singular: 'Lightning node timestamp',
		plural: 'Lightning node observations',
	},
})({
	$node: {
		entityType: EntityType.LightningNode,
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
	alias: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestLightningLndRestSources,
	},
	color: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestSources,
	},
	capacitySats: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestSources,
	},
	channelCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestLightningLndRestSources,
	},
	firstSeenMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestSources,
	},
	updatedAtMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestSources,
	},
	countryCode: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestSources,
	},
	city: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestSources,
	},
	networkAddresses: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: lightningMempoolSpaceRestSources,
	},
})({
	selectors: {
		NodeTimestampMsSource: [
			'$node',
			'timestampMs',
			'source',
		],
	},
})

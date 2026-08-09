// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CelestiaNetwork_Timestamp,
	labels: {
		singular: 'celestia network timestamp',
		plural: 'celestia network observations',
	},
})({
	$network: {
		entityType: EntityType.CelestiaNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Celenium_Rest,
			Source.CelestiaNode,
		],
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Celenium_Rest,
			Source.CelestiaNode,
		],
	},
	latestHeight: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Celenium_Rest,
			Source.CelestiaNode,
		],
	},
	latestHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Celenium_Rest,
			Source.CelestiaNode,
		],
	},
	latestBlockTimeMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Celenium_Rest,
			Source.CelestiaNode,
		],
	},
	syncing: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Celenium_Rest,
			Source.CelestiaNode,
		],
	},
	health: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CelestiaNode,
		],
	},
	blobCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	namespaceCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sampledHeaderHeight: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CelestiaNode,
		],
	},
	nodeType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CelestiaNode,
		],
	},
})({
	selectors: {
		NetworkTimestampMsSource: [
			'$network',
			'timestampMs',
			'source',
		],
	},
})

// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LightningNetwork_Timestamp,
	labels: {
		singular: 'Lightning network timestamp',
		plural: 'Lightning network observations',
	},
})({
	$lightningNetwork: {
		label: 'Lightning network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.LightningNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	nodeCount: {
		label: 'Nodes',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
	channelCount: {
		label: 'Channels',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
	totalCapacitySats: {
		label: 'Total capacity sats',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
	torNodeCount: {
		label: 'Tor nodes',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
	clearnetNodeCount: {
		label: 'Clearnet nodes',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
	unannouncedNodeCount: {
		label: 'Unannounced nodes',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
	averageCapacitySats: {
		label: 'Average capacity sats',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
	medianCapacitySats: {
		label: 'Median capacity sats',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
	averageFeeRatePpm: {
		label: 'Average fee rate ppm',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
	medianFeeRatePpm: {
		label: 'Median fee rate ppm',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
})({
	selectors: {
		LightningNetworkTimestampMsSource: [
			'$lightningNetwork',
			'timestampMs',
			'source',
		],
	},
})

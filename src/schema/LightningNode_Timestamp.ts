// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LightningNode_Timestamp,
	labels: {
		singular: 'Lightning node timestamp',
		plural: 'Lightning node observations',
	},
})({
	$node: {
		label: 'Node',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.LightningNode,
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
	alias: {
		label: 'Alias',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
			Source.LightningLnd_Rest,
		],
	},
	color: {
		label: 'Color',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
	capacitySats: {
		label: 'Capacity sats',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
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
			Source.LightningLnd_Rest,
		],
	},
	firstSeenMs: {
		label: 'First seen',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
	updatedAtMs: {
		label: 'Updated',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
	countryCode: {
		label: 'Country',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
	city: {
		label: 'City',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
	networkAddresses: {
		label: 'Network addresses',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
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

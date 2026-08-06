// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AvailBlock,
	labels: {
		singular: 'avail block',
		plural: 'avail blocks',
	},
})({
	$network: {
		entityType: EntityType.AvailNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	blockNumber: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	blockHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Avail,
		],
	},
	parentHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Avail,
		],
	},
	stateRoot: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Avail,
		],
	},
	extrinsicsRoot: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Avail,
		],
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	extrinsicCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Avail,
		],
	},
	dataSubmissionCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	appIdCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$parent: {
		entityType: EntityType.AvailBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Avail,
		],
	},
	$$dataSubmissions: {
		entityType: EntityType.AvailDataSubmission,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkBlockNumber: [
			'$network',
			'blockNumber',
		],
		NetworkBlockHash: [
			'$network',
			'blockHash',
		],
	},
})

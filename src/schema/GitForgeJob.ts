// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GitForgeJob,
	labels: {
		singular: 'Git forge job',
		plural: 'Git forge jobs',
	},
})({
	$pipeline: {
		entityType: EntityType.GitForgePipeline,
		cardinality: EntityFieldCardinality.One,
	},
	jobId: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	stage: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	commitObjectId: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	url: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	startedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	finishedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	durationSeconds: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	queuedDurationSeconds: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		PipelineJobId: [
			'$pipeline',
			'jobId',
		],
	},
})

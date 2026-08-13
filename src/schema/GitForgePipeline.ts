// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GitForgePipeline,
	labels: {
		singular: 'Git forge pipeline',
		plural: 'Git forge pipelines',
	},
})({
	$forgeMirror: {
		entityType: EntityType.GitForgeMirror,
		cardinality: EntityFieldCardinality.One,
	},
	pipelineId: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	pipelineIid: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	ref: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	commitObjectId: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
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
	updatedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$$jobs: {
		entityType: EntityType.GitForgeJob,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Gitlab_Rest,
		],
	},
})({
	selectors: {
		ForgeMirrorPipelineId: [
			'$forgeMirror',
			'pipelineId',
		],
	},
})

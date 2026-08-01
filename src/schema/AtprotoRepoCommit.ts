// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AtprotoRepoCommit,
	labels: {
		singular: 'AT Protocol repo commit',
		plural: 'AT Protocol repo commits',
	},
})({
	repoDid: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	rev: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	commitCid: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	previousRev: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	previousDataCid: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	dataCid: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sequence: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pdsHost: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	relayHost: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	time: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tooBig: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rebase: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	operationCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blobCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	carByteLength: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	operationPaths: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	createdRecordCids: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	updatedRecordCids: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	deletedRecordPaths: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	$$posts: {
		entityType: EntityType.AtprotoPost,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		RepoDidRevSource: [
			'repoDid',
			'rev',
			'source',
		],
		RepoDidCommitCidSource: [
			'repoDid',
			'commitCid',
			'source',
		],
	},
})

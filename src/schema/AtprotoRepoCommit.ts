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
		label: 'Repo DID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	rev: {
		label: 'Rev',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	commitCid: {
		label: 'Commit CID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	previousRev: {
		label: 'Previous rev',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	previousDataCid: {
		label: 'Previous data CID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	dataCid: {
		label: 'Data CID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sequence: {
		label: 'Sequence',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pdsHost: {
		label: 'PDS host',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	relayHost: {
		label: 'Relay host',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	time: {
		label: 'Time',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tooBig: {
		label: 'Too big',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rebase: {
		label: 'Rebase',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	operationCount: {
		label: 'Operation count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blobCount: {
		label: 'Blob count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	carByteLength: {
		label: 'CAR byte length',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	operationPaths: {
		label: 'Operation paths',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	createdRecordCids: {
		label: 'Created record CIDs',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	updatedRecordCids: {
		label: 'Updated record CIDs',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	deletedRecordPaths: {
		label: 'Deleted record paths',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	$$posts: {
		label: 'Posts',
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

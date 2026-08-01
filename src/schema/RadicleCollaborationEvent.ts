// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.RadicleCollaborationEvent,
	labels: {
		singular: 'radicle collaboration event',
		plural: 'radicle collaboration events',
	},
})({
	$repository: {
		label: 'repository',
		entityType: EntityType.RadicleRepository,
		cardinality: EntityFieldCardinality.One,
	},
	eventId: {
		label: 'event ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	eventKind: {
		label: 'event kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	authorDid: {
		label: 'author DID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subjectSelector: {
		label: 'subject selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.One,
	},
	payloadHash: {
		label: 'payload hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payloadObjectId: {
		label: 'payload object ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$gitCommit: {
		label: 'Git commit',
		entityType: EntityType.GitCommit,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$payloadObject: {
		label: 'payload object',
		entityType: EntityType.GitObject,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verificationStatus: {
		label: 'verification status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		RepositoryEventId: [
			'$repository',
			'eventId',
		],
	},
})

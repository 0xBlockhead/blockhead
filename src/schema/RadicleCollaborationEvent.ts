// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum RadicleCollaborationEventSelector {
	RepositoryEventId = 'RepositoryEventId',
}
export default {
	entityType: EntityType.RadicleCollaborationEvent,
	label: 'radicle collaboration event',
	labelPlural: 'radicle collaboration events',
	selectors: [
		{
			name: RadicleCollaborationEventSelector.RepositoryEventId,
			fields: [
				'$repository',
				'eventId',
			],
		},
	],
	fields: [
		{
			name: '$repository',
			label: 'repository',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RadicleRepository,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'eventId',
			label: 'event ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'eventKind',
			label: 'event kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'authorDid',
			label: 'author DID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'subjectSelector',
			label: 'subject selector',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'payloadHash',
			label: 'payload hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'payloadObjectId',
			label: 'payload object ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$gitCommit',
			label: 'Git commit',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.GitCommit,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$payloadObject',
			label: 'payload object',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.GitObject,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'verificationStatus',
			label: 'verification status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition

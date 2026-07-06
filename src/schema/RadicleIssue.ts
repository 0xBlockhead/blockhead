// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum RadicleIssueSelector {
	RepositoryIssueId = 'RepositoryIssueId',
}
export default {
	entityType: EntityType.RadicleIssue,
	label: 'radicle issue',
	labelPlural: 'radicle issues',
	selectors: [
		{
			name: RadicleIssueSelector.RepositoryIssueId,
			fields: [
				'$repository',
				'issueId',
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
			name: 'issueId',
			label: 'issue ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'title',
			label: 'title',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'authorDid',
			label: 'author DID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'state',
			label: 'state',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'createdAt',
			label: 'Created',
			description: 'The time when the subject was created according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'updatedAt',
			label: 'Updated',
			description: 'The time when the subject was last updated according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
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
			name: '$payloadObject',
			label: 'payload object',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.GitObject,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$comments',
			label: 'comments',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RadicleDiscussionComment,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

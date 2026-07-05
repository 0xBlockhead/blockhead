// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum GitForgeIssueSelector {
	ForgeMirrorIssueNumber = 'ForgeMirrorIssueNumber',
}
export default {
	entityType: EntityType.GitForgeIssue,
	label: 'Git forge issue',
	labelPlural: 'Git forge issues',
	selectors: [
		{
			name: GitForgeIssueSelector.ForgeMirrorIssueNumber,
			fields: [
				'$forgeMirror',
				'issueNumber',
			],
		},
	],
	fields: [
		{
				name: '$forgeMirror',
				label: 'forge mirror',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.GitForgeMirror,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'issueNumber',
				label: 'issue number',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
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
				name: 'state',
				label: 'state',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'authorSelector',
				label: 'author selector',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'labels',
				label: 'labels',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
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
				name: 'closedAt',
				label: 'closed AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

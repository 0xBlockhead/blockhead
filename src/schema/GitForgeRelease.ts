// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum GitForgeReleaseSelector {
	ForgeMirrorReleaseTagName = 'ForgeMirrorReleaseTagName',
}
export default {
	entityType: EntityType.GitForgeRelease,
	label: 'Git forge release',
	labelPlural: 'Git forge releases',
	selectors: [
		{
			name: GitForgeReleaseSelector.ForgeMirrorReleaseTagName,
			fields: [
				'$forgeMirror',
				'releaseTagName',
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
				name: 'releaseTagName',
				label: 'release tag name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'name',
				label: 'Name',
				description: 'The human-readable name of the subject.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'targetObjectId',
				label: 'target object ID',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'authorSelector',
				label: 'author selector',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'draft',
				label: 'draft',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'prerelease',
				label: 'prerelease',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
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
				name: 'publishedAt',
				label: 'published AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

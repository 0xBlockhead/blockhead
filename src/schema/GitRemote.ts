// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum GitRemoteSelector {
	RepositoryRemoteName = 'RepositoryRemoteName',
}
export default {
	entityType: EntityType.GitRemote,
	label: 'Git remote',
	labelPlural: 'Git remotes',
	selectors: [
		{
			name: GitRemoteSelector.RepositoryRemoteName,
			fields: [
				'$repository',
				'remoteName',
			],
		},
	],
	fields: [
		{
			name: '$repository',
			label: 'repository',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.GitRepository,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'remoteName',
			label: 'remote name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'url',
			label: 'URL',
			description: 'The URL for the source-domain resource.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transportKind',
			label: 'transport kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hostKind',
			label: 'host kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

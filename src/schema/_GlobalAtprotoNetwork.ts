import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum _GlobalAtprotoNetworkSelector {
	Scope = 'scope',
}
export default {
	entityType: EntityType._GlobalAtprotoNetwork,
	label: 'global atproto network',
	labelPlural: 'global atproto networks',
	selectors: [
		{
			name: _GlobalAtprotoNetworkSelector.Scope,
			fields: [
				'scope',
			],
		},
	],
	fields: [
		{
			name: 'scope',
			label: 'Scope',
			description: 'The fixed scope value that identifies this hub row.',
			type: EntityFieldType.Primitive,
			primitiveType: type("'_GlobalAtprotoNetwork'"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$sourceWindowActors',
			label: 'source window actors',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AtprotoActor,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$sourceWindowPosts',
			label: 'source window posts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AtprotoPost,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$sourceWindowRepoCommits',
			label: 'source window repo commits',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AtprotoRepoCommit,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType._GlobalAtprotoNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

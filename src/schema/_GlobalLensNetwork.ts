// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum _GlobalLensNetworkSelector {
	Scope = 'Scope',
}
export default {
	entityType: EntityType._GlobalLensNetwork,
	label: 'global lens network',
	labelPlural: 'global lens networks',
	selectors: [
		{
			name: _GlobalLensNetworkSelector.Scope,
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
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$$sourceWindowAccounts',
				label: 'source window accounts',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.LensAccount,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$sourceWindowFeeds',
				label: 'source window feeds',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.LensFeed,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$sourceWindowPosts',
				label: 'source window posts',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.LensPost,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$sourceWindowUsernameNamespaces',
				label: 'source window username namespaces',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.LensUsernameNamespace,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType._GlobalLensNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum _GlobalLensNetworkSelector {
	Scope = 'Scope',
}
export const _GlobalLensNetwork = entity({
	entityType: EntityType._GlobalLensNetwork,
	label: 'global lens network',
	labelPlural: 'global lens networks',
})({
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedAccounts: {
		label: 'observed accounts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LensAccount,
		cardinality: EntityFieldCardinality.Many,
	},
	$$observedFeeds: {
		label: 'observed feeds',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LensFeed,
		cardinality: EntityFieldCardinality.Many,
	},
	$$observedPosts: {
		label: 'observed posts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LensPost,
		cardinality: EntityFieldCardinality.Many,
	},
	$$observedUsernameNamespaces: {
		label: 'observed username namespaces',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LensUsernameNamespace,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType._GlobalLensNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})

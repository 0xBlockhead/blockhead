// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum LensNetworkSelector {
	Scope = 'Scope',
}
export const LensNetwork = entity({
	entityType: EntityType.LensNetwork,
	labels: {
		singular: 'Lens',
		plural: 'Lens',
	},
	description: 'Lens is a social graph protocol. This hub shows bounded account and post windows from the declared Lens GraphQL source.',
})({
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		type: EntityFieldType.Primitive,
		primitiveType: type.unit('LensNetwork'),
		cardinality: EntityFieldCardinality.One,
	},
	protocolName: {
		label: 'Protocol',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	relationshipModel: {
		label: 'Connection model',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	homeUrl: {
		label: 'Home URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	docsUrl: {
		label: 'Docs URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registryName: {
		label: 'Registry name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$lensAccounts: {
		label: 'Accounts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LensAccount,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.Lens_Graphql,
		],
	},
	$$lensPosts: {
		label: 'Posts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LensPost,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Lens_Graphql,
		],
	},
	$$lensFeeds: {
		label: 'Feeds',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LensFeed,
		cardinality: EntityFieldCardinality.Many,
	},
	$$lensUsernameNamespaces: {
		label: 'Username namespaces',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LensUsernameNamespace,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum LensNetworkSelector {
	Scope = 'Scope',
}
export default {
	entityType: EntityType.LensNetwork,
	label: 'Lens',
	labelPlural: 'Lens',
	description: 'Lens is a social graph protocol. This hub shows bounded account and post windows from the configured Lens GraphQL source.',
	selectors: [
		{
			name: LensNetworkSelector.Scope,
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
			primitiveType: type.unit('LensNetwork'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'protocolName',
			label: 'Protocol',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'topology',
			label: 'Topology',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'homeUrl',
			label: 'Home URL',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'docsUrl',
			label: 'Docs URL',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'registryLabel',
			label: 'Registry',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$lensAccounts',
			label: 'Accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LensAccount,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.Lens_Graphql,
			],
		},
		{
			name: '$$lensPosts',
			label: 'Posts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LensPost,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Lens_Graphql,
			],
		},
		{
			name: '$$lensFeeds',
			label: 'Feeds',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LensFeed,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$lensUsernameNamespaces',
			label: 'Username namespaces',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LensUsernameNamespace,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

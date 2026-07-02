// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum XNetworkSelector {
	Scope = 'Scope',
}
export default {
	entityType: EntityType.XNetwork,
	label: 'X',
	labelPlural: 'X',
	description: 'X profiles and posts surfaced through configured public HTTP sources.',
	selectors: [
		{
			name: XNetworkSelector.Scope,
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
				name: 'protocolName',
				label: 'Protocol',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
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
				name: 'topology',
				label: 'Topology',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$xUsers',
				label: 'Users',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.XUser,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.X_FxEmbed_Rest,
				],
		},
		{
				name: '$$xPosts',
				label: 'Posts',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.XPost,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.X_FxEmbed_Rest,
				],
		},
	],
} as const satisfies EntityDefinition

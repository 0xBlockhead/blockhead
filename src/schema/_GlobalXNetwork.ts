// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum _GlobalXNetworkSelector {
	Scope = 'Scope',
}
export default {
	entityType: EntityType._GlobalXNetwork,
	label: 'global X network',
	labelPlural: 'global X networks',
	selectors: [
		{
			name: _GlobalXNetworkSelector.Scope,
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
				name: '$$sourceWindowUsers',
				label: 'source window users',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.XUser,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$sourceWindowPosts',
				label: 'source window posts',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.XPost,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType._GlobalXNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

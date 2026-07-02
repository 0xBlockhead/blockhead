// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum _GlobalSwarmAccessSelector {
	Scope = 'Scope',
}
export default {
	entityType: EntityType._GlobalSwarmAccess,
	label: 'global Swarm access',
	labelPlural: 'global Swarm accesses',
	selectors: [
		{
			name: _GlobalSwarmAccessSelector.Scope,
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
				primitiveType: type.unit('_GlobalSwarmAccess'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$$sourceWindowResources',
				label: 'Source window resources',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SwarmResource,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$timestamps',
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType._GlobalSwarmAccess_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

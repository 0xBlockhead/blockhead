import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum _GlobalSwarmAccessSelector {
	Scope = 'scope',
}
export default {
	entityType: EntityType._GlobalSwarmAccess,
	label: 'global swarm access',
	labelPlural: 'global swarm accesses',
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
			primitiveType: type("'_GlobalSwarmAccess'"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$sourceWindowResources',
			label: 'source window resources',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SwarmResource,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType._GlobalSwarmAccess_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

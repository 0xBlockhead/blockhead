// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum _GlobalSwarmAccessSelector {
	Scope = 'Scope',
}
export const _GlobalSwarmAccess = entity({
	entityType: EntityType._GlobalSwarmAccess,
	labels: {
		singular: 'global Swarm access',
		plural: 'global Swarm accesses',
	},
})({
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		type: EntityFieldType.Primitive,
		primitiveType: type.unit('_GlobalSwarmAccess'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedResources: {
		label: 'Observed resources',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SwarmResource,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType._GlobalSwarmAccess_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})

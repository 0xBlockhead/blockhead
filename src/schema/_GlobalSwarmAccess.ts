// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType._GlobalSwarmAccess,
	labels: {
		singular: 'global Swarm access',
		plural: 'global Swarm accesses',
	},
})({
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		primitiveType: type.unit('_GlobalSwarmAccess'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedResources: {
		label: 'Observed resources',
		entityType: EntityType.SwarmResource,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'Observations',
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

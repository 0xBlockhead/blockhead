// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType._GlobalSwarmAccess,
	labels: {
		singular: 'global Swarm access',
		plural: 'global Swarm accesses',
	},
})({
	scope: {
		primitiveType: type.unit('_GlobalSwarmAccess'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedResources: {
		entityType: EntityType.SwarmResource,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		entityType: EntityType._GlobalSwarmAccess_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Swarm_Rest,
		],
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})

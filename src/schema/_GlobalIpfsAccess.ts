// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum _GlobalIpfsAccessSelector {
	Scope = 'Scope',
}
export const _GlobalIpfsAccess = entity({
	entityType: EntityType._GlobalIpfsAccess,
	labels: {
		singular: 'global IPFS access',
		plural: 'global IPFS accesses',
	},
})({
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		type: EntityFieldType.Primitive,
		primitiveType: type.unit('_GlobalIpfsAccess'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedResources: {
		label: 'Observed resources',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.IpfsResource,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType._GlobalIpfsAccess_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})

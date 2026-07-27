// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
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
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})

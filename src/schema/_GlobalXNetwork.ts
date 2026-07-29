// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType._GlobalXNetwork,
	labels: {
		singular: 'global X network',
		plural: 'global X networks',
	},
})({
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedUsers: {
		label: 'observed users',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.XUser,
		cardinality: EntityFieldCardinality.Many,
	},
	$$observedPosts: {
		label: 'observed posts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.XPost,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})

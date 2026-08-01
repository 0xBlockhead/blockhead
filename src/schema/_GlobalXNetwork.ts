// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: type.unit('_GlobalXNetwork'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedUsers: {
		entityType: EntityType.XUser,
		cardinality: EntityFieldCardinality.Many,
	},
	$$observedPosts: {
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

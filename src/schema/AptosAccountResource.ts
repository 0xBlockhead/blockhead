// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AptosAccountResource,
	labels: {
		singular: 'aptos account resource',
		plural: 'aptos account resources',
	},
})({
	$account: {
		entityType: EntityType.AptosAccount,
		cardinality: EntityFieldCardinality.One,
	},
	resourceType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.AptosAccountResource_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		AccountResourceType: [
			'$account',
			'resourceType',
		],
	},
})

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
		label: 'account',
		entityType: EntityType.AptosAccount,
		cardinality: EntityFieldCardinality.One,
	},
	resourceType: {
		label: 'resource type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
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

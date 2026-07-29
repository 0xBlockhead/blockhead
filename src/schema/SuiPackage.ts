// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SuiPackage,
	labels: {
		singular: 'sui package',
		plural: 'sui packages',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SuiNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	originalPackageId: {
		label: 'original package ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$versions: {
		label: 'versions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SuiPackageVersion,
		cardinality: EntityFieldCardinality.Many,
	},
	$$upgrades: {
		label: 'upgrades',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SuiPackageUpgrade,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkOriginalPackageId: [
			'$network',
			'originalPackageId',
		],
	},
})

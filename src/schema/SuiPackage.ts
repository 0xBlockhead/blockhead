// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.SuiNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	originalPackageId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$versions: {
		entityType: EntityType.SuiPackageVersion,
		cardinality: EntityFieldCardinality.Many,
	},
	$$upgrades: {
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

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
		label: 'network',
		entityType: EntityType.SuiNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	originalPackageId: {
		label: 'original package ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$versions: {
		label: 'versions',
		entityType: EntityType.SuiPackageVersion,
		cardinality: EntityFieldCardinality.Many,
	},
	$$upgrades: {
		label: 'upgrades',
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

// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ComplianceModule,
	labels: {
		singular: 'compliance module',
		plural: 'compliance modules',
	},
})({
	$profile: {
		entityType: EntityType.RegulatedAssetProfile,
		cardinality: EntityFieldCardinality.One,
	},
	moduleKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	moduleSelector: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.One,
	},
	ruleKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	config: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ProfileModuleKey: [
			'$profile',
			'moduleKey',
		],
	},
})

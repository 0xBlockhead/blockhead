// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		label: 'profile',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.RegulatedAssetProfile,
		cardinality: EntityFieldCardinality.One,
	},
	moduleKey: {
		label: 'module key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	moduleSelector: {
		label: 'module selector',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.One,
	},
	ruleKind: {
		label: 'rule kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	config: {
		label: 'config',
		type: EntityFieldType.Primitive,
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

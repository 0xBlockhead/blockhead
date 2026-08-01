// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TransferRestriction,
	labels: {
		singular: 'transfer restriction',
		plural: 'transfer restrictions',
	},
})({
	$assetInstance: {
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.One,
	},
	restrictionKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	restrictionKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$profile: {
		entityType: EntityType.RegulatedAssetProfile,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	message: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ruleSelector: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$checks: {
		entityType: EntityType.TransferRestrictionCheck_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		AssetInstanceRestrictionKeySource: [
			'$assetInstance',
			'restrictionKey',
			'source',
		],
	},
})

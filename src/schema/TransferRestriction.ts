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
		label: 'asset instance',
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.One,
	},
	restrictionKey: {
		label: 'restriction key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	restrictionKind: {
		label: 'restriction kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$profile: {
		label: 'profile',
		entityType: EntityType.RegulatedAssetProfile,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	message: {
		label: 'message',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ruleSelector: {
		label: 'rule selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$checks: {
		label: 'checks',
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

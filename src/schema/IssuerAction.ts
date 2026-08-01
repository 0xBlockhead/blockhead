// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.IssuerAction,
	labels: {
		singular: 'issuer action',
		plural: 'issuer actions',
	},
})({
	issuerActionId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	actionKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$assetInstance: {
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.One,
	},
	targetSelector: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$issuerPower: {
		entityType: EntityType.IssuerPower,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		IssuerActionId: [
			'issuerActionId',
		],
	},
})

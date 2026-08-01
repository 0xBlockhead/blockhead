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
		label: 'issuer action ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	actionKind: {
		label: 'action kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$assetInstance: {
		label: 'asset instance',
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.One,
	},
	targetSelector: {
		label: 'target selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		label: 'amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$issuerPower: {
		label: 'issuer power',
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

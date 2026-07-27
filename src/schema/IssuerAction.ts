// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	actionKind: {
		label: 'action kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$assetInstance: {
		label: 'asset instance',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.One,
	},
	targetSelector: {
		label: 'target selector',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		label: 'amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$issuerPower: {
		label: 'issuer power',
		type: EntityFieldType.EntityReference,
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

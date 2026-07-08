// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IssuerActionSelector {
	IssuerActionId = 'IssuerActionId',
}
export const IssuerAction = entity({
	entityType: EntityType.IssuerAction,
	label: 'issuer action',
	labelPlural: 'issuer actions',
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

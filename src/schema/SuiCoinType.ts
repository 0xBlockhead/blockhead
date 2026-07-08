// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SuiCoinTypeSelector {
	NetworkCoinType = 'NetworkCoinType',
}
export const SuiCoinType = entity({
	entityType: EntityType.SuiCoinType,
	label: 'sui coin type',
	labelPlural: 'sui coin types',
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SuiNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	coinType: {
		label: 'coin type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$definingStruct: {
		label: 'defining struct',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.MoveStruct,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$treasuryCap: {
		label: 'treasury cap',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SuiObject,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$assetInstance: {
		label: 'asset instance',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$balances: {
		label: 'balances',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SuiCoinBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$objects: {
		label: 'objects',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SuiObject,
		cardinality: EntityFieldCardinality.Many,
	},
	$$regulatedStates: {
		label: 'regulated states',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SuiRegulatedCoinState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	decimals: {
		label: 'Decimals',
		description: 'The number of decimal places used to display the amount.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	symbol: {
		label: 'Symbol',
		description: 'The short ticker or symbol used for display.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	iconUrl: {
		label: 'icon URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkCoinType: [
			'$network',
			'coinType',
		],
	},
})

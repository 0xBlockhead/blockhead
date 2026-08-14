// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SuiCoinType,
	labels: {
		singular: 'sui coin type',
		plural: 'sui coin types',
	},
})({
	$network: {
		entityType: EntityType.SuiNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	coinType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$definingStruct: {
		entityType: EntityType.MoveStruct,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$treasuryCap: {
		entityType: EntityType.SuiObject,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$assetInstance: {
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$balances: {
		entityType: EntityType.SuiCoinBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$objects: {
		entityType: EntityType.SuiObject,
		cardinality: EntityFieldCardinality.Many,
	},
	$$regulatedStates: {
		entityType: EntityType.SuiRegulatedCoinState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	decimals: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	symbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	iconUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$icon: {
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Sui,
		],
	},
})({
	selectors: {
		NetworkCoinType: [
			'$network',
			'coinType',
		],
	},
})

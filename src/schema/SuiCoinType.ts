// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SuiCoinType,
	labels: {
		singular: 'sui coin type',
		plural: 'sui coin types',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.SuiNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	coinType: {
		label: 'coin type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$definingStruct: {
		label: 'defining struct',
		entityType: EntityType.MoveStruct,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$treasuryCap: {
		label: 'treasury cap',
		entityType: EntityType.SuiObject,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$assetInstance: {
		label: 'asset instance',
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$balances: {
		label: 'balances',
		entityType: EntityType.SuiCoinBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$objects: {
		label: 'objects',
		entityType: EntityType.SuiObject,
		cardinality: EntityFieldCardinality.Many,
	},
	$$regulatedStates: {
		label: 'regulated states',
		entityType: EntityType.SuiRegulatedCoinState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	decimals: {
		label: 'Decimals',
		description: 'The number of decimal places used to display the amount.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	symbol: {
		label: 'Symbol',
		description: 'The short ticker or symbol used for display.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	iconUrl: {
		label: 'icon URL',
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

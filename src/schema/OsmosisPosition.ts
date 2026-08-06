// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.OsmosisPosition,
	labels: {
		singular: 'Osmosis position',
		plural: 'Osmosis positions',
	},
	description: 'An Osmosis concentrated-liquidity position identified by numeric position id on cosmos:osmosis-1.',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	positionId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$pool: {
		entityType: EntityType.OsmosisPool,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Osmosis_LCD_Rest,
		],
	},
	$account: {
		entityType: EntityType.CosmosAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Osmosis_LCD_Rest,
		],
	},
	tickLower: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Osmosis_LCD_Rest,
		],
	},
	tickUpper: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Osmosis_LCD_Rest,
		],
	},
	liquidity: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Osmosis_LCD_Rest,
		],
	},
	joinTime: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Osmosis_LCD_Rest,
		],
	},
	asset0Amount: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Osmosis_LCD_Rest,
		],
	},
	asset0Denom: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Osmosis_LCD_Rest,
		],
	},
	asset1Amount: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Osmosis_LCD_Rest,
		],
	},
	asset1Denom: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Osmosis_LCD_Rest,
		],
	},
	claimableSpreadRewards: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Osmosis_LCD_Rest,
		],
	},
})({
	selectors: {
		NetworkPositionId: [
			'$network',
			'positionId',
		],
	},
})

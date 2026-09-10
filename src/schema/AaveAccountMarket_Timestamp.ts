// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { DecimalString } from '$/schema/DecimalString.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AaveAccountMarket_Timestamp,
	labels: {
		singular: 'Aave account market observation',
		plural: 'Aave account market observations',
	},
	description: 'A provider-observed Aave account health, liquidation, LTV, collateral/debt bases, and net APY at the completed response time.',
})({
	$accountMarket: {
		entityType: EntityType.AaveAccountMarket,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	healthFactor: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	currentLiquidationThreshold: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	ltv: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	totalCollateralBase: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	totalDebtBase: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	availableBorrowsBase: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	netApy: {
		primitiveType: DecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
})({
	selectors: {
		AccountMarketTimestampMsSource: [
			'$accountMarket',
			'timestampMs',
			'source',
		],
	},
})

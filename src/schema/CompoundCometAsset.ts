// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CompoundCometAsset,
	labels: {
		singular: 'Compound Comet collateral asset',
		plural: 'Compound Comet collateral assets',
	},
	description: 'A collateral asset configured on a Compound III Comet market, from official deployment configuration.json.',
})({
	$comet: {
		entityType: EntityType.CompoundComet,
		cardinality: EntityFieldCardinality.One,
	},
	symbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	tokenAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
	priceFeedAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
	decimals: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
	borrowCF: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
	liquidateCF: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
	liquidationFactor: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
	supplyCap: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
})({
	selectors: {
		CometAssetSymbol: [
			'$comet',
			'symbol',
		],
	},
})

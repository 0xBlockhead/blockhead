import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CompoundComet,
	labels: {
		singular: 'Compound Comet market',
		plural: 'Compound Comet markets',
	},
	description: 'A Compound III Comet money market on an EIP-155 network, identified by its proxy contract address.',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	cometAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	marketSlug: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
	symbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
	baseTokenSymbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
	baseTokenAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
	baseTokenPriceFeedAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
	collateralAssetCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
	borrowMin: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
	targetReserves: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
	governorAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
	pauseGuardianAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
	configuratorAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
	rewardsAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
	bulkerAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
})({
	selectors: {
		NetworkCometAddress: [
			'$network',
			'cometAddress',
		],
	},
})

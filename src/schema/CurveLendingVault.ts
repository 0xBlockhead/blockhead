// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CurveLendingVault,
	labels: {
		singular: 'Curve Lend vault',
		plural: 'Curve Lend vaults',
	},
	description: 'A Curve Lend (crvUSD lending) vault on an EIP-155 network — borrow/collateral assets, rates, and optional gauge from Curve REST getLendingVaults.',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	vaultAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	registryId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	controllerAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	ammAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	monetaryPolicyAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	borrowedAssetAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	borrowedAssetSymbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	borrowedAssetDecimals: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	borrowedAssetUsdPrice: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	collateralAssetAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	collateralAssetSymbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	collateralAssetDecimals: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	collateralAssetUsdPrice: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	$gauge: {
		entityType: EntityType.CurveGauge,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	borrowApr: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	borrowApy: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	lendApr: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	lendApy: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	pricePerShare: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	totalShares: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	totalSupplied: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	totalSuppliedUsd: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	totalBorrowed: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	totalBorrowedUsd: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	availableToBorrow: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	availableToBorrowUsd: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	usdTotal: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
})({
	selectors: {
		NetworkVaultAddress: [
			'$network',
			'vaultAddress',
		],
	},
})

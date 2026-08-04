import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EulerEvkVault,
	labels: {
		singular: 'Euler EVK vault',
		plural: 'Euler EVK vaults',
	},
	description: 'An Euler v2 EVK (Euler Vault Kit) lending vault on an EIP-155 network, identified by vault contract address.',
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
			Source.Euler_Rest,
		],
	},
	symbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	decimals: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	assetAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	assetSymbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	totalAssets: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	totalBorrows: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	totalSupplyUsd: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	totalBorrowsUsd: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	utilization: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	supplyApy: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	borrowApy: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	createdAt: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	dTokenAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	oracleAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	governorAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	supplyCap: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	borrowCap: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	interestFee: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Euler_Rest,
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

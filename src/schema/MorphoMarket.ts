// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { EvmAddress, Hash32, lowercaseHexIdentityValue } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.MorphoMarket,
	labels: {
		singular: 'Morpho market',
		plural: 'Morpho markets',
	},
	description: 'A Morpho Blue immutable market on an EIP-155 network, identified by its bytes32 market id (hash of loan/collateral/oracle/IRM/LLTV).',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	marketId: {
		primitiveType: Hash32,
		cardinality: EntityFieldCardinality.One,
	},
	loanAssetAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Morpho_Rest,
		],
	},
	collateralAssetAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Morpho_Rest,
		],
	},
	oracleAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Morpho_Rest,
		],
	},
	irmAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Morpho_Rest,
		],
	},
	lltvWad: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Morpho_Rest,
		],
	},
	creationBlockNumber: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Morpho_Rest,
		],
	},
	totalSupplyAssets: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Morpho_Rest,
		],
	},
	totalSupplyShares: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Morpho_Rest,
		],
	},
	totalBorrowAssets: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Morpho_Rest,
		],
	},
	totalBorrowShares: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Morpho_Rest,
		],
	},
	feeWad: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Morpho_Rest,
		],
	},
	lastIndexedBlock: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Morpho_Rest,
		],
	},
	lastAccrualTimestamp: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Morpho_Rest,
		],
	},
})({
	selectors: {
		NetworkMarketId: [
			'$network',
			'marketId',
		],
	},
})

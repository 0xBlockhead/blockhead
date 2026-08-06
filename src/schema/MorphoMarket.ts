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
			Source.Morpho_Graphql,
		],
	},
	collateralAssetAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Morpho_Rest,
			Source.Morpho_Graphql,
		],
	},
	oracleAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Morpho_Rest,
			Source.Morpho_Graphql,
		],
	},
	irmAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Morpho_Rest,
			Source.Morpho_Graphql,
		],
	},
	lltvWad: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Morpho_Rest,
			Source.Morpho_Graphql,
		],
	},
	creationBlockNumber: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Morpho_Rest,
			Source.Morpho_Graphql,
		],
	},
	totalSupplyAssets: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Morpho_Rest,
			Source.Morpho_Graphql,
		],
	},
	totalSupplyShares: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Morpho_Rest,
			Source.Morpho_Graphql,
		],
	},
	totalBorrowAssets: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Morpho_Rest,
			Source.Morpho_Graphql,
		],
	},
	totalBorrowShares: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Morpho_Rest,
			Source.Morpho_Graphql,
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
			Source.Morpho_Graphql,
		],
	},
	lastAccrualTimestamp: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Morpho_Rest,
			Source.Morpho_Graphql,
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

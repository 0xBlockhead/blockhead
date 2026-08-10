// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.UniswapCcaAuction,
	labels: {
		singular: 'Uniswap CCA auction',
		plural: 'Uniswap CCA auctions',
	},
	description: 'A Uniswap Continuous Clearing Auction identified by its EVM network and auction contract address.',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	auctionAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$auctionContract: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.UniswapContracts_Evm,
		],
	},
	$currency: {
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.UniswapContracts_Evm,
		],
	},
	$token: {
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.UniswapContracts_Evm,
		],
	},
	totalSupply: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.UniswapContracts_Evm,
		],
	},
	$tokensRecipient: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.UniswapContracts_Evm,
		],
	},
	$fundsRecipient: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.UniswapContracts_Evm,
		],
	},
	$startBlock: {
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.UniswapContracts_Evm,
		],
	},
	$endBlock: {
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.UniswapContracts_Evm,
		],
	},
	$claimBlock: {
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.UniswapContracts_Evm,
		],
	},
	$validationHook: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniswapContracts_Evm,
		],
	},
	floorPriceQ96: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.UniswapContracts_Evm,
		],
	},
	tickSpacingQ96: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.UniswapContracts_Evm,
		],
	},
	$$blocks: {
		entityType: EntityType.UniswapCcaAuction_EvmBlock,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAuctionAddress: [
			'$network',
			'auctionAddress',
		],
	},
})

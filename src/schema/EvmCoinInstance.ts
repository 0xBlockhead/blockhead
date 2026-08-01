// Generated from APP.ts.

import { entity, facet } from '$/schema/$schema.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmCoinInstance,
	labels: {
		singular: 'EVM coin instance',
		plural: 'EVM coin instances',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	type: {
		label: 'Type',
		description: 'The source-domain type or category.',
		primitiveType: type.enumerated(...Object.values(CoinInstanceType)),
		cardinality: EntityFieldCardinality.One,
	},
	$contract: {
		label: 'Contract',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkType: [
			'$network',
			'type',
		],
		NetworkTypeContract: [
			'$network',
			'type',
			'$contract',
		],
	},

	facets: {
		NativeCurrency: facet({
			path: [
				'type',
			],
			is: 'NativeCurrency',
		})({
			coinId: {
				label: 'Coin ID',
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			name: {
				label: 'Name',
				description: 'The human-readable name of the native currency.',
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			symbol: {
				label: 'Symbol',
				description: 'The native currency ticker used for display.',
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			decimals: {
				label: 'Decimals',
				description: 'The native currency display precision.',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			iconUrl: {
				label: 'Icon URL',
				primitiveType: UrlString,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$icon: {
				label: 'Icon',
				entityType: EntityType.Media,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			caip19: {
				label: 'CAIP-19',
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			representation: {
				label: 'Representation',
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
					Source.Coingecko_Rest,
				],
			},
			$canonicalInstance: {
				label: 'Canonical instance',
				entityType: EntityType.EvmCoinInstance,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Coingecko_Rest,
				],
			},
			$$outboundBridgeCapabilities: {
				label: 'Outbound bridge capabilities',
				entityType: EntityType.CoinBridgeCapability,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: [
					Source.Lifi_Rest,
				],
			},
			$$inboundBridgeCapabilities: {
				label: 'Inbound bridge capabilities',
				entityType: EntityType.CoinBridgeCapability,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: [
					Source.Lifi_Rest,
				],
			},
			$$marketsWithInstanceAsBase: {
				label: 'Markets with instance as base',
				entityType: EntityType.Market,
				cardinality: EntityFieldCardinality.ZeroOrMany,
			},
			$$marketsWithInstanceAsQuote: {
				label: 'Markets with instance as quote',
				entityType: EntityType.Market,
				cardinality: EntityFieldCardinality.ZeroOrMany,
			},
		}),
		Erc20Token: facet({
			path: [
				'type',
			],
			is: 'Erc20Token',
		})({
			coinId: {
				label: 'Coin ID',
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Blockscout_Rest,
					Source.Constants_Internal,
				],
			},
			name: {
				label: 'Name',
				description: 'The human-readable ERC-20 token name.',
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
					Source.Constants_Internal,
				],
			},
			symbol: {
				label: 'Symbol',
				description: 'The ERC-20 token ticker used for display.',
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Blockscout_Rest,
					Source.Constants_Internal,
				],
			},
			decimals: {
				label: 'Decimals',
				description: 'The ERC-20 token display precision.',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Blockscout_Rest,
					Source.Constants_Internal,
				],
			},
			iconUrl: {
				label: 'Icon URL',
				primitiveType: UrlString,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$icon: {
				label: 'Icon',
				entityType: EntityType.Media,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			caip19: {
				label: 'CAIP-19',
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
					Source.Coingecko_Rest,
				],
			},
			representation: {
				label: 'Representation',
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Coingecko_Rest,
				],
			},
			$canonicalInstance: {
				label: 'Canonical instance',
				entityType: EntityType.EvmCoinInstance,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Coingecko_Rest,
				],
			},
			$$outboundBridgeCapabilities: {
				label: 'Outbound bridge capabilities',
				entityType: EntityType.CoinBridgeCapability,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: [
					Source.Lifi_Rest,
				],
			},
			$$inboundBridgeCapabilities: {
				label: 'Inbound bridge capabilities',
				entityType: EntityType.CoinBridgeCapability,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: [
					Source.Lifi_Rest,
				],
			},
			$$marketsWithInstanceAsBase: {
				label: 'Markets with instance as base',
				entityType: EntityType.Market,
				cardinality: EntityFieldCardinality.ZeroOrMany,
			},
			$$marketsWithInstanceAsQuote: {
				label: 'Markets with instance as quote',
				entityType: EntityType.Market,
				cardinality: EntityFieldCardinality.ZeroOrMany,
			},
		}),
	},
})

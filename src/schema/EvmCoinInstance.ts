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
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	type: {
		primitiveType: type.enumerated(...Object.values(CoinInstanceType)),
		cardinality: EntityFieldCardinality.One,
	},
	$contract: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.One,
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
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			name: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			symbol: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			decimals: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			iconUrl: {
				primitiveType: UrlString,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$icon: {
				entityType: EntityType.Media,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			caip19: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			representation: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
					Source.Coingecko_Rest,
				],
			},
			$canonicalInstance: {
				entityType: EntityType.EvmCoinInstance,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Coingecko_Rest,
				],
			},
			$$outboundBridgeCapabilities: {
				entityType: EntityType.CoinBridgeCapability,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: [
					Source.Lifi_Rest,
				],
			},
			$$inboundBridgeCapabilities: {
				entityType: EntityType.CoinBridgeCapability,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: [
					Source.Lifi_Rest,
				],
			},
			$$marketsWithInstanceAsBase: {
				entityType: EntityType.Market,
				cardinality: EntityFieldCardinality.ZeroOrMany,
			},
			$$marketsWithInstanceAsQuote: {
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
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Blockscout_Rest,
					Source.Constants_Internal,
				],
			},
			name: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
					Source.Constants_Internal,
				],
			},
			symbol: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Blockscout_Rest,
					Source.Constants_Internal,
				],
			},
			decimals: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Blockscout_Rest,
					Source.Constants_Internal,
				],
			},
			iconUrl: {
				primitiveType: UrlString,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$icon: {
				entityType: EntityType.Media,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			caip19: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
					Source.Coingecko_Rest,
				],
			},
			representation: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Coingecko_Rest,
				],
			},
			$canonicalInstance: {
				entityType: EntityType.EvmCoinInstance,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Coingecko_Rest,
				],
			},
			$$outboundBridgeCapabilities: {
				entityType: EntityType.CoinBridgeCapability,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: [
					Source.Lifi_Rest,
				],
			},
			$$inboundBridgeCapabilities: {
				entityType: EntityType.CoinBridgeCapability,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: [
					Source.Lifi_Rest,
				],
			},
			$$marketsWithInstanceAsBase: {
				entityType: EntityType.Market,
				cardinality: EntityFieldCardinality.ZeroOrMany,
			},
			$$marketsWithInstanceAsQuote: {
				entityType: EntityType.Market,
				cardinality: EntityFieldCardinality.ZeroOrMany,
			},
		}),
	},
})

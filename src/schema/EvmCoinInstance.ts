// Generated from APP.ts.

import { entity, facet } from '$/schema/$schema.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const constantsInternalSources = [
	Source.Constants_Internal,
] as const
const constantsInternalCoingeckoRestSources = [
	Source.Constants_Internal,
	Source.Coingecko_Rest,
] as const
const coingeckoRestSources = [
	Source.Coingecko_Rest,
] as const
const lifiRestSources = [
	Source.Lifi_Rest,
] as const
const blockscoutRestConstantsInternalSources = [
	Source.Blockscout_Rest,
	Source.Constants_Internal,
] as const

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
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
				defaultSources: constantsInternalSources,
			},
			name: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: constantsInternalSources,
			},
			symbol: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
				defaultSources: constantsInternalSources,
			},
			decimals: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
				defaultSources: constantsInternalSources,
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
				defaultSources: constantsInternalSources,
			},
			representation: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: constantsInternalCoingeckoRestSources,
			},
			$canonicalInstance: {
				entityType: EntityType.EvmCoinInstance,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: coingeckoRestSources,
			},
			$$outboundBridgeCapabilities: {
				entityType: EntityType.CoinBridgeCapability,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: lifiRestSources,
			},
			$$inboundBridgeCapabilities: {
				entityType: EntityType.CoinBridgeCapability,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: lifiRestSources,
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
				defaultSources: blockscoutRestConstantsInternalSources,
			},
			name: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: blockscoutRestConstantsInternalSources,
			},
			symbol: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
				defaultSources: blockscoutRestConstantsInternalSources,
			},
			decimals: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
				defaultSources: blockscoutRestConstantsInternalSources,
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
				defaultSources: constantsInternalCoingeckoRestSources,
			},
			representation: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: coingeckoRestSources,
			},
			$canonicalInstance: {
				entityType: EntityType.EvmCoinInstance,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: coingeckoRestSources,
			},
			$$outboundBridgeCapabilities: {
				entityType: EntityType.CoinBridgeCapability,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: lifiRestSources,
			},
			$$inboundBridgeCapabilities: {
				entityType: EntityType.CoinBridgeCapability,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: lifiRestSources,
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

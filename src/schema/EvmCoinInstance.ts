// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum CoinInstanceType {
	NativeCurrency = 'NativeCurrency',
	Erc20Token = 'Erc20Token',
}
export enum EvmCoinInstanceSelector {
	NetworkType = 'NetworkType',
	NetworkTypeContract = 'NetworkTypeContract',
}
export const EvmCoinInstance = entity({
	entityType: EntityType.EvmCoinInstance,
	labels: {
		singular: 'EVM coin instance',
		plural: 'EVM coin instances',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	type: {
		label: 'Type',
		description: 'The source-domain type or category.',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(CoinInstanceType)),
		cardinality: EntityFieldCardinality.One,
	},
	$contract: {
		label: 'Contract',
		type: EntityFieldType.EntityReference,
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
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			name: {
				label: 'Name',
				description: 'The human-readable name of the native currency.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			symbol: {
				label: 'Symbol',
				description: 'The native currency ticker used for display.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			decimals: {
				label: 'Decimals',
				description: 'The native currency display precision.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			iconUrl: {
				label: 'Icon URL',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$icon: {
				label: 'Icon',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Media,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			caip19: {
				label: 'CAIP-19',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
			representation: {
				label: 'Representation',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
					Source.Coingecko_Rest,
				],
			},
			$canonicalInstance: {
				label: 'Canonical instance',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmCoinInstance,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Coingecko_Rest,
				],
			},
			$$outboundBridgeCapabilities: {
				label: 'Outbound bridge capabilities',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.CoinBridgeCapability,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: [
					Source.Lifi_Rest,
				],
			},
			$$inboundBridgeCapabilities: {
				label: 'Inbound bridge capabilities',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.CoinBridgeCapability,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: [
					Source.Lifi_Rest,
				],
			},
			$$marketsWithInstanceAsBase: {
				label: 'Markets with instance as base',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.Market,
				cardinality: EntityFieldCardinality.ZeroOrMany,
			},
			$$marketsWithInstanceAsQuote: {
				label: 'Markets with instance as quote',
				type: EntityFieldType.EntitiesReference,
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
				type: EntityFieldType.Primitive,
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
				type: EntityFieldType.Primitive,
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
				type: EntityFieldType.Primitive,
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
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Blockscout_Rest,
					Source.Constants_Internal,
				],
			},
			iconUrl: {
				label: 'Icon URL',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
			},
			$icon: {
				label: 'Icon',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Media,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			caip19: {
				label: 'CAIP-19',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
					Source.Coingecko_Rest,
				],
			},
			representation: {
				label: 'Representation',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Coingecko_Rest,
				],
			},
			$canonicalInstance: {
				label: 'Canonical instance',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmCoinInstance,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Coingecko_Rest,
				],
			},
			$$outboundBridgeCapabilities: {
				label: 'Outbound bridge capabilities',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.CoinBridgeCapability,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: [
					Source.Lifi_Rest,
				],
			},
			$$inboundBridgeCapabilities: {
				label: 'Inbound bridge capabilities',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.CoinBridgeCapability,
				cardinality: EntityFieldCardinality.ZeroOrMany,
				defaultSources: [
					Source.Lifi_Rest,
				],
			},
			$$marketsWithInstanceAsBase: {
				label: 'Markets with instance as base',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.Market,
				cardinality: EntityFieldCardinality.ZeroOrMany,
			},
			$$marketsWithInstanceAsQuote: {
				label: 'Markets with instance as quote',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.Market,
				cardinality: EntityFieldCardinality.ZeroOrMany,
			},
		}),
	},
})

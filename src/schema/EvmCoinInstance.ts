import { type } from 'arktype'
// Per-chain deployment of a catalog Coin (native or ERC-20). $$marketsWithInstanceAs* require a venue indexer—not wired yet (Constants/Coingecko resolvers throw).
import { CoinInstanceRepresentation } from '$/constants/Bridge.ts'
import { CoinId } from '$/constants/Coin.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import EvmContract from '$/schema/EvmContract.ts'
import { Source } from '$/sources/Source.ts'

export enum EvmCoinInstanceSelector {
	NetworkType = 'networkType',
	NetworkTypeContract = 'networkTypeContract',
}


export enum CoinInstanceType {
	NativeCurrency = 'NativeCurrency',
	Erc20Token = 'Erc20Token',
}

export default {
	entityType: EntityType.EvmCoinInstance,

	label: 'Coin deployment',
	labelPlural: 'Coin deployments',

	selectors: [
		{
			name: EvmCoinInstanceSelector.NetworkType,
			fields: [
				'$network',
				'type',
			],
		},
		{
			name: EvmCoinInstanceSelector.NetworkTypeContract,
			fields: [
				'$network',
				'type',
				'$contract',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'type',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(CoinInstanceType),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'coinId',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(CoinId),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'symbol',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'decimals',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$icon',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'caip19',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$marketsWithInstanceAsBase',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$marketsWithInstanceAsQuote',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'representation',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(CoinInstanceRepresentation),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
				Source.Coingecko_Rest,
			],
		},
		{
			name: '$canonicalInstance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmCoinInstance,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Coingecko_Rest,
			],
		},
		{
			name: '$$outboundBridgeCapabilities',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CoinBridgeCapability,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Lifi_Rest,
			],
		},
		{
			name: '$$inboundBridgeCapabilities',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CoinBridgeCapability,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Lifi_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

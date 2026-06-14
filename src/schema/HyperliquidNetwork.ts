import { type } from 'arktype'

import { TransportType } from '$/constants/TransportType.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import Network from '$/schema/Network.ts'
import { Source } from '$/sources/Source.ts'

export enum HyperliquidNetworkSelector {
	Network = 'network',
}


const hyperliquidEndpointField = type({
	url: UrlString,
	transportType: type.valueOf(TransportType),
	providerName: 'string',
})

export default {
	entityType: EntityType.HyperliquidNetwork,

	label: 'Hyperliquid network',
	labelPlural: 'Hyperliquid networks',

	selectors: [
		{
			name: HyperliquidNetworkSelector.Network,
			fields: [
				'$network',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'rpcEndpoints',
			type: EntityFieldType.Primitive,
			primitiveType: hyperliquidEndpointField,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Hyperliquid_JsonRpc,
			],
		},
		{
			name: 'restEndpoints',
			type: EntityFieldType.Primitive,
			primitiveType: hyperliquidEndpointField,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Hyperliquid_Rest,
			],
		},
		{
			name: '$$timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HyperliquidNetwork_Timestamp,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Hyperliquid_Rest,
			],
		},
		{
			name: '$$blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HyperliquidBlock,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Hyperliquid_JsonRpc,
			],
		},
		{
			name: '$$transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HyperliquidTransaction,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Hyperliquid_JsonRpc,
			],
		},
		{
			name: '$$validators',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HyperliquidValidator,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Hyperliquid_Rest,
			],
		},
		{
			name: '$$perpMarkets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HyperliquidPerpMarket,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Hyperliquid_Rest,
			],
		},
		{
			name: '$$spotAssets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HyperliquidSpotAsset,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Hyperliquid_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

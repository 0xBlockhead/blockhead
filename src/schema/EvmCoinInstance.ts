// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum CoinInstanceType {
	NativeCurrency = 'NativeCurrency',
	Erc20Token = 'Erc20Token',
}
export enum EvmCoinInstanceSelector {
	NetworkType = 'NetworkType',
	NetworkTypeContract = 'NetworkTypeContract',
}
export default {
	entityType: EntityType.EvmCoinInstance,
	label: 'EVM coin instance',
	labelPlural: 'EVM coin instances',
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
			label: 'Network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'type',
			label: 'Type',
			description: 'The source-domain type or category.',
			type: EntityFieldType.Primitive,
			primitiveType: type.enumerated(...Object.values(CoinInstanceType)),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$contract',
			label: 'Contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'coinId',
			label: 'Coin ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'symbol',
			label: 'Symbol',
			description: 'The short ticker or symbol used for display.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'decimals',
			label: 'Decimals',
			description: 'The number of decimal places used to display the amount.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'iconUrl',
			label: 'Icon URL',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$icon',
			label: 'Icon',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'caip19',
			label: 'CAIP-19',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'representation',
			label: 'Representation',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$canonicalInstance',
			label: 'Canonical instance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmCoinInstance,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$outboundBridgeCapabilities',
			label: 'Outbound bridge capabilities',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CoinBridgeCapability,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$inboundBridgeCapabilities',
			label: 'Inbound bridge capabilities',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CoinBridgeCapability,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$marketsWithInstanceAsBase',
			label: 'Markets with instance as base',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$marketsWithInstanceAsQuote',
			label: 'Markets with instance as quote',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	],
} as const satisfies EntityDefinition

// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
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
export const EvmCoinInstance = entity({
	entityType: EntityType.EvmCoinInstance,
	label: 'EVM coin instance',
	labelPlural: 'EVM coin instances',
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
	coinId: {
		label: 'Coin ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	symbol: {
		label: 'Symbol',
		description: 'The short ticker or symbol used for display.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	decimals: {
		label: 'Decimals',
		description: 'The number of decimal places used to display the amount.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
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
	},
	representation: {
		label: 'Representation',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$canonicalInstance: {
		label: 'Canonical instance',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$outboundBridgeCapabilities: {
		label: 'Outbound bridge capabilities',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CoinBridgeCapability,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$inboundBridgeCapabilities: {
		label: 'Inbound bridge capabilities',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CoinBridgeCapability,
		cardinality: EntityFieldCardinality.ZeroOrMany,
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
})

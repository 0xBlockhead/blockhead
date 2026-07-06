// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StellarTradeSelector {
	NetworkTradeIdSource = 'NetworkTradeIdSource',
}
export default {
	entityType: EntityType.StellarTrade,
	label: 'stellar trade',
	labelPlural: 'stellar trades',
	selectors: [
		{
			name: StellarTradeSelector.NetworkTradeIdSource,
			fields: [
				'$network',
				'tradeId',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StellarNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'tradeId',
			label: 'trade ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'ledgerCloseTimeMs',
			label: 'ledger close time ms',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$baseAccount',
			label: 'base account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StellarAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$counterAccount',
			label: 'counter account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StellarAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$baseOffer',
			label: 'base offer',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StellarOffer,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$counterOffer',
			label: 'counter offer',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StellarOffer,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$baseLiquidityPool',
			label: 'base liquidity pool',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StellarLiquidityPool,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$counterLiquidityPool',
			label: 'counter liquidity pool',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StellarLiquidityPool,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$baseAsset',
			label: 'base asset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StellarAsset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$counterAsset',
			label: 'counter asset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StellarAsset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'baseAmount',
			label: 'base amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'counterAmount',
			label: 'counter amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'priceNumerator',
			label: 'price numerator',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'priceDenominator',
			label: 'price denominator',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$transaction',
			label: 'transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StellarTransaction,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$operation',
			label: 'operation',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StellarOperation,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum DydxChainOrderSelector {
	SubaccountOrderId = 'SubaccountOrderId',
}
export default {
	entityType: EntityType.DydxChainOrder,
	label: 'dydx chain order',
	labelPlural: 'dydx chain orders',
	selectors: [
		{
			name: DydxChainOrderSelector.SubaccountOrderId,
			fields: [
				'$subaccount',
				'orderId',
			],
		},
	],
	fields: [
		{
				name: '$subaccount',
				label: 'subaccount',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.DydxChainSubaccount,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'orderId',
				label: 'order ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$market',
				label: 'market',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.DydxChainMarket,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'side',
				label: 'side',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'orderType',
				label: 'order type',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'timeInForce',
				label: 'time in force',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'clientId',
				label: 'client ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'goodTilBlock',
				label: 'good til block',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'goodTilBlockTimeMs',
				label: 'good til block time ms',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.DydxChainOrder_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

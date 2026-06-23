import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum DydxChainPerpetualPosition_TimestampSelector {
	SubaccountMarketTimestampMsSource = '$subaccount+$market+timestampMs+source',
}
export default {
	entityType: EntityType.DydxChainPerpetualPosition_Timestamp,
	label: 'dydx chain perpetual position timestamp',
	labelPlural: 'dydx chain perpetual position observations',
	selectors: [
		{
			name: DydxChainPerpetualPosition_TimestampSelector.SubaccountMarketTimestampMsSource,
			fields: [
				'$subaccount',
				'$market',
				'timestampMs',
				'source',
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
			name: '$market',
			label: 'market',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.DydxChainMarket,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'blockHeight',
			label: 'block height',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'side',
			label: 'side',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'size',
			label: 'size',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'entryPrice',
			label: 'entry price',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'unrealizedPnl',
			label: 'unrealized pnl',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'realizedPnl',
			label: 'realized pnl',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'fundingIndex',
			label: 'funding index',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

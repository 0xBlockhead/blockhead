// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum Market_TimestampSelector {
	MarketTimestampMsFeedKey = 'MarketTimestampMsFeedKey',
}
export default {
	entityType: EntityType.Market_Timestamp,
	label: 'market timestamp',
	labelPlural: 'market observations',
	description: 'A point-in-time market quote or metric observation.',
	selectors: [
		{
			name: Market_TimestampSelector.MarketTimestampMsFeedKey,
			fields: [
				'$market',
				'timestampMs',
				'feedKey',
			],
		},
	],
	fields: [
		{
			name: '$market',
			label: 'Market',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'feedKey',
			label: 'Feed key',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'price',
			label: 'Price',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transport',
			label: 'Transport',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'providerAssetId',
			label: 'Provider asset ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'caip19',
			label: 'CAIP-19',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

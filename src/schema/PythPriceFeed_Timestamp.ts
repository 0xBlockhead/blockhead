// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum PythPriceFeed_TimestampSelector {
	FeedPublishTimeMsSource = 'FeedPublishTimeMsSource',
}
export default {
	entityType: EntityType.PythPriceFeed_Timestamp,
	label: 'Pyth price feed timestamp',
	labelPlural: 'Pyth price feed observations',
	selectors: [
		{
			name: PythPriceFeed_TimestampSelector.FeedPublishTimeMsSource,
			fields: [
				'$feed',
				'publishTimeMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$feed',
			label: 'Feed',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.PythPriceFeed,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'publishTimeMs',
			label: 'Publish time ms',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
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
			name: 'observedAtMs',
			label: 'Observed at ms',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'price',
			label: 'Price',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'conf',
			label: 'Conf',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'expo',
			label: 'Expo',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'emaPrice',
			label: 'EMA price',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'emaConf',
			label: 'EMA conf',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'vaa',
			label: 'VAA',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'updateDataHash',
			label: 'Update data hash',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'slot',
			label: 'Slot',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sequence',
			label: 'Sequence',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'onChainNetwork',
			label: 'On-chain network',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'onChainContract',
			label: 'On-chain contract',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'stale',
			label: 'Stale',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

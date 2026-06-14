import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum HyperliquidNetwork_TimestampSelector {
	NetworkTimestampMs = 'networkTimestampMs',
}
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.HyperliquidNetwork_Timestamp,

	label: 'Hyperliquid network snapshot',
	labelPlural: 'Hyperliquid network snapshots',

	selectors: [
		{
			name: HyperliquidNetwork_TimestampSelector.NetworkTimestampMs,
			fields: [
				'$network',
				'timestampMs',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'perpMarketCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Hyperliquid_Rest,
			],
		},
		{
			name: 'spotAssetCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Hyperliquid_Rest,
			],
		},
		{
			name: 'spotPairCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Hyperliquid_Rest,
			],
		},
		{
			name: 'validatorCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Hyperliquid_Rest,
			],
		},
		{
			name: 'activeValidatorCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Hyperliquid_Rest,
			],
		},
		{
			name: 'jailedValidatorCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Hyperliquid_Rest,
			],
		},
		{
			name: 'totalStake',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Hyperliquid_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

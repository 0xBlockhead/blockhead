import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Network from '$/schema/Network.ts'
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.HyperliquidNetwork_Timestamp,

	label: 'Hyperliquid network snapshot',
	labelPlural: 'Hyperliquid network snapshots',

	id: type({
		$network: Network.id,
		timestampMs: 'number',
	}),

	fields: [
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

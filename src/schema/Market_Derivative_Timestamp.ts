import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Market from '$/schema/Market.ts'
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.Market_Derivative_Timestamp,

	label: 'Derivative market observation',
	labelPlural: 'Derivative market observations',

	id: type({
		$market: Market.id,
		timestampMs: 'number',
		'feedKey?': 'string',
	}),

	fields: [
		{
			name: '$parentMarket',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Coingecko_OpenApi,
			],
		},
		{
			name: 'fundingRate',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Coingecko_OpenApi,
			],
		},
		{
			name: 'openInterestUsd',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Coingecko_OpenApi,
			],
		},
		{
			name: 'indexBasisPercent',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Coingecko_OpenApi,
			],
		},
		{
			name: 'markPrice',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'indexPrice',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'expiredAtMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Coingecko_OpenApi,
			],
		},
		{
			name: 'lastTradedAtMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Coingecko_OpenApi,
			],
		},
		{
			name: 'providerAssetId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string | null'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transport',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

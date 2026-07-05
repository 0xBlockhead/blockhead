// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum AiBenchmarkSelector {
	BenchmarkId = 'BenchmarkId',
	BenchmarkUri = 'BenchmarkUri',
	SourceSourceBenchmarkId = 'SourceSourceBenchmarkId',
}
export default {
	entityType: EntityType.AiBenchmark,
	label: 'AI benchmark',
	labelPlural: 'AI benchmarks',
	selectors: [
		{
			name: AiBenchmarkSelector.BenchmarkId,
			fields: [
				'benchmarkId',
			],
		},
		{
			name: AiBenchmarkSelector.BenchmarkUri,
			fields: [
				'benchmarkUri',
			],
		},
		{
			name: AiBenchmarkSelector.SourceSourceBenchmarkId,
			fields: [
				'source',
				'sourceBenchmarkId',
			],
		},
	],
	fields: [
		{
				name: 'benchmarkId',
				label: 'benchmark ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'benchmarkUri',
				label: 'benchmark URI',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'sourceBenchmarkId',
				label: 'source benchmark ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'label',
				label: 'Label',
				description: 'A human-readable name for the subject.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'taskType',
				label: 'task type',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'metricName',
				label: 'metric name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'metricType',
				label: 'metric type',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'license',
				label: 'license',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$dataset',
				label: 'dataset',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AiDataset,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$documents',
				label: 'documents',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.AiDocument,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

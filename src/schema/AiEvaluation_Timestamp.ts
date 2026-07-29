// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AiEvaluation_Timestamp,
	labels: {
		singular: 'AI evaluation timestamp',
		plural: 'AI evaluation observations',
	},
})({
	subjectKind: {
		label: 'subject kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	subjectSelector: {
		label: 'subject selector',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.One,
	},
	$benchmark: {
		label: 'benchmark',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AiBenchmark,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$model: {
		label: 'model',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AiModel,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$modelVersion: {
		label: 'model version',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AiModelVersion,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$a2aAgentService: {
		label: 'a2a agent service',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.A2aAgentService,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$mcpServer: {
		label: 'mcp server',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.McpServer,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$eip8004Registration: {
		label: 'eip8004 registration',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Eip8004AgentRegistration,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceRunId: {
		label: 'source run ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceResultId: {
		label: 'source result ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metricName: {
		label: 'metric name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	metricType: {
		label: 'metric type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		label: 'Value',
		description: 'The source-domain value.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	unit: {
		label: 'unit',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	step: {
		label: 'step',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	split: {
		label: 'split',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	method: {
		label: 'method',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	harnessVersion: {
		label: 'harness version',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	datasetName: {
		label: 'dataset name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	datasetType: {
		label: 'dataset type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	datasetConfig: {
		label: 'dataset config',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	datasetSplit: {
		label: 'dataset split',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	datasetDigest: {
		label: 'dataset digest',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceName: {
		label: 'source name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceUrl: {
		label: 'source URL',
		type: EntityFieldType.Primitive,
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payload: {
		label: 'payload',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SubjectKindSubjectSelectorBenchmarkMetricNameTimestampMsSource: [
			'subjectKind',
			'subjectSelector',
			'$benchmark',
			'metricName',
			'timestampMs',
			'source',
		],
	},
})

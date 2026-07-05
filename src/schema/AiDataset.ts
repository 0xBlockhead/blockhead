// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum AiDatasetSelector {
	DatasetUri = 'DatasetUri',
	HuggingFaceDatasetIdRevision = 'HuggingFaceDatasetIdRevision',
	SourceDatasetNameDatasetDigest = 'SourceDatasetNameDatasetDigest',
	Artifact = 'Artifact',
}
export default {
	entityType: EntityType.AiDataset,
	label: 'AI dataset',
	labelPlural: 'AI datasets',
	selectors: [
		{
			name: AiDatasetSelector.DatasetUri,
			fields: [
				'datasetUri',
			],
		},
		{
			name: AiDatasetSelector.HuggingFaceDatasetIdRevision,
			fields: [
				'huggingFaceDatasetId',
				'revision',
			],
		},
		{
			name: AiDatasetSelector.SourceDatasetNameDatasetDigest,
			fields: [
				'source',
				'datasetName',
				'datasetDigest',
			],
		},
		{
			name: AiDatasetSelector.Artifact,
			fields: [
				'$artifact',
			],
		},
	],
	fields: [
		{
				name: 'datasetUri',
				label: 'dataset URI',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'huggingFaceDatasetId',
				label: 'hugging face dataset ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'revision',
				label: 'revision',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
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
				name: 'datasetName',
				label: 'dataset name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'datasetDigest',
				label: 'dataset digest',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$artifact',
				label: 'artifact',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AiArtifact,
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
				name: 'license',
				label: 'license',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'modality',
				label: 'modality',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'version',
				label: 'version',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'isLiveDataset',
				label: 'is live dataset',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
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

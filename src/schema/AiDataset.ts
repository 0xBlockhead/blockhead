// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum AiDatasetSelector {
	DatasetUri = 'DatasetUri',
	HuggingFaceDatasetIdRevision = 'HuggingFaceDatasetIdRevision',
	SourceDatasetNameDatasetDigest = 'SourceDatasetNameDatasetDigest',
	Artifact = 'Artifact',
}
export const AiDataset = entity({
	entityType: EntityType.AiDataset,
	labels: {
		singular: 'AI dataset',
		plural: 'AI datasets',
	},
})({
	datasetUri: {
		label: 'dataset URI',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	huggingFaceDatasetId: {
		label: 'hugging face dataset ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	revision: {
		label: 'revision',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
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
	datasetDigest: {
		label: 'dataset digest',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$artifact: {
		label: 'artifact',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AiArtifact,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	license: {
		label: 'license',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	modality: {
		label: 'modality',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	version: {
		label: 'version',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isLiveDataset: {
		label: 'is live dataset',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$documents: {
		label: 'documents',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AiDocument,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		DatasetUri: [
			'datasetUri',
		],
		HuggingFaceDatasetIdRevision: [
			'huggingFaceDatasetId',
			'revision',
		],
		SourceDatasetNameDatasetDigest: [
			'source',
			'datasetName',
			'datasetDigest',
		],
		Artifact: [
			'$artifact',
		],
	},
})

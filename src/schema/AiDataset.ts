// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AiDataset,
	labels: {
		singular: 'AI dataset',
		plural: 'AI datasets',
	},
})({
	datasetUri: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	huggingFaceDatasetId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	revision: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	datasetName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	datasetDigest: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$artifact: {
		entityType: EntityType.AiArtifact,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	label: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	license: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	modality: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	version: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isLiveDataset: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$documents: {
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

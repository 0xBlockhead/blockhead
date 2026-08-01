// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AiModelVersion,
	labels: {
		singular: 'AI model version',
		plural: 'AI model versions',
	},
})({
	$model: {
		label: 'model',
		entityType: EntityType.AiModel,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	versionId: {
		label: 'version ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$artifact: {
		label: 'artifact',
		entityType: EntityType.AiArtifact,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	huggingFaceRepo: {
		label: 'hugging face repo',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	revision: {
		label: 'revision',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mlflowRegisteredModelName: {
		label: 'mlflow registered model name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mlflowModelVersion: {
		label: 'mlflow model version',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	onnxIrVersion: {
		label: 'onnx ir version',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	onnxOpsetImports: {
		label: 'onnx opset imports',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	trainingCutoff: {
		label: 'training cutoff',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	quantization: {
		label: 'quantization',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fineTuneKind: {
		label: 'fine tune kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$documents: {
		label: 'documents',
		entityType: EntityType.AiDocument,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ModelVersionId: [
			'$model',
			'versionId',
		],
		Artifact: [
			'$artifact',
		],
		HuggingFaceRepoRevision: [
			'huggingFaceRepo',
			'revision',
		],
	},
})

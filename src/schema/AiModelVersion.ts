import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AiModelVersionSelector {
	ModelVersionId = '$model+versionId',
	Artifact = '$artifact',
	HuggingFaceRepoRevision = 'huggingFaceRepo+revision',
}
export default {
	entityType: EntityType.AiModelVersion,
	label: 'AI model version',
	labelPlural: 'AI model versions',
	selectors: [
		{
			name: AiModelVersionSelector.ModelVersionId,
			fields: [
				'$model',
				'versionId',
			],
		},
		{
			name: AiModelVersionSelector.Artifact,
			fields: [
				'$artifact',
			],
		},
		{
			name: AiModelVersionSelector.HuggingFaceRepoRevision,
			fields: [
				'huggingFaceRepo',
				'revision',
			],
		},
	],
	fields: [
		{
			name: '$model',
			label: 'model',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AiModel,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'versionId',
			label: 'version ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
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
			name: 'huggingFaceRepo',
			label: 'hugging face repo',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'revision',
			label: 'revision',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'mlflowRegisteredModelName',
			label: 'mlflow registered model name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'mlflowModelVersion',
			label: 'mlflow model version',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'onnxIrVersion',
			label: 'onnx ir version',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'onnxOpsetImports',
			label: 'onnx opset imports',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			label: 'Created',
			description: 'The time when the subject was created according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'trainingCutoff',
			label: 'training cutoff',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'quantization',
			label: 'quantization',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'fineTuneKind',
			label: 'fine tune kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
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

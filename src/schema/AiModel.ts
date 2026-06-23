import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AiModelSelector {
	ProviderProviderModelId = '$provider+providerModelId',
}
export default {
	entityType: EntityType.AiModel,
	label: 'AI model',
	labelPlural: 'AI models',
	selectors: [
		{
			name: AiModelSelector.ProviderProviderModelId,
			fields: [
				'$provider',
				'providerModelId',
			],
		},
	],
	fields: [
		{
			name: '$provider',
			label: 'provider',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AiModelProvider,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'providerModelId',
			label: 'provider model ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'providerResourceName',
			label: 'provider resource name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'baseModelId',
			label: 'base model ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'label',
			label: 'Label',
			description: 'A human-readable name for the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'modelFamily',
			label: 'model family',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'providerOwnedBy',
			label: 'provider owned by',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'providerCreatedAt',
			label: 'provider created AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$versions',
			label: 'versions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AiModelVersion,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$documents',
			label: 'documents',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AiDocument,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AiModel_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AiModel,
	labels: {
		singular: 'AI model',
		plural: 'AI models',
	},
})({
	$provider: {
		label: 'provider',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AiModelProvider,
		cardinality: EntityFieldCardinality.One,
	},
	providerModelId: {
		label: 'provider model ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	providerResourceName: {
		label: 'provider resource name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	baseModelId: {
		label: 'base model ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	modelFamily: {
		label: 'model family',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerOwnedBy: {
		label: 'provider owned by',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerCreatedAt: {
		label: 'provider created AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$versions: {
		label: 'versions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AiModelVersion,
		cardinality: EntityFieldCardinality.Many,
	},
	$$documents: {
		label: 'documents',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AiDocument,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AiModel_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ProviderModelId: [
			'$provider',
			'providerModelId',
		],
	},
})

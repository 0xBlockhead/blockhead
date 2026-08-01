// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.AiModelProvider,
		cardinality: EntityFieldCardinality.One,
	},
	providerModelId: {
		label: 'provider model ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	providerResourceName: {
		label: 'provider resource name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	baseModelId: {
		label: 'base model ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	modelFamily: {
		label: 'model family',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerOwnedBy: {
		label: 'provider owned by',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerCreatedAt: {
		label: 'provider created AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$versions: {
		label: 'versions',
		entityType: EntityType.AiModelVersion,
		cardinality: EntityFieldCardinality.Many,
	},
	$$documents: {
		label: 'documents',
		entityType: EntityType.AiDocument,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
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

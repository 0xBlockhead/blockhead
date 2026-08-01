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
		entityType: EntityType.AiModelProvider,
		cardinality: EntityFieldCardinality.One,
	},
	providerModelId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	providerResourceName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	baseModelId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	label: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	modelFamily: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerOwnedBy: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerCreatedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$versions: {
		entityType: EntityType.AiModelVersion,
		cardinality: EntityFieldCardinality.Many,
	},
	$$documents: {
		entityType: EntityType.AiDocument,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
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

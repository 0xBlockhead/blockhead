// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum AiModelProviderSelector {
	Domain = 'Domain',
	ProviderId = 'ProviderId',
}
export const AiModelProvider = entity({
	entityType: EntityType.AiModelProvider,
	label: 'AI model provider',
	labelPlural: 'AI model providers',
})({
	domain: {
		label: 'domain',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerId: {
		label: 'provider ID',
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
	organizationKind: {
		label: 'organization kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	homepageUrl: {
		label: 'homepage URL',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	docsUrl: {
		label: 'docs URL',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$catalogEntries: {
		label: 'catalog entries',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AiProviderCatalogEntry,
		cardinality: EntityFieldCardinality.Many,
	},
	$$apiOperations: {
		label: 'API operations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AiProviderApiOperation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$models: {
		label: 'models',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AiModel,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Domain: [
			'domain',
		],
		ProviderId: [
			'providerId',
		],
	},
})

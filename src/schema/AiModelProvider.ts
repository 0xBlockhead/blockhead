// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AiModelProvider,
	labels: {
		singular: 'AI model provider',
		plural: 'AI model providers',
	},
})({
	domain: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	providerId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	organizationKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	homepageUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	docsUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$catalogEntries: {
		entityType: EntityType.AiProviderCatalogEntry,
		cardinality: EntityFieldCardinality.Many,
	},
	$$apiOperations: {
		entityType: EntityType.AiProviderApiOperation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$models: {
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

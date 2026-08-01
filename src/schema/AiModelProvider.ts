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
		label: 'domain',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerId: {
		label: 'provider ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	organizationKind: {
		label: 'organization kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	homepageUrl: {
		label: 'homepage URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	docsUrl: {
		label: 'docs URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$catalogEntries: {
		label: 'catalog entries',
		entityType: EntityType.AiProviderCatalogEntry,
		cardinality: EntityFieldCardinality.Many,
	},
	$$apiOperations: {
		label: 'API operations',
		entityType: EntityType.AiProviderApiOperation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$models: {
		label: 'models',
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

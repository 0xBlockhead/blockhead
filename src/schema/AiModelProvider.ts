// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum AiModelProviderSelector {
	Domain = 'Domain',
	ProviderId = 'ProviderId',
}
export default {
	entityType: EntityType.AiModelProvider,
	label: 'AI model provider',
	labelPlural: 'AI model providers',
	selectors: [
		{
			name: AiModelProviderSelector.Domain,
			fields: [
				'domain',
			],
		},
		{
			name: AiModelProviderSelector.ProviderId,
			fields: [
				'providerId',
			],
		},
	],
	fields: [
		{
			name: 'domain',
			label: 'domain',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'providerId',
			label: 'provider ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'label',
			label: 'Label',
			description: 'A human-readable name for the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'organizationKind',
			label: 'organization kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'homepageUrl',
			label: 'homepage URL',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'docsUrl',
			label: 'docs URL',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$catalogEntries',
			label: 'catalog entries',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AiProviderCatalogEntry,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$apiOperations',
			label: 'API operations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AiProviderApiOperation,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$models',
			label: 'models',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AiModel,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

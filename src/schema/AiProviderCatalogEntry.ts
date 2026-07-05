// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AiProviderCatalogEntrySelector {
	ProviderCatalogKindProviderEntryId = 'ProviderCatalogKindProviderEntryId',
}
export default {
	entityType: EntityType.AiProviderCatalogEntry,
	label: 'AI provider catalog entry',
	labelPlural: 'AI provider catalog entries',
	selectors: [
		{
			name: AiProviderCatalogEntrySelector.ProviderCatalogKindProviderEntryId,
			fields: [
				'$provider',
				'catalogKind',
				'providerEntryId',
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
				name: 'catalogKind',
				label: 'catalog kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'providerEntryId',
				label: 'provider entry ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'entryLabel',
				label: 'entry label',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'subjectKind',
				label: 'subject kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'subjectSelector',
				label: 'subject selector',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.AiProviderCatalogEntry_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

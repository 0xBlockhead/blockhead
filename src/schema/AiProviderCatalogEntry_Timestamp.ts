import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AiProviderCatalogEntry_TimestampSelector {
	EntryTimestampMsSource = '$entry+timestampMs+source',
}
export default {
	entityType: EntityType.AiProviderCatalogEntry_Timestamp,
	label: 'AI provider catalog entry timestamp',
	labelPlural: 'AI provider catalog entry observations',
	selectors: [
		{
			name: AiProviderCatalogEntry_TimestampSelector.EntryTimestampMsSource,
			fields: [
				'$entry',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$entry',
			label: 'entry',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AiProviderCatalogEntry,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'availabilityStatus',
			label: 'availability status',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'raw',
			label: 'raw',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

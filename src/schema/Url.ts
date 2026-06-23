import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum UrlSelector {
	Url = 'url',
}
export default {
	entityType: EntityType.Url,
	label: 'URL',
	labelPlural: 'URLs',
	description: 'A web URL that is modeled as a referenced resource rather than an inline string.',
	selectors: [
		{
			name: UrlSelector.Url,
			fields: [
				'url',
			],
		},
	],
	fields: [
		{
			name: 'url',
			label: 'URL',
			description: 'The URL for the source-domain resource.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$previewTimestamps',
			label: 'preview timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.UrlPreview_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

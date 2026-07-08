// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum UrlSelector {
	Url = 'Url',
}
export const Url = entity({
	entityType: EntityType.Url,
	label: 'URL',
	labelPlural: 'URLs',
	description: 'A web URL that is modeled as a referenced resource rather than an inline string.',
})({
	url: {
		label: 'URL',
		description: 'The URL for the source-domain resource.',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.One,
	},
	$$previewTimestamps: {
		label: 'Preview timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.UrlPreview_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Url: [
			'url',
		],
	},
})

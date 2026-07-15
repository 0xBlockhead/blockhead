// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum MediaType {
	Image = 'Image',
	Video = 'Video',
	Audio = 'Audio',
	Model = 'Model',
	Other = 'Other',
}
export enum MediaTransport {
	Http = 'Http',
	Ipfs = 'Ipfs',
	Arweave = 'Arweave',
}
export enum MediaSelector {
	Url = 'Url',
}
export const Media = entity({
	entityType: EntityType.Media,
	labels: {
		singular: 'Media',
		plural: 'media',
	},
})({
	url: {
		label: 'URL',
		description: 'The URL for the source-domain resource.',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.One,
	},
	type: {
		label: 'Type',
		description: 'The source-domain type or category.',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(MediaType)),
		cardinality: EntityFieldCardinality.One,
	},
	transport: {
		label: 'Transport',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(MediaTransport)),
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		label: 'Hash',
		description: 'The hash that identifies this object in its protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		Url: [
			'url',
		],
	},
})

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
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
export default {
	entityType: EntityType.Media,
	label: 'Media',
	labelPlural: 'media',
	selectors: [
		{
			name: MediaSelector.Url,
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
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'type',
			label: 'Type',
			description: 'The source-domain type or category.',
			type: EntityFieldType.Primitive,
			primitiveType: type.enumerated(...Object.values(MediaType)),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transport',
			label: 'Transport',
			type: EntityFieldType.Primitive,
			primitiveType: type.enumerated(...Object.values(MediaTransport)),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hash',
			label: 'Hash',
			description: 'The hash that identifies this object in its protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
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
	Url = 'url',
}
export default {
	entityType: EntityType.Media,
	label: 'media',
	labelPlural: 'medias',
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
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'type',
			label: 'Type',
			description: 'The source-domain type or category.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transport',
			label: 'transport',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hash',
			label: 'Hash',
			description: 'The hash that identifies this object in its protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$original',
			label: 'original',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MediaObject,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$thumbnail',
			label: 'thumbnail',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MediaObject,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$low',
			label: 'low',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MediaObject,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$medium',
			label: 'medium',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MediaObject,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$high',
			label: 'high',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MediaObject,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

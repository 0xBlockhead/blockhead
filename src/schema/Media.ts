import { type } from 'arktype'

import { UrlString } from '$/schema/UrlString.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import type { Entity } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum MediaSelector {
	Url = 'url',
}



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

export default {
	entityType: EntityType.Media,

	label: 'Media',
	labelPlural: 'Media',

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
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'type',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(MediaType),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transport',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(MediaTransport),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hash',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$original',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MediaObject,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$thumbnail',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MediaObject,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$low',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MediaObject,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$medium',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MediaObject,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$high',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MediaObject,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

export type Media<_MediaType extends MediaType = MediaType> = (
	Entity<typeof schema, EntityType.Media> &
	{ type: _MediaType, transport: MediaTransport }
)

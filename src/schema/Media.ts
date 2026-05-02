import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import type { Entity } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'


export enum MediaType {
	Image = 'Image',
	Video = 'Video',
	Audio = 'Audio',
	Model = 'Model',
	Other = 'Other',
}

export default {
	entityType: EntityType.Media,

	label: 'Media',
	labelPlural: 'Media',

	id: type({
		url: 'string',
	}),

	fields: [
		{
			name: 'type',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(MediaType),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string.hex' as type.cast<`0x${string}`>),
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
	{ type: _MediaType }
)

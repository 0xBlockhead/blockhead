import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import type { Entity } from '$/schema/$schema.ts'
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

	id: type({
		url: 'string',
	}),

	fields: [
		
	], as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

export type Media<_MediaType extends MediaType = MediaType> = Extract<
	Entity<EntityType.Media>,
	{ type: _MediaType }
>

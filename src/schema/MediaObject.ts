import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import type { Entity } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export default {
	entityType: EntityType.MediaObject,

	label: 'Media Object',

	id: type({
		url: 'string',
	}),

	fields: [
		
	], as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

export type MediaObject = Entity<EntityType.MediaObject>

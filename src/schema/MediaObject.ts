import { type } from 'arktype'

import { UrlString } from '$/schema/UrlString.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import type { Entity } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum MediaObjectSelector {
	Url = 'url',
}

export default {
	entityType: EntityType.MediaObject,

	label: 'Media Object',
	labelPlural: 'Media Objects',

	selectors: [
		{
			name: MediaObjectSelector.Url,
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
			name: 'width',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'height',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'mimeType',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'size',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

export type MediaObject = Entity<typeof schema, EntityType.MediaObject>

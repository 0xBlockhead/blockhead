import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export default {
	entityType: EntityType.YouTubePlaylist,

	label: 'YouTube playlist',
	labelPlural: 'YouTube playlists',

	id: type({
		playlistId: 'string',
	}),

	fields: [
		{
			name: 'title',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'description',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'itemCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'publishedAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'publishedAtMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$channel',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.YouTubeChannel,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$videos',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.YouTubeVideo,
			cardinality: EntityFieldCardinality.Many,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

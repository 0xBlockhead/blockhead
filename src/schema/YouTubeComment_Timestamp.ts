import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import YouTubeComment from '$/schema/YouTubeComment.ts'
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.YouTubeComment_Timestamp,

	label: 'YouTube comment snapshot',
	labelPlural: 'YouTube comment snapshots',

	id: type({
		$comment: YouTubeComment.id,
		timestampMs: 'number',
	}),

	fields: [
		{
			name: 'likeCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
		},
		{
			name: 'replyCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

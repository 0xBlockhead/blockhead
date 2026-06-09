import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import RedditComment from '$/schema/RedditComment.ts'
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.RedditComment_Timestamp,

	label: 'Reddit comment snapshot',
	labelPlural: 'Reddit comment snapshots',

	id: type({
		$comment: RedditComment.id,
		timestampMs: 'number',
	}),

	fields: [
		{
			name: 'score',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Reddit_Rest,
				Source.Reddit_PublicJson,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

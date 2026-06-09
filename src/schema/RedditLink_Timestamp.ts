import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import RedditLink from '$/schema/RedditLink.ts'
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.RedditLink_Timestamp,

	label: 'Reddit post snapshot',
	labelPlural: 'Reddit post snapshots',

	id: type({
		$link: RedditLink.id,
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
		{
			name: 'commentCount',
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

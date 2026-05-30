import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import YouTubePlaylist from '$/schema/YouTubePlaylist.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	entityType: EntityType.YouTubePlaylist_Timestamp,

	label: 'YouTube playlist snapshot',
	labelPlural: 'YouTube playlist snapshots',

	id: type({
		$playlist: YouTubePlaylist.id,
		timestampMs: 'number',
	}),

	fields: [
		{
			name: 'itemCount',
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

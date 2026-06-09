import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import FarcasterChannel from '$/schema/FarcasterChannel.ts'
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.FarcasterChannel_Timestamp,

	label: 'Farcaster channel snapshot',
	labelPlural: 'Farcaster channel snapshots',

	id: type({
		$channel: FarcasterChannel.id,
		timestampMs: 'number',
	}),

	fields: [
		{
			name: 'followerCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Farcaster_Rest,
			],
		},
		{
			name: 'memberCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Farcaster_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

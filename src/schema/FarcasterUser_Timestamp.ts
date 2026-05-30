import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import FarcasterUser from '$/schema/FarcasterUser.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	entityType: EntityType.FarcasterUser_Timestamp,

	label: 'Farcaster user snapshot',
	labelPlural: 'Farcaster user snapshots',

	id: type({
		$user: FarcasterUser.id,
		timestampMs: 'number',
	}),

	fields: [
		{
			name: 'followerCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
			],
		},
		{
			name: 'followingCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

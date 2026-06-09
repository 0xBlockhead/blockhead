import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import XUser from '$/schema/XUser.ts'
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.XUser_Timestamp,

	label: 'X user snapshot',
	labelPlural: 'X user snapshots',

	id: type({
		$user: XUser.id,
		timestampMs: 'number',
	}),

	fields: [
		{
			name: 'followerCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.X_Rest,
				Source.X_FxEmbed_Rest,
			],
		},
		{
			name: 'followingCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.X_Rest,
				Source.X_FxEmbed_Rest,
			],
		},
		{
			name: 'tweetCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.X_Rest,
				Source.X_FxEmbed_Rest,
			],
		},
		{
			name: 'listedCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.X_Rest,
				Source.X_FxEmbed_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

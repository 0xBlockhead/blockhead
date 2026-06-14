import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import AtprotoActor from '$/schema/AtprotoActor.ts'
import { Source } from '$/sources/Source.ts'

export enum AtprotoActor_TimestampSelector {
	AtprotoActorTimestampMs = 'atprotoActorTimestampMs',
}

export default {
	entityType: EntityType.AtprotoActor_Timestamp,

	label: 'AT Protocol actor snapshot',
	labelPlural: 'AT Protocol actor snapshots',

	selectors: [
		{
			name: AtprotoActor_TimestampSelector.AtprotoActorTimestampMs,
			fields: [
				'$actor',
				'timestampMs',
			],
		},
	],

	fields: [
		{
			name: '$actor',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AtprotoActor,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'followersCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Atproto_Xrpc,
				Source.Atproto_BskySocial_Xrpc,
			],
		},
		{
			name: 'followsCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Atproto_Xrpc,
				Source.Atproto_BskySocial_Xrpc,
			],
		},
		{
			name: 'postsCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Atproto_Xrpc,
				Source.Atproto_BskySocial_Xrpc,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

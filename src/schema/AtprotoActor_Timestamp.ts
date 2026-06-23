import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AtprotoActor_TimestampSelector {
	AtprotoActorTimestampMs = 'atprotoActorTimestampMs',
	ActorTimestampMs = '$actor+timestampMs',
}
export default {
	entityType: EntityType.AtprotoActor_Timestamp,
	label: 'atproto actor timestamp',
	labelPlural: 'atproto actor observations',
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
			label: 'actor',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AtprotoActor,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'followersCount',
			label: 'followers count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'followsCount',
			label: 'follows count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'postsCount',
			label: 'posts count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
